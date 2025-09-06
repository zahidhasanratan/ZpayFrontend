import { useState } from "react";
import {
  useMeQuery,
  useTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useSendMutation,
  type Txn,
  type TxnType,
} from "../../features/api/walletApi";
import toast from "react-hot-toast";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";

const currency = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function UserDashboard() {
  // filters / paging
  const [type, setType] = useState<TxnType | "all">("all");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const me = useMeQuery();
  const tx = useTransactionsQuery({ page, pageSize, type, q, from, to });

  // actions
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const [deposit] = useDepositMutation();
  const [withdraw] = useWithdrawMutation();
  const [send] = useSendMutation();

  // forms
  const [amt, setAmt] = useState<number>(500);
  const [note, setNote] = useState("");
  const [toUser, setToUser] = useState("");

  const resetForms = () => {
    setAmt(500);
    setNote("");
    setToUser("");
  };

  const submitDeposit = async () => {
    if (amt <= 0) return toast.error("Amount must be positive");
    await deposit({ amount: amt, note }).unwrap();
    toast.success("Deposited successfully");
    setDepositOpen(false);
    resetForms();
  };
  const submitWithdraw = async () => {
    if (amt <= 0) return toast.error("Amount must be positive");
    await withdraw({ amount: amt, note }).unwrap();
    toast.success("Withdrawn successfully");
    setWithdrawOpen(false);
    resetForms();
  };
  const submitSend = async () => {
    if (amt <= 0) return toast.error("Amount must be positive");
    if (!toUser.trim()) return toast.error("Enter recipient phone/email");
    await send({ amount: amt, to: toUser.trim(), note }).unwrap();
    toast.success("Sent successfully");
    setSendOpen(false);
    resetForms();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Wallet overview</h1>

      {/* cards */}
      <div className="mt-4 grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Balance</div>
          <div className="mt-1 text-3xl font-extrabold">
            {me.isLoading ? "…" : currency(me.data?.balance ?? 0)}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Today’s in</div>
          <div className="mt-1 text-2xl font-bold text-green-600">
            {me.isLoading ? "…" : currency(me.data?.todayIn ?? 0)}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="text-sm text-gray-500">Today’s out</div>
          <div className="mt-1 text-2xl font-bold text-red-600">
            {me.isLoading ? "…" : currency(me.data?.todayOut ?? 0)}
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => setDepositOpen(true)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Deposit
        </button>
        <button
          onClick={() => setWithdrawOpen(true)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-700"
        >
          Withdraw
        </button>
        <button
          onClick={() => setSendOpen(true)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:border-indigo-700"
        >
          Send money
        </button>
      </div>

      {/* filters */}
      <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
        <div className="grid md:grid-cols-5 gap-3">
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
              <option value="deposit">Deposit</option>
              <option value="withdraw">Withdraw</option>
              <option value="send">Send</option>
              <option value="receive">Receive</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Search</label>
            <input
              placeholder="Txn ID, note, phone/email…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* table */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 overflow-x-auto">
        <table className="min-w-[760px] w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-3">Txn ID</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Counterparty</th>
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
              : (tx.data?.items ?? []).map((t: Txn) => (
                  <tr key={t.id}>
                    <td className="p-3 font-mono text-xs text-gray-700">
                      {t.id}
                    </td>
                    <td className="p-3 capitalize">{t.type}</td>
                    <td className="p-3">{currency(t.amount)}</td>
                    <td className="p-3">{t.counterparty ?? "—"}</td>
                    <td className="p-3">{t.note ?? "—"}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          t.status === "success"
                            ? "bg-green-100 text-green-700"
                            : t.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
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

      {/* Modals */}
      <Modal
        open={depositOpen}
        title="Deposit"
        onClose={() => setDepositOpen(false)}
      >
        <Label>Amount (BDT)</Label>
        <InputNumber value={amt} onChange={setAmt} />
        <Label className="mt-3">Note (optional)</Label>
        <Input value={note} onChange={setNote} placeholder="Agent cash-in" />
        <div className="mt-4 flex justify-end gap-2">
          <Btn onClick={() => setDepositOpen(false)} variant="ghost">
            Cancel
          </Btn>
          <Btn onClick={submitDeposit}>Confirm</Btn>
        </div>
      </Modal>

      <Modal
        open={withdrawOpen}
        title="Withdraw"
        onClose={() => setWithdrawOpen(false)}
      >
        <Label>Amount (BDT)</Label>
        <InputNumber value={amt} onChange={setAmt} />
        <Label className="mt-3">Note (optional)</Label>
        <Input
          value={note}
          onChange={setNote}
          placeholder="ATM / Agent cash-out"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Btn onClick={() => setWithdrawOpen(false)} variant="ghost">
            Cancel
          </Btn>
          <Btn onClick={submitWithdraw}>Confirm</Btn>
        </div>
      </Modal>

      <Modal
        open={sendOpen}
        title="Send money"
        onClose={() => setSendOpen(false)}
      >
        <Label>Recipient (phone/email)</Label>
        <Input
          value={toUser}
          onChange={setToUser}
          placeholder="017xx..., user@demo.com"
        />
        <Label className="mt-3">Amount (BDT)</Label>
        <InputNumber value={amt} onChange={setAmt} />
        <Label className="mt-3">Note (optional)</Label>
        <Input value={note} onChange={setNote} placeholder="Family / Rent" />
        <div className="mt-4 flex justify-end gap-2">
          <Btn onClick={() => setSendOpen(false)} variant="ghost">
            Cancel
          </Btn>
          <Btn onClick={submitSend}>Send</Btn>
        </div>
      </Modal>
    </div>
  );
}

/** tiny input helpers (keeps the JSX clean) */
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
  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400"
      >
        {children}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {children}
    </button>
  );
}
