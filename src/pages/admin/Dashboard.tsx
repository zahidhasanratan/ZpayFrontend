export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Admin overview</h1>
      <div className="mt-4 grid md:grid-cols-4 gap-6">
        <div className="rounded-2xl border p-6 bg-white">Total users</div>
        <div className="rounded-2xl border p-6 bg-white">Total agents</div>
        <div className="rounded-2xl border p-6 bg-white">Transactions</div>
        <div className="rounded-2xl border p-6 bg-white">Volume</div>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6 bg-white">Manage users</div>
        <div className="rounded-2xl border p-6 bg-white">Manage agents</div>
      </div>
    </div>
  );
}
