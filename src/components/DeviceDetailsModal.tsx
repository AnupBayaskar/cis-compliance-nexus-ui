
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Server, 
  MapPin, 
  Monitor, 
  User, 
  Phone, 
  Mail, 
  FileText,
  AlertTriangle
} from 'lucide-react';

interface Device {
  id: number;
  name: string;
  type: string;
  status: string;
  lastScan: string;
  compliance: number;
  uuid?: string;
  ipAddress?: string;
  hostName?: string;
  ownerName?: string;
  contactNumber?: string;
  email?: string;
  description?: string;
}

interface DeviceDetailsModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onDecommission: (deviceId: number) => void;
}

const DeviceDetailsModal = ({ device, isOpen, onClose, onDecommission }: DeviceDetailsModalProps) => {
  const [isDecommissionDialogOpen, setIsDecommissionDialogOpen] = useState(false);

  if (!device) return null;

  const handleDecommission = () => {
    onDecommission(device.id);
    setIsDecommissionDialogOpen(false);
    onClose();
  };

  // Mock data for demonstration - in real app, this would come from the device prop
  const deviceDetails = {
    uuid: device.uuid || `uuid-${device.id}-${Date.now()}`,
    ipAddress: device.ipAddress || '192.168.1.100',
    hostName: device.hostName || device.name?.toLowerCase().replace(/\s+/g, '-'),
    ownerName: device.ownerName || 'John Smith',
    contactNumber: device.contactNumber || '+1 (555) 123-4567',
    email: device.email || 'john.smith@company.com',
    description: device.description || 'Production server for web applications and database services.',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Maintenance': return 'secondary';
      case 'Decommissioned': return 'destructive';
      default: return 'outline';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isDecommissioned = device.status === 'Decommissioned';

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Server className="h-6 w-6" />
              <span>Device Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed information for {device.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status Overview */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-lg">{device.name}</h3>
                <Badge variant={getStatusColor(device.status)}>
                  {device.status}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Compliance Score</div>
                <div className={`text-lg font-semibold ${getComplianceColor(device.compliance)}`}>
                  {device.compliance}%
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-base">Device Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Device UUID</div>
                      <div className="font-mono text-sm break-all">{deviceDetails.uuid}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Device Type</div>
                      <div>{device.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">IP Address</div>
                      <div className="font-mono">{deviceDetails.ipAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Device Name</div>
                      <div>{device.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Host Name</div>
                      <div className="font-mono">{deviceDetails.hostName}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-base">Owner Information</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Owner Name</div>
                      <div>{deviceDetails.ownerName}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Contact Number</div>
                      <div>{deviceDetails.contactNumber}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email Address</div>
                      <div>{deviceDetails.email}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-base mb-2">Additional Information</h4>
                  <div className="text-sm text-muted-foreground mb-1">Last Scan</div>
                  <div className="mb-3">{device.lastScan}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-base">Description</h4>
              </div>
              <div className="p-3 bg-muted rounded-lg text-sm">
                {deviceDetails.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              
              {!isDecommissioned && (
                <AlertDialog open={isDecommissionDialogOpen} onOpenChange={setIsDecommissionDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Decommission Device</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span>Decommission Device</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to decommission "{device.name}"? This action cannot be undone and will mark the device as inactive. The device will no longer be available for compliance checks.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDecommission}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Decommission Device
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {isDecommissioned && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Device has been decommissioned</span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeviceDetailsModal;
