
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { AlertTriangle } from 'lucide-react';

interface DecommissionModalProps {
  isOpen: boolean;
  deviceName: string | undefined;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DecommissionModal = ({ 
  isOpen, 
  deviceName, 
  isLoading, 
  onConfirm, 
  onCancel 
}: DecommissionModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Confirm Decommission"
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-800">Warning: This action cannot be undone</h4>
            <p className="text-sm text-red-700 mt-1">
              Are you sure you want to decommission "{deviceName}"? 
              This will mark the device as inactive and it will no longer be available for compliance checks.
            </p>
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Decommissioning...' : 'Yes, Decommission'}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DecommissionModal;
