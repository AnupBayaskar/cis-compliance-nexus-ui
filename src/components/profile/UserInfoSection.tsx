
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface UserInfoSectionProps {
  user: {
    name: string;
    email: string;
  };
  devicesCount: number;
  activeDevicesCount: number;
}

const UserInfoSection = ({ user, devicesCount, activeDevicesCount }: UserInfoSectionProps) => {
  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-6 w-6" />
          <span>User Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type:</span>
                <Badge variant="outline">Premium</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since:</span>
                <span>January 2024</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Account Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Devices:</span>
                <span>{devicesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Scans:</span>
                <span>{activeDevicesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Compliance:</span>
                <span className={getComplianceColor(85)}>85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoSection;
