import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const input = z.object({ plan: z.enum(["basic", "premium"]) });
const priceIds = { basic: "price_1UL7DTJXRmydGOOfvmJxSJpi", premium: "price_1UL7DTJXRmydGOOfvmJxSJpi" };

export const Route = createFileRoute("/create-checkout-session")({
  server: { handlers: {
    POST: async ({ request }) => {
      const key = process.env["STRIPE_SECRET_KEY"];
      if (!key) return Response.json({ error: "O pagamento ainda não está configurado. Tente novamente mais tarde." }, { status: 503 });
      const parsed = input.safeParse(await request.json().catch(() => null));
      if (!parsed.success) return Response.json({ error: "Plano inválido." }, { status: 400 });
      const origin = new URL(request.url).origin;
      const params = new URLSearchParams({
        mode: "payment", "payment_method_types[0]": "card",
        "line_items[0][price]": priceIds[parsed.data.plan],
        "line_items[0][quantity]": "1", billing_address_collection: "auto",
        allow_promotion_codes: "false", locale: "auto",
        success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancelado`,
      });
      const result = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params,
      });
      const data = await result.json() as { url?: string; error?: { message?: string } };
      if (!result.ok || !data.url) return Response.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 });
      return Response.json({ url: data.url });
    },
  } },
});
