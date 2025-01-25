"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VerifyEmail() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError("No verification token provided")
        return
      }

      try {
        const response = await fetch(`/api/auth/verify-email/${token}`, {
          method: "GET",
        })

        if (response.ok) {
          setSuccess("Email verified successfully")
          setTimeout(() => router.push("/login"), 3000)
        } else {
          const data = await response.json()
          setError(data.error || "Email verification failed")
        }
      } catch (err) {
        setError("An error occurred. Please try again.")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>Verifying your email address</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {!error && !success && <p className="text-center">Verifying your email...</p>}
      </CardContent>
      <CardFooter>
        <Link href="/login" className="text-sm text-blue-500 hover:underline">
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  )
}

