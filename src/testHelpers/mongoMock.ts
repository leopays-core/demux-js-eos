import { actionTraces } from './actionTraces'
import { blockStates } from './blockStates'

const deepCloneBlockStates = (bStates: any) => {
  const newBStates: any[] = []
  for (const bState of bStates) {
    newBStates.push(deepCloneBlockState(bState))
  }

  return newBStates
}

const deepCloneBlockState = (bState: any) => {
  return JSON.parse(JSON.stringify(bState))
}
// Do a reverse sort
const sortFunction = (a: any, b: any) => {
  return b.block_num - a.block_num
}

export const mockConnect = {
  db: () => ({
    collection: (col: any) => {
      if (col === 'block_states') {
        return {
          find: (options: any) => ({
            limit: () => ({
              sort: () => {
                const newBlockStates = deepCloneBlockStates(blockStates)
                newBlockStates.sort(sortFunction)
                return {
                  toArray: () => [newBlockStates[0]],
                }},
            }),
            toArray: () => {
              for (const bState of blockStates) {
                if (bState.block_num === options.block_num) {
                  return [bState]
                }
              }
              return []
            },
          }),
        }
      } else if (col === 'action_traces') {
        return ({
          find: () => ({
            sort: () => ({
              toArray: () => actionTraces,
            }),
          }),
        })
      }
      return
    },
  }),
}
