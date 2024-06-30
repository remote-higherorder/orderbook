import { useEffect, useMemo, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { connectWebSocket, disconnectWebSocket } from "./websocket"
import { setPrecision } from "./store"
import _ from "lodash"

const OrderBook = () => {
  const dispatch = useDispatch()
  const { asks, askPrices, bids, bidPrices, precision } = useSelector(
    (state: any) => state.orderBook,
  )

  useEffect(() => {
    connectWebSocket(precision)

    return () => {
      disconnectWebSocket()
    }
  }, [precision])

  const handlePrecisionChange = useCallback((e: any) => {
    const newPrecision = e.target.value
    // after precision change, need do disconnect before reconnect
    disconnectWebSocket()
    dispatch(setPrecision(newPrecision))
  }, [])

  // TODO Need refactor blow methods into a new hook and unit test for them
  const top10AskPrices: number[] = useMemo(
    () => _.take(askPrices, 10),
    [askPrices],
  )
  const top10BidPrices: number[] = useMemo(
    () => _.take(bidPrices, 10),
    [bidPrices],
  )

  const askAmountTotals: number[] = useMemo(() => {
    const result: number[] = []
    for (let i = 0; i < top10AskPrices.length; i++) {
      const sum = top10AskPrices
        .slice(i)
        .reduce((acc, val) => acc + asks[val][2], 0)
      result.push(sum)
    }
    return result
  }, [top10AskPrices])

  const bidAmountTotals: number[] = useMemo(() => {
    const result: number[] = []
    let sum = 0
    for (let i = 0; i < top10BidPrices.length; i++) {
      sum += bids[top10BidPrices[i]][2]
      result.push(sum)
    }
    return result
  }, [top10BidPrices])

  const dataRow = useCallback((
    price: number,
    data: number[][],
    amountTotalData: number[],
    index: number,
  ) => {
    const amount = Number(amountTotalData[index].toFixed(5))
    const max = Number(
      amountTotalData[amount > 0 ? amountTotalData.length - 1 : 0].toFixed(5),
    )
    const ratio = Number(((amount / max) * 100).toFixed(2))
    return (
      <tr key={price}>
        <td>{data[price][0]}</td>
        <td>{Math.abs(amount)}</td>
        <td>{data[price][1]}</td>
        <td>{Math.abs(data[price][2])}</td>
        <td>
          <div
            style={{
              backgroundColor: amount > 0 ? "green" : "red",
              height: "100%",
              width: `${ratio}%`,
            }}
          >
            {`${ratio}%`}
          </div>
        </td>
      </tr>
    )
  }, [])

  return (
    <div>
      <div>
        <button onClick={() => connectWebSocket()}>Connect</button>
        <button onClick={disconnectWebSocket}>Disconnect</button>
      </div>
      <div>
        <label htmlFor="precision">Precision: </label>
        <select
          id="precision"
          value={precision}
          onChange={handlePrecisionChange}
        >
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
          <option value="P3">P3</option>
          <option value="P4">P4</option>
        </select>
      </div>
      <div className="order-book">
        <h2>Asks</h2>
        <table>
          <thead>
            <tr>
              <td>Price</td>
              <td>Total</td>
              <td>Count</td>
              <td>Amount</td>
              <td width={100}>Depth</td>
            </tr>
          </thead>
          <tbody>
            {top10AskPrices.map((askPrice: number, index: number) =>
              dataRow(askPrice, asks, askAmountTotals, index),
            )}
          </tbody>
        </table>
        <div className="bids">
          <h2>Bids</h2>
          <table>
            <thead>
              <tr>
                <td>Price</td>
                <td>Total</td>
                <td>Count</td>
                <td>Amount</td>
                <td width={100}>Depth</td>
              </tr>
            </thead>
            <tbody>
              {top10BidPrices.map((bidPrice: number, index: number) =>
                dataRow(bidPrice, bids, bidAmountTotals, index),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
