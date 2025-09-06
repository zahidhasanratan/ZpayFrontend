import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type AdminStats = {
  totalUsers: number;
  totalAgents: number;
  txCount: number;
  volume: number; // BDT
};

export type SimpleUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "blocked" | "pending";
  role: "user" | "agent";
};

export type AdminTxn = {
  id: string;
  type: "deposit" | "withdraw" | "send" | "receive" | "cashin" | "cashout";
  amount: number;
  actor: string; // phone/email or id
  createdAt: string; // ISO
  status: "success" | "pending" | "failed";
};

let USERS: SimpleUser[] = Array.from({ length: 42 }).map((_, i) => ({
  id: "u_" + (i + 1),
  name:
    ["Shahid", "Farhana", "Rafi", "Tanvir", "Maliha", "Arif"][i % 6] +
    " " +
    (i + 1),
  email: `user${i + 1}@zpay.dev`,
  phone: "017" + (10000000 + i),
  status: ["active", "active", "blocked", "pending"][i % 4] as any,
  role: i % 5 === 0 ? "agent" : "user",
}));

let ADMIN_TXNS: AdminTxn[] = Array.from({ length: 120 }).map((_, i) => ({
  id: "g_tx_" + (i + 1),
  type: (
    ["deposit", "withdraw", "send", "receive", "cashin", "cashout"] as const
  )[i % 6],
  amount: Math.floor(Math.random() * 8000 + 200),
  actor: ["01710001122", "01720002233", "biz@shop.com", "user@demo.com"][i % 4],
  createdAt: new Date(Date.now() - i * 3600_000 * 3).toISOString(),
  status: "success",
}));

export const adminApi = createApi({
  reducerPath: "admin",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["AdminStats", "Users", "Agents", "GlobalTxns"],
  endpoints: (b) => ({
    stats: b.query<AdminStats, void>({
      async queryFn() {
        await sleep(250);
        const totalUsers = USERS.filter((u) => u.role === "user").length;
        const totalAgents = USERS.filter((u) => u.role === "agent").length;
        const txCount = ADMIN_TXNS.length;
        const volume = ADMIN_TXNS.reduce((a, c) => a + c.amount, 0);
        return { data: { totalUsers, totalAgents, txCount, volume } };
      },
      providesTags: ["AdminStats"],
    }),

    users: b.query<
      { items: SimpleUser[]; total: number },
      {
        q?: string;
        role?: "user" | "agent";
        status?: "active" | "blocked" | "pending";
      }
    >({
      async queryFn({ q = "", role, status } = {}) {
        await sleep(300);
        let list = [...USERS];
        if (role) list = list.filter((u) => u.role === role);
        if (status) list = list.filter((u) => u.status === status);
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter(
            (u) =>
              u.name.toLowerCase().includes(qq) ||
              u.email.toLowerCase().includes(qq) ||
              (u.phone ?? "").toLowerCase().includes(qq)
          );
        }
        return { data: { items: list, total: list.length } };
      },
      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    toggleUser: b.mutation<{ ok: true }, { id: string }>({
      async queryFn({ id }) {
        await sleep(350);
        USERS = USERS.map((u) =>
          u.id === id
            ? { ...u, status: u.status === "blocked" ? "active" : "blocked" }
            : u
        );
        return { data: { ok: true } };
      },
      invalidatesTags: [{ type: "Users", id: "LIST" }, "AdminStats"],
    }),

    agents: b.query<
      { items: SimpleUser[]; total: number },
      { q?: string; status?: "active" | "blocked" | "pending" }
    >({
      async queryFn({ q = "", status } = {}) {
        await sleep(300);
        let list = USERS.filter((u) => u.role === "agent");
        if (status) list = list.filter((u) => u.status === status);
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter(
            (u) =>
              u.name.toLowerCase().includes(qq) ||
              u.email.toLowerCase().includes(qq) ||
              (u.phone ?? "").toLowerCase().includes(qq)
          );
        }
        return { data: { items: list, total: list.length } };
      },
      providesTags: [{ type: "Agents", id: "LIST" }],
    }),

    approveAgent: b.mutation<{ ok: true }, { id: string }>({
      async queryFn({ id }) {
        await sleep(300);
        USERS = USERS.map((u) =>
          u.id === id ? { ...u, status: "active" } : u
        );
        return { data: { ok: true } };
      },
      invalidatesTags: [{ type: "Agents", id: "LIST" }, "AdminStats"],
    }),

    suspendAgent: b.mutation<{ ok: true }, { id: string }>({
      async queryFn({ id }) {
        await sleep(300);
        USERS = USERS.map((u) =>
          u.id === id ? { ...u, status: "blocked" } : u
        );
        return { data: { ok: true } };
      },
      invalidatesTags: [{ type: "Agents", id: "LIST" }, "AdminStats"],
    }),

    globalTxns: b.query<
      { items: AdminTxn[]; total: number; page: number; pageSize: number },
      { page?: number; pageSize?: number; type?: string; q?: string }
    >({
      async queryFn({ page = 1, pageSize = 10, type = "all", q = "" } = {}) {
        await sleep(350);
        let list = [...ADMIN_TXNS];
        if (type && type !== "all") list = list.filter((t) => t.type === type);
        if (q) {
          const qq = q.toLowerCase();
          list = list.filter(
            (t) =>
              t.id.toLowerCase().includes(qq) ||
              t.actor.toLowerCase().includes(qq)
          );
        }
        const total = list.length;
        const start = (page - 1) * pageSize;
        const items = list.slice(start, start + pageSize);
        return { data: { items, total, page, pageSize } };
      },
      providesTags: [{ type: "GlobalTxns", id: "LIST" }],
    }),
  }),
});

export const {
  useStatsQuery: useAdminStatsQuery,
  useUsersQuery,
  useToggleUserMutation,
  useAgentsQuery,
  useApproveAgentMutation,
  useSuspendAgentMutation,
  useGlobalTxnsQuery,
} = adminApi;
