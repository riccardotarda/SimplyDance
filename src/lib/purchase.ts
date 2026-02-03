import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const PURCHASE_KEY = "simplydancePurchased";

export function isPurchased(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(PURCHASE_KEY) === "true";
}

export function markPurchased(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PURCHASE_KEY, "true");
}

export function clearPurchase(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(PURCHASE_KEY);
}

export async function syncPurchaseFromSupabase(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return false;
  }
  const { data } = await supabase
    .from("purchases")
    .select("id,status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (data) {
    markPurchased();
    return true;
  }
  return false;
}

export async function savePurchaseToSupabase(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return;
  }
  await supabase.from("purchases").upsert({
    user_id: user.id,
    product: "lifetime",
    status: "active",
  });
}
