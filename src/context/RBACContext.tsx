
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
  createOrganization: (org: Omit<Organization, 'id' | 'teams'>) => void;
  createTeam: (orgId: string, team: Omit<Team, 'id' | 'users' | 'organizationId'>) => void;
  addUserToTeam: (orgId: string, teamId: string, user: Omit<User, 'id' | 'organizationId' | 'teamId'>) => void;
  deleteOrganization: (orgId: string) => void;
  deleteTeam: (orgId: string, teamId: string) => void;
  deleteUser: (orgId: string, teamId: string, userId: string) => void;
  toggleTeamAdmin: (orgId: string, teamId: string, userId: string) => void;
  setCurrentUser: (user: User) => void;
  getCurrentUserTeams: () => Team[];
  getUserByEmail: (email: string, password: string) => User | null;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('rbac_organizations');
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

  return (
    <RBACContext.Provider value={{
      organizations,
      currentUser,
      createOrganization,
      createTeam,
      addUserToTeam,
      deleteOrganization,
      deleteTeam,
      deleteUser,
      toggleTeamAdmin,
      setCurrentUser,
      getCurrentUserTeams,
      getUserByEmail
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
