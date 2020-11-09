import { writable, readable } from 'svelte/store'

export const zombieSpawnDuration = readable(500)
export const currentPopulation = writable(7824071572)
export const zombies = writable({
  regular_zombie: 0,
  fast_zombie: 0
})
export const fastZombies = writable(0)

function createUpgrades() {
  const { subscribe, set, update } = writable({
    available: false,
    upgrades: {
      'AUTO_ZOMBIES': {
        name: 'Zombie Helpers',
        cost: { number: 20, type: 'regular_zombie', description: '20 Zombies' },
        purchased: false
      },
      'FAST_ZOMBIES': {
        name: 'Upgrade Hunger',
        cost: { number: 50, type: 'regular_zombie', description: '50 Zombies' },
        purchased: false
      },
      'AUTO_FAST_ZOMBIES': {
        name: 'Equip Zombie Helpers',
        cost: { number: 75, type: 'regular_zombie', description: '75 Zombies' },
        purchased: false
      },
      'BETTER_TOOLS': {
        name: 'Better Reanimation Tools',
        cost: { number: 40, type: 'fast_zombie', description: '40 Fast Zombies' },
        purchased: false
      },
    }
  })

  const showUpgrades = state => ({ ...state, available: true })

  const purchaseUpgrade = (state, id) => {
    const upgrade = { ...state.upgrades[id] }
    zombies.update(oldZombies => ({ ...oldZombies, [upgrade.cost.type]: oldZombies[upgrade.cost.type] - upgrade.cost.number}))
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
      update(oldUpgrades => {
        switch(id) {
          case 'SHOW_UPGRADES': return showUpgrades(oldUpgrades)
          case 'AUTO_ZOMBIES': return purchaseUpgrade(oldUpgrades, 'AUTO_ZOMBIES')
          case 'FAST_ZOMBIES': return purchaseUpgrade(oldUpgrades, 'FAST_ZOMBIES')
          case 'AUTO_FAST_ZOMBIES': return purchaseUpgrade(oldUpgrades, 'AUTO_FAST_ZOMBIES')
          case 'BETTER_TOOLS': return purchaseUpgrade(oldUpgrades, 'BETTER_TOOLS')
          default: return oldUpgrades
        }
      })
  }
}

export const upgrades = createUpgrades()
