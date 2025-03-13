'use client';

import React, { useState } from 'react';
import XpertStatsDashboard from './XpertStatsDashboard';
import MissionStatsDashboard from './MissionStatsDashboard';
import FournisseurStatsDashboard from './FournisseurStatsDashboard';
import { cn } from '@/lib/utils';

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
