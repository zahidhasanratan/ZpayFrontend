import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type TxnType = "deposit" | "withdraw" | "send" | "receive";

export type Txn = {
  id: string;
  type: TxnType;
  amount: number;
  counterparty?: string;
  note?: string;
  status: "success" | "pending" | "failed";
  createdAt: string;
};

let BALANCE = 5000;
let TXNS: Txn[] = Array.from({ length: 32 }).map((_, i) => ({
  id: "u_tx_" + (i + 1),
  type: (["deposit", "withdraw", "send", "receive"] as TxnType[])[i % 4],
  amount: Math.floor(Math.random() * 2000 + 100),
  counterparty: ["01710001122", "01720002233", "shop@zpay.dev"][i % 3],
  note: ["Top-up", "Withdrawal", "Rent", "Gift"][i % 4],
  status: "success",
  createdAt: new Date(Date.now() - i * 3600_000 * 6).toISOString(),
}));

export const walletApi = createApi({
  reducerPath: "wallet",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Me", "Txns"],
  endpoints: (b) => ({
    me: b.query<{ balance: number; todayIn: number; todayOut: number }, void>({
      async queryFn() {
        await sleep(300);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        let todayIn = 0,
          todayOut = 0;
        for (const t of TXNS) {
          const ts = new Date(t.createdAt).getTime();
          if (ts >= todayStart.getTime()) {
            if (t.type === "deposit" || t.type === "receive")
              todayIn += t.amount;
            else todayOut += t.amount;
          }
        }

        return { data: { balance: BALANCE, todayIn, todayOut } };
      },
      providesTags: ["Me"],
    }),

    transactions: b.query<
      { items: Txn[]; total: number; page: number; pageSize: number },
      {
        page?: number;
        pageSize?: number;
        type?: TxnType | "all";
        q?: string;
        from?: string;
        to?: string;
      }
    >({
      async queryFn({
        page = 1,
        pageSize = 10,
        type = "all",
        q = "",
        from,
        to,
      } = {}) {
        await sleep(350);
        let list = [...TXNS];
        if (type !== "all") list = list.filter((t) => t.type === type);
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter(
            (t) =>
              t.id.toLowerCase().includes(qq) ||
              (t.note ?? "").toLowerCase().includes(qq) ||
              (t.counterparty ?? "").toLowerCase().includes(qq)
          );
        }
        if (from) {
          const f = new Date(from).getTime();
          list = list.filter((t) => new Date(t.createdAt).getTime() >= f);
        }
        if (to) {
          const tt = new Date(to).getTime();
          list = list.filter((t) => new Date(t.createdAt).getTime() <= tt);
        }

        const total = list.length;
        const start = (page - 1) * pageSize;
        const items = list.slice(start, start + pageSize);

        return { data: { items, total, page, pageSize } };
      },
      providesTags: [{ type: "Txns", id: "LIST" }],
    }),

    deposit: b.mutation<{ ok: true }, { amount: number; note?: string }>({
      async queryFn({ amount, note }) {
        await sleep(500);
        BALANCE += amount;
        const tx: Txn = {
          id: "u_tx_" + (TXNS.length + 1),
          type: "deposit",
          amount,
          note,
          status: "success",
          createdAt: new Date().toISOString(),
        };
        TXNS = [tx, ...TXNS];
        return { data: { ok: true } };
      },
      invalidatesTags: ["Me", { type: "Txns", id: "LIST" }],
    }),

    withdraw: b.mutation<{ ok: true }, { amount: number; note?: string }>({
      async queryFn({ amount, note }) {
        await sleep(500);
        BALANCE -= amount;
        const tx: Txn = {
          id: "u_tx_" + (TXNS.length + 1),
          type: "withdraw",
          amount,
          note,
          status: "success",
          createdAt: new Date().toISOString(),
        };
        TXNS = [tx, ...TXNS];
        return { data: { ok: true } };
      },
      invalidatesTags: ["Me", { type: "Txns", id: "LIST" }],
    }),

    send: b.mutation<
      { ok: true },
      { amount: number; to: string; note?: string }
    >({
      async queryFn({ amount, to, note }) {
        await sleep(500);
        BALANCE -= amount;
        const tx: Txn = {
          id: "u_tx_" + (TXNS.length + 1),
          type: "send",
          amount,
          counterparty: to,
          note,
          status: "success",
          createdAt: new Date().toISOString(),
        };
        TXNS = [tx, ...TXNS];
        return { data: { ok: true } };
      },
      invalidatesTags: ["Me", { type: "Txns", id: "LIST" }],
    }),
  }),
});

export const {
  useMeQuery,
  useTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useSendMutation,
} = walletApi;
