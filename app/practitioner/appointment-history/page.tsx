'use client'

import { useEffect, useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPractitionerAppointments, updateAppointmentStatus } from '@/lib/database'
import { getInitials, formatDate, formatTime } from '@/lib/utils'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppointmentWithPatient {
  id: string
  start_time: string
  end_time: string
  type: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  patient: {
    id: string
    full_name: string
  }
}

export default function AppointmentHistoryPage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentWithPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        const data = await getPractitionerAppointments(user.id) as any
        setAppointments(data)
        setFilteredAppointments(data)
        setLoading(false)
      }
    }
    loadAppointments()
  }, [user])

  useEffect(() => {
    let filtered = appointments

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((apt) =>
        apt.patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAppointments(filtered)
  }, [statusFilter, searchTerm, appointments])

  const handleMarkComplete = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, 'completed')
      setAppointments(
        appointments.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
        )
      )
    } catch (error) {
      alert('Failed to update appointment')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute requiredRole="practitioner">
        <MainLayout>
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="practitioner">
      <MainLayout>
        <div className="bg-gradient-green py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Appointment <span className="text-primary">History</span>
            </h1>
            <p className="text-muted-foreground">
              View and manage all your appointments
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by patient name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No appointments found</p>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments
                .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
                .map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarFallback className="bg-muted">
                            {getInitials(appointment.patient.full_name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {appointment.patient.full_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(appointment.start_time)} at {formatTime(appointment.start_time)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </div>

                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Type:</span> {appointment.type}
                          </div>

                          {appointment.notes && (
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">Notes:</span> {appointment.notes}
                            </div>
                          )}

                          {appointment.status === 'confirmed' && new Date(appointment.start_time) < new Date() && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkComplete(appointment.id)}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

