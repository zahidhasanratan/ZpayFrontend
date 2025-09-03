import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useFeaturesQuery } from "../features/api/landingApi";
import { CardSkeleton } from "../components/Skeleton";

type Feature = { id: string; title: string; desc: string; icon: string };

export default function Home() {
  const { data, isLoading } = useFeaturesQuery();

  // accept both shapes: array or { data: array }
  const features: Feature[] = useMemo(() => {
    if (Array.isArray(data)) return data as Feature[];
    if (data && Array.isArray((data as any).data))
      return (data as any).data as Feature[];
    return [];
  }, [data]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
              🛡️ Bank-grade • ⚡ Instant • 📱 Mobile-first
            </p>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Move money at the speed of trust.
            </h1>
            <p className="mt-4 text-gray-700">
              Send, receive, and manage your wallet with instant transfers, QR
              payments, and secure cash-in/out via verified agents.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/features"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Explore Features
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white hover:border-indigo-700"
              >
                Talk to us
              </Link>
            </div>

            {/* Trust strip */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" /> 99.95%
                uptime
              </span>
              <span className="hidden sm:inline">•</span>
              <span>24/7 in-app support</span>
              <span className="hidden sm:inline">•</span>
              <span>KYC/AML ready</span>
            </div>
          </div>

          {/* Visual card */}
          <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
            <div className="h-56 rounded-xl bg-gradient-to-br from-indigo-100 via-white to-indigo-200" />
            <div className="mt-4 text-sm text-gray-500">
              ZPay wallet preview
            </div>
          </div>
        </div>
      </section>

      {/* Partner/press logos (placeholders) */}
      <section aria-label="Partners" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 opacity-70">
            {[
              "FinBank",
              "PayNet",
              "CityTel",
              "SecureID",
              "BroadNet",
              "TrustCo",
            ].map((n) => (
              <div
                key={n}
                className="h-10 rounded-md bg-gray-100 grid place-items-center text-xs text-gray-500"
                title={n}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Why ZPay</h2>
          <Link
            to="/features"
            className="text-sm text-indigo-700 hover:underline"
          >
            See all features →
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(features.length
              ? features
              : [
                  {
                    id: "f1",
                    title: "Instant Transfers",
                    desc: "Send money in seconds with bank-grade security.",
                    icon: "⚡",
                  },
                  {
                    id: "f2",
                    title: "Agent Network",
                    desc: "Cash-in/out at verified agents nationwide.",
                    icon: "🏪",
                  },
                  {
                    id: "f3",
                    title: "QR Payments",
                    desc: "Scan & pay with dynamic QR codes.",
                    icon: "🔳",
                  },
                  {
                    id: "f4",
                    title: "Bill Payments",
                    desc: "Utilities & internet—pay in one place.",
                    icon: "🧾",
                  },
                  {
                    id: "f5",
                    title: "Multi-Layer Security",
                    desc: "2FA, device lock, anomaly checks.",
                    icon: "🛡️",
                  },
                  {
                    id: "f6",
                    title: "Real-time Alerts",
                    desc: "Push notifications for every move.",
                    icon: "🔔",
                  },
                ]
            ).map((f) => (
              <article
                key={f.id}
                className="group rounded-2xl border border-gray-100 p-6 bg-white transition hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-2xl">
                    <span aria-hidden>{f.icon}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                    {f.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mt-3">{f.desc}</p>
                <div className="mt-4">
                  <Link
                    to="/features"
                    className="text-sm text-indigo-700 hover:underline"
                  >
                    Learn more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            {
              n: 1,
              t: "Sign up & verify",
              d: "Create your ZPay wallet and complete quick KYC.",
            },
            {
              n: 2,
              t: "Add money",
              d: "Cash-in via agent or link your bank account.",
            },
            {
              n: 3,
              t: "Pay & transfer",
              d: "Use QR at merchants or send money in seconds.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-gray-100 bg-white p-6"
            >
              <div className="h-8 w-8 grid place-items-center rounded-full bg-indigo-600 text-white text-sm font-bold">
                {s.n}
              </div>
              <div className="mt-3 font-semibold text-gray-900">{s.t}</div>
              <p className="text-sm text-gray-600 mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl bg-white border border-gray-100 p-8 shadow-sm">
          <blockquote className="text-lg text-gray-800 leading-relaxed">
            “ZPay made our store’s checkout painless. QR payments are instant
            and our cash-out is always on time.”
          </blockquote>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-full bg-gray-900 text-white text-sm font-semibold">
              MS
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                M. Siddique
              </div>
              <div className="text-xs text-gray-500">Owner, CityMart</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security ribbon */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-gray-900 text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xl font-bold">Security you can rely on</div>
              <p className="text-sm text-gray-300 mt-1">
                Multi-layer protection: encryption, device binding, 2FA, and
                proactive fraud monitoring.
              </p>
            </div>
            <Link
              to="/features"
              className="inline-flex items-center px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium"
            >
              See security features →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl bg-indigo-600 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-bold">Ready to go cashless?</div>
            <p className="text-sm text-indigo-100 mt-1">
              Open your ZPay wallet in minutes. No paperwork drama.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/features"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium"
            >
              Get Started →
            </Link>
            <Link
              to="/pricing"
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium ring-1 ring-white/20 hover:bg-indigo-500/90"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
