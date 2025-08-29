import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const landingApi = createApi({
  reducerPath: "landing",
  baseQuery: fakeBaseQuery(),
  endpoints: (b) => ({
    features: b.query(async () => {
      await sleep(600);
      return {
        data: [
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
        ],
      };
    }),
    plans: b.query(async () => {
      await sleep(600);
      return {
        data: [
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
        ],
      };
    }),
    faqs: b.query(async () => {
      await sleep(500);
      return {
        data: [
          {
            q: "Is my money safe?",
            a: "We use strong encryption, device binding, and 2FA.",
          },
          {
            q: "How fast are transfers?",
            a: "Instant within ZPay. Banks vary by partner.",
          },
          {
            q: "Where can I cash-in?",
            a: "Any verified ZPay Agent kiosk near you.",
          },
          { q: "Are there fees?", a: "Yes—depends on transfer type and plan." },
        ],
      };
    }),
  }),
});

export const { useFeaturesQuery, usePlansQuery, useFaqsQuery } = landingApi;
