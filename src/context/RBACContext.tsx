
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  isTeamAdmin?: boolean;
  organizationId?: string;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  users: User[];
  adminId?: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  teams: Team[];
}

interface RBACContextType {
  organizations: Organization[];
  currentUser: User | null;
  unassignedUsers: User[];
  createOrganization: (org: Omit<Organization, 'id' | 'teams'>) => void;
  createTeam: (orgId: string, team: Omit<Team, 'id' | 'users' | 'organizationId'>) => void;
  addUserToTeam: (orgId: string, teamId: string, user: Omit<User, 'id' | 'organizationId' | 'teamId'>) => void;
  assignUnassignedUserToTeam: (userId: string, orgId: string, teamId: string) => void;
  deleteOrganization: (orgId: string) => void;
  deleteTeam: (orgId: string, teamId: string) => void;
  deleteUser: (orgId: string, teamId: string, userId: string) => void;
  toggleTeamAdmin: (orgId: string, teamId: string, userId: string) => void;
  setCurrentUser: (user: User) => void;
  getCurrentUserTeams: () => Team[];
  getUserByEmail: (email: string, password: string) => User | null;
  getCurrentUserTeam: () => Team | null;
  getUnassignedUsers: () => User[];
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('rbac_organizations');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('unassigned_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUserState] = useState<User | null>(() => {
    const saved = localStorage.getItem('rbac_current_user');
    return saved ? JSON.parse(saved) : {
      id: '1',
      name: 'Super Admin',
      email: 'admin@smartedge.in',
      role: 'super_admin'
    };
  });

  // Save to localStorage whenever organizations change
  useEffect(() => {
    localStorage.setItem('rbac_organizations', JSON.stringify(organizations));
  }, [organizations]);

  // Save unassigned users to localStorage
  useEffect(() => {
    localStorage.setItem('unassigned_users', JSON.stringify(unassignedUsers));
  }, [unassignedUsers]);

  // Save current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rbac_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Sync with auth user when it changes
  useEffect(() => {
    if (authUser) {
      // Check if this user exists in our RBAC system
      const rbacUser = getUserByEmail(authUser.email, ''); // We'll find by email since we have the auth token
      if (rbacUser) {
        setCurrentUserState(rbacUser);
      } else if (authUser.email === 'admin@smartedge.in') {
        // Default super admin
        setCurrentUserState({
          id: '1',
          name: 'Super Admin',
          email: 'admin@smartedge.in',
          role: 'super_admin'
        });
      } else {
        // Check if it's a registered user (self-signup)
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const registeredUser = registeredUsers.find((u: any) => u.email === authUser.email);
        if (registeredUser) {
          setCurrentUserState({
            id: registeredUser.user_id,
            name: registeredUser.name,
            email: registeredUser.email,
            role: 'user'
          });
        }
      }
    }
  }, [authUser, organizations]);

  const createOrganization = (org: Omit<Organization, 'id' | 'teams'>) => {
    const newOrg: Organization = {
      ...org,
      id: Date.now().toString(),
      teams: []
    };
    setOrganizations(prev => [...prev, newOrg]);
  };

  const createTeam = (orgId: string, team: Omit<Team, 'id' | 'users' | 'organizationId'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      users: [],
      organizationId: orgId
    };
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? { ...org, teams: [...org.teams, newTeam] }
        : org
    ));
  };

  const addUserToTeam = (orgId: string, teamId: string, user: Omit<User, 'id' | 'organizationId' | 'teamId'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      organizationId: orgId,
      teamId: teamId
    };
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? {
            ...org,
            teams: org.teams.map(team => 
              team.id === teamId 
                ? { ...team, users: [...team.users, newUser] }
                : team
            )
          }
        : org
    ));
  };

  const assignUnassignedUserToTeam = (userId: string, orgId: string, teamId: string) => {
    const userToAssign = unassignedUsers.find(u => u.id === userId);
    if (!userToAssign) return;

    // Add user to team
    const assignedUser: User = {
      ...userToAssign,
      organizationId: orgId,
      teamId: teamId
    };

    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? {
            ...org,
            teams: org.teams.map(team => 
              team.id === teamId 
                ? { ...team, users: [...team.users, assignedUser] }
                : team
            )
          }
        : org
    ));

    // Remove from unassigned users
    setUnassignedUsers(prev => prev.filter(u => u.id !== userId));
  };

  const deleteOrganization = (orgId: string) => {
    setOrganizations(prev => prev.filter(org => org.id !== orgId));
  };

  const deleteTeam = (orgId: string, teamId: string) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? { ...org, teams: org.teams.filter(team => team.id !== teamId) }
        : org
    ));
  };

  const deleteUser = (orgId: string, teamId: string, userId: string) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? {
            ...org,
            teams: org.teams.map(team => 
              team.id === teamId 
                ? { 
                    ...team, 
                    users: team.users.filter(user => user.id !== userId),
                    adminId: team.adminId === userId ? undefined : team.adminId
                  }
                : team
            )
          }
        : org
    ));
  };

  const toggleTeamAdmin = (orgId: string, teamId: string, userId: string) => {
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? {
            ...org,
            teams: org.teams.map(team => 
              team.id === teamId 
                ? { 
                    ...team, 
                    adminId: team.adminId === userId ? undefined : userId,
                    users: team.users.map(user => ({
                      ...user,
                      isTeamAdmin: user.id === userId ? !user.isTeamAdmin : false
                    }))
                  }
                : team
            )
          }
        : org
    ));
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
  };

  const getCurrentUserTeams = (): Team[] => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'super_admin') {
      // Super admin can see all teams
      return organizations.flatMap(org => org.teams);
    }
    
    if (currentUser.role === 'admin') {
      // Admin can see teams in their organization
      const userOrg = organizations.find(org => org.id === currentUser.organizationId);
      return userOrg ? userOrg.teams : [];
    }
    
    if (currentUser.role === 'user') {
      // Regular user can only see their own team
      const userTeam = organizations
        .flatMap(org => org.teams)
        .find(team => team.id === currentUser.teamId);
      return userTeam ? [userTeam] : [];
    }
    
    return [];
  };

  const getCurrentUserTeam = (): Team | null => {
    if (!currentUser || currentUser.role !== 'user') return null;
    
    return organizations
      .flatMap(org => org.teams)
      .find(team => team.id === currentUser.teamId) || null;
  };

  const getUserByEmail = (email: string, password: string): User | null => {
    // Check super admin
    if (email === 'admin@smartedge.in') {
      return {
        id: '1',
        name: 'Super Admin',
        email: 'admin@smartedge.in',
        role: 'super_admin'
      };
    }

    // Check users in organizations
    for (const org of organizations) {
      for (const team of org.teams) {
        const user = team.users.find(u => u.email === email);
        if (user) {
          return user;
        }
      }
    }
    
    return null;
  };

  const getUnassignedUsers = (): User[] => {
    return unassignedUsers;
  };

  return (
    <RBACContext.Provider value={{
      organizations,
      currentUser,
      unassignedUsers,
      createOrganization,
      createTeam,
      addUserToTeam,
      assignUnassignedUserToTeam,
      deleteOrganization,
      deleteTeam,
      deleteUser,
      toggleTeamAdmin,
      setCurrentUser,
      getCurrentUserTeams,
      getUserByEmail,
      getCurrentUserTeam,
      getUnassignedUsers
    }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
