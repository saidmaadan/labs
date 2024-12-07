import { auth } from "@/lib/auth"

export async function getSession() {
  try {
    const session = await auth()
    return { session }
  } catch (error) {
    console.error('Session error:', error)
    return { session: null }
  }
}
