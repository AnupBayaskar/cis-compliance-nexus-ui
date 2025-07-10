
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  isTeamAdmin?: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  users: User[];
  adminId?: string;
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
  createTeam: (orgId: string, team: Omit<Team, 'id' | 'users'>) => void;
  addUserToTeam: (orgId: string, teamId: string, user: Omit<User, 'id'>) => void;
  deleteOrganization: (orgId: string) => void;
  deleteTeam: (orgId: string, teamId: string) => void;
  deleteUser: (orgId: string, teamId: string, userId: string) => void;
  toggleTeamAdmin: (orgId: string, teamId: string, userId: string) => void;
  setCurrentUser: (user: User) => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({ children }: { children: ReactNode }) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    name: 'Super Admin',
    email: 'admin@smartedge.in',
    role: 'super_admin'
  });

  const createOrganization = (org: Omit<Organization, 'id' | 'teams'>) => {
    const newOrg: Organization = {
      ...org,
      id: Date.now().toString(),
      teams: []
    };
    setOrganizations(prev => [...prev, newOrg]);
  };

  const createTeam = (orgId: string, team: Omit<Team, 'id' | 'users'>) => {
    const newTeam: Team = {
      ...team,
      id: Date.now().toString(),
      users: []
    };
    setOrganizations(prev => prev.map(org => 
      org.id === orgId 
        ? { ...org, teams: [...org.teams, newTeam] }
        : org
    ));
  };

  const addUserToTeam = (orgId: string, teamId: string, user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
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
      setCurrentUser
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
