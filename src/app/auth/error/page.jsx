export default function AuthError({ searchParams }) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-red-600">
            Authentication Error
          </h2>
          <p className="mt-4 text-gray-600">
            {searchParams.error || "Something went wrong."}
          </p>
        </div>
      </div>
    )
  }