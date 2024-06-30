import "./App.css"
import { Counter } from "./features/counter/Counter"
import { Orders } from "./features/order/Orders"
import { Quotes } from "./features/quotes/Quotes"
import logo from "./logo.svg"

const App = () => {
  return (
    <div className="App">
      <Orders />
    </div>
  )
}

export default App
