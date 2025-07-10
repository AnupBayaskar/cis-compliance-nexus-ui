
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

const TeamManagement = () => {
  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their roles</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Team Management Dashboard</span>
            </CardTitle>
            <CardDescription>
              This page will contain team management functionality for admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Management Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Advanced team management features will be available here
              </p>
              <Button className="bg-brand-green hover:bg-brand-green/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamManagement;
