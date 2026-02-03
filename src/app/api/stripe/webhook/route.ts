import { headers } from "next/headers";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import {
  supabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json(
      { error: "Stripe non configurato." },
      { status: 500 }
    );
  }
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json(
      { error: "Supabase admin non configurato." },
      { status: 500 }
    );
  }

  const signature = headers().get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Firma mancante." },
      { status: 400 }
    );
  }

  const body = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: "Webhook non valido." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId) {
      await supabaseAdmin.from("purchases").upsert({
        user_id: userId,
        product: "lifetime",
        status: "active",
      });
    }
  }

  return NextResponse.json({ received: true });
}
