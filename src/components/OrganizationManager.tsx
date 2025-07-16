// --- Types for Team and User ---
interface Team {
  _id: string;
  name: string;
  details: string;
  admin: string;
  members: User[];
}
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Building,
  Users,
  Trash2,
  Edit,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
  teamCount: number;
  status: "active" | "inactive";
}

export function OrganizationManager() {
  // --- Teams and Users State ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState<{
    open: boolean;
    team: Team | null;
  }>({ open: false, team: null });
  const [newTeam, setNewTeam] = useState({ name: "", details: "", admin: "" });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "member",
  });
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      _id: "1",
      name: "TechCorp Security",
      description: "Enterprise security compliance management",
      createdAt: "2024-01-15T10:00:00Z",
      memberCount: 45,
      teamCount: 8,
      status: "active",
    },
    {
      _id: "2",
      name: "Healthcare Systems",
      description: "HIPAA compliance and healthcare IT security",
      createdAt: "2024-01-10T14:30:00Z",
      memberCount: 23,
      teamCount: 4,
      status: "active",
    },
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<Organization | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState<Organization | null>(
    null
  );
  const [newOrganization, setNewOrganization] = useState({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  const handleCreateOrganization = async () => {
    if (!newOrganization.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const newOrg: Organization = {
        _id: `org_${Date.now()}`,
        name: newOrganization.name.trim(),
        description: newOrganization.description.trim(),
        createdAt: new Date().toISOString(),
        memberCount: 1,
        teamCount: 0,
        status: "active",
      };

      setOrganizations([...organizations, newOrg]);
      setNewOrganization({ name: "", description: "" });
      setShowCreateDialog(false);

      toast({
        title: "Organization Created Successfully",
        description: `${newOrg.name} has been created and is now active`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrganization = async (orgId: string) => {
    try {
      setOrganizations(organizations.filter((org) => org._id !== orgId));
      setShowDeleteDialog(null);

      toast({
        title: "Organization Deleted",
        description: "The organization has been permanently removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-primary-light rounded-2xl flex items-center justify-center shadow-lg">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gradient-primary heading-enhanced">
                Organization Management
              </h1>
              <p className="text-muted-foreground typography-enhanced">
                Create and manage organizations for compliance oversight
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="button-primary shadow-lg"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Organization
        </Button>
      </motion.div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org, index) => (
          <motion.div
            key={org._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card shadow-xl hover-lift group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                      <Building className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-display">
                        {org.name}
                      </CardTitle>
                      <Badge
                        variant={
                          org.status === "active" ? "default" : "secondary"
                        }
                        className={
                          org.status === "active"
                            ? "bg-brand-success/10 text-brand-success"
                            : ""
                        }
                      >
                        {org.status}
                      </Badge>
                      {/* --- Teams Section for Org Admin --- */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold">Teams</h3>
                          <Button
                            size="sm"
                            onClick={() => setShowAddTeamDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add Team
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {teams.length === 0 && (
                            <div className="text-xs text-muted-foreground">
                              No teams yet.
                            </div>
                          )}
                          {teams.map((team) => (
                            <Card key={team._id} className="border p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold">
                                    {team.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {team.details}
                                  </div>
                                  <div className="text-xs mt-1">
                                    Admin: {team.admin}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    setShowAddUserDialog({ open: true, team })
                                  }
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Add User
                                </Button>
                              </div>
                              {/* Users in team */}
                              <div className="mt-2 ml-2">
                                <div className="text-xs font-bold mb-1">
                                  Members:
                                </div>
                                {team.members.length === 0 && (
                                  <div className="text-xs text-muted-foreground">
                                    No users yet.
                                  </div>
                                )}
                                {team.members.map((user) => (
                                  <div
                                    key={user._id}
                                    className="text-xs flex gap-2 items-center"
                                  >
                                    <span>{user.name}</span>
                                    <span className="text-muted-foreground">
                                      ({user.role})
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowEditDialog(org)}
                      className="hover:bg-brand-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {/* Add Team Dialog */}
                    <Dialog
                      open={showAddTeamDialog}
                      onOpenChange={setShowAddTeamDialog}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Team</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newTeam.name.trim() || !newTeam.admin.trim())
                              return;
                            const team: Team = {
                              _id: `team_${Date.now()}`,
                              name: newTeam.name.trim(),
                              details: newTeam.details.trim(),
                              admin: newTeam.admin.trim(),
                              members: [],
                            };
                            setTeams([...teams, team]);
                            setNewTeam({ name: "", details: "", admin: "" });
                            setShowAddTeamDialog(false);
                            toast({
                              title: "Team Created",
                              description: `${team.name} created.`,
                            });
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="teamName">Team Name</Label>
                            <Input
                              id="teamName"
                              value={newTeam.name}
                              onChange={(e) =>
                                setNewTeam({ ...newTeam, name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="teamDetails">Details</Label>
                            <Textarea
                              id="teamDetails"
                              value={newTeam.details}
                              onChange={(e) =>
                                setNewTeam({
                                  ...newTeam,
                                  details: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="teamAdmin">Admin Name</Label>
                            <Input
                              id="teamAdmin"
                              value={newTeam.admin}
                              onChange={(e) =>
                                setNewTeam({
                                  ...newTeam,
                                  admin: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowAddTeamDialog(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Create Team</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>

                    {/* Add User to Team Dialog */}
                    <Dialog
                      open={showAddUserDialog.open}
                      onOpenChange={(open) =>
                        setShowAddUserDialog({
                          open,
                          team: showAddUserDialog.team,
                        })
                      }
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add User to Team</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!newUser.name.trim() || !newUser.email.trim())
                              return;
                            if (!showAddUserDialog.team) return;
                            const user: User = {
                              _id: `user_${Date.now()}`,
                              name: newUser.name.trim(),
                              email: newUser.email.trim(),
                              role: newUser.role,
                            };
                            setTeams(
                              teams.map((team) =>
                                team._id === showAddUserDialog.team!._id
                                  ? {
                                      ...team,
                                      members: [...team.members, user],
                                    }
                                  : team
                              )
                            );
                            setNewUser({ name: "", email: "", role: "member" });
                            setShowAddUserDialog({ open: false, team: null });
                            toast({
                              title: "User Added",
                              description: `${user.name} added to ${showAddUserDialog.team.name}`,
                            });
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <Label htmlFor="userName">Name</Label>
                            <Input
                              id="userName"
                              value={newUser.name}
                              onChange={(e) =>
                                setNewUser({ ...newUser, name: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="userEmail">Email</Label>
                            <Input
                              id="userEmail"
                              type="email"
                              value={newUser.email}
                              onChange={(e) =>
                                setNewUser({
                                  ...newUser,
                                  email: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="userRole">Role</Label>
                            <select
                              id="userRole"
                              value={newUser.role}
                              onChange={(e) =>
                                setNewUser({ ...newUser, role: e.target.value })
                              }
                              className="w-full border rounded px-2 py-1"
                            >
                              <option value="member">Member</option>
                              <option value="validator">Validator</option>
                              <option value="team-lead">Team Lead</option>
                            </select>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setShowAddUserDialog({
                                  open: false,
                                  team: null,
                                })
                              }
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Add User</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-brand-danger/10 text-brand-danger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="confirmation-dialog">
                        <AlertDialogHeader className="text-center space-y-4">
                          <div className="w-16 h-16 bg-brand-danger/10 rounded-2xl flex items-center justify-center mx-auto">
                            <Trash2 className="w-8 h-8 text-brand-danger" />
                          </div>
                          <AlertDialogTitle className="font-display">
                            Delete Organization
                          </AlertDialogTitle>
                          <AlertDialogDescription className="typography-enhanced">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{org.name}</span>?
                            This action cannot be undone and will remove all
                            associated teams and data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex space-x-2">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteOrganization(org._id)}
                            className="bg-brand-danger hover:bg-brand-danger/90"
                          >
                            Delete Organization
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground typography-enhanced">
                  {org.description || "No description provided"}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-brand-primary/5 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="w-4 h-4 text-brand-primary mr-1" />
                    </div>
                    <div className="text-lg font-bold text-brand-primary">
                      {org.memberCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>

                  <div className="text-center p-3 bg-brand-secondary/5 rounded-xl">
                    <div className="flex items-center justify-center mb-1">
                      <Shield className="w-4 h-4 text-brand-secondary mr-1" />
                    </div>
                    <div className="text-lg font-bold text-brand-secondary">
                      {org.teamCount}
                    </div>
                    <div className="text-xs text-muted-foreground">Teams</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created {new Date(org.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Organization Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="confirmation-dialog max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-brand-primary" />
            </div>
            <DialogTitle className="font-display">
              Create New Organization
            </DialogTitle>
            <DialogDescription className="typography-enhanced">
              Set up a new organization to manage compliance across teams and
              devices
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="orgName" className="font-semibold">
                Organization Name <span className="text-brand-danger">*</span>
              </Label>
              <Input
                id="orgName"
                value={newOrganization.name}
                onChange={(e) =>
                  setNewOrganization({
                    ...newOrganization,
                    name: e.target.value,
                  })
                }
                placeholder="Enter organization name..."
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="orgDescription" className="font-semibold">
                Description
              </Label>
              <Textarea
                id="orgDescription"
                value={newOrganization.description}
                onChange={(e) =>
                  setNewOrganization({
                    ...newOrganization,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of the organization..."
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex space-x-2 pt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setNewOrganization({ name: "", description: "" });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrganization}
              className="button-primary flex-1"
              disabled={!newOrganization.name.trim()}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
