import { useState } from 'react'
import produce from 'immer'

const userImmerState = initialState => {
  const [state, setState] = useState(initialState)

  const updater = producer => {
    setState(produce(state, producer))
  }

  return [state, updater]
}

export default userImmerState
