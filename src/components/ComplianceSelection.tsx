
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Monitor, Server, Smartphone, Wifi, Users, CheckCircle2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface ComplianceTeam {
  _id: string
  name: string
}

interface ComplianceDevice {
  _id: string
  name: string
  type: string
  teamId: string
}

interface ComplianceSelectionProps {
  teams: ComplianceTeam[]
  devices: ComplianceDevice[]
  selectedTeam: string
  selectedDevice: string
  onTeamSelect: (teamId: string) => void
  onDeviceSelect: (deviceId: string) => void
  onStartMarking: () => void
}

const getDeviceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'server':
      return Server
    case 'laptop':
    case 'desktop':
      return Monitor
    case 'mobile':
    case 'phone':
      return Smartphone
    case 'network':
    case 'router':
      return Wifi
    default:
      return Monitor
  }
}

export function ComplianceSelection({
  teams,
  devices,
  selectedTeam,
  selectedDevice,
  onTeamSelect,
  onDeviceSelect,
  onStartMarking
}: ComplianceSelectionProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const filteredDevices = devices.filter(device => device.teamId === selectedTeam)
  
  const selectedTeamObj = teams.find(team => team._id === selectedTeam)
  const selectedDeviceObj = devices.find(device => device._id === selectedDevice)

  const handleStartMarkingClick = () => {
    setShowConfirmation(true)
  }

  const handleConfirmStart = () => {
    setShowConfirmation(false)
    onStartMarking()
  }

  return (
    <div className="space-y-8">
      {/* Team Selection */}
      <Card className="glass-card border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-brand-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-display heading-enhanced">Select Your Team</CardTitle>
          <p className="text-muted-foreground typography-enhanced">Choose the team you want to manage compliance for</p>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team, index) => (
              <motion.div
                key={team._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  variant={selectedTeam === team._id ? "default" : "outline"}
                  size="lg"
                  className={`w-full h-16 transition-all duration-300 ${
                    selectedTeam === team._id
                      ? "button-primary shadow-xl scale-105"
                      : "hover:shadow-lg hover:scale-[1.02] border-2 hover:border-brand-primary/50"
                  }`}
                  onClick={() => onTeamSelect(team._id)}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-semibold">{team.name}</span>
                    {selectedTeam === team._id && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Device Selection */}
      {selectedTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-brand-secondary/10 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-brand-secondary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-display heading-enhanced">Select Device</CardTitle>
              <p className="text-muted-foreground typography-enhanced">
                Choose the device for compliance validation from <span className="font-semibold text-brand-primary">{selectedTeamObj?.name}</span>
              </p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device, index) => {
                  const Icon = getDeviceIcon(device.type)
                  return (
                    <motion.div
                      key={device._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        variant={selectedDevice === device._id ? "default" : "outline"}
                        className={`h-32 w-full flex flex-col items-center space-y-3 p-6 transition-all duration-300 ${
                          selectedDevice === device._id
                            ? "button-secondary shadow-xl scale-105"
                            : "hover:shadow-lg hover:scale-[1.02] border-2 hover:border-brand-secondary/50"
                        }`}
                        onClick={() => onDeviceSelect(device._id)}
                      >
                        <Icon className="w-8 h-8" />
                        <div className="text-center space-y-1">
                          <span className="font-semibold text-sm">{device.name}</span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-white/20 text-current border-0"
                          >
                            {device.type}
                          </Badge>
                        </div>
                        {selectedDevice === device._id && (
                          <CheckCircle2 className="w-5 h-5" />
                        )}
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Start Marking Button */}
      {selectedTeam && selectedDevice && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="button-primary h-14 px-12 text-lg font-semibold shadow-2xl hover:shadow-3xl animate-pulse-brand"
            onClick={handleStartMarkingClick}
          >
            <span>Start Compliance Marking</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="confirmation-dialog max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-brand-primary" />
            </div>
            <DialogTitle className="text-xl font-display">Confirm Compliance Marking</DialogTitle>
            <DialogDescription className="typography-enhanced">
              You are about to start compliance marking for:
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Team:</span>
                  <span className="text-brand-primary font-semibold">{selectedTeamObj?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Device:</span>
                  <span className="text-brand-secondary font-semibold">{selectedDeviceObj?.name}</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 pt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmStart}
              className="button-primary flex-1"
            >
              Start Marking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
