import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

type Feature = { id: string; title: string; desc: string; icon: string };
type Plan = {
  id: string;
  name: string;
  price: number;
  unit: string;
  notes: string;
  perks: string[];
};
type QA = { q: string; a: string };

export const landingApi = createApi({
  reducerPath: "landing",
  baseQuery: fakeBaseQuery(),
  endpoints: (b) => ({
    features: b.query<Feature[], void>({
      async queryFn() {
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
      },
    }),

    plans: b.query<Plan[], void>({
      async queryFn() {
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
              perks: [
                "Priority support",
                "Spending analytics",
                "Custom limits",
              ],
            },
            {
              id: "p3",
              name: "Business",
              price: 499,
              unit: "BDT/mo",
              notes: "For merchants & SMBs",
              perks: [
                "Multi-user access",
                "Invoicing & QR",
                "Dedicated manager",
              ],
            },
          ],
        };
      },
    }),

    faqs: b.query<QA[], void>({
      async queryFn() {
        await sleep(500);
        return {
          data: [
            {
              q: "Is my money safe with NovaPay?",
              a: "Yes. We use bank-grade encryption (TLS 1.2+), device binding, 2FA for high-risk actions, and continuous fraud monitoring.",
            },
            {
              q: "What documents do I need to open an account?",
              a: "For a basic wallet: full name, mobile number, and a valid government ID (NID/Passport/Driving License). Higher limits may require additional KYC docs.",
            },
            {
              q: "How fast are transfers?",
              a: "P2P within NovaPay is typically instant. Bank transfers depend on partner banks; most post in minutes but can take longer off-hours.",
            },
            {
              q: "Where can I cash-in or cash-out?",
              a: "At any verified NovaPay Agent. Show your wallet QR or share your phone and confirm in-app.",
            },
            {
              q: "What are the fees?",
              a: "P2P is free on Starter (fair use). Cash-out and bank transfers have small fees. Pro/Business get discounts—see Pricing.",
            },
            {
              q: "Are there transaction limits?",
              a: "Yes. Typical personal limits: ৳25,000 per transaction and ৳100,000 per day (varies by KYC tier).",
            },
            {
              q: "Can I send money internationally?",
              a: "Inbound remittance via partners is rolling out. Outbound will follow in phases.",
            },
            {
              q: "How do I reset my PIN or password?",
              a: "Tap “Forgot PIN/Password” on login, verify with OTP and ID, then set a new one. Multiple failures may temporarily lock the account.",
            },
            {
              q: "I sent money to the wrong number—what now?",
              a: "If it’s pending, cancel from the transaction details. If completed, contact Support with the Txn ID for review.",
            },
            {
              q: "How do refunds work for merchant QR payments?",
              a: "Merchants can issue full/partial refunds within 7 days. You’ll receive a credit and a push notification.",
            },
            {
              q: "Do I need internet for QR payments?",
              a: "Dynamic QR requires internet. Static QR can queue offline and post when reconnected.",
            },
            {
              q: "Which platforms are supported?",
              a: "Android 8.0+, iOS 14+, and a web dashboard for Business and Agents.",
            },
            {
              q: "When is support available?",
              a: "In-app chat 24/7. Phone support 09:00–22:00 (local). Account lockouts can be escalated via hotline.",
            },
            {
              q: "How is my data used?",
              a: "We process only what’s needed for your account and compliance (KYC/AML). We never sell personal data.",
            },
            {
              q: "Can I upgrade to Pro or Business?",
              a: "Yes. Settings → Plan. Business requires extra verification (trade license/TIN).",
            },
            {
              q: "Do agents earn commission?",
              a: "Yes—on eligible cash-in/out and bill payments. Settled daily to the agent wallet and visible in the Agent dashboard.",
            },
          ],
        };
      },
    }),
  }),
});

export const { useFeaturesQuery, usePlansQuery, useFaqsQuery } = landingApi;
