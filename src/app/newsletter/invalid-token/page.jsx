import { XCircle } from "lucide-react"

export default function InvalidTokenPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <XCircle className="h-16 w-16 text-red-500" />
      <h1 className="mt-4 text-2xl font-bold">Invalid or Expired Link</h1>
      <p className="mt-2 text-muted-foreground">
        The confirmation link is invalid or has expired. Please try subscribing again.
      </p>
    </div>
  )
}
