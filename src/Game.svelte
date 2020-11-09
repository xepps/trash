<script>
	import { onMount } from 'svelte'
	import Notification from './Notification.svelte'
  import ReanimateZombie from './ReanimateZombie.svelte'
  import UpgradeFastZombie from './UpgradeFastZombie.svelte'
  import Upgrades from './Upgrades.svelte'
  import { formatNumber } from './utils'

  import { currentPopulation, zombies, upgrades, fastZombies } from './store'

	let showSaved = false

	onMount(() => {
		loadGame()
  })

  function loadGame () {
    const save = localStorage.getItem('save')
    const game = save ? JSON.parse(save) : {}

    if (Object.keys(game).length) {
      currentPopulation.update(() => game.currentPopulation)
      zombies.update(() => game.zombies)
      upgrades.load(game.upgrades)
    }
  }

  function saveGame () {
    const parsedUpgrades = { }
    Object.keys($upgrades.upgrades).forEach(id => {
      parsedUpgrades[id] = { purchased: $upgrades.upgrades[id].purchased }
    })

		localStorage.setItem('save', JSON.stringify({
			currentPopulation: $currentPopulation,
      zombies: $zombies,
      upgrades: { available: $upgrades.available, upgrades: parsedUpgrades }
		}))
		showSaved = true
		setTimeout(() => {
			showSaved = false
		}, 2000)
	}

	setInterval(() => {
    if (Math.random() < 0.15) {
      currentPopulation.update(oldPopulation => oldPopulation + 1)
    }
	}, 50)

	setInterval(() => {
		saveGame()
	}, 1000 * 60)

</script>

<main>
	<Notification show={showSaved} text="Saved" />
  <h1>
    {#if $zombies.regular_zombie}
      <span>{formatNumber($zombies.regular_zombie)} {$zombies.regular_zombie === 1 ? 'Zombie' : 'Zombies'} and </span>
    {/if}
    {#if $zombies.fast_zombie}
      <span>{formatNumber($zombies.fast_zombie)} {$zombies.fast_zombie === 1 ? 'Fast Zombie' : 'Fast Zombies'} and </span>
    {/if}
    <span class='black'>{formatNumber($currentPopulation)} humans</span>
  </h1>

	<div class="row">
    <ReanimateZombie />
	</div>
  {#if $upgrades.upgrades.FAST_ZOMBIES.purchased}
    <div class="row">
      <UpgradeFastZombie />
    </div>
  {/if}

  <hr />

  <Upgrades />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
  }

  .black {
    color: black;
  }

	.row {
		display: grid;
		grid-template-columns: 140px auto 140px;
		column-gap: 20px;
		align-items: center;
  }

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
    font-weight: 100;
    display: inline-block;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
