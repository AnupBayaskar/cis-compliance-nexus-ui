
export interface ComplianceConfigurationData {
  name: string;
  teamId: string;
  deviceId: string;
  controls: any[];
  comments?: string;
}

export const saveComplianceConfiguration = async (data: ComplianceConfigurationData) => {
  // Mock API call - replace with actual implementation
  console.log('Saving compliance configuration:', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful response
  return {
    success: true,
    configurationId: `config_${Date.now()}`,
    message: 'Configuration saved successfully'
  };
};
