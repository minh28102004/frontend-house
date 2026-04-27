import { Order } from "../modules/client/history-order/types/order";

const KEY = "orderGuests";

type LegacyStoredOrder = { _id?: string } & Record<string, unknown>;

function normalizeToIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];

  // New format: string[]
  if (raw.every((x) => typeof x === "string")) return raw as string[];

  // Legacy format: Order[] (or objects with _id)
  const ids = (raw as LegacyStoredOrder[])
    .map((o) => (typeof o?._id === "string" ? o._id : ""))
    .filter(Boolean);

  return ids;
}

export const OrderGuestStorage = {
  getIds(): string[] {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      const ids = normalizeToIds(parsed);

      // migrate to new format
      if (Array.isArray(parsed) && !parsed.every((x: unknown) => typeof x === "string")) {
        localStorage.setItem(KEY, JSON.stringify(ids));
      }

      return ids;
    } catch {
      return [];
    }
  },

  add(order: Pick<Order, "_id"> | string) {
    if (typeof window === "undefined") return;

    const id = typeof order === "string" ? order : order._id;
    if (!id) return;

    const ids = this.getIds();
    if (ids.includes(id)) return;

    ids.unshift(id);
    localStorage.setItem(KEY, JSON.stringify(ids));
  },

  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEY);
  },
};
