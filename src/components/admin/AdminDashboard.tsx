
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  UserPlus, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  ShieldCheck,
  Trash2,
  User
} from 'lucide-react';
import { useRBAC, Organization, Team, User as UserType } from '@/context/RBACContext';
import CreateOrganizationModal from './CreateOrganizationModal';
import CreateTeamModal from './CreateTeamModal';
import AddUserModal from './AddUserModal';
import ConfirmationDialog from './ConfirmationDialog';
import UnassignedUsersSection from './UnassignedUsersSection';

const AdminDashboard = () => {
  const { 
    organizations, 
    currentUser, 
    deleteOrganization, 
    deleteTeam, 
    deleteUser, 
    toggleTeamAdmin 
  } = useRBAC();

  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState<{orgId: string, teamId: string} | null>(null);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const toggleOrgExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const handleDeleteOrg = (org: Organization) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Organization',
      message: `Are you sure you want to delete "${org.name}"? This will also delete all teams and users within this organization.`,
      onConfirm: () => {
        deleteOrganization(org.id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteTeam = (orgId: string, team: Team) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Team',
      message: `Are you sure you want to delete team "${team.name}"? This will also remove all users from this team.`,
      onConfirm: () => {
        deleteTeam(orgId, team.id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteUser = (orgId: string, teamId: string, user: UserType) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove User',
      message: `Are you sure you want to remove "${user.name}" from this team?`,
      onConfirm: () => {
        deleteUser(orgId, teamId, user.id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const canCreateOrganization = currentUser?.role === 'super_admin';
  const canManageTeams = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  return (
    <div className="section-padding min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage organizations, teams, and users
            </p>
          </div>
          {canCreateOrganization && (
            <Button onClick={() => setShowCreateOrg(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Organization</span>
            </Button>
          )}
        </div>

        {/* Current User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Current User</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="font-medium">{currentUser?.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-sm font-medium capitalize">
                  {currentUser?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unassigned Users Section */}
        <UnassignedUsersSection />

        {/* Organizations */}
        <div className="space-y-6">
          {organizations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Organizations</h3>
                <p className="text-muted-foreground mb-4">
                  {canCreateOrganization 
                    ? "Create your first organization to get started."
                    : "No organizations have been created yet."
                  }
                </p>
                {canCreateOrganization && (
                  <Button onClick={() => setShowCreateOrg(true)}>
                    Create Organization
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            organizations.map((org) => (
              <Card key={org.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => toggleOrgExpansion(org.id)}
                    >
                      {expandedOrgs.has(org.id) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <Building2 className="h-5 w-5 text-brand-green" />
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{org.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {canManageTeams && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowCreateTeam(org.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Team
                        </Button>
                      )}
                      {canCreateOrganization && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteOrg(org)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedOrgs.has(org.id) && (
                  <CardContent className="pt-0">
                    {org.teams.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                        <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No teams in this organization</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {org.teams.map((team) => (
                          <Card key={team.id} className="ml-4">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div 
                                  className="flex items-center space-x-3 cursor-pointer flex-1"
                                  onClick={() => toggleTeamExpansion(team.id)}
                                >
                                  {expandedTeams.has(team.id) ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <Users className="h-4 w-4 text-brand-green" />
                                  <div>
                                    <h4 className="font-medium">{team.name}</h4>
                                    <p className="text-sm text-muted-foreground">{team.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowAddUser({orgId: org.id, teamId: team.id})}
                                  >
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Add User
                                  </Button>
                                  {canManageTeams && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteTeam(org.id, team)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardHeader>

                            {expandedTeams.has(team.id) && (
                              <CardContent className="pt-0">
                                {team.users.length === 0 ? (
                                  <div className="text-center py-6 border-2 border-dashed border-muted rounded-lg">
                                    <UserPlus className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">No users in this team</p>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {team.users.map((user) => (
                                      <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                          </div>
                                          <span className="px-2 py-1 bg-background rounded text-xs capitalize">
                                            {user.role.replace('_', ' ')}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            size="sm"
                                            variant={user.isTeamAdmin ? "default" : "outline"}
                                            onClick={() => toggleTeamAdmin(org.id, team.id, user.id)}
                                            className="flex items-center space-x-1"
                                          >
                                            {user.isTeamAdmin ? (
                                              <ShieldCheck className="h-4 w-4" />
                                            ) : (
                                              <Shield className="h-4 w-4" />
                                            )}
                                            <span className="hidden sm:inline">
                                              {user.isTeamAdmin ? 'Admin' : 'Make Admin'}
                                            </span>
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteUser(org.id, team.id, user)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {/* Modals */}
        <CreateOrganizationModal 
          isOpen={showCreateOrg} 
          onClose={() => setShowCreateOrg(false)} 
        />
        <CreateTeamModal 
          isOpen={!!showCreateTeam} 
          onClose={() => setShowCreateTeam(null)}
          organizationId={showCreateTeam || ''}
        />
        <AddUserModal 
          isOpen={!!showAddUser} 
          onClose={() => setShowAddUser(null)}
          organizationId={showAddUser?.orgId || ''}
          teamId={showAddUser?.teamId || ''}
        />
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
