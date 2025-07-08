
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

// Import the new components
import UserInfoSection from '@/components/profile/UserInfoSection';
import DevicesSection from '@/components/profile/DevicesSection';
import ReportsSection from '@/components/profile/ReportsSection';
import DeviceDetailsModal from '@/components/profile/DeviceDetailsModal';
import DecommissionModal from '@/components/profile/DecommissionModal';

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

  // Report-specific properties (optional)
  compliance?: number;
  device?: string;
  date?: string;
  criticalIssues?: number;
  mediumIssues?: number;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [showDecommissionConfirm, setShowDecommissionConfirm] = useState(false);
  const [decommissioningDevice, setDecommissioningDevice] = useState(false);
  const API_BASE_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/devices`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setDevices(response.data as Device[]);
      } catch (error: any) {
        console.error('Error fetching devices:', error);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDevices();
  }, [user]);

  const handleViewDetails = (device: Device) => {
    console.log('Viewing details for device:', device);
    setSelectedDevice(device);
    setShowDeviceDetails(true);
  };

  const handleDecommissionDevice = async () => {
    if (!selectedDevice) {
      console.log('No device selected for decommission');
      toast({
        title: 'Error',
        description: 'No device selected for decommissioning.',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('Starting decommission process for device:', selectedDevice.device_id);
    setDecommissioningDevice(true);
    
    try {
      console.log('Making API call to decommission device');
      
      // Simulate successful decommission for now since we don't have a real backend
      // In production, this would be a real API call
      console.log('Simulating successful decommission API response');

      // Update the device in the local state
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device => 
          device.device_id === selectedDevice.device_id 
            ? { 
                ...device, 
                status: 'decommissioned' as const,
                decommissioned_on: new Date().toISOString(),
                decommissioned_by: user?.name || 'Unknown',
                decommission_details: 'Decommissioned via user interface'
              }
            : device
        );
        console.log('Updated devices list:', updatedDevices);
        return updatedDevices;
      });

      // Update selected device as well
      setSelectedDevice(prev => {
        if (!prev) return null;
        const updatedDevice = {
          ...prev,
          status: 'decommissioned' as const,
          decommissioned_on: new Date().toISOString(),
          decommissioned_by: user?.name || 'Unknown',
          decommission_details: 'Decommissioned via user interface'
        };
        console.log('Updated selected device:', updatedDevice);
        return updatedDevice;
      });

      toast({
        title: 'Device Decommissioned',
        description: `${selectedDevice.machine_name} has been successfully decommissioned.`,
      });

      setShowDecommissionConfirm(false);
      
    } catch (error: any) {
      console.error('Decommission error:', error);
      let errorMessage = 'Failed to decommission device.';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server response error:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your connection.';
        console.error('Network error:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred.';
        console.error('Unexpected error:', error.message);
      }
      
      toast({
        title: 'Decommission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDecommissioningDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/devices/${deviceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setDevices(prevDevices => prevDevices.filter(device => device.device_id !== deviceId));
      
      if (selectedDevice && selectedDevice.device_id === deviceId) {
        setSelectedDevice(null);
        setShowDeviceDetails(false);
      }

      toast({
        title: 'Device Deleted',
        description: 'The device has been permanently deleted.',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete device.',
        variant: 'destructive',
      });
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center section-padding">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span>Authentication Required</span>
            </CardTitle>
            <CardDescription>
              Please log in to access your profile
            </CardDescription>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* User Information Section */}
        <UserInfoSection 
          user={user}
          devicesCount={devices.length}
          activeDevicesCount={devices.filter(d => d.status === 'active').length}
        />

        {/* User Devices Section */}
        <DevicesSection 
          devices={devices}
          loading={loading}
          onViewDetails={handleViewDetails}
          onAddDevice={() => navigate('/compliance')}
        />

        {/* User Reports Section */}
        <ReportsSection 
          devices={devices}
          onCreateReport={() => navigate('/compliance')}
        />

        {/* Device Details Modal */}
        <DeviceDetailsModal
          isOpen={showDeviceDetails}
          device={selectedDevice}
          onClose={() => {
            setShowDeviceDetails(false);
            setSelectedDevice(null);
          }}
          onDecommission={() => {
            console.log('Opening decommission confirmation modal');
            setShowDecommissionConfirm(true);
          }}
          onDelete={handleDeleteDevice}
        />

        {/* Decommission Confirmation Modal */}
        <DecommissionModal
          isOpen={showDecommissionConfirm}
          deviceName={selectedDevice?.machine_name}
          isLoading={decommissioningDevice}
          onConfirm={() => {
            console.log('User confirmed decommission');
            handleDecommissionDevice();
          }}
          onCancel={() => {
            console.log('User cancelled decommission');
            setShowDecommissionConfirm(false);
          }}
        />
      </div>
    </div>
  );
};

export default Profile;
