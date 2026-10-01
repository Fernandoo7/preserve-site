import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { originalHtml } from "@/lib/original-site";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "365 Receitas Sem Acucar, Sem Gluten e Sem Lactose | Lena Weber" },
    { name: "description", content: "Mais de 365 receitas praticas sem acucar, sem gluten e sem lactose. Bolos, paes, sobremesas e refeicoes leves. Transforme sua alimentacao sem abrir mao do sabor." },
    { property: "og:title", content: "365 Receitas Sem Acucar, Sem Gluten e Sem Lactose | Lena Weber" },
    { property: "og:description", content: "Mais de 365 receitas praticas sem acucar, sem gluten e sem lactose. Bolos, paes, sobremesas e refeicoes leves." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = container.current;
    if (!root) return;
    let seconds = 14 * 60;
    const countdown = root.querySelector<HTMLElement>("#countdown");
    const timer = window.setInterval(() => {
      const minutes = Math.floor(seconds / 60);
      const remainder = seconds % 60;
      if (countdown) countdown.textContent = `${minutes}:${String(remainder).padStart(2, "0")}`;
      if (seconds > 0) seconds--;
    }, 1000);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    }), { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    root.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

    const handleClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const faq = target.closest<HTMLButtonElement>("[data-faq]");
      if (faq) {
        const item = faq.closest(".faq-item");
        const isOpen = item?.classList.contains("open");
        root.querySelectorAll(".faq-item.open").forEach((entry) => entry.classList.remove("open"));
        if (!isOpen) item?.classList.add("open");
        return;
      }
      const purchase = target.closest<HTMLButtonElement>("[data-plan]");
      if (!purchase) return;
      const buttons = root.querySelectorAll<HTMLButtonElement>("[data-plan]");
      buttons.forEach((button) => { button.disabled = true; button.style.opacity = "0.7"; button.style.cursor = "wait"; });
      try {
        const response = await fetch("/create-checkout-session", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: purchase.dataset["plan"] }),
        });
        const result = await response.json();
        if (!response.ok || !result.url) throw new Error(result.error || "Ocorreu um erro ao processar o pagamento. Tente novamente.");
        window.location.href = result.url;
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Erro de conexão. Verifique sua internet e tente novamente.");
        buttons.forEach((button) => { button.disabled = false; button.style.opacity = ""; button.style.cursor = ""; });
      }
    };
    root.addEventListener("click", handleClick);
    return () => { window.clearInterval(timer); observer.disconnect(); root.removeEventListener("click", handleClick); };
  }, []);
  return <div ref={container} dangerouslySetInnerHTML={{ __html: originalHtml }} />;
}
