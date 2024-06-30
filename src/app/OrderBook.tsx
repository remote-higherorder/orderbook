import { useEffect, useMemo } from "react"
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

  const handlePrecisionChange = (e: any) => {
    const newPrecision = e.target.value
    dispatch(setPrecision(newPrecision))
    disconnectWebSocket()
    connectWebSocket(newPrecision)
  }

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
    for (let i = 0; i < top10BidPrices.length; i++) {
      const sum = top10BidPrices
        .slice(i)
        .reduce((acc, val) => acc + bids[val][2], 0)
      result.push(sum)
    }
    return result
  }, [top10BidPrices])

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
        <div className="asks">
          <h2>Asks</h2>
          <ul>
            {top10AskPrices.map((askPrice: number, index: number) => (
              <li
                key={askPrice}
              >{`Price: ${asks[askPrice][0]}, Count: ${asks[askPrice][1]}, Amount: ${asks[askPrice][2]}, Total: ${askAmountTotals[index]}`}</li>
            ))}
          </ul>
        </div>
        <div className="bids">
          <h2>Bids</h2>
          <ul>
            {top10BidPrices.map((bidPrice: number, index: number) => (
              <li
                key={bidPrice}
              >{`Price: ${bids[bidPrice][0]}, Count: ${bids[bidPrice][1]}, Amount: ${bids[bidPrice][2]}, Total: ${bidAmountTotals[index]}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
