import { useState } from "react";
import { Bell, ChevronRight, CreditCard, FileText, HelpCircle, Lock, LogOut, Mail, MapPin, Shield, Star, Calendar } from "lucide-react";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-primary text-primary-foreground">
      <div className="px-6 pb-10 pt-16">
        <div className="text-5xl">🚗</div>
        <h1 className="mt-4 text-3xl font-bold">AlugaFácil</h1>
        <p className="mt-1 text-sm opacity-80">Seu carro, do seu jeito, onde você estiver.</p>
      </div>
      <div className="flex-1 rounded-t-3xl bg-card px-6 pt-8 text-card-foreground">
        <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-semibold">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`rounded-lg py-2 ${mode === m ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>
        <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          {mode === "signup" && <Field placeholder="Nome completo" />}
          {mode === "signup" && <Field placeholder="CPF" />}
          <Field placeholder="E-mail" type="email" defaultValue="maria@email.com" />
          <Field placeholder="Senha" type="password" defaultValue="123456" />
          {mode === "login" && <button type="button" className="text-xs font-semibold text-primary">Esqueci minha senha</button>}
          <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground active:scale-[0.98]">
            {mode === "login" ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" /></div>
        <button onClick={onLogin} className="w-full rounded-xl border py-3 text-sm font-semibold">Continuar com Google</button>
        <button onClick={onLogin} className="mt-3 w-full rounded-xl border py-3 text-sm font-semibold">Continuar com Apple</button>
      </div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary" />;
}

const ACTIVE = [
  { code: "AF-8K2M4X", car: "Jeep Renegade", emoji: "🚐", place: "Aeroporto de Maceió", pick: "10/10 10:00", ret: "13/10 10:00", total: 657, status: "Confirmada" },
  { code: "AF-3J9P1L", car: "Hyundai HB20", emoji: "🚙", place: "Shopping Pátio Maceió", pick: "02/11 09:00", ret: "05/11 09:00", total: 357, status: "Aguardando retirada" },
];

export function ReservationsScreen() {
  return (
    <div className="space-y-4 px-5 pt-5">
      <h2 className="text-lg font-bold">Minhas reservas</h2>
      {ACTIVE.map((r) => (
        <div key={r.code} className="rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-xl bg-muted text-3xl">{r.emoji}</div>
            <div className="flex-1">
              <p className="text-sm font-bold">{r.car}</p>
              <p className="text-xs text-muted-foreground">Código {r.code}</p>
            </div>
            <span className="rounded-full bg-accent px-2 py-1 text-[10px] font-bold text-primary">{r.status}</span>
          </div>
          <div className="mt-3 space-y-1.5 border-t pt-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{r.place}</p>
            <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />{r.pick} → {r.ret}</p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-primary">R$ {r.total}</p>
            <div className="flex gap-2">
              <button className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Cancelar</button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Detalhes</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const PAST = [
  { car: "Fiat Mobi Like", emoji: "🚗", date: "Ago 2026", days: 4, total: 356, km: 412 },
  { car: "Toyota Corolla", emoji: "🚘", date: "Jun 2026", days: 2, total: 498, km: 230 },
  { car: "Fiat Toro", emoji: "🛻", date: "Mar 2026", days: 7, total: 2023, km: 1180 },
  { car: "Hyundai HB20", emoji: "🚙", date: "Jan 2026", days: 3, total: 357, km: 290 },
];

export function HistoryScreen() {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-bold">Histórico</h2>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[["4", "Aluguéis"], ["16", "Diárias"], ["2.112", "Km rodados"]].map(([v, l]) => (
          <div key={l} className="rounded-2xl bg-card p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-primary">{v}</p>
            <p className="text-[10px] text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {PAST.map((p) => (
          <div key={p.car + p.date} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted text-2xl">{p.emoji}</div>
            <div className="flex-1">
              <p className="text-sm font-bold">{p.car}</p>
              <p className="text-xs text-muted-foreground">{p.date} · {p.days} diárias · {p.km} km</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">R$ {p.total}</p>
              <button className="text-[10px] font-semibold text-primary">Alugar de novo</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileScreen({ onLogout }: { onLogout: () => void }) {
  const sections = [
    { title: "Conta", items: [{ i: FileText, l: "Dados pessoais e CNH" }, { i: CreditCard, l: "Formas de pagamento" }, { i: MapPin, l: "Endereços" }] },
    { title: "Preferências", items: [{ i: Bell, l: "Notificações" }, { i: Lock, l: "Segurança e senha" }, { i: Shield, l: "Privacidade" }] },
    { title: "Suporte", items: [{ i: HelpCircle, l: "Central de ajuda" }, { i: Mail, l: "Fale conosco" }] },
  ];
  return (
    <div className="px-5 pt-5">
      <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">M</div>
        <div className="flex-1">
          <p className="font-bold">Maria Silva</p>
          <p className="text-xs text-muted-foreground">maria@email.com</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-primary"><Star className="h-3 w-3 fill-current" />Cliente Ouro · 1.240 pts</p>
        </div>
      </div>
      {sections.map((s) => (
        <div key={s.title} className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{s.title}</p>
          <div className="divide-y rounded-2xl bg-card shadow-sm">
            {s.items.map(({ i: Icon, l }) => (
              <button key={l} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm">
                <Icon className="h-4 w-4 text-primary" /><span className="flex-1">{l}</span><ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={onLogout} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive py-3 text-sm font-semibold text-destructive">
        <LogOut className="h-4 w-4" />Sair da conta
      </button>
    </div>
  );
}
