import { Suspense } from 'react';
import { NewPasswordForm } from "@/components/auth/new-password-form";

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}
