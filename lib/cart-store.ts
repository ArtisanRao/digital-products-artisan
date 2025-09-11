// lib/cart-store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CartItem = {
  id: string
  title: string
  price: number
  qty: number
  image?: string
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem, "qty">, qty?: number) => void
  remove: (id: string) => void
  clear: () => void
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items]
        const i = items.findIndex((x) => x.id === item.id)
        if (i > -1) items[i] = { ...items[i], qty: items[i].qty + qty }
        else items.push({ ...item, qty })
        set({ items })
      },
      remove: (id) => set({ items: get().items.filter((x) => x.id !== id) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, x) => n + x.qty, 0),
    }),
    { name: "dpa-cart-v1" }
  )
)
