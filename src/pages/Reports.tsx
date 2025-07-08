import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Report {
  report_id: string;
  save_id: string;
  device_id: string;
  user_id: string;
  generated_at: string;
  file_url: string;
  metadata: { file_name: string; format: string };
}

interface SavedConfiguration {
  save_id: string;
  user_id: string;
  device_id: string;
  name: string;
  saved_at: string;
  comments: string;
  checks: { id: string; check_id: string; status: boolean | null }[];
}

const Reports = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user && token) {
      fetchReports();
      fetchConfigurations();
    } else {
      navigate('/auth');
    }
  }, [user, token, navigate]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data as Report[]);
    } catch (error: any) {
      console.error('Fetch reports error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load reports.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConfigurations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/saved-configurations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfigurations(response.data as SavedConfiguration[]);
    } catch (error: any) {
      console.error('Fetch configurations error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load configurations.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateReport = async (config: SavedConfiguration) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reports/${config.save_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const newReport = response.data as Report;
      setReports([...reports, newReport]);
      toast({
        title: 'Report Generated',
        description: `Report for ${config.name} has been generated.`,
      });
    } catch (error: any) {
      console.error('Generate report error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate report.',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadReport = async (reportId: string, deviceName: string) => {
  try {
    const response = await axios.get<Blob>(`${API_BASE_URL}/reports/${reportId}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${deviceName.replace(/\s/g, '_')}_report.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast({
      title: 'Success',
      description: 'Report downloaded successfully.',
    });
  } catch (error: any) {
    console.error('Download report error:', error.response?.data || error.message);
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
        description: error.response?.data?.message || 'Failed to download report.',
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
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access reports</CardDescription>
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and download compliance reports</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Saved Configurations</CardTitle>
            <CardDescription>Generate reports from saved configurations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading configurations...</p>
              </div>
            ) : configurations.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No saved configurations found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {configurations.map((config) => (
                  <Card key={config.save_id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{config.name}</h4>
                        <Badge variant="outline">
                          Saved: {new Date(config.saved_at).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Device ID: {config.device_id}</p>
                      {config.comments && (
                        <p className="text-sm text-muted-foreground">Comments: {config.comments}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Checks: {config.checks.length} (
                        {config.checks.filter((c) => c.status === true).length} Compliant,{' '}
                        {config.checks.filter((c) => c.status === false).length} Non-Compliant,{' '}
                        {config.checks.filter((c) => c.status === null).length} Skipped)
                      </p>
                      <Button
                        className="mt-3"
                        onClick={() => handleGenerateReport(config)}
                        disabled={config.checks.some((c) => c.status === null)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>Download previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No reports generated yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => {
                  const config = configurations.find((c) => c.save_id === report.save_id);
                  return (
                    <Card key={report.report_id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{config?.name || 'Report'}</h4>
                          <Badge variant="outline">
                            Generated: {new Date(report.generated_at).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Device ID: {report.device_id}</p>
                        <p className="text-sm text-muted-foreground">Format: {report.metadata.format}</p>
                        <Button
                          className="mt-3"
                          onClick={() => handleDownloadReport(report.report_id, config?.name || 'Report')}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Report
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;

function logout() {
  throw new Error('Function not implemented.');
}
