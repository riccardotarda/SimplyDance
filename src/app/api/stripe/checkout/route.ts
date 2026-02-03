import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json(
      { error: "Stripe non configurato." },
      { status: 500 }
    );
  }

  const { userId } = (await request.json()) as { userId?: string };
  if (!userId) {
    return NextResponse.json(
      { error: "Utente non valido." },
      { status: 400 }
    );
  }

  const priceId = process.env.STRIPE_PRICE_ID ?? "";
  if (!priceId) {
    return NextResponse.json(
      { error: "Prezzo non configurato." },
      { status: 500 }
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/sblocca/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/sblocca`,
    metadata: {
      user_id: userId,
    },
  });

  return NextResponse.json({ url: session.url });
}
