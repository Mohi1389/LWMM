import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, EnglishLevel, LearningGoal, AgeRange } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
    ageRange: AgeRange;
    englishLevel: EnglishLevel;
    learningGoal: LearningGoal;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  updateUserLevel: (level: EnglishLevel) => Promise<void>;
  resetProgress: () => Promise<void>;
  addXp: (amount: number) => void;
  isPlacementModalOpen: boolean;
  openPlacementModal: () => void;
  closePlacementModal: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isOnboardingOpen: boolean;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlacementModalOpen, setIsPlacementModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('onboarding_seen');
  });

  // Fetch current user on mount or token change
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.user) {
              setUser(data.user);
            } else {
              setUser(null);
              setToken(null);
              localStorage.removeItem('auth_token');
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
            setToken(null);
            localStorage.removeItem('auth_token');
          }
        }
      } catch {
        // Silently fallback on network error/offline
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        setIsAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'ورود ناموفق بود' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'خطا در ارتباط با سرور' };
    }
  };

  const signup = async (formData: {
    fullName: string;
    email: string;
    password: string;
    ageRange: AgeRange;
    englishLevel: EnglishLevel;
    learningGoal: LearningGoal;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('auth_token', data.token);
        setIsAuthModalOpen(false);

        // If user chose "I don't know" level, trigger Placement Test
        if (formData.englishLevel === 'unknown') {
          setIsPlacementModalOpen(true);
        }
        return { success: true };
      } else {
        return { success: false, error: data.error || 'ثبت نام ناموفق بود' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'خطا در ارتباط با سرور' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Logout API error:', err);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const resp = await res.json();
        if (resp.user) {
          setUser(resp.user);
        }
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const updateUserLevel = async (level: EnglishLevel) => {
    await updateProfile({ englishLevel: level });
  };

  const resetProgress = async () => {
    try {
      const res = await fetch('/api/auth/reset-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        }
      }
    } catch (err) {
      console.error('Reset progress error:', err);
    }
  };

  const addXp = (amount: number) => {
    if (user) {
      setUser({
        ...user,
        xp: user.xp + amount,
      });
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_seen', 'true');
    setIsOnboardingOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        updateUserProfile: updateProfile,
        updateUserLevel,
        resetProgress,
        addXp,
        isPlacementModalOpen,
        openPlacementModal: () => setIsPlacementModalOpen(true),
        closePlacementModal: () => setIsPlacementModalOpen(false),
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isOnboardingOpen,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
