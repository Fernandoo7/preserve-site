import { Link } from "@tanstack/react-router";

type Props = { icon: string; heading: string; text: string; label: string };
export function PaymentResult({ icon, heading, text, label }: Props) {
  return <main className="payment-page"><div className="payment-card">
    <div className="payment-icon">{icon}</div>
    <h1>{heading}</h1>
    <p dangerouslySetInnerHTML={{ __html: text }} />
    <Link to="/">{label}</Link>
  </div></main>;
}
