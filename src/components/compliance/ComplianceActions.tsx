
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, X, SkipForward, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface ComplianceActionsProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  selectedAction: string | null;
  onActionChange: (action: string) => void;
  onPrevious: () => void;
  onMark: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const ComplianceActions = ({
  comment,
  onCommentChange,
  selectedAction,
  onActionChange,
  onPrevious,
  onMark,
  onNext,
  canGoPrevious,
  canGoNext
}: ComplianceActionsProps) => {
  const actions = [
    { id: 'checked', label: 'Checked', icon: CheckCircle, color: 'text-green-600' },
    { id: 'cross', label: 'Cross', icon: X, color: 'text-red-600' },
    { id: 'skip', label: 'Skip', icon: SkipForward, color: 'text-yellow-600' },
    { id: 'reset', label: 'Reset/Empty', icon: RotateCcw, color: 'text-gray-600' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Check className="h-5 w-5" />
          <span>Compliance Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Action</label>
          {actions.map((action) => (
            <div key={action.id} className="flex items-center space-x-3">
              <Checkbox
                checked={selectedAction === action.id}
                onCheckedChange={() => onActionChange(action.id)}
              />
              <action.icon className={`h-4 w-4 ${action.color}`} />
              <span className="text-sm">{action.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Comment</label>
          <Textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add your comments here..."
            rows={3}
          />
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={onMark}
            className="flex-1 bg-brand-green hover:bg-brand-green/90"
          >
            Mark
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!canGoNext}
            className="flex-1"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceActions;
