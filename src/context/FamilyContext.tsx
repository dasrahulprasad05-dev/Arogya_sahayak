import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

export type Relationship = 'self' | 'father' | 'mother' | 'spouse' | 'son' | 'daughter' | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: Relationship;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  chronicConditions?: string[];
  avatarColor?: string;
}

interface FamilyContextProps {
  members: FamilyMember[];
  activeMember: FamilyMember;
  activeMemberId: string;
  setActiveMemberId: (id: string) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeFamilyMember: (id: string) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
}

const FamilyContext = createContext<FamilyContextProps | undefined>(undefined);

const AVATAR_COLORS = [
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-blue-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-teal-500 text-white'
];

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const defaultSelf: FamilyMember = useMemo(() => ({
    id: 'self',
    name: user?.user_metadata?.full_name || 'Self (Primary User)',
    relationship: 'self',
    age: 30,
    gender: 'male',
    bloodGroup: 'O+',
    chronicConditions: [],
    avatarColor: 'bg-primary text-white'
  }), [user]);

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const stored = localStorage.getItem('arogya_family_members');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [defaultSelf];
  });

  const [activeMemberId, setActiveMemberId] = useState<string>(() => {
    return localStorage.getItem('arogya_active_member_id') || 'self';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('arogya_family_members', JSON.stringify(members));
      localStorage.setItem('arogya_active_member_id', activeMemberId);
    } catch {}
  }, [members, activeMemberId]);

  const activeMember = useMemo(() => {
    return members.find(m => m.id === activeMemberId) || members[0] || defaultSelf;
  }, [members, activeMemberId, defaultSelf]);

  const addFamilyMember = useCallback((data: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...data,
      id: crypto.randomUUID(),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };
    setMembers(prev => [...prev, newMember]);
    setActiveMemberId(newMember.id);
  }, []);

  const removeFamilyMember = useCallback((id: string) => {
    if (id === 'self') return; // Cannot delete self
    setMembers(prev => prev.filter(m => m.id !== id));
    if (activeMemberId === id) {
      setActiveMemberId('self');
    }
  }, [activeMemberId]);

  const updateFamilyMember = useCallback((id: string, updates: Partial<FamilyMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  return (
    <FamilyContext.Provider
      value={{
        members,
        activeMember,
        activeMemberId,
        setActiveMemberId,
        addFamilyMember,
        removeFamilyMember,
        updateFamilyMember
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
