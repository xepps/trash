import { writable } from 'svelte/store'

export const currentPopulation = writable(0)
export const zombies = writable(0)
export const zombieHelpers = writable(false)
export const upgrades = writable(false)
export const defaultZombieSpawnDuration = writable(500)
export const autoZombies = writable(false)
