import store, { updateOrders } from "./store"

let socket: WebSocket

export const connectWebSocket = (precision = "P0") => {
  socket = new WebSocket("wss://api-pub.bitfinex.com/ws/2")

  socket.onopen = () => {
    const msg = JSON.stringify({
      event: "subscribe",
      channel: "book",
      symbol: "tBTCUSD",
      prec: precision,
    })
    socket.send(msg)
  }

  socket.onmessage = event => {
    const data = JSON.parse(event.data)

    if (Array.isArray(data) && data[1] !== "hb") {
      const [, orders] = data
      store.dispatch(updateOrders(orders))
    }
  }

  socket.onclose = () => {
    console.log("WebSocket connection closed")
  }
}

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close()
  }
}
