import { configureStore, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"

export const initialState: {
  askPrices: number[]
  asks: { [key: number]: number[] }
  bidPrices: number[]
  bids: { [key: number]: number[] }
  precision: string
} = {
  askPrices: [],
  asks: {},
  bidPrices: [],
  bids: {},
  precision: "P0", // Default precision
}

export const orderBookSlice = createSlice({
  name: "orderBook",
  initialState,
  reducers: {
    updateOrders(state, action) {
      const orders = action.payload
      // initial full orders
      if (orders.length > 0) {
        if (Array.isArray(orders[0])) {
          // amount < 0 is ask order
          const askOrders = orders.filter(
            ([, , amount]: number[]) => amount < 0,
          )
          state.askPrices = _.reverse(
            _.sortBy(askOrders.map(([price]: number[]) => price)),
          )

          state.asks = _.fromPairs(
            _.map(askOrders, (array: number[]) => [array[0], array]),
          )
          // amount > 0 is bid order
          const bidOrders = orders.filter(
            ([, , amount]: number[]) => amount > 0,
          )
          state.bidPrices = _.reverse(
            _.sortBy(bidOrders.map(([price]: number[]) => price)),
          )
          state.bids = _.fromPairs(
            _.map(bidOrders, (array: number[]) => [array[0], array]),
          )
        } else {
          // delta order
          // either upsert at price or delete at price
          const order = orders
          const [price, count, amount] = order
          if (count > 0) {
            if (amount < 0) {
              // upsert ask order
              if (!state.askPrices.includes(price)) {
                state.askPrices.push(price)
                state.askPrices = _.reverse(_.sortBy(state.askPrices))
              }
              state.asks[price] = order
            } else if (amount > 0) {
              // upsert bid order
              if (!state.bidPrices.includes(price)) {
                state.bidPrices.push(price)
                state.bidPrices = _.reverse(_.sortBy(state.bidPrices))
              }
              state.bids[price] = order
            }
          } else if (count === 0) {
            if (amount < 0) {
              // delete ask order
              _.remove(state.askPrices, p => p === price)
              delete state.asks[price]
            } else if (amount > 0) {
              // delete bid order
              _.remove(state.bidPrices, p => p === price)
              delete state.bids[price]
            }
          }
        }
      }
    },
    setPrecision(state, action) {
      state.precision = action.payload
    },
  },
})

export const orderBookReducer = orderBookSlice.reducer

export const { updateOrders, setPrecision } = orderBookSlice.actions

const store = configureStore({
  reducer: {
    orderBook: orderBookReducer,
  },
})

export default store
