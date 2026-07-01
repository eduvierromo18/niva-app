import { AuthCard } from "@/components/auth/auth-card";
import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return <AuthCard mode="login" action={signIn} error={params.error} next={params.next} />;
}

