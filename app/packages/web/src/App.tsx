import { useEffect, useState } from 'react'

function App () {
  const [text, setText] = useState<any>()

  useEffect(() => {
    fetch('/api/test')
      .then(async res => await res.json())
      .then(data => { setText(data) })
  }, [])

  return (
    <>
      {JSON.stringify(text)}
    </>
  )
}

export default App
