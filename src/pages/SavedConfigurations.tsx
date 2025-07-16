import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Download, Trash2, FileText, Calendar, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

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

const SavedConfigurations = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    if (user && token) {
      fetchConfigurations();
    } else {
      navigate('/auth');
    }
  }, [user, token, navigate]);

  const fetchConfigurations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/saved-configurations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const configs = (response.data as any[]).map((config: any) => ({
        save_id: config.save_id,
        user_id: config.user_id,
        device_id: config.device_id,
        name: config.name,
        saved_at: config.saved_at,
        comments: config.comments || undefined,
        checks: config.checks || [],
        device_name: config.device?.machine_name || 'Unknown Device',
        report: config.report || undefined,
      }));
      setConfigurations(configs);
    } catch (error: any) {
      console.error('Fetch configurations error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load configurations.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfiguration = async (saveId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/saved-configurations/${saveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConfigurations(prev => prev.filter(config => config.save_id !== saveId));
      toast({
        title: 'Success',
        description: 'Configuration deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete configuration error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete configuration.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        navigate('/auth');
      }
    }
  };

  if (!user || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access saved configurations</CardDescription>
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
          <h1 className="text-4xl font-bold mb-2">Saved Configurations</h1>
          <p className="text-muted-foreground">Manage and review your saved device configurations</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Configurations</CardTitle>
            <CardDescription>View, manage, and generate reports for your saved configurations</CardDescription>
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
                      <p className="text-sm text-muted-foreground">Device: {config.device_name}</p>
                      {config.comments && (
                        <p className="text-sm text-muted-foreground">Comments: {config.comments}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Checks: {config.checks.length} (
                        {config.checks.filter((c) => c.status === true).length} Compliant,{' '}
                        {config.checks.filter((c) => c.status === false).length} Non-Compliant,{' '}
                        {config.checks.filter((c) => c.status === null).length} Skipped)
                      </p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/compliance-details?saveId=${config.save_id}`)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the configuration{' '}
                                <b>{config.name}</b> and all of its data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteConfiguration(config.save_id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavedConfigurations;
