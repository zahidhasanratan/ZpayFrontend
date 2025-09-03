export default function About() {
  const stats = [
    { k: "5M+", v: "Transactions / mo" },
    { k: "10k+", v: "Active agents" },
    { k: "99.95%", v: "Uptime (12m)" },
    { k: "45s", v: "Avg. support reply" },
  ];

  const values = [
    {
      icon: "🛡️",
      t: "Security first",
      d: "Bank-grade encryption, device binding, and strong auth by default.",
    },
    {
      icon: "⚡",
      t: "Speed matters",
      d: "Transfers feel instant; every tap is optimized for latency.",
    },
    {
      icon: "🤝",
      t: "Empathy",
      d: "We design for clarity and accessibility across every screen size.",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "Founded",
      text: "Built the first ZPay prototype and agent pilots.",
    },
    {
      year: "2023",
      title: "Nationwide agents",
      text: "Scaled to 10k+ verified agents & launched QR payments.",
    },
    {
      year: "2024",
      title: "Merchant tools",
      text: "Rolled out POS, invoices, and analytics for SMBs.",
    },
    {
      year: "2025",
      title: "Remittance beta",
      text: "Inbound remittance with select partners (pilot regions).",
    },
  ];

  const team = [
    { name: "Shahid Khan", role: "VP, Product" },
    { name: "Farhana Rahman", role: "Head of Design" },
    { name: "Rafi Ahmed", role: "Lead Engineer" },
    { name: "Tanvir Hasan", role: "Platform Engineer" },
    { name: "Maliha Karim", role: "Security Engineer" },
    { name: "Arif Chowdhury", role: "Data Scientist" },
  ];

  const initials = (full: string) =>
    full
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Hero / Story */}
      <section className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">About ZPay</h1>
          <p className="mt-4 text-gray-700 leading-relaxed">
            We started ZPay to make moving money feel as natural as messaging.
            Our team has shipped payment systems across APAC and believes safe,
            modern finance should be accessible to everyone—no jargon, no
            friction.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
              PCI-aware practices
            </span>
            <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm text-green-700">
              KYC/AML ready
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              Mobile-first UX
            </span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="h-56 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-indigo-100" />
          <div className="mt-3 text-xs text-gray-500">
            ZPay dashboard preview
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.v} className="text-center">
              <div className="text-2xl font-extrabold text-gray-900">{s.k}</div>
              <div className="text-xs text-gray-600 mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="mt-12">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              t: "Mission",
              d: "Accelerate financial inclusion with simple, secure tools that work anywhere.",
            },
            {
              t: "Vision",
              d: "Be the most trusted wallet in emerging markets.",
            },
            {
              t: "Promise",
              d: "Clarity, control, and confidence with every transaction.",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-2xl border border-gray-100 p-6 bg-white"
            >
              <div className="font-semibold text-gray-900">{x.t}</div>
              <p className="text-sm text-gray-600 mt-1">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.t}
              className="rounded-2xl border border-gray-100 p-6 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-2xl">
                  <span aria-hidden>{v.icon}</span>
                </div>
                <div className="font-semibold text-gray-900">{v.t}</div>
              </div>
              <p className="text-sm text-gray-600 mt-3">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company timeline */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold">Our journey</h2>
        <div className="mt-6 relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 md:left-1/2" />
          <div className="space-y-8">
            {timeline.map((t, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={t.year} className="md:grid md:grid-cols-2 md:gap-8">
                  <div className={`${isLeft ? "" : "md:col-start-2"}`}>
                    <div className="relative rounded-2xl border border-gray-100 bg-white p-5">
                      <span className="absolute -left-3 top-5 h-6 w-6 rounded-full bg-indigo-600 ring-8 ring-white md:left-1/2 md:-translate-x-1/2" />
                      <div className="text-xs uppercase tracking-wide text-gray-500">
                        {t.year}
                      </div>
                      <div className="mt-1 font-semibold">{t.title}</div>
                      <p className="text-sm text-gray-600 mt-1">{t.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl border border-gray-100 p-6 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gray-900 text-white font-semibold">
                  {initials(m.name)}
                </div>
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs text-gray-500">{m.role}</div>
                </div>
              </div>
              <div className="h-24 mt-4 rounded-xl bg-gray-100" />
              <p className="mt-3 text-xs text-gray-500">
                Building reliable payments for everyday life.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 rounded-2xl bg-gray-900 text-white p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-2xl font-bold">Want to partner with ZPay?</div>
          <p className="text-sm text-gray-300 mt-1">
            Whether you’re a merchant or an agent network, we’d love to talk.
          </p>
        </div>
        <a
          href="/contact"
          className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium"
        >
          Get in touch →
        </a>
      </section>
    </div>
  );
}
