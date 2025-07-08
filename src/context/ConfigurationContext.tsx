// src/context/ConfigurationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Check {
  id: string;
  save_id: string;
  check_id: string;
  status: boolean | null;
  title?: string;
  category?: string;
  criticality?: 'Low' | 'Medium' | 'High';
}

interface Report {
  report_id: string;
  generated_at: string;
  passed_checks: number;
  failed_checks: number;
  skipped_checks: number;
  compliance_score: number;
}

interface SavedConfiguration {
  save_id: string;
  user_id: string;
  device_id: string;
  name: string;
  saved_at: string;
  comments?: string;
  checks: Check[];
  device_name: string;
  report?: Report;
}

interface ConfigurationContextType {
  savedConfigurations: SavedConfiguration[];
  saveConfiguration: (
    name: string,
    deviceId: string,
    deviceName: string,
    checks: { check_id: string; status: boolean | null }[],
    comments?: string
  ) => Promise<void>;
  generateReport: (saveId: string) => Promise<void>;
  deleteConfiguration: (saveId: string) => Promise<void>;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [savedConfigurations, setSavedConfigurations] = useState<SavedConfiguration[]>([]);

  // Fetch configurations on mount if user and token are available
  useEffect(() => {
    if (user && token && user.user_id) {
      fetchConfigurations();
    }
  }, [user, token]);

  const fetchConfigurations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/saved-configurations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const configs = (response.data as any[]).map((config: any) => ({
        save_id: config.save_id,
        user_id: config.user_id,
        device_id: config.device_id,
        name: config.name,
        saved_at: config.saved_at,
        comments: config.comments || undefined,
        checks: config.checks || [],
        device_name: config.device?.machine_name || 'Unknown Device',
        report: config.report || undefined,
      }));
      setSavedConfigurations(configs);
    } catch (error: any) {
      console.error('Fetch configurations error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load configurations.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        logout();
        navigate('/auth');
      }
    }
  };

  const saveConfiguration = async (
    name: string,
    deviceId: string,
    deviceName: string,
    checks: { check_id: string; status: boolean | null }[],
    comments?: string
  ) => {
    if (!user || !token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to save configurations.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      interface SaveConfigResponse {
        save_id: string;
        user_id: string;
        device_id: string;
        name: string;
        saved_at: string;
        comments?: string;
      }

      const response = await axios.post<SaveConfigResponse>(
        `${API_BASE_URL}/saved-configurations`,
        {
          device_id: deviceId,
          name,
          comments,
          checks,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newConfig: SavedConfiguration = {
        save_id: response.data.save_id,
        user_id: response.data.user_id,
        device_id: response.data.device_id,
        name: response.data.name,
        saved_at: response.data.saved_at,
        comments: response.data.comments,
        checks: checks.map(check => ({
          id: `${response.data.save_id}-${check.check_id}`, // Placeholder ID
          save_id: response.data.save_id,
          check_id: check.check_id,
          status: check.status,
        })),
        device_name: deviceName,
        report: undefined,
      };
      setSavedConfigurations(prev => [newConfig, ...prev]);
      toast({
        title: 'Success',
        description: 'Configuration saved successfully.',
      });
      navigate('/saved-configurations');
    } catch (error: any) {
      console.error('Save configuration error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save configuration.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        logout();
        navigate('/auth');
      }
    }
  };

  const generateReport = async (saveId: string) => {
    if (!user || !token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to generate reports.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      interface GenerateReportResponse {
        report_id: string;
        generated_at: string;
        passed_checks: number;
        failed_checks: number;
        skipped_checks: number;
        compliance_score: number;
      }

      const response = await axios.post<GenerateReportResponse>(
        `${API_BASE_URL}/saved-configurations/${saveId}/report`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const report: Report = {
        report_id: response.data.report_id,
        generated_at: response.data.generated_at,
        passed_checks: response.data.passed_checks,
        failed_checks: response.data.failed_checks,
        skipped_checks: response.data.skipped_checks,
        compliance_score: response.data.compliance_score,
      };
      setSavedConfigurations(prev =>
        prev.map(config =>
          config.save_id === saveId
            ? {
                ...config,
                report: {
                  report_id: report.report_id,
                  generated_at: report.generated_at,
                  passed_checks: report.passed_checks,
                  failed_checks: report.failed_checks,
                  skipped_checks: report.skipped_checks,
                  compliance_score: report.compliance_score,
                },
              }
            : config
        )
      );
      toast({
        title: 'Success',
        description: 'Report generated successfully.',
      });
    } catch (error: any) {
      console.error('Generate report error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to generate report.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        logout();
        navigate('/auth');
      }
    }
  };

  const deleteConfiguration = async (saveId: string) => {
    if (!user || !token) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to delete configurations.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/saved-configurations/${saveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedConfigurations(prev => prev.filter(config => config.save_id !== saveId));
      toast({
        title: 'Success',
        description: 'Configuration deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete configuration error:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete configuration.',
        variant: 'destructive',
      });
      if (error.response?.status === 401) {
        logout();
        navigate('/auth');
      }
    }
  };

  return (
    <ConfigurationContext.Provider
      value={{
        savedConfigurations,
        saveConfiguration,
        generateReport,
        deleteConfiguration,
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};