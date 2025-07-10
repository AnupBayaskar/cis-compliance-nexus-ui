
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Device {
  id: string;
  name: string;
  teamId: string;
}

interface DeviceDropdownProps {
  devices: Device[];
  selectedDevice: string | null;
  onDeviceChange: (deviceId: string) => void;
}

const DeviceDropdown = ({ devices, selectedDevice, onDeviceChange }: DeviceDropdownProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Device</label>
      <Select value={selectedDevice || ''} onValueChange={onDeviceChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a device" />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device) => (
            <SelectItem key={device.id} value={device.id}>
              {device.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DeviceDropdown;
