'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserManagementTable } from '@/components/admin/user-management-table'
import { CreateUserModal } from '@/components/admin/create-user-modal'
import { Users } from 'lucide-react'

export default function AdminUsersPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <MainLayout>
        <div className="bg-gradient-green py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              User <span className="text-primary">Management</span>
            </h1>
            <p className="text-muted-foreground">
              Manage all users on the platform
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  All Users
                </CardTitle>
                <CardDescription>
                  View, create, edit, and manage user accounts
                </CardDescription>
              </div>
              <CreateUserModal onSuccess={handleRefresh} />
            </CardHeader>
            <CardContent>
              <UserManagementTable key={refreshKey} onRefresh={handleRefresh} />
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}

