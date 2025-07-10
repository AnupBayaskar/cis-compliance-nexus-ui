
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Team {
  id: string;
  name: string;
}

interface TeamDropdownProps {
  teams: Team[];
  selectedTeam: string | null;
  onTeamChange: (teamId: string) => void;
}

const TeamDropdown = ({ teams, selectedTeam, onTeamChange }: TeamDropdownProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Team</label>
      <Select value={selectedTeam || ''} onValueChange={onTeamChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamDropdown;
