import { writable, readable } from 'svelte/store'
import spawns from './spawns'

export const SHOW_UPGRADES = 'SHOW_UPGRADES'
export const AUTO_RESEARCH = 'AUTO_RESEARCH'
export const ZOMBIES = 'ZOMBIES'
export const AUTO_CAPTURE = 'AUTO_CAPTURE'
export const AUTO_ZOMBIE = 'AUTO_ZOMBIE'
export const ZOMBIE_RELEASE = 'ZOMBIE_RELEASE'

let spawnNumbers
spawns.subscribe(value => {
  spawnNumbers = value
})

const initialState = {
  available: false,
  upgrades: {
    [ZOMBIES]: {
      name: 'Necromancer 101',
      cost: {
        description: '20 Research Points',
        isAvailable: ({ research }) => research >= 20,
        paymentFunction: () => {
          spawns.spendResearch(20)
        }
      },
      purchased: false
    },
    [AUTO_RESEARCH]: {
      name: 'Zombie Researchers',
      cost: {
        description: '30 Research Points + 2 Zombies',
        isAvailable: ({ research, regular_zombie }) => research >= 30 && regular_zombie >= 2,
        paymentFunction: () => {
          spawns.spendResearch(30)
          spawns.killZombies(2)
        }
      },
      purchased: false
    },
    [AUTO_CAPTURE]: {
      name: 'Brainwashed Abductors',
      cost: {
        description: '40 Research Points + 5 Test Subjects',
        isAvailable: ({ research, test_subjects }) => research >= 40 && test_subjects >= 5,
        paymentFunction: () => {
          spawns.spendResearch(40)
          spawns.killTestSubject(5)
        }
      },
      purchased: false
    },
    [AUTO_ZOMBIE]: {
      name: 'Reanimation Chamber',
      cost: {
        description: '100 Research Points',
        isAvailable: ({ research }) => research >= 100,
        paymentFunction: () => {
          spawns.spendResearch(100)
        }
      },
      purchased: false
    },
    [ZOMBIE_RELEASE]: {
      name: 'Prep for war',
      cost: {
        description: '10 Zombies',
        isAvailable: ({ regular_zombie }) => regular_zombie >= 10,
        paymentFunction: () => {
        }
      },
      purchased: false
    }
  }
}

function createUpgrades() {
  const { subscribe, set, update } = writable(initialState)

  const showUpgrades = state => ({ ...state, available: true })

  const purchaseUpgrade = (state, id) => {
    const upgrade = { ...state.upgrades[id] }
    state.upgrades[id].cost.paymentFunction()
    return ({
      ...state,
      upgrades: {
        ...state.upgrades,
        [id]: { ...upgrade, purchased: true }
      }
    })
  }

  return {
    subscribe,
    reset: () => set(initialState),
    load: (loadedUpgrades) => update(oldUpgrades => {
      const newUpgrades = {
        available: loadedUpgrades.available,
        upgrades: { ...oldUpgrades.upgrades }
      }
      Object.keys(newUpgrades.upgrades).forEach(id => {
        newUpgrades.upgrades[id] = { ...oldUpgrades.upgrades[id], ...loadedUpgrades.upgrades[id] }
      })

      return newUpgrades
    }),
    getUpgrade: (id) =>
      update(state => {
        switch(id) {
          case SHOW_UPGRADES: return showUpgrades(state)
          case ZOMBIES: return purchaseUpgrade(state, id)
          case AUTO_RESEARCH: return purchaseUpgrade(state, id)
          case AUTO_CAPTURE: return purchaseUpgrade(state, id)
          case AUTO_ZOMBIE: return purchaseUpgrade(state, id)
          case ZOMBIE_RELEASE: return purchaseUpgrade(state, id)
          default: return state
        }
      })
  }
}

export default createUpgrades()
