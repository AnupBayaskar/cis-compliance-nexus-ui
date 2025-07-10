
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface SectionDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  criticality: 'High' | 'Medium' | 'Low';
}

interface SectionDetailsProps {
  sectionName: string;
  details: SectionDetail[];
}

const SectionDetails = ({ sectionName, details }: SectionDetailsProps) => {
  if (!sectionName) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Section Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a section to view details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{sectionName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {details.map((detail) => (
            <div key={detail.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{detail.title}</h4>
                <div className="flex space-x-2">
                  <Badge variant="outline">{detail.category}</Badge>
                  <Badge 
                    variant={detail.criticality === 'High' ? 'destructive' : 'secondary'}
                  >
                    {detail.criticality}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{detail.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionDetails;
