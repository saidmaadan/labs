import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-yellow-500" />
      <h1 className="mt-4 text-2xl font-bold">Something Went Wrong</h1>
      <p className="mt-2 text-muted-foreground">
        We encountered an error while processing your subscription. Please try again later.
      </p>
    </div>
  )
}
