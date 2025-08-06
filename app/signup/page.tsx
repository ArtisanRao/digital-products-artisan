'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Toaster } from "@/components/ui/toaster"
import { toast } from "sonner"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(name, email, password)
      toast('Signup successful! Please check your email to confirm.')
      router.push('/login')
    } catch (err: any) {
      toast(`Signup failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
      <p className="text-sm mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log In
        </a>
      </p>
      <Toaster />
    </div>
  )
}
