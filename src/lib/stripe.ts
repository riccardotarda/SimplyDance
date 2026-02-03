import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

export const isStripeConfigured = stripeSecretKey.length > 0;

export const stripe = isStripeConfigured
  ? new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" })
  : null;
