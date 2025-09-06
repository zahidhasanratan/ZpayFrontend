import { useMemo, useState } from "react";
import {
  useAdminStatsQuery,
  useUsersQuery,
  useToggleUserMutation,
  useAgentsQuery,
  useApproveAgentMutation,
  useSuspendAgentMutation,
  useGlobalTxnsQuery,
} from "../../features/api/adminApi";
import toast from "react-hot-toast";
import Pagination from "../../components/ui/Pagination";

const currency = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminDashboard() {
  const stats = useAdminStatsQuery();

  // Tabs: users / agents / txns
  const [tab, setTab] = useState<"users" | "agents" | "txns">("users");

  // Users filters
  const [uq, setUq] = useState("");
  const [uRole, setURole] = useState<"user" | "agent" | undefined>(undefined);
  const [uStatus, setUStatus] = useState<
    "active" | "blocked" | "pending" | undefined
  >(undefined);
  const users = useUsersQuery({ q: uq, role: uRole, status: uStatus });
  const [toggleUser] = useToggleUserMutation();

  // Agents filters
  const [aq, setAq] = useState("");
  const [aStatus, setAStatus] = useState<
    "active" | "blocked" | "pending" | undefined
  >(undefined);
  const agents = useAgentsQuery({ q: aq, status: aStatus });
  const [approveAgent] = useApproveAgentMutation();
  const [suspendAgent] = useSuspendAgentMutation();

  // Txns filters
  const [tType, setTType] = useState("all");
  const [tQ, setTQ] = useState("");
  const [tPage, setTPage] = useState(1);
  const txns = useGlobalTxnsQuery({
    page: tPage,
    pageSize: 10,
    type: tType,
    q: tQ,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Admin overview</h1>

      {/* Stats cards */}
      <div className="mt-4 grid md:grid-cols-4 gap-6">
        <CardStat
          title="Total users"
          value={stats.isLoading ? "…" : String(stats.data?.totalUsers ?? 0)}
        />
        <CardStat
          title="Total agents"
          value={stats.isLoading ? "…" : String(stats.data?.totalAgents ?? 0)}
        />
        <CardStat
          title="Transactions"
          value={stats.isLoading ? "…" : String(stats.data?.txCount ?? 0)}
        />
        <CardStat
          title="Volume"
          value={stats.isLoading ? "…" : currency(stats.data?.volume ?? 0)}
        />
      </div>

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2">
        {(["users", "agents", "txns"] as const).map((k) => (
          <button
            key={k}
            className={`px-4 py-2 rounded-lg border ${
              tab === k
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onClick={() => setTab(k)}
          >
            {k === "users"
              ? "Manage users"
              : k === "agents"
              ? "Manage agents"
              : "All transactions"}
          </button>
        ))}
      </div>

      {/* USERS */}
      {tab === "users" && (
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                value={uq}
                onChange={(e) => setUq(e.target.value)}
                placeholder="Name, email, phone…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Role</label>
              <select
                value={uRole ?? ""}
                onChange={(e) => setURole((e.target.value || undefined) as any)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">All</option>
                <option value="user">User</option>
                <option value="agent">Agent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={uStatus ?? ""}
                onChange={(e) =>
                  setUStatus((e.target.value || undefined) as any)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="p-3">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (users.data?.items ?? []).map((u) => (
                      <tr key={u.id}>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3">{u.phone ?? "—"}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              u.status === "active"
                                ? "bg-green-100 text-green-700"
                                : u.status === "blocked"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={async () => {
                              await toggleUser({ id: u.id }).unwrap();
                              toast.success(
                                u.status === "blocked"
                                  ? "User unblocked"
                                  : "User blocked"
                              );
                            }}
                            className="px-3 py-1 rounded border border-gray-300 hover:border-gray-400 text-xs"
                          >
                            {u.status === "blocked" ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* AGENTS */}
      {tab === "agents" && (
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                value={aq}
                onChange={(e) => setAq(e.target.value)}
                placeholder="Name, email, phone…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={aStatus ?? ""}
                onChange={(e) =>
                  setAStatus((e.target.value || undefined) as any)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agents.isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="p-3">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (agents.data?.items ?? []).map((a) => (
                      <tr key={a.id}>
                        <td className="p-3">{a.name}</td>
                        <td className="p-3">{a.email}</td>
                        <td className="p-3">{a.phone ?? "—"}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs ${
                              a.status === "active"
                                ? "bg-green-100 text-green-700"
                                : a.status === "blocked"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={async () => {
                              await approveAgent({ id: a.id }).unwrap();
                              toast.success("Agent approved");
                            }}
                            className="px-3 py-1 rounded border border-gray-300 hover:border-gray-400 text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              await suspendAgent({ id: a.id }).unwrap();
                              toast.success("Agent suspended");
                            }}
                            className="px-3 py-1 rounded border border-gray-300 hover:border-gray-400 text-xs"
                          >
                            Suspend
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TXNS */}
      {tab === "txns" && (
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              <select
                value={tType}
                onChange={(e) => {
                  setTType(e.target.value);
                  setTPage(1);
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All</option>
                <option value="deposit">Deposit</option>
                <option value="withdraw">Withdraw</option>
                <option value="send">Send</option>
                <option value="receive">Receive</option>
                <option value="cashin">Cash-in</option>
                <option value="cashout">Cash-out</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-gray-500 mb-1">Search</label>
              <input
                value={tQ}
                onChange={(e) => {
                  setTQ(e.target.value);
                  setTPage(1);
                }}
                placeholder="Txn ID, actor…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[760px] w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Actor</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {txns.isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((__, j) => (
                          <td key={j} className="p-3">
                            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : (txns.data?.items ?? []).map((t) => (
                      <tr key={t.id}>
                        <td className="p-3 font-mono text-xs">{t.id}</td>
                        <td className="p-3 capitalize">{t.type}</td>
                        <td className="p-3">{t.actor}</td>
                        <td className="p-3">{currency(t.amount)}</td>
                        <td className="p-3">
                          <span className="rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-700">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={txns.data?.page ?? 1}
            pageSize={txns.data?.pageSize ?? 10}
            total={txns.data?.total ?? 0}
            onPage={setTPage}
          />
        </section>
      )}
    </div>
  );
}

function CardStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
