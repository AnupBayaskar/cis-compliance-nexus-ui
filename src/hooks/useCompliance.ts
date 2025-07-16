
import { useState, useEffect } from 'react'

export interface ComplianceTeam {
  _id: string
  name: string
}

export interface ComplianceDevice {
  _id: string
  name: string
  type: string
  teamId: string
}

export interface ComplianceControl {
  _id: string
  controlId: string
  title: string
  description: string
  implementation: string
  section: string
  riskLevel: 'low' | 'medium' | 'high'
  references: string[]
}

export function useCompliance() {
  const [teams, setTeams] = useState<ComplianceTeam[]>([])
  const [devices, setDevices] = useState<ComplianceDevice[]>([])
  const [controls, setControls] = useState<ComplianceControl[]>([])

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTeams([
      { _id: '1', name: 'Security Team' },
      { _id: '2', name: 'IT Operations' }
    ])

    setDevices([
      { _id: '1', name: 'Web Server 01', type: 'Ubuntu Server', teamId: '1' },
      { _id: '2', name: 'Database Server', type: 'CentOS', teamId: '1' },
      { _id: '3', name: 'John Laptop', type: 'Windows 11 Pro', teamId: '2' }
    ])

    setControls([
      {
        _id: '1',
        controlId: '1.1.1',
        title: 'Ensure mounting of cramfs filesystems is disabled',
        description: 'The cramfs filesystem type is a compressed read-only Linux filesystem embedded in small footprint systems.',
        implementation: 'modprobe -n -v cramfs',
        section: 'Filesystem Configuration',
        riskLevel: 'high',
        references: ['CIS-1.1.1', 'NIST-AC-3']
      },
      {
        _id: '2',
        controlId: '1.1.2',
        title: 'Ensure mounting of freevxfs filesystems is disabled',
        description: 'The freevxfs filesystem type is a free version of the Veritas type filesystem.',
        implementation: 'modprobe -n -v freevxfs',
        section: 'Filesystem Configuration',
        riskLevel: 'medium',
        references: ['CIS-1.1.2', 'NIST-AC-3']
      },
      {
        _id: '3',
        controlId: '2.1.1',
        title: 'Ensure xinetd is not installed',
        description: 'The eXtended InterNET Daemon (xinetd) is an open source super daemon.',
        implementation: 'rpm -q xinetd',
        section: 'Services',
        riskLevel: 'high',
        references: ['CIS-2.1.1', 'NIST-CM-7']
      }
    ])
  }, [])

  return { teams, devices, controls }
}
