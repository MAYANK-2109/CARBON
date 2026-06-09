import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../../components/feedback/Toast';
import { GlassCard } from '../../components/ui/GlassCard';
import { Tabs } from '../../components/ui/Tabs';
import { TravelForm } from './TravelForm';
import { EnergyForm } from './EnergyForm';
import { DietForm } from './DietForm';
import { ResultCard } from './ResultCard';
import { api } from '../../lib/api';
import type { CalculationResult, TravelInput, EnergyInput, DietInput } from '@carbon/shared';
import { Car, Zap, Utensils } from 'lucide-react';

export const CalculatorPage: React.FC = () => {
  const { isAuthenticated, refreshProfile } = useAuth();
  const { success, error: showToastError } = useToast();
  const [activeTab, setActiveTab] = useState<'travel' | 'energy' | 'diet'>('travel');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculateTravel = async (data: TravelInput) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: CalculationResult }>('/calculate/travel', data);
      if (res.data.success) {
        setResult(res.data.data);
        success('Travel carbon calculation complete.');
        if (isAuthenticated) refreshProfile(); // Refresh profile values if saved
      }
    } catch (err: any) {
      showToastError(err.message || 'Failed to calculate emissions. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateEnergy = async (data: EnergyInput) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: CalculationResult }>('/calculate/energy', data);
      if (res.data.success) {
        setResult(res.data.data);
        success('Energy carbon calculation complete.');
        if (isAuthenticated) refreshProfile();
      }
    } catch (err: any) {
      showToastError(err.message || 'Failed to calculate emissions. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateDiet = async (data: DietInput) => {
    setIsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: CalculationResult }>('/calculate/diet', data);
      if (res.data.success) {
        setResult(res.data.data);
        success('Dietary carbon calculation complete.');
        if (isAuthenticated) refreshProfile();
      }
    } catch (err: any) {
      showToastError(err.message || 'Failed to calculate emissions. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  const tabOptions = [
    { id: 'travel', label: 'Travel', icon: <Car size={16} /> },
    { id: 'energy', label: 'Energy', icon: <Zap size={16} /> },
    { id: 'diet', label: 'Diet', icon: <Utensils size={16} /> },
  ];

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {!result && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs
            options={tabOptions}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'travel' | 'energy' | 'diet')}
          />
        </div>
      )}

      <GlassCard
        glowColor={
          result ? (result.category === 'travel' ? 'emerald' : result.category === 'energy' ? 'sky' : 'amber') : 'none'
        }
        style={{
          padding: '32px',
          background: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {result ? (
          <ResultCard
            result={result}
            onReset={() => setResult(null)}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <>
            {activeTab === 'travel' && (
              <TravelForm onSubmit={handleCalculateTravel} isLoading={isLoading} />
            )}
            {activeTab === 'energy' && (
              <EnergyForm onSubmit={handleCalculateEnergy} isLoading={isLoading} />
            )}
            {activeTab === 'diet' && (
              <DietForm onSubmit={handleCalculateDiet} isLoading={isLoading} />
            )}
          </>
        )}
      </GlassCard>
    </div>
  );
};
