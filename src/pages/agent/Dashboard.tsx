export default function AgentDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Agent overview</h1>
      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-6 bg-white">Cash-in today</div>
        <div className="rounded-2xl border p-6 bg-white">Cash-out today</div>
        <div className="rounded-2xl border p-6 bg-white">Commission</div>
      </div>
      <div className="mt-6 rounded-2xl border p-6 bg-white">
        Agent transactions
      </div>
    </div>
  );
}
