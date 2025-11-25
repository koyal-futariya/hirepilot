"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode}  from "jwt-decode"; // Use the default import

// Define the shape of our user object
type User = {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  [key: string]: any; // Allow other properties
};

type AuthContextType = User | null;

const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("betterauth_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
