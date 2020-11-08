<script>
	import { onMount } from 'svelte'
	import Notification from './Notification.svelte'
  import ConstructZombie from './ReanimateZombie.svelte'
  import Upgrades from './Upgrades.svelte'
  import { formatNumber } from './utils'

  import { currentPopulation, zombies, upgrades } from './store'

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
		localStorage.setItem('save', JSON.stringify({
			currentPopulation: $currentPopulation,
			zombies: $zombies,
      upgrades: $upgrades
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
	<h1>{$zombies > 0 ? formatNumber($zombies) : ''} {$zombies === 1 ? 'Zombie' : 'Zombies'}</h1>
	{#if $zombies}
		<h2> and {formatNumber($currentPopulation)} humans</h2>
	{/if}

	<div class="row">
		<ConstructZombie />
	</div>

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

  h2 {
    display: inline-block;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
