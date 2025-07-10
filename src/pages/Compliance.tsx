
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Users, User } from 'lucide-react';
import { useRBAC } from '@/context/RBACContext';

const Compliance = () => {
  const { getCurrentUserTeams, currentUser, getCurrentUserTeam } = useRBAC();
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [teams, setTeams] = useState(getCurrentUserTeams());

  useEffect(() => {
    const availableTeams = getCurrentUserTeams();
    setTeams(availableTeams);
    
    if (currentUser?.role === 'user') {
      const userTeam = getCurrentUserTeam();
      if (userTeam) {
        setSelectedTeamId(userTeam.id);
      }
    } else if (availableTeams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(availableTeams[0].id);
    }
  }, [currentUser]);

  const selectedTeam = teams.find(team => team.id === selectedTeamId);

  // Mock compliance data
  const complianceResults = {
    overall: 85,
    critical: 3,
    medium: 7,
    passed: 23
  };

  // For users not assigned to any team
  if (currentUser?.role === 'user' && !getCurrentUserTeam()) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Team Assignment Required</h1>
            <p className="text-muted-foreground mb-4">
              You need to be assigned to a team before you can access compliance features.
            </p>
            <p className="text-sm text-muted-foreground">
              Please contact your administrator to be added to a team.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2">Compliance Check</h1>
            <p className="text-muted-foreground">
              Monitor and analyze security compliance across your teams
            </p>
          </div>
          
          {/* Team Selection - only show if user has access to multiple teams */}
          {(currentUser?.role !== 'user' || teams.length > 1) && (
            <div className="w-full sm:w-64">
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {!selectedTeam ? (
          <Card>
            <CardContent className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Team Selected</h3>
              <p className="text-muted-foreground">
                Please select a team to view compliance information.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Team Information Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{selectedTeam.name}</span>
                </CardTitle>
                <CardDescription>{selectedTeam.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Team Members ({selectedTeam.users.length})</span>
                    </h4>
                    {selectedTeam.users.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No members assigned to this team.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedTeam.users.map((user) => (
                          <div key={user.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            {user.isTeamAdmin && (
                              <Badge variant="outline" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{complianceResults.overall}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Critical Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">{complianceResults.critical}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Medium Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">{complianceResults.medium}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Passed Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{complianceResults.passed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Actions</CardTitle>
                <CardDescription>
                  Run compliance checks and generate reports for {selectedTeam.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Run Compliance Check</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Generate Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Compliance;
