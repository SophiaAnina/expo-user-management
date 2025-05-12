// filepath: c:\Users\sophi\expo-user-management\context\UserContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface UserContextType {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <UserContext.Provider value={{ email, password, setEmail, setPassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};