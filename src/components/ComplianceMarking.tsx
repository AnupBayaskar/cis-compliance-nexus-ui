
import React, { useState } from 'react'
import { ArrowLeft, Check, X, SkipForward, Shield, RotateCcw, Save, CheckCircle2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useCompliance, ComplianceTeam, ComplianceDevice, ComplianceControl } from '@/hooks/useCompliance'
import { cn } from '@/lib/utils'

interface ComplianceMarkingProps {
  teamId: string
  deviceId: string
  onBack: () => void
}

interface ComplianceMarking {
  controlId: string
  type: 'pass' | 'fail' | 'skip'
  explanation: string
  comments: string
  timestamp: string
}

export function ComplianceMarking({ teamId, deviceId, onBack }: ComplianceMarkingProps) {
  const [selectedControl, setSelectedControl] = useState<ComplianceControl | null>(null)
  const [markings, setMarkings] = useState<Record<string, ComplianceMarking>>({})
  const [currentMarkingType, setCurrentMarkingType] = useState<'pass' | 'fail' | 'skip' | ''>('')
  const [currentExplanation, setCurrentExplanation] = useState('')
  const [currentComments, setCurrentComments] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [configName, setConfigName] = useState('')
  const [configComments, setConfigComments] = useState('')
  const { teams, devices, controls } = useCompliance()

  const team = teams.find(t => t._id === teamId)
  const device = devices.find(d => d._id === deviceId)

  const handleSaveConfiguration = () => {
    if (!configName.trim()) {
      return
    }

    console.log('Saving configuration:', {
      name: configName,
      comments: configComments,
      teamId,
      deviceId,
      markings
    })

    setShowSaveDialog(false)
    setConfigName('')
    setConfigComments('')
  }

  const handleReset = () => {
    setCurrentMarkingType('')
    setCurrentExplanation('')
    setCurrentComments('')
  }

  const handleResetAll = () => {
    setMarkings({})
    setSelectedControl(null)
    setCurrentMarkingType('')
    setCurrentExplanation('')
    setCurrentComments('')
  }

  const controlsBySection = controls.reduce((acc, control) => {
    if (!acc[control.section]) {
      acc[control.section] = []
    }
    acc[control.section].push(control)
    return acc
  }, {} as Record<string, ComplianceControl[]>)

  const handleMarkCompliance = () => {
    if (!selectedControl || !currentMarkingType || !currentExplanation.trim()) {
      return
    }

    const newMarking = {
      controlId: selectedControl._id,
      type: currentMarkingType,
      explanation: currentExplanation.trim(),
      comments: currentComments.trim(),
      timestamp: new Date().toISOString()
    }

    setMarkings(prev => ({
      ...prev,
      [selectedControl._id]: newMarking
    }))

    // Clear current marking
    handleReset()
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Selection
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Compliance Marking</h1>
                  <p className="text-sm text-muted-foreground">
                    {team?.name} - {device?.name} ({device?.type})
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Markings</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reset all compliance markings? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetAll} className="bg-destructive hover:bg-destructive/90">
                      Reset All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                disabled={Object.keys(markings).length === 0}
              >
                <Save className="h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Controls */}
        <div className="w-1/3 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Device & Benchmark Details</h2>
            <div className="text-sm text-muted-foreground mt-1">
              <div>Team: {team?.name}</div>
              <div>Device: {device?.name}</div>
              <div>Type: {device?.type}</div>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4 space-y-4">
              {Object.entries(controlsBySection).map(([section, sectionControls]) => (
                <Collapsible key={section} defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-left bg-muted rounded-lg hover:bg-muted/80">
                    <span className="font-medium">{section}</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-1">
                    {sectionControls.map((control) => {
                      const marking = markings[control._id]
                      const isSelected = selectedControl?._id === control._id
                      
                      return (
                        <button
                          key={control._id}
                          onClick={() => setSelectedControl(control)}
                          className={cn(
                            "w-full text-left p-2 rounded text-sm transition-colors flex items-center justify-between",
                            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          )}
                        >
                          <span>{control.controlId}</span>
                          {marking && (
                            <div className="flex items-center gap-1">
                              {marking.type === 'pass' && <Check className="h-3 w-3 text-green-500" />}
                              {marking.type === 'fail' && <X className="h-3 w-3 text-red-500" />}
                              {marking.type === 'skip' && <SkipForward className="h-3 w-3 text-yellow-500" />}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Middle Column - Control Details */}
        <div className="w-1/3 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Control Details</h2>
          </div>
          
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-4">
              {selectedControl ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedControl.controlId}</h3>
                    <h4 className="font-medium text-base mt-1">{selectedControl.title}</h4>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Description</h5>
                    <p className="text-sm text-muted-foreground">{selectedControl.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Implementation</h5>
                    <code className="text-xs bg-muted p-2 rounded block font-mono">
                      {selectedControl.implementation}
                    </code>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Risk Level</h5>
                    <Badge className={cn(
                      selectedControl.riskLevel === 'high' ? 'bg-red-500/10 text-red-600' :
                      selectedControl.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-600' :
                      'bg-green-500/10 text-green-600'
                    )}>
                      {selectedControl.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">References</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedControl.references.map((ref, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a control to view details</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Column - Marking Interface */}
        <div className="w-1/3 bg-card">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Mark Compliance</h2>
          </div>
          
          <div className="p-4 space-y-6">
            {selectedControl ? (
              <>
                {/* Marking Options */}
                <div>
                  <h3 className="font-medium mb-3">Select Compliance Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={currentMarkingType === 'pass' ? 'default' : 'outline'}
                      onClick={() => setCurrentMarkingType('pass')}
                      className={cn(
                        "flex items-center gap-2",
                        currentMarkingType === 'pass' && "bg-green-600 hover:bg-green-700"
                      )}
                    >
                      <Check className="h-4 w-4" />
                      Pass
                    </Button>
                    <Button
                      variant={currentMarkingType === 'fail' ? 'default' : 'outline'}
                      onClick={() => setCurrentMarkingType('fail')}
                      className={cn(
                        "flex items-center gap-2",
                        currentMarkingType === 'fail' && "bg-red-600 hover:bg-red-700"
                      )}
                    >
                      <X className="h-4 w-4" />
                      Fail
                    </Button>
                    <Button
                      variant={currentMarkingType === 'skip' ? 'default' : 'outline'}
                      onClick={() => setCurrentMarkingType('skip')}
                      className={cn(
                        "flex items-center gap-2",
                        currentMarkingType === 'skip' && "bg-yellow-600 hover:bg-yellow-700"
                      )}
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>

                {/* Explanation Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Explanation <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={currentExplanation}
                    onChange={(e) => setCurrentExplanation(e.target.value)}
                    placeholder="Explain your compliance marking decision..."
                    rows={3}
                    required
                  />
                </div>

                {/* Comments Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Comments
                  </label>
                  <Textarea
                    value={currentComments}
                    onChange={(e) => setCurrentComments(e.target.value)}
                    placeholder="Any additional details or notes..."
                    rows={2}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const controlIndex = controls.findIndex(c => c._id === selectedControl._id)
                      if (controlIndex > 0) {
                        setSelectedControl(controls[controlIndex - 1])
                        handleReset()
                      }
                    }}
                    disabled={!selectedControl || controls.findIndex(c => c._id === selectedControl._id) === 0}
                  >
                    Previous
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="bg-primary hover:bg-primary/90"
                        disabled={!currentMarkingType || !currentExplanation.trim()}
                      >
                        Mark
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Compliance Marking</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to mark this control as "{currentMarkingType}"? 
                          This will save your compliance decision.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleMarkCompliance} className="bg-primary hover:bg-primary/90">
                          Confirm Mark
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const controlIndex = controls.findIndex(c => c._id === selectedControl._id)
                      if (controlIndex < controls.length - 1) {
                        setSelectedControl(controls[controlIndex + 1])
                        handleReset()
                      }
                    }}
                    disabled={!selectedControl || controls.findIndex(c => c._id === selectedControl._id) === controls.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a control to start marking</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Configuration Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Configuration Name <span className="text-destructive">*</span>
              </label>
              <Input
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
                placeholder="Enter configuration name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Configuration Comments
              </label>
              <Textarea
                value={configComments}
                onChange={(e) => setConfigComments(e.target.value)}
                placeholder="Additional details about this configuration..."
                rows={3}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Marked Controls: {Object.keys(markings).length}</p>
              <p>Total Controls: {controls.length}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90 flex-1"
                  disabled={!configName.trim()}
                >
                  Save Configuration
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Save Configuration</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to save this configuration? It will be sent to the validation space for review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSaveConfiguration} className="bg-primary hover:bg-primary/90">
                    Save Configuration
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
