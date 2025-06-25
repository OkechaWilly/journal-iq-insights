import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthError {
  message: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('trading_journal_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('trading_journal_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in production, this would call your auth API
    if (email && password) {
      const user: User = {
        id: 'user_123',
        email,
        username: email.split('@')[0]
      };
      
      setUser(user);
      localStorage.setItem('trading_journal_user', JSON.stringify(user));
      
      return { data: { user }, error: null };
    }
    
    return { 
      data: null, 
      error: { message: 'Invalid email or password' } as AuthError 
    };
  };

  const signUp = async (email: string, password: string) => {
    // Mock signup - in production, this would call your auth API
    if (email && password) {
      const user: User = {
        id: `user_${Date.now()}`,
        email,
        username: email.split('@')[0]
      };
      
      setUser(user);
      localStorage.setItem('trading_journal_user', JSON.stringify(user));
      
      return { data: { user }, error: null };
    }
    
    return { 
      data: null, 
      error: { message: 'Invalid email or password' } as AuthError 
    };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('trading_journal_user');
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};