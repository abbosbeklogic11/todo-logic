import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <OnboardingForm />;
}
