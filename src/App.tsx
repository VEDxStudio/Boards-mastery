import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/navigation/Header';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { PlannerView } from './components/planner/PlannerView';
import { RevisionQueue } from './components/queues/RevisionQueue';
import { PyqQueue } from './components/queues/PyqQueue';
import { CompetencyQueue } from './components/queues/CompetencyQueue';
import { ResourceManager } from './components/resources/ResourceManager';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto pb-24 md:pb-12">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'syllabus' && <SyllabusView />}
        {activeTab === 'planner' && <PlannerView />}
        {activeTab === 'revision' && <RevisionQueue />}
        {activeTab === 'pyq' && <PyqQueue />}
        {activeTab === 'competency' && <CompetencyQueue />}
        {activeTab === 'resources' && <ResourceManager />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        <div className="flex-1 flex min-w-0">
          <Sidebar />
          <MainContent />
        </div>
        <BottomNav />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
