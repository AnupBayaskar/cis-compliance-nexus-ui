
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Crown, Shield, CheckCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Mock data - in real app this would come from your database
const mockMembers = {
  'organization-lead': [
    { id: '1', name: 'Sarah Johnson', avatar: '/api/placeholder/32/32' },
  ],
  'team-lead': [
    { id: '2', name: 'Michael Chen', avatar: '/api/placeholder/32/32' },
    { id: '3', name: 'Emily Rodriguez', avatar: '/api/placeholder/32/32' },
  ],
  'validator': [
    { id: '4', name: 'David Park', avatar: '/api/placeholder/32/32' },
    { id: '5', name: 'Lisa Wang', avatar: '/api/placeholder/32/32' },
    { id: '6', name: 'James Miller', avatar: '/api/placeholder/32/32' },
  ],
  'member': [
    { id: '7', name: 'Anna Smith', avatar: '/api/placeholder/32/32' },
    { id: '8', name: 'Robert Brown', avatar: '/api/placeholder/32/32' },
    { id: '9', name: 'Jennifer Davis', avatar: '/api/placeholder/32/32' },
    { id: '10', name: 'Christopher Wilson', avatar: '/api/placeholder/32/32' },
  ],
};

const roleConfig = {
  'organization-lead': {
    label: 'Organization Leaders',
    icon: Crown,
    color: 'text-yellow-500',
  },
  'team-lead': {
    label: 'Team Leaders',
    icon: Shield,
    color: 'text-blue-500',
  },
  'validator': {
    label: 'Validators',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  'member': {
    label: 'Members',
    icon: User,
    color: 'text-gray-500',
  },
};

export function MemberPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      {/* Toggle Button */}
      <div className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-300",
        isOpen ? "translate-x-0" : "translate-x-0"
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-16 w-6 rounded-l-lg rounded-r-none border-l border-t border-b bg-sidebar hover:bg-accent transition-all duration-300",
            isOpen && "bg-accent"
          )}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Member Panel */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-80 bg-sidebar border-l border-border/50 z-30 transition-transform duration-300 overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b border-border/50">
          <h3 className="font-semibold text-lg">Organization Members</h3>
          <p className="text-sm text-muted-foreground">
            {Object.values(mockMembers).flat().length} members online
          </p>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {Object.entries(roleConfig).map(([role, config]) => {
            const members = mockMembers[role as keyof typeof mockMembers] || [];
            if (members.length === 0) return null;

            const Icon = config.icon;

            return (
              <div key={role} className="p-4 border-b border-border/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <span className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                    {config.label} — {members.length}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer",
                        user?.id === member.id && "bg-accent/30"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.name}
                          {user?.id === member.id && (
                            <span className="text-xs text-muted-foreground ml-2">(You)</span>
                          )}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
