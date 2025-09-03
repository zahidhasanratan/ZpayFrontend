import { useMemo, useState } from "react";
import { usePlansQuery } from "../features/api/landingApi";

type Plan = {
  id: string;
  name: string;
  price: number; // monthly base price in BDT
  unit: string; // "BDT/mo"
  notes: string;
  perks: string[];
};

const currency = (n: number, code: string = "BDT") =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(n);

// Sample: 15% off for yearly billing (UI-only simulation)
const YEARLY_DISCOUNT = 0.15;

export default function Pricing() {
  const { data, isLoading } = usePlansQuery();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  // Fallback in case data is undefined (keeps UI usable)
  const plans: Plan[] = useMemo(
    () =>
      (data ?? [
        {
          id: "p1",
          name: "Starter",
          price: 0,
          unit: "BDT/mo",
          notes: "Pay-as-you-go fees",
          perks: ["Personal wallet", "P2P transfers", "Basic support"],
        },
        {
          id: "p2",
          name: "Pro",
          price: 199,
          unit: "BDT/mo",
          notes: "Lower fees + extras",
          perks: ["Priority support", "Spending analytics", "Custom limits"],
        },
        {
          id: "p3",
          name: "Business",
          price: 499,
          unit: "BDT/mo",
          notes: "For merchants & SMBs",
          perks: ["Multi-user access", "Invoicing & QR", "Dedicated manager"],
        },
      ]) as Plan[],
    [data]
  );

  const computePrice = (baseMonthly: number) => {
    if (cycle === "monthly") return baseMonthly;
    // Yearly billing shown as equivalent monthly (discounted) + "/mo billed yearly"
    const discountedMonthly = Math.round(baseMonthly * (1 - YEARLY_DISCOUNT));
    return discountedMonthly;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-2">Simple pricing</h1>
        <p className="text-gray-600">
          Choose a plan that fits your needs. You can switch or cancel anytime.
        </p>
      </header>

      {/* Billing cycle toggle */}
      <div className="mt-6 flex items-center gap-3">
        <span
          className={`text-sm ${
            cycle === "monthly" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Monthly
        </span>
        <button
          type="button"
          onClick={() =>
            setCycle((c) => (c === "monthly" ? "yearly" : "monthly"))
          }
          aria-label="Toggle billing cycle"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition
            ${cycle === "yearly" ? "bg-indigo-600" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition
              ${cycle === "yearly" ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
        <span
          className={`text-sm ${
            cycle === "yearly" ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Yearly{" "}
          <span className="text-green-600">
            (save {Math.round(YEARLY_DISCOUNT * 100)}%)
          </span>
        </span>
      </div>

      {/* Plans grid */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 p-6 bg-white"
              >
                <div className="animate-pulse h-6 w-1/2 mb-2 bg-gray-200 rounded" />
                <div className="animate-pulse h-10 w-2/3 mb-4 bg-gray-200 rounded" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((__, j) => (
                    <div
                      key={j}
                      className="animate-pulse h-4 bg-gray-200 rounded"
                    />
                  ))}
                </div>
              </div>
            ))
          : plans.map((p) => {
              const displayPrice = computePrice(p.price);
              const suffix =
                cycle === "monthly" ? "/mo" : "/mo · billed yearly";
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border border-gray-100 p-6 bg-white ${
                    p.name === "Pro" ? "shadow-xl ring-1 ring-indigo-100" : ""
                  }`}
                >
                  <div className="text-sm text-gray-500">{p.name}</div>
                  <div className="text-3xl font-bold mt-1">
                    {currency(displayPrice)}
                    <span className="text-base font-normal text-gray-500">
                      {suffix}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{p.notes}</div>
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.perks.map((x) => (
                      <li key={x}>✅ {x}</li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                    Choose {p.name}
                  </button>
                  {p.name !== "Starter" &&
                    cycle === "yearly" &&
                    p.price > 0 && (
                      <p className="mt-2 text-xs text-green-700">
                        You save{" "}
                        {currency(Math.round(p.price * YEARLY_DISCOUNT))}/mo vs
                        monthly.
                      </p>
                    )}
                </div>
              );
            })}
      </div>

      {/* Service fees table */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Service fees</h2>
        <p className="text-gray-600 mt-1">
          Fees apply to certain operations. Pro/Business plans include
          discounted rates.
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
          <table className="min-w-[680px] w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="text-left p-3 font-medium">Operation</th>
                <th className="text-left p-3 font-medium">Starter</th>
                <th className="text-left p-3 font-medium">Pro</th>
                <th className="text-left p-3 font-medium">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-3">P2P transfer (ZPay → ZPay)</td>
                <td className="p-3">
                  Free<sup className="text-xs">†</sup>
                </td>
                <td className="p-3">Free</td>
                <td className="p-3">Free</td>
              </tr>
              <tr>
                <td className="p-3">Cash-out (Agent)</td>
                <td className="p-3">1.8% of amount</td>
                <td className="p-3">1.5% of amount</td>
                <td className="p-3">1.2% of amount</td>
              </tr>
              <tr>
                <td className="p-3">Bank transfer (local)</td>
                <td className="p-3">{currency(20)} flat</td>
                <td className="p-3">{currency(15)} flat</td>
                <td className="p-3">{currency(10)} flat</td>
              </tr>
              <tr>
                <td className="p-3">Bill payment (utilities)</td>
                <td className="p-3">{currency(10)} per bill</td>
                <td className="p-3">{currency(5)} per bill</td>
                <td className="p-3">Free</td>
              </tr>
              <tr>
                <td className="p-3">Merchant QR acceptance</td>
                <td className="p-3">—</td>
                <td className="p-3">0.9% MDR</td>
                <td className="p-3">0.7% MDR</td>
              </tr>
              <tr>
                <td className="p-3">International remittance (inbound)</td>
                <td className="p-3">{currency(30)} flat</td>
                <td className="p-3">{currency(20)} flat</td>
                <td className="p-3">{currency(15)} flat</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          † Fair use policy applies. Fees shown are examples for demo purposes
          and may vary by partner/bank.
        </p>
      </section>

      {/* FAQ blurb */}
      <div className="mt-10 text-sm text-gray-600">
        Still unsure which plan fits?{" "}
        <a href="/faq" className="text-indigo-600 hover:underline">
          See FAQs
        </a>{" "}
        or{" "}
        <a href="/contact" className="text-indigo-600 hover:underline">
          contact us
        </a>
        .
      </div>
    </div>
  );
}
