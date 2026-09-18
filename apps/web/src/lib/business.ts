import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Returns the signed-in user, their business, and a ready server client.
// Redirects to /login or /onboarding if either is missing.
export async function requireBusiness() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, category, city, region, whatsapp")
    .order("created_at", { ascending: true })
    .limit(1);

  const business = businesses?.[0];
  if (!business) redirect("/onboarding");

  return { supabase, user, business };
}
