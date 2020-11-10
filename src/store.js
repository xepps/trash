import { writable, readable } from 'svelte/store'

function createSpawns() {
  const { subscribe, set, update } = writable({
    free_humans: 7824071572,
    research: 0,
    test_subjects: 0,
    regular_zombie: 0
  })

  return {
    subscribe,
    load: set,
    spawnHuman: () => update(state => ({ ...state, free_humans: state.free_humans + 1 })),
    performResearch: () => update(state => ({ ...state, research: state.research + 1 })),
    spendResearch: (toSpend) => update(state => ({ ...state, research: state.research - toSpend })),
    captureTestSubject: () => update(state => ({ ...state, free_humans: state.free_humans - 1, test_subjects: state.test_subjects + 1 })),
    killTestSubject: (toKill) => update(state => ({ ...state, test_subjects: state.test_subjects - toKill })),
    createZombie: () => update(state => ({ ...state, test_subjects: state.test_subjects - 1, regular_zombie: state.regular_zombie + 1 })),
    killZombies: (toKill) => update(state => ({ ...state, regular_zombie: state.regular_zombie - toKill }))
  }
}

export const spawns = createSpawns()

function createUpgrades() {
  const SHOW_UPGRADES = 'SHOW_UPGRADES'
  const AUTO_RESEARCH = 'AUTO_RESEARCH'
  const ZOMBIES = 'ZOMBIES'
  const AUTO_CAPTURE = 'AUTO_CAPTURE'
  const AUTO_ZOMBIE = 'AUTO_ZOMBIE'
  const ZOMBIE_RELEASE = 'ZOMBIE_RELEASE'

  let spawnNumbers
  spawns.subscribe(value => {
    spawnNumbers = value
  })

  const { subscribe, set, update } = writable({
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
  })

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

export const upgrades = createUpgrades()
