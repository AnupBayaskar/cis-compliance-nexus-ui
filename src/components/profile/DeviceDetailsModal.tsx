
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Modal from '@/components/ui/modal';
import { AlertTriangle, Trash } from 'lucide-react';

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
  compliance?: number;
  device?: string;
  date?: string;
  criticalIssues?: number;
  mediumIssues?: number;
}

interface DeviceDetailsModalProps {
  isOpen: boolean;
  device: Device | null;
  onClose: () => void;
  onDecommission: () => void;
  onDelete: (deviceId: string) => void;
}

const DeviceDetailsModal = ({ 
  isOpen, 
  device, 
  onClose, 
  onDecommission, 
  onDelete 
}: DeviceDetailsModalProps) => {
  if (!device) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Device Details"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Device UUID
              </label>
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                {device.uuid}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Device Type
              </label>
              <p className="text-sm">
                <Badge variant="outline">{device.type.toUpperCase()}</Badge>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Host Name
              </label>
              <p className="text-sm">{device.device_subtype}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Contact Number
              </label>
              <p className="text-sm">{device.owner_phone || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Status
              </label>
              <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
                {device.status}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                IP Address
              </label>
              <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                {device.ip_address}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Device Name
              </label>
              <p className="text-sm">{device.machine_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Owner Name
              </label>
              <p className="text-sm">{device.owner_name || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </label>
              <p className="text-sm">{device.owner_email || 'Not provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Created On
              </label>
              <p className="text-sm">{new Date(device.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Description
          </label>
          <p className="text-sm bg-muted/50 p-3 rounded">
            {device.description || 'No description provided'}
          </p>
        </div>

        {device.status === 'decommissioned' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-800">Device Decommissioned</h4>
            </div>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Decommissioned on:</strong> {device.decommissioned_on ? new Date(device.decommissioned_on).toLocaleDateString() : 'Unknown'}</p>
              <p><strong>Decommissioned by:</strong> {device.decommissioned_by || 'Unknown'}</p>
              {device.decommission_details && (
                <p><strong>Details:</strong> {device.decommission_details}</p>
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="flex space-x-3 pt-4">
          {device.status === 'active' ? (
            <Button
              variant="destructive"
              onClick={onDecommission}
              className="flex-1"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Decommission Device
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => onDelete(device.device_id)}
              className="flex-1"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Device
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeviceDetailsModal;
