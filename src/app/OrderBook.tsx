import { useEffect } from "react"
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

  const top10AskPrices: number[] = _.take(askPrices, 10)
  const top10BidPrices: number[] = _.take(bidPrices, 10)

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
            {top10AskPrices.map((askPrice: number) => (
              <li
                key={askPrice}
              >{`Price: ${asks[askPrice][0]}, Count: ${asks[askPrice][1]}, Amount: ${asks[askPrice][2]}`}</li>
            ))}
          </ul>
        </div>
        <div className="bids">
          <h2>Bids</h2>
          <ul>
            {top10BidPrices.map((bidPrice: number) => (
              <li
                key={bidPrice}
              >{`Price: ${bids[bidPrice][0]}, Count: ${bids[bidPrice][1]}, Amount: ${bids[bidPrice][2]}`}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OrderBook
