import { AuthCard } from "@/components/auth/auth-card";
import { signUp } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return <AuthCard mode="signup" action={signUp} error={params.error} />;
}

