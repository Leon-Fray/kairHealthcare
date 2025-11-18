'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [signInSuccess, setSignInSuccess] = useState(false)
  const { signIn, user, profile, loading: authLoading } = useAuth()
  const router = useRouter()

  // Handle redirect after successful sign-in and profile load
  useEffect(() => {
    if (signInSuccess && !authLoading && user && profile) {
      // Redirect based on user role
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
        default:
          router.push('/dashboard')
      }
      setSignInSuccess(false)
      setLoading(false)
    } else if (signInSuccess && !authLoading && user && !profile) {
      // User signed in but profile not found - redirect to default dashboard
      console.warn('Profile not found for user, redirecting to default dashboard')
      router.push('/dashboard')
      setSignInSuccess(false)
      setLoading(false)
    }
  }, [signInSuccess, authLoading, user, profile, router])

  // Timeout fallback in case profile takes too long to load
  useEffect(() => {
    if (signInSuccess && loading) {
      const timeout = setTimeout(() => {
        if (user) {
          // If we have a user but profile is still loading, redirect anyway
          router.push('/dashboard')
          setSignInSuccess(false)
          setLoading(false)
        }
      }, 5000) // 5 second timeout

      return () => clearTimeout(timeout)
    }
  }, [signInSuccess, loading, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSignInSuccess(false)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Wait for profile to load via auth state change
      setSignInSuccess(true)
      // Keep loading state until redirect happens
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/sign-up" className="text-primary hover:underline">
              Sign up as a patient
            </Link>
            {' '}or{' '}
            <Link href="/practitioner-signup" className="text-primary hover:underline">
              register as a practitioner
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

