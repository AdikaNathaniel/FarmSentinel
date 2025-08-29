
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User } from '@/lib/types';


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            // In a real app, you'd fetch the full user profile from a database here.
            // For this mock, we'll just use the basic info from Firebase Auth
            // and add some default mock data.
            const mockUser: User = {
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                role: 'admin',
                phone: '+1 (555) 123-4567',
                farmInfo: {
                    name: 'Green Valley Farms',
                    size: '120 Hectares',
                    latitude: '36.7783',
                    longitude: '-119.4179'
                }
            };
            setUser(mockUser);
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle setting the user state
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      // This will trigger onAuthStateChanged to log the user in with mock data.
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) throw new Error("No user is logged in.");
    
    // This is a mock update. In a real app, this would write to a database.
    console.log("Updating user with:", data);
    const updatedUser = { ...user, ...data };
    
    // If farmInfo is part of the update, merge it.
    if (data.farmInfo) {
        updatedUser.farmInfo = { ...user.farmInfo, ...data.farmInfo };
    }

    setUser(updatedUser);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
  };

  const logout = async () => {
    await signOut(auth);
  };
  
  const value = { 
    user,
    login,
    signup,
    logout, 
    updateUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
