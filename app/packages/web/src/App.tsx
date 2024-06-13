import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState()

  useEffect(() => {
    fetch('http://localhost:3000/test')
      .then(res => res.json())
      .then(data => setText(data))
  }, [])

  return (
    <>
    
      {JSON.stringify(text)}
    </>
  )
}

export default App
