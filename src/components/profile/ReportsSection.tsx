
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Download, 
  Calendar, 
  Shield,
  AlertCircle,
  Clock
} from 'lucide-react';

interface Device {
  device_id: string;
  uuid: string;
  type: 'os' | 'service';
  device_subtype: string;
  ip_address: string;
  machine_name: string;
  description?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'decommissioned';
  decommissioned_on?: string;
  decommissioned_by?: string;
  decommission_details?: string;
  compliance?: number;
  device?: string;
  date?: string;
  criticalIssues?: number;
  mediumIssues?: number;
}

interface ReportsSectionProps {
  devices: Device[];
  onCreateReport: () => void;
}

const ReportsSection = ({ devices, onCreateReport }: ReportsSectionProps) => {
  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Maintenance': return 'secondary';
      case 'Completed': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span>Compliance Reports</span>
        </CardTitle>
        <CardDescription>
          View and download your compliance assessment reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {devices.map((report) => (
            <Card key={report.device_id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold">{report.device}</h4>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.type}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className={`h-4 w-4 ${getComplianceColor(report.compliance || 0)}`} />
                        <span className={getComplianceColor(report.compliance || 0)}>
                          {report.compliance}% Compliant
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-sm">
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{report.criticalIssues} Critical</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-600">
                        <Clock className="h-4 w-4" />
                        <span>{report.mediumIssues} Medium</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" disabled={report.status !== 'active'}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button onClick={onCreateReport}>
            Create New Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsSection;
