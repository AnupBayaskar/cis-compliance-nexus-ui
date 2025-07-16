
import { useState } from "react"
import { useCompliance } from "@/hooks/useCompliance"
import { motion } from "framer-motion"
import { Shield, CheckCircle2, Users, Monitor, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ComplianceMarking } from "@/components/ComplianceMarking"
import { cn } from "@/lib/utils"

export default function ComplianceSpace() {
  const [selectedTeam, setSelectedTeam] = useState("")
  const [selectedDevice, setSelectedDevice] = useState("")
  const [isMarkingMode, setIsMarkingMode] = useState(false)
  const { teams, devices } = useCompliance()

  const handleStartMarking = () => {
    if (selectedTeam && selectedDevice) {
      console.log('Starting compliance marking for:', { selectedTeam, selectedDevice })
      setIsMarkingMode(true)
    }
  }

  const handleBackToSelection = () => {
    setIsMarkingMode(false)
  }

  const filteredDevices = devices.filter(device => device.teamId === selectedTeam)

  if (isMarkingMode) {
    return (
      <div className="min-h-screen bg-background">
        <ComplianceMarking
          teamId={selectedTeam}
          deviceId={selectedDevice}
          onBack={handleBackToSelection}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                  <Shield className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                Compliance Space
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Professional compliance management platform for baseline and benchmark validation
              </p>
              <div className="flex items-center justify-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">{teams.length} Teams</span>
                </div>
                <div className="w-1 h-1 bg-primary rounded-full"></div>
                <div className="flex items-center space-x-2 text-primary">
                  <Monitor className="w-5 h-5" />
                  <span className="font-medium">{devices.length} Devices</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold">Select Team</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {teams.map((team) => (
                <Button
                  key={team._id}
                  variant={selectedTeam === team._id ? "default" : "outline"}
                  size="lg"
                  onClick={() => {
                    setSelectedTeam(team._id)
                    setSelectedDevice("") // Reset device selection
                  }}
                  className={cn(
                    "px-8 py-4 text-lg font-medium transition-all duration-200",
                    selectedTeam === team._id 
                      ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" 
                      : "hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {team.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Device Selection */}
          {selectedTeam && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center space-y-6"
            >
              <h2 className="text-2xl font-bold">Select Device</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {filteredDevices.map((device) => (
                  <Button
                    key={device._id}
                    variant={selectedDevice === device._id ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedDevice(device._id)}
                    className={cn(
                      "px-8 py-4 text-lg font-medium transition-all duration-200",
                      selectedDevice === device._id 
                        ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90" 
                        : "hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <div className="text-center">
                      <div className="font-medium">{device.name}</div>
                      <div className="text-sm opacity-75">{device.type}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mark Compliance Button */}
          {selectedTeam && selectedDevice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-xl font-semibold shadow-xl"
                  >
                    <Shield className="w-6 h-6 mr-3" />
                    Mark Compliance
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-6 h-6 text-primary" />
                    </div>
                    <AlertDialogTitle>Start Compliance Marking</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you ready to start marking compliance for the selected team and device? 
                      This will open the compliance marking interface.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartMarking} className="bg-primary hover:bg-primary/90">
                      Start Marking
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
