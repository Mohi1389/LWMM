import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { LanguageProvider, useLanguage } from './context/LanguageContext.js';
import { ThemeProvider } from './context/ThemeContext.js';

import { Header } from './components/common/Header.js';
import { BottomNav } from './components/common/BottomNav.js';
import { OnboardingModal } from './components/onboarding/OnboardingModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { PlacementTestModal } from './components/placement/PlacementTestModal.js';

import { DashboardView } from './components/dashboard/DashboardView.js';
import { LearnView } from './components/learn/LearnView.js';
import { AIAssistantView } from './components/ai/AIAssistantView.js';
import { MovieHubView } from './components/movies/MovieHubView.js';
import { QuizHubView } from './components/quiz/QuizHubView.js';
import { CommunityView } from './components/community/CommunityView.js';
import { ProfileView } from './components/profile/ProfileView.js';
import { AdminPanelView } from './components/admin/AdminPanelView.js';
import { SettingsView } from './components/settings/SettingsView.js';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [aiPrompt, setAiPrompt] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAI = (prompt?: string) => {
    setAiPrompt(prompt);
    setActiveTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Global Modals */}
      <OnboardingModal />
      <AuthModal />
      <PlacementTestModal />

      {/* Main App Header */}
      <Header activeTab={activeTab} onNavigate={handleNavigate} />

      {/* Main Body Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-12 overflow-x-hidden">
        {activeTab === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
        {activeTab === 'learn' && <LearnView onNavigateToAI={handleNavigateToAI} />}
        {activeTab === 'ai' && <AIAssistantView initialPrompt={aiPrompt} />}
        {activeTab === 'movies' && <MovieHubView onNavigateToAI={handleNavigateToAI} />}
        {activeTab === 'quizzes' && <QuizHubView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'profile' && <ProfileView onNavigateToAI={handleNavigateToAI} onNavigate={handleNavigate} />}
        {activeTab === 'settings' && <SettingsView onNavigate={handleNavigate} />}
        {activeTab === 'admin' && <AdminPanelView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
