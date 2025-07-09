import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// **CẦN THAY ĐỔI**: Lấy client IDs từ Google Cloud Console
const googleConfig = Constants.expoConfig?.extra?.googleAuthConfig;

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // **CẦN THAY ĐỔI**: Thay đổi redirectUri theo domain của bạn
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'foodieapp',
    path: 'auth',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleConfig?.webClientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      redirectUri,
      extraParams: {
        access_type: 'offline',
      },
    },
    discovery
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGoogleResponse(code);
    }
  }, [response]);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleResponse = async (code: string) => {
    try {
      setLoading(true);
      
      // **CẦN THAY ĐỔI**: Thay đổi URL theo backend server của bạn
      // Dùng IP thực cho mobile, localhost cho web/simulator
      const baseUrl = __DEV__ && Constants.platform?.ios 
        ? 'http://10.248.189.105:5000' // Thay IP theo máy bạn
        : 'http://localhost:5000';
        
      const response = await fetch(`${baseUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirectUri }),
      });

      const data = await response.json();

      if (data.success) {
        await SecureStore.setItemAsync('userToken', data.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error handling Google response:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Failed to sign in with Google');
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}