import { createFileRoute } from "@tanstack/react-router";
import { PaymentResult } from "@/components/payment-result";

export const Route = createFileRoute("/sucesso")({
  head: () => ({ meta: [
    { title: 'Compra Confirmada! | Lena Weber' },
    { name: "description", content: 'Confirmação de compra das 365 Receitas de Lena Weber.' },
    { property: "og:title", content: 'Compra Confirmada! | Lena Weber' },
    { property: "og:description", content: 'Confirmação de compra das 365 Receitas de Lena Weber.' },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <PaymentResult icon='🎉' heading='Pagamento Confirmado!' text='Muito obrigado pela sua compra! O seu acesso às <strong>365 Receitas de Lena Weber</strong> foi enviado para o seu e-mail cadastrado na hora da compra.' label='Voltar ao início' />,
});
