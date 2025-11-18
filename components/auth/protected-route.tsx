'use client'

import { useAuth } from './auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { UserRole } from '@/types'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user || !profile) {
        router.push('/auth/sign-in')
        return
      }

      // Wrong role
      if (requiredRole && profile.role !== requiredRole) {
        // Redirect to appropriate dashboard
        switch (profile.role) {
          case 'patient':
            router.push('/dashboard')
            break
          case 'practitioner':
            router.push('/practitioner/dashboard')
            break
          case 'admin':
            router.push('/admin/users')
            break
        }
      }
    }
  }, [user, profile, loading, requiredRole, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !profile) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (requiredRole && profile.role !== requiredRole) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

