import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Server, Users, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useConfiguration } from '@/context/ConfigurationContext';

interface Device {
  device_id: string;
  uuid: string;
  type: 'os' | 'service';
  device_subtype: string;
  ip_address: string;
  machine_name: string;
  description?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'decommissioned';
  decommissioned_on?: string;
  decommissioned_by?: string;
  decommission_details?: string;
}

interface Check {
  check_id: string;
  title: string;
  category: string;
  criticality: 'Low' | 'Medium' | 'High';
}

const Compliance = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const { saveConfiguration } = useConfiguration();
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [checks, setChecks] = useState<Check[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [deviceName, setDeviceName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [complianceResults, setComplianceResults] = useState<{ [check_id: string]: boolean | null }>({});
  const [saveName, setSaveName] = useState('');
  const [comments, setComments] = useState('');
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [loadingChecks, setLoadingChecks] = useState(true);

  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    if (!user || !token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access compliance checks.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }
    fetchDevices();
    fetchChecks();
  }, [user, token, navigate, toast]);

  const fetchDevices = async () => {
    setLoadingDevices(true);
    try {
      const response = await fetch(`${API_BASE_URL}/devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDevices(data as Device[]);
    } catch (error: any) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load devices.',
        variant: 'destructive',
      });
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchChecks = async () => {
    setLoadingChecks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/checks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setChecks(data as Check[]);
    } catch (error: any) {
      console.error('Error fetching checks:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load checks.',
        variant: 'destructive',
      });
    } finally {
      setLoadingChecks(false);
    }
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    const selectedDevice = devices.find((device) => device.device_id === deviceId);
    setDeviceName(selectedDevice ? selectedDevice.machine_name : '');
  };

  const handleCheckChange = (checkId: string, status: boolean | null) => {
    setComplianceResults((prev) => ({ ...prev, [checkId]: status }));
  };

  const handleRunCompliance = async () => {
    if (!selectedDeviceId) {
      toast({
        title: 'Error',
        description: 'Please select a device to run compliance checks.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate compliance check by setting random results
      const newResults: { [check_id: string]: boolean | null } = {};
      checks.forEach((check) => {
        const random = Math.random();
        if (random < 0.7) {
          newResults[check.check_id] = random < 0.35; // true or false
        } else {
          newResults[check.check_id] = null; // skipped
        }
      });
      setComplianceResults(newResults);
      toast({
        title: 'Compliance Check Complete',
        description: 'Simulated compliance check completed.',
      });
    } catch (error: any) {
      console.error('Compliance check error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to run compliance check.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedDeviceId) {
      toast({
        title: 'Error',
        description: 'Please select a device before saving.',
        variant: 'destructive',
      });
      return;
    }

    if (!saveName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the saved configuration.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const checksToSave = checks.map(check => ({
        check_id: check.check_id,
        status: complianceResults[check.check_id] !== undefined ? complianceResults[check.check_id] : null
      }));

      await saveConfiguration(saveName, selectedDeviceId, deviceName, checksToSave, comments);
      toast({
        title: 'Configuration Saved',
        description: 'Configuration saved successfully.',
      });
      navigate('/saved-configurations');
    } catch (error: any) {
      console.error('Save configuration error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access compliance checks</CardDescription>
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
          <h1 className="text-3xl font-bold mb-2">Compliance Check</h1>
          <p className="text-muted-foreground">
            Assess and manage compliance configurations for your devices
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Device Selection</CardTitle>
            <CardDescription>Select a device to run compliance checks against</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDevices ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-4">
                <Server className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No devices found. Please add a device to continue.</p>
                <Button onClick={() => navigate('/profile')} variant="link">
                  Add Device
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device">Select Device</Label>
                  <Select onValueChange={handleDeviceSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((device) => (
                        <SelectItem key={device.device_id} value={device.device_id}>
                          {device.machine_name} ({device.device_subtype})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedDeviceId && (
                  <Badge variant="secondary">
                    Selected Device: {deviceName} ({selectedDeviceId})
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Compliance Checks</CardTitle>
            <CardDescription>Review and set the status for each compliance check</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChecks ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">Loading checks...</p>
              </div>
            ) : checks.length === 0 ? (
              <div className="text-center py-4">
                <Users className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No checks found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Check
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Criticality
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Compliant
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Non-Compliant
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Skipped
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {checks.map((check) => (
                        <tr key={check.check_id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-foreground">{check.title}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">{check.category}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-muted-foreground">{check.criticality}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <input
                              type="radio"
                              id={`${check.check_id}-compliant`}
                              name={check.check_id}
                              value="compliant"
                              className="h-4 w-4 text-green-500 focus:ring-green-500"
                              onChange={() => handleCheckChange(check.check_id, true)}
                              checked={complianceResults[check.check_id] === true}
                              disabled={isLoading}
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <input
                              type="radio"
                              id={`${check.check_id}-non-compliant`}
                              name={check.check_id}
                              value="non-compliant"
                              className="h-4 w-4 text-red-500 focus:ring-red-500"
                              onChange={() => handleCheckChange(check.check_id, false)}
                              checked={complianceResults[check.check_id] === false}
                              disabled={isLoading}
                            />
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-center">
                            <input
                              type="radio"
                              id={`${check.check_id}-skipped`}
                              name={check.check_id}
                              value="skipped"
                              className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                              onChange={() => handleCheckChange(check.check_id, null)}
                              checked={complianceResults[check.check_id] === null}
                              disabled={isLoading}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  onClick={handleRunCompliance}
                  disabled={isLoading || !selectedDeviceId}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running Checks...
                    </>
                  ) : (
                    <>
                      Run Compliance Checks
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Save Configuration</CardTitle>
            <CardDescription>Save the current compliance configuration for future use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="save-name">Configuration Name</Label>
                <Input
                  id="save-name"
                  placeholder="Enter a name for this configuration"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments (Optional)</Label>
                <Input
                  id="comments"
                  placeholder="Add any relevant comments about this configuration"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSaveConfiguration}
                disabled={isSaving || !selectedDeviceId}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Configuration...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Compliance;
