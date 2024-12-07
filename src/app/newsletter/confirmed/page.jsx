import { CheckCircle } from "lucide-react"

export default function NewsletterConfirmedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-2xl font-bold">Subscription Confirmed!</h1>
      <p className="mt-2 text-muted-foreground">
        Thank you for confirming your subscription to our newsletter.
      </p>
    </div>
  )
}
