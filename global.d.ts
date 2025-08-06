export {}

declare global {
  interface Window {
    Snipcart?: {
      api: {
        items: {
          add: (item: any) => void
          clear: () => Promise<void>
        }
        cart: {
          open: () => void
        }
      }
    }
  }
}
