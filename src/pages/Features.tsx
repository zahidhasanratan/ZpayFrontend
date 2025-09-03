import { useMemo, useState } from "react";
import { useFeaturesQuery } from "../features/api/landingApi";
import { CardSkeleton } from "../components/Skeleton";

type Feature = { id: string; title: string; desc: string; icon: string };

const FALLBACK: Feature[] = [
  {
    id: "f1",
    title: "Instant Transfers",
    desc: "Send money in seconds with bank-grade security.",
    icon: "⚡",
  },
  {
    id: "f2",
    title: "Agent Network",
    desc: "Cash-in/out via verified agents nationwide.",
    icon: "🏪",
  },
  {
    id: "f3",
    title: "QR Payments",
    desc: "Scan & pay at stores using dynamic QR.",
    icon: "🔳",
  },
  {
    id: "f4",
    title: "Bill Payments",
    desc: "Utilities, internet—pay in one place.",
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
];

export default function Features() {
  const { data, isLoading } = useFeaturesQuery();
  const [q, setQ] = useState("");

  // Accept both shapes: array or { data: array }
  const allFeatures: Feature[] = useMemo(() => {
    if (Array.isArray(data)) return data as Feature[];
    if (data && Array.isArray((data as any).data))
      return (data as any).data as Feature[];
    return FALLBACK;
  }, [data]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return allFeatures;
    return allFeatures.filter(
      (f) =>
        f.title.toLowerCase().includes(term) ||
        f.desc.toLowerCase().includes(term)
    );
  }, [allFeatures, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-2">All the tools you need</h1>
        <p className="text-gray-600">
          NovaPay is built for real-world money movement—fast, secure, and
          flexible. Browse the highlights below.
        </p>
      </header>

      {/* Search/filter */}
      <div className="mt-6">
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="feature-search"
        >
          Search features
        </label>
        <div className="relative max-w-md">
          <input
            id="feature-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try: QR, security, agent…"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ⌘K
          </span>
        </div>
      </div>

      {/* Grid */}
      <section className="mt-8">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8">
            <div className="text-gray-900 font-semibold">No results</div>
            <p className="text-sm text-gray-600 mt-1">
              We couldn’t find any features matching “{q}”. Try a different
              term.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((f) => (
              <article
                key={f.id}
                className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:shadow-xl"
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

                <div className="mt-4 flex flex-wrap gap-2">
                  {/* simple visual tags to make the cards feel richer */}
                  {f.title.includes("QR") && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      QR
                    </span>
                  )}
                  {f.title.toLowerCase().includes("security") && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      Security
                    </span>
                  )}
                  {f.title.toLowerCase().includes("agent") && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      Agent network
                    </span>
                  )}
                  {f.title.toLowerCase().includes("bill") && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      Bills
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-2xl bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-2xl font-bold">See it in action</div>
          <p className="text-sm text-gray-300 mt-1">
            Explore QR payments, agent cash-in/out, and instant P2P transfers.
          </p>
        </div>
        <a
          href="/contact"
          className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium"
        >
          Request a demo →
        </a>
      </div>
    </div>
  );
}
