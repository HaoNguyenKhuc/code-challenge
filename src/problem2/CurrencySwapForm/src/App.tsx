import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CurrencySwap from './Components/SwapForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CurrencySwap />
    </>
  )
}

export default App
