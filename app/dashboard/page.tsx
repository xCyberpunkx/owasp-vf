"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/auth/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push("/login")
        }
      } catch (err) {
        console.error("Error checking authentication:", err)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Welcome to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Email: {user.email}</p>
        <p className="mb-4">Role: {user.role}</p>
        <Button onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </CardContent>
    </Card>
  )
}

