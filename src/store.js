import { writable, readable } from 'svelte/store'

export const defaultZombieSpawnDuration = readable(500)

export const currentPopulation = writable(7824071572)
export const zombies = writable(0)

function createUpgrades() {
  const { subscribe, set, update } = writable({
    available: false,
    upgrades: {
      'AUTO_ZOMBIES': {
        name: 'Zombie Helpers',
        cost: 20,
        purchased: false
      }
    }
  })

  const showUpgrades = state => ({ ...state, available: true })

  const purchaseUpgrade = (state, id) => {
    const upgrade = { ...state.upgrades[id] }
    zombies.update(oldZombies => oldZombies - upgrade.cost)
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
    load: (upgrades) => set(upgrades),
    getUpgrade: (id) =>
      update(oldUpgrades => {
        switch(id) {
          case 'SHOW_UPGRADES': return showUpgrades(oldUpgrades)
          case 'AUTO_ZOMBIES': return purchaseUpgrade(oldUpgrades, 'AUTO_ZOMBIES')
          default: return oldUpgrades
        }
      })
  }
}

export const upgrades = createUpgrades()
