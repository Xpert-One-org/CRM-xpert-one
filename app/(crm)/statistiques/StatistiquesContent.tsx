'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import Loader from '@/components/Loader';

// Chargement dynamique : recharts + react-simple-maps ne sont téléchargés
// que pour l'onglet affiché, pas au premier rendu de la page.
const dashboardLoading = () => (
  <div className="flex w-full items-center justify-center p-10">
    <Loader />
  </div>
);
const XpertStatsDashboard = dynamic(() => import('./XpertStatsDashboard'), {
  ssr: false,
  loading: dashboardLoading,
});
const MissionStatsDashboard = dynamic(() => import('./MissionStatsDashboard'), {
  ssr: false,
  loading: dashboardLoading,
});
const FournisseurStatsDashboard = dynamic(
  () => import('./FournisseurStatsDashboard'),
  { ssr: false, loading: dashboardLoading }
);

const StatistiquesContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'xpert' | 'mission' | 'fournisseur'
  >('xpert');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex space-x-4">
        <button
          className={cn(
            'rounded-lg px-4 py-2 font-medium transition',
            activeTab === 'xpert'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
          onClick={() => setActiveTab('xpert')}
        >
          XPERT
        </button>
        <button
          className={cn(
            'rounded-lg px-4 py-2 font-medium transition',
            activeTab === 'mission'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
          onClick={() => setActiveTab('mission')}
        >
          MISSION
        </button>
        <button
          className={cn(
            'rounded-lg px-4 py-2 font-medium transition',
            activeTab === 'fournisseur'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
          onClick={() => setActiveTab('fournisseur')}
        >
          FOURNISSEUR
        </button>
      </div>

      {activeTab === 'xpert' && <XpertStatsDashboard />}
      {activeTab === 'mission' && <MissionStatsDashboard />}
      {activeTab === 'fournisseur' && <FournisseurStatsDashboard />}
    </div>
  );
};

export default StatistiquesContent;
