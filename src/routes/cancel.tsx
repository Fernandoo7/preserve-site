import { createFileRoute } from "@tanstack/react-router";
import { PaymentResult } from "@/components/payment-result";
export const Route = createFileRoute("/cancel")({
  head: () => ({ meta: [
    { title: "Pagamento Cancelado | Lena Weber" },
    { name: "description", content: "Pagamento cancelado das 365 Receitas de Lena Weber." },
    { property: "og:title", content: "Pagamento Cancelado | Lena Weber" },
    { property: "og:description", content: "Pagamento cancelado das 365 Receitas de Lena Weber." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PaymentResult icon="😔" heading="Pagamento Cancelado" text="Não se preocupe! A sua compra foi cancelada e não foi cobrado nenhum valor. Volte à página e tente novamente quando quiser." label="Voltar e tentar novamente" />,
});
