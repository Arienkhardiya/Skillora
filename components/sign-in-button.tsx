"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, User, Award, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-provider"
import { signInWithGoogle, signOut } from "@/lib/auth"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function SignInButton() {
  const { user, userProfile, loading } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const { toast } = useToast()

  const handleSignIn = async () => {
    setSigningIn(true)
    try {
      await signInWithGoogle()
      toast({
        title: "Signed in successfully",
        description: "Welcome to Skillora Learning Hub!",
      })
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Sign in failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Signed out successfully",
      })
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign out failed",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  if (loading || signingIn) {
    return (
      <Button disabled variant="outline" size="lg">
        <span className="animate-pulse">Loading...</span>
      </Button>
    )
  }

  if (user && userProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline">{user.displayName}</span>
              {userProfile.level && (
                <Badge variant="outline" className="ml-1">
                  Lvl {userProfile.level}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer flex items-center">
                <User className="mr-2 h-4 w-4" /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/history" className="cursor-pointer flex items-center">
                <BookOpen className="mr-2 h-4 w-4" /> Learning History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/projects" className="cursor-pointer flex items-center">
                <Award className="mr-2 h-4 w-4" /> IDX Projects
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Button onClick={handleSignIn} size="lg" className="gap-2">
        <LogIn className="h-5 w-5" />
        Sign in with Google
      </Button>
    </motion.div>
  )
}

