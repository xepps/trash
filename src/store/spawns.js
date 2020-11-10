import { writable, readable } from 'svelte/store'

export const initialState = {
  free_humans: 7824071572,
  research: 0,
  test_subjects: 0,
  regular_zombie: 0
}

function createSpawns() {
  const { subscribe, set, update } = writable(initialState)

  return {
    subscribe,
    load: set,
    reset: () => set(initialState),
    spawnHuman: () => update(state => ({ ...state, free_humans: state.free_humans + 1 })),
    performResearch: () => update(state => ({ ...state, research: state.research + 1 })),
    spendResearch: (toSpend) => update(state => ({ ...state, research: state.research - toSpend })),
    captureTestSubject: () => update(state => ({ ...state, free_humans: state.free_humans - 1, test_subjects: state.test_subjects + 1 })),
    killTestSubject: (toKill) => update(state => ({ ...state, test_subjects: state.test_subjects - toKill })),
    createZombie: () => update(state => ({ ...state, test_subjects: state.test_subjects - 1, regular_zombie: state.regular_zombie + 1 })),
    killZombies: (toKill) => update(state => ({ ...state, regular_zombie: state.regular_zombie - toKill }))
  }
}

export default createSpawns()
