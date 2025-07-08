
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Eye } from 'lucide-react';

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

interface DeviceCardProps {
  device: Device;
  onViewDetails: (device: Device) => void;
}

const DeviceCard = ({ device, onViewDetails }: DeviceCardProps) => {
  return (
    <Card className="hover-lift">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-semibold">{device.machine_name}</h4>
          <Badge variant={device.status === 'active' ? 'default' : 'secondary'}>
            {device.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{device.device_subtype}</p>
        <Separator className="my-3" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">IP Address:</span>
            <span>{device.ip_address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner:</span>
            <span>{device.owner_name || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Added:</span>
            <span>{new Date(device.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-3"
          onClick={() => onViewDetails(device)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
