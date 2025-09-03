export default function UserDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Wallet overview</h1>
      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border p-6 bg-white">Balance: ৳25,400</div>
        <div className="rounded-2xl border p-6 bg-white">Quick actions</div>
        <div className="rounded-2xl border p-6 bg-white">Limits</div>
      </div>
      <div className="mt-6 rounded-2xl border p-6 bg-white">
        Recent transactions (pagination + filters later)
      </div>
    </div>
  );
}
