import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: { handlers: {
    POST: async ({ request }) => {
      const secret = process.env["STRIPE_WEBHOOK_SECRET"];
      const signature = request.headers.get("stripe-signature");
      if (!secret || !signature) return new Response("Unauthorized", { status: 401 });
      const body = await request.text();
      const timestamp = signature.match(/(?:^|,)t=(\d+)/)?.[1];
      const supplied = signature.match(/(?:^|,)v1=([a-f0-9]+)/)?.[1];
      if (!timestamp || !supplied || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return new Response("Invalid signature", { status: 400 });
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
      const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${body}`)));
      const expected = Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("");
      let mismatch = expected.length ^ supplied.length;
      for (let i = 0; i < Math.max(expected.length, supplied.length); i++) mismatch |= (expected.charCodeAt(i) || 0) ^ (supplied.charCodeAt(i) || 0);
      if (mismatch !== 0) return new Response("Invalid signature", { status: 400 });
      const event = JSON.parse(body) as { type?: string; data?: { object?: { id?: string; amount_total?: number; currency?: string } } };
      if (event.type === "checkout.session.completed") console.info("Pagamento confirmado", event.data?.object?.id, event.data?.object?.amount_total, event.data?.object?.currency);
      return Response.json({ received: true });
    },
  } },
});
