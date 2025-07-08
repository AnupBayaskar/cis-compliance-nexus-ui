import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileText,
  Download,
  Trash2,
  CheckCircle,
  X,
  Minus,
  Server,
  AlertTriangle,
} from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface Check {
  id: string;
  save_id: string;
  check_id: string;
  status: boolean | null;
  title?: string;
  category?: string;
  criticality?: 'Low' | 'Medium' | 'High';
}

interface Report {
  report_id: string;
  generated_at: string;
  passed_checks: number;
  failed_checks: number;
  skipped_checks: number;
  compliance_score: number;
  fileId: string;
}

interface SavedConfiguration {
  save_id: string;
  user_id: string;
  device_id: string;
  name: string;
  saved_at: string;
  comments?: string;
  checks: Check[];
  device_name: string;
  report?: Report;
}

interface Device {
  device_id: string;
  machine_name: string;
  configCount: number;
  configurations: SavedConfiguration[];
}

const SavedConfigurations = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedConfigId, setExpandedConfigId] = useState<string | null>(null);
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    if (user && token && user.user_id) {
      console.log('User:', user, 'Token:', token);
      fetchConfigurations();
    } else {
      console.warn('Missing user or token, redirecting to auth');
      navigate('/auth');
    }
  }, [user, token, navigate]);

  const fetchConfigurations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/saved-configurations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const configs = (response.data as any[]).map((config: any) => {
        console.log('Processing config:', {
          save_id: config.save_id,
          device: config.device,
        });
        return {
          save_id: config.save_id,
          user_id: config.user_id,
          device_id: config.device_id,
          name: config.name,
          saved_at: config.saved_at,
          comments: config.comments || undefined,
          checks: config.checks || [],
          device_name: config.device?.machine_name || config.device?.device_subtype || config.device?.device_id || 'Unknown Device',
          report: config.report
            ? {
                report_id: config.report.report_id,
                generated_at: config.report.generated_at,
                passed_checks: config.report.passed_checks,
                failed_checks: config.report.failed_checks,
                skipped_checks: config.report.skipped_checks,
                compliance_score: config.report.compliance_score,
                fileId: config.report.fileId,
              }
            : undefined,
        };
      });
      setConfigurations(configs);
    } catch (error: any) {
      console.error('Fetch configurations error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        logout();
        navigate('/auth');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load configurations. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const devices: Device[] = configurations.reduce((acc, config) => {
    const existingDevice = acc.find((d) => d.device_id === config.device_id);
    if (!existingDevice) {
      acc.push({
        device_id: config.device_id,
        machine_name: config.device_name,
        configCount: 1,
        configurations: [config],
      });
    } else {
      existingDevice.configCount++;
      existingDevice.configurations.push(config);
    }
    return acc;
  }, [] as Device[]);

  const handleGenerateReport = async (saveId: string) => {
    if (!saveId) {
      console.error('Generate report error: saveId is missing');
      toast({
        title: 'Error',
        description: 'Configuration ID is missing.',
        variant: 'destructive',
      });
      return;
    }
    try {
      console.log('Request URL:', `${API_BASE_URL}/reports`, 'Body:', { save_id: saveId }, 'Token:', token ? 'Token present' : 'Token missing');
      const response = await axios.post<Report>(
        `${API_BASE_URL}/reports`,
        { save_id: saveId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const report = response.data;
      console.log('Report response:', report);
      if (!report.fileId) {
        throw new Error('Report fileId is missing in response');
      }
      setConfigurations((prev) =>
        prev.map((config) =>
          config.save_id === saveId
            ? { ...config, report: { ...report } }
            : config
        )
      );
      toast({
        title: 'Success',
        description: 'Report generated successfully. Downloading...',
      });
      const config = configurations.find((c) => c.save_id === saveId);
      const deviceName = config?.device_id || 'report';
      await handleDownloadReport(report.fileId, deviceName);
    } catch (error: any) {
      console.error('Generate report error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: `${API_BASE_URL}/reports`,
        token: token ? 'Token present' : 'Token missing',
      });
      let errorMsg = error.response?.data?.message || 'Failed to generate report.';
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          console.error('Failed to parse error response:', text);
        }
      }
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadReport = async (fileId: string, deviceName: string) => {
    if (!fileId) {
      console.error('Download report error: fileId is missing');
      toast({
        title: 'Error',
        description: 'Report ID is missing.',
        variant: 'destructive',
      });
      return;
    }
    try {
      console.log('Downloading report with fileId:', fileId, 'deviceName:', deviceName);
      const response = await axios.get(`${API_BASE_URL}/reports/download/${encodeURIComponent(fileId)}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const contentType = response.headers['content-type'];
      console.log('Response content-type:', contentType, 'status:', response.status);
      if (contentType && contentType.includes('application/json')) {
        const blob = response.data as Blob;
        const text = await blob.text();
        let errorMsg = 'Failed to download report.';
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {}
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
        return;
      }
      if (!contentType || !contentType.includes('application/pdf')) {
        toast({
          title: 'Error',
          description: 'Invalid response format. Expected PDF.',
          variant: 'destructive',
        });
        return;
      }

      // Create a Blob from the response data and download the PDF
      const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
      console.log('Blob size:', blob.size);
      if (blob.size === 0) {
        toast({
          title: 'Error',
          description: 'Downloaded file is empty. Please try again or contact support.',
          variant: 'destructive',
        });
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${deviceName.replace(/\s/g, '_')}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Success',
        description: 'Report downloaded successfully.',
      });
    } catch (error: any) {
      console.error('Download report error:', {
        fileId,
        message: error.message,
        status: error.response?.status,
        headers: error.response?.headers,
      });
      let errorMsg = error.message || 'Failed to download report.';
      if (error.response?.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        logout();
        navigate('/auth');
      } else if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          console.error('Failed to parse error response:', text);
        }
      } else if (error.message === 'Downloaded report is empty') {
        errorMsg = 'The report file is empty. Please try generating the report again.';
      } else if (error.message === 'Downloaded report is not a valid PDF') {
        errorMsg = 'The report file is corrupt or invalid. Please try generating the report again.';
      }
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConfiguration = async (saveId: string) => {
    if (!window.confirm('Are you sure you want to delete this configuration?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/saved-configurations/${saveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfigurations((prev) => prev.filter((config) => config.save_id !== saveId));
      toast({
        title: 'Success',
        description: 'Configuration deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete configuration error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        logout();
        navigate('/auth');
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete configuration.',
          variant: 'destructive',
        });
      }
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>Please log in to view saved configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Saved Configurations</h1>
          <p className="text-muted-foreground">
            View and manage your saved compliance configurations
          </p>
        </div>

        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">Loading configurations...</p>
            </CardContent>
          </Card>
        ) : configurations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Configurations</h3>
              <p className="text-muted-foreground mb-4">
                Save a configuration from the Compliance Check page to get started
              </p>
              <Button onClick={() => navigate('/compliance')}>
                Go to Compliance Check
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {devices.map((device) => (
              <AccordionItem
                key={device.device_id}
                value={device.device_id}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="hover:no-underline px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <Server className="h-6 w-6 text-brand-green" />
                      <div className="text-left">
                        <h3 className="text-lg font-semibold">{device.machine_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Device ID: {device.device_id} • {device.configCount} configuration{device.configCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {device.configCount} config{device.configCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 p-4">
                    {device.configurations.map((config) => (
                      <Card key={config.save_id} className="border-l-4 border-l-brand-green">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle className="text-base font-medium flex items-center space-x-2">
                              <span>{config.name}</span>
                              {config.report && (
                                <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                  Report Generated
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <span>Saved: {new Date(config.saved_at).toLocaleDateString()}</span>
                              <span>{config.checks.length} checks</span>
                              {config.comments && <span>Comments: {config.comments}</span>}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateReport(config.save_id)}
                              disabled={!!config.report}
                            >
                              <FileText className="mr-1 h-4 w-4" />
                              {config.report ? 'Report Generated' : 'Generate Report'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedConfigId(expandedConfigId === config.save_id ? null : config.save_id)}
                            >
                              {expandedConfigId === config.save_id ? 'Hide' : 'Show'} Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteConfiguration(config.save_id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        {expandedConfigId === config.save_id && (
                          <CardContent>
                            {config.report && (
                              <div className="mb-4 p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                                  <FileText className="h-5 w-5" />
                                  <span>Compliance Report Summary</span>
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-green-600">
                                      {config.report.passed_checks}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Passed</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-red-600">
                                      {config.report.failed_checks}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Failed</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-yellow-600">
                                      {config.report.skipped_checks}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Skipped</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-brand-green">
                                      {config.report.compliance_score}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Score</div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => handleDownloadReport(config.report!.fileId, config.device_name)}
                                  disabled={!config.report.fileId}
                                >
                                  <Download className="mr-1 h-4 w-4" />
                                  Download Report
                                </Button>
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold mb-2">Compliance Checks</h4>
                              {config.checks.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No checks available.</p>
                              ) : (
                                <div className="space-y-2 max-h-80 overflow-y-auto">
                                  {config.checks.map((check) => (
                                    <div
                                      key={check.id}
                                      className="flex items-center space-x-3 p-2 border border-border rounded-md"
                                    >
                                      <div className="flex-shrink-0">
                                        {check.status === true && (
                                          <CheckCircle className="h-4 w-4 text-green-600" />
                                        )}
                                        {check.status === false && (
                                          <X className="h-4 w-4 text-red-600" />
                                        )}
                                        {check.status === null && (
                                          <Minus className="h-4 w-4 text-yellow-600" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="font-mono text-xs text-brand-green">
                                            {check.check_id}
                                          </span>
                                          {check.category && (
                                            <Badge variant="outline" className="text-xs">
                                              {check.category}
                                            </Badge>
                                          )}
                                          {check.criticality && (
                                            <Badge
                                              variant={check.criticality === 'High' ? 'destructive' : 'secondary'}
                                              className="text-xs"
                                            >
                                              {check.criticality}
                                            </Badge>
                                          )}
                                        </div>
                                        <p className="text-sm truncate">
                                          {check.title || 'Check Title Unavailable'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default SavedConfigurations;