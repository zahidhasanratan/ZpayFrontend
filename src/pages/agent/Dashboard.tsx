import { useState } from "react";
import {
  useAgentSummaryQuery,
  useAgentTxnsQuery,
  useCashInMutation,
  useCashOutMutation,
  type AgentTxn,
} from "../../features/api/agentApi";
import toast from "react-hot-toast";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";
import SparkBar from "../../components/charts/SparkBar";

const currency = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function AgentDashboard() {
  const summary = useAgentSummaryQuery();
  const [page, setPage] = useState(1);
  const [type, setType] = useState<"all" | "cashin" | "cashout">("all");
  const [q, setQ] = useState("");

  const tx = useAgentTxnsQuery({ page, pageSize: 10, type, q });

  const [cashInOpen, setCashInOpen] = useState(false);
  const [cashOutOpen, setCashOutOpen] = useState(false);
  const [user, setUser] = useState("");
  const [amt, setAmt] = useState<number>(500);
  const [note, setNote] = useState("");

  const [cashIn] = useCashInMutation();
  const [cashOut] = useCashOutMutation();

  const submitIn = async () => {
    if (!user.trim()) return toast.error("Enter user phone/email");
    if (amt <= 0) return toast.error("Amount must be positive");
    await cashIn({ user: user.trim(), amount: amt, note }).unwrap();
    toast.success("Cash-in successful");
    setCashInOpen(false);
    setUser("");
    setAmt(500);
    setNote("");
  };

  const submitOut = async () => {
    if (!user.trim()) return toast.error("Enter user phone/email");
    if (amt <= 0) return toast.error("Amount must be positive");
    await cashOut({ user: user.trim(), amount: amt, note }).unwrap();
    toast.success("Cash-out successful");
    setCashOutOpen(false);
    setUser("");
    setAmt(500);
    setNote("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Agent overview</h1>

      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Today cash-in</div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {summary.isLoading ? "…" : currency(summary.data?.todayCashIn ?? 0)}
          </div>
          <div className="mt-3">
            <SparkBar values={[4, 9, 6, 8, 12, 7, 10]} />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Today cash-out</div>
          <div className="mt-1 text-2xl font-bold text-red-600">
            {summary.isLoading
              ? "…"
              : currency(summary.data?.todayCashOut ?? 0)}
          </div>
          <div className="mt-3">
            <SparkBar values={[6, 3, 8, 5, 9, 7, 4]} />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Commission (this month)</div>
          <div className="mt-1 text-2xl font-bold">
            {summary.isLoading
              ? "…"
              : currency(summary.data?.monthCommission ?? 0)}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Settled daily to your wallet.
          </p>
        </div>
      </div>

      {/* actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setCashInOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Cash-in to user
        </button>
        <button
          onClick={() => setCashOutOpen(true)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-700"
        >
          Cash-out from user
        </button>
      </div>

      {/* filters */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as any);
              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="all">All</option>
            <option value="cashin">Cash-in</option>
            <option value="cashout">Cash-out</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Search</label>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Txn ID, user phone/email…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* table */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Txn ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Note</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tx.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="p-3">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              : (tx.data?.items ?? []).map((t: AgentTxn) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono text-xs text-gray-700">
                      {t.id}
                    </td>
                    <td className="p-3 capitalize">{t.type}</td>
                    <td className="p-3">{t.user}</td>
                    <td className="p-3">{currency(t.amount)}</td>
                    <td className="p-3">{t.note ?? "—"}</td>
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

        <Pagination
          page={tx.data?.page ?? 1}
          pageSize={tx.data?.pageSize ?? 10}
          total={tx.data?.total ?? 0}
          onPage={setPage}
        />
      </div>

      {/* modals */}
      <Modal
        open={cashInOpen}
        title="Cash-in to user"
        onClose={() => setCashInOpen(false)}
      >
        <Label>User (phone/email)</Label>
        <Input
          value={user}
          onChange={setUser}
          placeholder="017xx..., user@demo.com"
        />
        <Label className="mt-3">Amount (BDT)</Label>
        <InputNumber value={amt} onChange={setAmt} />
        <Label className="mt-3">Note (optional)</Label>
        <Input value={note} onChange={setNote} placeholder="Wallet top-up" />
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setCashInOpen(false)}>
            Cancel
          </Btn>
          <Btn onClick={submitIn}>Confirm</Btn>
        </div>
      </Modal>

      <Modal
        open={cashOutOpen}
        title="Cash-out from user"
        onClose={() => setCashOutOpen(false)}
      >
        <Label>User (phone/email)</Label>
        <Input
          value={user}
          onChange={setUser}
          placeholder="017xx..., user@demo.com"
        />
        <Label className="mt-3">Amount (BDT)</Label>
        <InputNumber value={amt} onChange={setAmt} />
        <Label className="mt-3">Note (optional)</Label>
        <Input value={note} onChange={setNote} placeholder="Cash withdrawal" />
        <div className="mt-4 flex justify-end gap-2">
          <Btn variant="ghost" onClick={() => setCashOutOpen(false)}>
            Cancel
          </Btn>
          <Btn onClick={submitOut}>Confirm</Btn>
        </div>
      </Modal>
    </div>
  );
}

function Label({
  children,
  className = "",
}: {
  children: any;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  );
}
function Input({
  value,
  onChange,
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
    />
  );
}
function InputNumber({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
    />
  );
}
function Btn({
  children,
  onClick,
  variant = "primary",
}: {
  children: any;
  onClick: () => void;
  variant?: "primary" | "ghost";
}) {
  return variant === "ghost" ? (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400"
    >
      {children}
    </button>
  ) : (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {children}
    </button>
  );
}
