import store, { updateOrders } from "./store"

let socket: WebSocket
let channelId: number

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

    if (data.event === "subscribed") {
      channelId = data.chanId
    } else if (Array.isArray(data) && data[1] !== "hb") {
      // exclude useless data, e.g. [395659,"hb"]
      const [chanId, orders] = data
      if (chanId === channelId) {
        store.dispatch(updateOrders(orders))
      }
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
