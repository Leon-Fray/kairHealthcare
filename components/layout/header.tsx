'use client'

import { useAuth } from '@/components/auth/auth-provider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, LogOut, Settings, Calendar, Users } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import Image from 'next/image'

import { useState, useEffect } from 'react'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  // Logo based on user role
  const logoSrc = profile?.role === 'practitioner'
    ? '/icons/Doctors_icon.png'
    : '/icons/Patients_Icon.png'

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled
        ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm py-2"
        : "bg-transparent border-transparent py-4"
    )}>
      <div className="container flex h-auto items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Kari Health Logo"
            width={840}
            height={240}
            className="h-[120px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!user ? (
            // Anonymous user
            <>
              <Link
                href="/search"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary',
                  isActive('/search') && 'text-primary'
                )}
              >
                Find Practitioners
              </Link>
              <Link
                href="/practitioner-signup"
                className="text-lg font-medium transition-colors hover:text-primary"
              >
                For Practitioners
              </Link>
            </>
          ) : profile?.role === 'patient' ? (
            // Patient navigation
            <>
              <Link
                href="/search"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/search') && 'bg-secondary-patient/20 text-primary'
                )}
              >
                Find Practitioners
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/dashboard') && 'bg-secondary-patient/20 text-primary'
                )}
              >
                Dashboard
              </Link>
            </>
          ) : profile?.role === 'practitioner' ? (
            // Practitioner navigation
            <>
              <Link
                href="/practitioner/dashboard"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/practitioner/dashboard') && 'bg-secondary-doctor/20 text-primary'
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/practitioner/schedule"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/practitioner/schedule') && 'bg-secondary-doctor/20 text-primary'
                )}
              >
                Schedule
              </Link>
              <Link
                href="/practitioner/appointment-history"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/practitioner/appointment-history') && 'bg-secondary-doctor/20 text-primary'
                )}
              >
                Appointments
              </Link>
              <Link
                href="/practitioner/edit-account"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/practitioner/edit-account') && 'bg-secondary-doctor/20 text-primary'
                )}
              >
                Edit Profile
              </Link>
            </>
          ) : profile?.role === 'admin' ? (
            // Admin navigation
            <>
              <Link
                href="/admin/users"
                className={cn(
                  'text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-md',
                  isActive('/admin/users') && 'bg-primary/20 text-primary'
                )}
              >
                <Users className="inline-block w-4 h-4 mr-2" />
                User Management
              </Link>
            </>
          ) : null}
        </nav>

        {/* User menu */}
        <div className="flex items-center space-x-4">
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {profile.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {profile.role === 'patient' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>My Appointments</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                {profile.role === 'practitioner' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/practitioner/dashboard">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/practitioner/edit-account">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {profile.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/users">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Manage Users</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

