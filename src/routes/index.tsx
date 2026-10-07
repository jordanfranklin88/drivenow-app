import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Fuel,
  Home,
  MapPin,
  Search,
  Settings2,
  Star,
  User,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlugaFácil — Aluguel de Carros" },
      { name: "description", content: "Protótipo de app mobile de aluguel de veículos." },
      { property: "og:title", content: "AlugaFácil — Aluguel de Carros" },
      { property: "og:description", content: "Protótipo de app mobile de aluguel de veículos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Screen = "home" | "results" | "detail" | "booking" | "success" | "reservations" | "history" | "profile";
import { LoginScreen, ReservationsScreen, HistoryScreen, ProfileScreen } from "@/components/ExtraScreens";

interface Vehicle {
  id: number;
  name: string;
  category: string;
  price: number;
  seats: number;
  transmission: string;
  fuel: string;
  rating: number;
  emoji: string;
}

const VEHICLES: Vehicle[] = [
  { id: 1, name: "Fiat Mobi Like", category: "Econômico", price: 89, seats: 4, transmission: "Manual", fuel: "Flex", rating: 4.6, emoji: "🚗" },
  { id: 2, name: "Hyundai HB20", category: "Compacto", price: 119, seats: 5, transmission: "Automático", fuel: "Flex", rating: 4.8, emoji: "🚙" },
  { id: 3, name: "Jeep Renegade", category: "SUV", price: 219, seats: 5, transmission: "Automático", fuel: "Flex", rating: 4.9, emoji: "🚐" },
  { id: 4, name: "Toyota Corolla", category: "Sedan", price: 249, seats: 5, transmission: "Automático", fuel: "Híbrido", rating: 4.9, emoji: "🚘" },
  { id: 5, name: "Fiat Toro", category: "Pickup", price: 289, seats: 5, transmission: "Automático", fuel: "Diesel", rating: 4.7, emoji: "🛻" },
];

const CATEGORIES = ["Todos", "Econômico", "Compacto", "SUV", "Sedan", "Pickup"];

function Index() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState<Vehicle | null>(null);

  const filtered = category === "Todos" ? VEHICLES : VEHICLES.filter((v) => v.category === category);

  const goHome = () => {
    setScreen("home");
    setSelected(null);
    setCategory("Todos");
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary px-5 pb-5 pt-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-80">Olá, Maria 👋</p>
            <h1 className="text-lg font-bold">AlugaFácil</h1>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/20">
            <User className="h-5 w-5" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {screen === "home" && (
          <div className="px-5">
            {/* Search card */}
            <div className="-mt-4 rounded-2xl bg-card p-4 shadow-lg shadow-primary/10">
              <div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Retirada</p>
                  <p className="truncate text-sm font-semibold">Aeroporto de Maceió</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-3">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Retirada</p>
                    <p className="text-sm font-semibold">10/10</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-3">
                  <Calendar className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Devolução</p>
                    <p className="text-sm font-semibold">14/10</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setScreen("results")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
              >
                <Search className="h-4 w-4" />
                Buscar carros
              </button>
            </div>

            {/* Categories */}
            <h2 className="mt-6 text-base font-bold">Categorias</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {[
                { label: "Econômico", emoji: "🚗" },
                { label: "SUV", emoji: "🚐" },
                { label: "Sedan", emoji: "🚘" },
                { label: "Pickup", emoji: "🛻" },
                { label: "Luxo", emoji: "🏎️" },
                { label: "Utilitário", emoji: "🚚" },
              ].map((c) => (
                <button
                  key={c.label}
                  onClick={() => {
                    setCategory(c.label === "Luxo" || c.label === "Utilitário" ? "Todos" : c.label);
                    setScreen("results");
                  }}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm transition-transform active:scale-95"
                >
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="text-xs font-semibold">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Promo banner */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">Oferta da semana</p>
              <p className="mt-1 text-lg font-bold">20% OFF em SUVs</p>
              <p className="mt-1 text-xs opacity-80">Válido para retiradas até 31 de outubro.</p>
            </div>

            {/* Popular */}
            <h2 className="mt-6 text-base font-bold">Populares perto de você</h2>
            <div className="mt-3 space-y-3">
              {VEHICLES.slice(0, 3).map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onClick={() => {
                    setSelected(v);
                    setScreen("detail");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "results" && (
          <div className="px-5">
            <div className="-mt-2 flex items-center gap-3">
              <button
                onClick={goHome}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card shadow-sm"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold">Carros disponíveis</h2>
                <p className="text-xs text-muted-foreground">Aeroporto de Maceió · 10–14 out</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    category === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {filtered.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  onClick={() => {
                    setSelected(v);
                    setScreen("detail");
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {screen === "detail" && selected && (
          <div className="px-5">
            <div className="-mt-2 flex items-center gap-3">
              <button
                onClick={() => setScreen("results")}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card shadow-sm"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="truncate text-base font-bold">{selected.name}</h2>
            </div>

            <div className="mt-4 grid place-items-center rounded-2xl bg-card py-10 text-8xl shadow-sm">
              {selected.emoji}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.category} · ou similar</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-bold text-accent-foreground">
                <Star className="h-4 w-4 fill-current" />
                {selected.rating}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: Users, label: `${selected.seats} lugares` },
                { icon: Settings2, label: selected.transmission },
                { icon: Fuel, label: selected.fuel },
              ].map((f) => (
                <div key={f.label} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 shadow-sm">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span className="text-[11px] font-semibold">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl bg-card p-4 shadow-sm">
              <p className="text-sm font-bold">Incluso na diária</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {["Km livre", "Proteção básica", "Cancelamento grátis até 24h antes"].map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
              <div>
                <p className="text-xs text-muted-foreground">4 diárias</p>
                <p className="text-xl font-bold text-primary">
                  R$ {selected.price * 4}
                  <span className="text-xs font-normal text-muted-foreground"> total</span>
                </p>
              </div>
              <button
                onClick={() => setScreen("booking")}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
              >
                Reservar
              </button>
            </div>
          </div>
        )}

        {screen === "booking" && selected && (
          <div className="px-5">
            <div className="-mt-2 flex items-center gap-3">
              <button
                onClick={() => setScreen("detail")}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card shadow-sm"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-base font-bold">Confirmar reserva</h2>
            </div>

            <div className="mt-4 flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
              <span className="text-5xl">{selected.emoji}</span>
              <div className="min-w-0">
                <p className="truncate font-bold">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.category}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 rounded-2xl bg-card p-4 shadow-sm">
              {[
                { icon: MapPin, label: "Local de retirada", value: "Aeroporto de Maceió" },
                { icon: Calendar, label: "Retirada", value: "10/10/2026 · 10:00" },
                { icon: Calendar, label: "Devolução", value: "14/10/2026 · 10:00" },
              ].map((r) => (
                <div key={r.label} className="flex items-center gap-3">
                  <r.icon className="h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-muted-foreground">{r.label}</p>
                    <p className="truncate text-sm font-semibold">{r.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2 rounded-2xl bg-card p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Diária × 4</span>
                <span className="font-semibold">R$ {selected.price * 4}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxas</span>
                <span className="font-semibold">R$ 42</span>
              </div>
              <div className="border-t pt-2" />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">R$ {selected.price * 4 + 42}</span>
              </div>
            </div>

            <button
              onClick={() => setScreen("success")}
              className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Confirmar e pagar
            </button>
          </div>
        )}

        {screen === "success" && (
          <div className="flex flex-col items-center px-5 pt-16 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-accent">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mt-4 text-xl font-bold">Reserva confirmada!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Seu {selected?.name} estará te esperando no Aeroporto de Maceió no dia 10/10 às 10:00.
            </p>
            <div className="mt-6 w-full rounded-2xl bg-card p-4 text-left shadow-sm">
              <p className="text-xs text-muted-foreground">Código da reserva</p>
              <p className="text-lg font-bold tracking-widest">AF-8K2M4X</p>
            </div>
            <button
              onClick={goHome}
              className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98]"
            >
              Voltar ao início
            </button>
          </div>
        )}
        {screen === "reservations" && <ReservationsScreen />}
        {screen === "history" && <HistoryScreen />}
        {screen === "profile" && <ProfileScreen onLogout={() => { setLoggedIn(false); goHome(); }} />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-10 w-full max-w-md -translate-x-1/2 border-t bg-card">
        <div className="grid grid-cols-4 px-2 py-2">
          {[
            { icon: Home, label: "Início", target: "home" as Screen },
            { icon: Car, label: "Reservas", target: "reservations" as Screen },
            { icon: Clock, label: "Histórico", target: "history" as Screen },
            { icon: User, label: "Perfil", target: "profile" as Screen },
          ].map((item) => {
            const active = item.target === "home" ? !["reservations", "history", "profile"].includes(screen) : screen === item.target;
            return (
            <button
              key={item.label}
              onClick={() => (item.target === "home" ? goHome() : setScreen(item.target))}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}

function VehicleCard({ vehicle, onClick }: { vehicle: Vehicle; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left shadow-sm transition-transform active:scale-[0.98]"
    >
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-muted text-4xl">
        {vehicle.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{vehicle.name}</p>
        <p className="text-xs text-muted-foreground">
          {vehicle.category} · {vehicle.transmission}
        </p>
        <p className="mt-1 text-sm font-bold text-primary">
          R$ {vehicle.price}
          <span className="text-xs font-normal text-muted-foreground">/dia</span>
        </p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
