import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type AgentSummary = {
  todayCashIn: number;
  todayCashOut: number;
  monthCommission: number;
};

export type AgentTxn = {
  id: string;
  type: "cashin" | "cashout";
  user: string; // phone/email
  amount: number;
  createdAt: string; // ISO
  status: "success" | "pending" | "failed";
  note?: string;
};

let AGENT_TXNS: AgentTxn[] = Array.from({ length: 63 }).map((_, i) => ({
  id: "a_tx_" + (i + 1),
  type: i % 2 === 0 ? "cashin" : "cashout",
  user: ["01710001122", "01720002233", "biz@shop.com"][i % 3],
  amount: Math.floor(Math.random() * 3000 + 300),
  createdAt: new Date(Date.now() - i * 3600_000 * 5).toISOString(),
  status: "success",
  note: ["Agent booth", "Store payout", "Wallet top-up"][i % 3],
}));

export const agentApi = createApi({
  reducerPath: "agent",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["AgentSummary", "AgentTxns"],
  endpoints: (b) => ({
    summary: b.query<AgentSummary, void>({
      async queryFn() {
        await sleep(300);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        let todayCashIn = 0,
          todayCashOut = 0;
        for (const t of AGENT_TXNS) {
          const ts = new Date(t.createdAt).getTime();
          if (ts >= todayStart.getTime()) {
            if (t.type === "cashin") todayCashIn += t.amount;
            else todayCashOut += t.amount;
          }
        }
        const monthCommission = Math.round(
          AGENT_TXNS.filter(
            (t) => new Date(t.createdAt).getMonth() === new Date().getMonth()
          ).reduce((a, c) => a + c.amount, 0) * 0.006
        );
        return { data: { todayCashIn, todayCashOut, monthCommission } };
      },
      providesTags: ["AgentSummary"],
    }),

    txns: b.query<
      { items: AgentTxn[]; total: number; page: number; pageSize: number },
      {
        page?: number;
        pageSize?: number;
        type?: "all" | "cashin" | "cashout";
        q?: string;
      }
    >({
      async queryFn({ page = 1, pageSize = 10, type = "all", q = "" } = {}) {
        await sleep(350);
        let list = [...AGENT_TXNS];
        if (type !== "all") list = list.filter((t) => t.type === type);
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter(
            (t) =>
              t.id.includes(qq) ||
              t.user.toLowerCase().includes(qq) ||
              (t.note ?? "").toLowerCase().includes(qq)
          );
        }
        const total = list.length;
        const start = (page - 1) * pageSize;
        const items = list.slice(start, start + pageSize);
        return { data: { items, total, page, pageSize } };
      },
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((t) => ({
                type: "AgentTxns" as const,
                id: t.id,
              })),
              { type: "AgentTxns" as const, id: "LIST" },
            ]
          : [{ type: "AgentTxns" as const, id: "LIST" }],
    }),

    cashIn: b.mutation<
      { ok: true; id: string },
      { user: string; amount: number; note?: string }
    >({
      async queryFn({ user, amount, note }) {
        await sleep(500);
        const tx: AgentTxn = {
          id: "a_tx_" + (AGENT_TXNS.length + 1),
          type: "cashin",
          user,
          amount,
          note: note ?? "Cash-in",
          status: "success",
          createdAt: new Date().toISOString(),
        };
        AGENT_TXNS = [tx, ...AGENT_TXNS];
        return { data: { ok: true, id: tx.id } };
      },
      invalidatesTags: ["AgentSummary", { type: "AgentTxns", id: "LIST" }],
    }),

    cashOut: b.mutation<
      { ok: true; id: string },
      { user: string; amount: number; note?: string }
    >({
      async queryFn({ user, amount, note }) {
        await sleep(500);
        const tx: AgentTxn = {
          id: "a_tx_" + (AGENT_TXNS.length + 1),
          type: "cashout",
          user,
          amount,
          note: note ?? "Cash-out",
          status: "success",
          createdAt: new Date().toISOString(),
        };
        AGENT_TXNS = [tx, ...AGENT_TXNS];
        return { data: { ok: true, id: tx.id } };
      },
      invalidatesTags: ["AgentSummary", { type: "AgentTxns", id: "LIST" }],
    }),
  }),
});

export const {
  useSummaryQuery: useAgentSummaryQuery,
  useTxnsQuery: useAgentTxnsQuery,
  useCashInMutation,
  useCashOutMutation,
} = agentApi;
