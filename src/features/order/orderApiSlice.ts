import { createApi } from "@reduxjs/toolkit/query/react"

interface Event<Data> {
  name: string
  data: Data
}

const websocket = new WebSocket("wss://api-pub.bitfinex.com/ws/2")

const connected = new Promise<void>(resolve => {
  websocket.onopen = function () {
    console.log("WebSocket connection opened")
    resolve()
  }
})

export const orderApiSlice = createApi({
  reducerPath: "order",
  async baseQuery({options: any}) {
    await connected
    return { data: [] }
  },
  endpoints: build => ({
    sendEvent: build.mutation<unknown, string>({
      query() {
        return {
            event: "subscribe",
            channel: "book",
            symbol: "tBTCUSD",
          }
      },
    }),
    orderApiSlice: build.query<{ value: number }[], string>({
      queryFn() {
        return { data: [] }
      },
      async onCacheEntryAdded(
        event,
        { cacheEntryRemoved, updateCachedData, cacheDataLoaded },
      ) {
        await cacheDataLoaded
        await connected

        const listener = (data: any) => {
          updateCachedData(currentCacheData => {
            currentCacheData.push(data)
          })
        }

        websocket.onmessage = listener
        await cacheEntryRemoved
        websocket.close()
      },
    }),
  }),
})

export const { useSendEventMutation } = orderApiSlice
