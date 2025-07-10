
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

const Organization = () => {
  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Organization Management</h1>
          <p className="text-muted-foreground">Manage your organization structure and settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span>Organization Dashboard</span>
            </CardTitle>
            <CardDescription>
              This page will contain organization management functionality for super admins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Organization Management Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                Comprehensive organization management features will be available here
              </p>
              <Button className="bg-brand-green hover:bg-brand-green/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Organization;
