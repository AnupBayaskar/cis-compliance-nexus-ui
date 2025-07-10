
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Users, AlertCircle } from 'lucide-react';
import { useRBAC } from '@/context/RBACContext';

interface UserInfoSectionProps {
  user: {
    name: string;
    email: string;
  };
  devicesCount: number;
  activeDevicesCount: number;
}

const UserInfoSection = ({ user, devicesCount, activeDevicesCount }: UserInfoSectionProps) => {
  const { getCurrentUserTeam, currentUser } = useRBAC();
  const userTeam = getCurrentUserTeam();

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
        {/* Team Status for Users */}
        {currentUser?.role === 'user' && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center space-x-2 mb-2">
              {userTeam ? (
                <>
                  <Users className="h-5 w-5 text-brand-green" />
                  <h4 className="font-semibold text-brand-green">Team Assignment</h4>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-amber-600">Pending Team Assignment</h4>
                </>
              )}
            </div>
            {userTeam ? (
              <div className="space-y-1">
                <p className="text-sm">You are a member of:</p>
                <Badge variant="outline" className="text-brand-green border-brand-green">
                  {userTeam.name}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{userTeam.description}</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm text-amber-600">You are not part of any team yet.</p>
                <p className="text-xs text-muted-foreground">
                  Please wait for an administrator to assign you to a team to access full features.
                </p>
              </div>
            )}
          </div>
        )}

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
                <span className="text-muted-foreground">Role:</span>
                <Badge variant="outline" className="capitalize">
                  {currentUser?.role?.replace('_', ' ') || 'User'}
                </Badge>
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
