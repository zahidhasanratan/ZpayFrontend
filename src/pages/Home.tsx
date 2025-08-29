import { Link } from "react-router-dom";
import { useFeaturesQuery } from "../features/api/landingApi";
import { CardSkeleton } from "../components/Skeleton";

export default function Home() {
  const { data, isLoading } = useFeaturesQuery(undefined);

  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Move money at the speed of trust.
            </h1>
            <p className="mt-4 text-gray-700">
              Send, receive, and manage your wallet with instant transfers, QR
              payments, and bank-grade security.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/features"
                className="px-6 py-3 rounded-lg bg-indigo-600 text-white shadow hover:bg-indigo-700"
              >
                Explore Features
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg border border-gray-300 hover:border-indigo-700"
              >
                Talk to us
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-6">
            <div className="h-56 rounded-xl bg-gradient-to-br from-indigo-100 to-white" />
            <div className="mt-4 text-sm text-gray-500">Wallet UI preview</div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl font-bold mb-6">Why ZPay</h2>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((f: any) => (
              <div
                key={f.id}
                className="rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition bg-white"
              >
                <div className="text-3xl">{f.icon}</div>
                <div className="mt-3 font-semibold text-gray-900">
                  {f.title}
                </div>
                <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-gray-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-2xl font-bold">Ready to go cashless?</div>
            <p className="text-sm text-gray-300 mt-1">
              Open your ZPay wallet in minutes. No paperwork drama.
            </p>
          </div>
          <Link
            to="/features"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium"
          >
            Get Started →
          </Link>
        </div>
      </section>
    </div>
  );
}
