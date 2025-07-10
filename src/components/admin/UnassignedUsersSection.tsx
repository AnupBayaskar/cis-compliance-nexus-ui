
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, UserPlus, Building2 } from 'lucide-react';
import { useRBAC } from '@/context/RBACContext';

const UnassignedUsersSection = () => {
  const { unassignedUsers, organizations, assignUnassignedUserToTeam, currentUser } = useRBAC();
  const [selectedAssignments, setSelectedAssignments] = useState<{[userId: string]: {orgId: string, teamId: string}}>({});

  const handleAssignUser = (userId: string) => {
    const assignment = selectedAssignments[userId];
    if (assignment) {
      assignUnassignedUserToTeam(userId, assignment.orgId, assignment.teamId);
      // Clear the selection
      setSelectedAssignments(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleSelectionChange = (userId: string, type: 'org' | 'team', value: string) => {
    setSelectedAssignments(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [type === 'org' ? 'orgId' : 'teamId']: value,
        // Reset team selection if org changes
        ...(type === 'org' ? { teamId: '' } : {})
      }
    }));
  };

  // Filter organizations based on current user role
  const availableOrganizations = currentUser?.role === 'super_admin' 
    ? organizations 
    : organizations.filter(org => org.id === currentUser?.organizationId);

  if (unassignedUsers.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Unassigned Users</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2" />
            <p>No unassigned users found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Unassigned Users ({unassignedUsers.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {unassignedUsers.map((user) => {
            const userAssignment = selectedAssignments[user.id] || { orgId: '', teamId: '' };
            const selectedOrg = availableOrganizations.find(org => org.id === userAssignment.orgId);
            const availableTeams = selectedOrg ? selectedOrg.teams : [];

            return (
              <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={userAssignment.orgId}
                    onValueChange={(value) => handleSelectionChange(user.id, 'org', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOrganizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{org.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={userAssignment.teamId}
                    onValueChange={(value) => handleSelectionChange(user.id, 'team', value)}
                    disabled={!userAssignment.orgId}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => handleAssignUser(user.id)}
                    disabled={!userAssignment.orgId || !userAssignment.teamId}
                    size="sm"
                  >
                    Assign
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnassignedUsersSection;
