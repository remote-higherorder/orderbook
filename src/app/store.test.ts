import { orderBookReducer, updateOrders, initialState } from "./store"

describe("store test", () => {
  it("should handle initial full latest prices event", () => {
    const previousState = initialState

    const orders = [
      [100, 1, -5],
      [101, 1, -2],
      [99, 1, 5],
      [98, 1, 2],
    ]

    const expectedState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
      },
      precision: "P0",
    }

    expect(orderBookReducer(previousState, updateOrders(orders))).toEqual(
      expectedState,
    )
  })

  it("should handle delete event", () => {
    const previousState = {
      askPrices: [101, 100, 90],
      asks: {
        90: [90, 1, -3],
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
      },
      precision: "P0",
    }

    const order = [90, 0, -3]

    const expectedState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
      },
      precision: "P0",
    }

    expect(orderBookReducer(previousState, updateOrders(order))).toEqual(
      expectedState,
    )
  })

  it("should handle upsert event", () => {
    const previousState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
      },
      precision: "P0",
    }

    let order = [80, 1, 6]

    let expectedState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98, 80],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
        80: [80, 1, 6],
      },
      precision: "P0",
    }

    expect(orderBookReducer(previousState, updateOrders(order))).toEqual(
      expectedState,
    )

    order = [80, 1, 3]

    expectedState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98, 80],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
        80: [80, 1, 3],
      },
      precision: "P0",
    }

    expect(orderBookReducer(previousState, updateOrders(order))).toEqual(
      expectedState,
    )
  })

  it("should handle invalid event", () => {
    const previousState = {
      askPrices: [101, 100],
      asks: {
        100: [100, 1, -5],
        101: [101, 1, -2],
      },
      bidPrices: [99, 98],
      bids: {
        99: [99, 1, 5],
        98: [98, 1, 2],
      },
      precision: "P0",
    }

    const order: number[] = []

    expect(orderBookReducer(previousState, updateOrders(order))).toEqual(
      previousState,
    )
  })
})
