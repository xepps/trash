<script>
	import { onMount } from 'svelte'
	import Notification from './Notification.svelte'
  import { formatNumber } from './utils'
  import ConstructZombie from './ConstructZombie.svelte'

  import { currentPopulation, zombies, zombieHelpers, upgrades, autoZombies } from './store'

	let showSaved = false

	onMount(() => {
		loadGame()
  })

  function loadGame () {
    const save = localStorage.getItem('save')
		const game = save ? JSON.parse(save) : {}

		currentPopulation.update(() => game?.currentPopulation ?? 7824071572)
		zombies.update(() => game?.zombies || 0)
		zombieHelpers.update(() => game?.zombieHelpers ?? false)
    upgrades.update(() => game?.upgrades ?? false)
    autoZombies.update(() => game?.autoZombies ?? false)
  }

  function saveGame () {
		localStorage.setItem('save', JSON.stringify({
			currentPopulation: $currentPopulation,
			zombies: $zombies,
			zombieHelpers: $zombieHelpers,
      upgrades: $upgrades,
      autoZombies: $autoZombies
		}))
		showSaved = true
		setTimeout(() => {
			showSaved = false
		}, 2000)
	}

	function getUpgrade (upgrade) {
		switch(upgrade.type) {
			case 'upgrades':
				upgrades.update(() => true)
				return
			case 'zombieHelpers':
				zombies.update(oldZombies => oldZombies - upgrade.cost)
				zombieHelpers.update(() => true)
				return
			default: return
		}
	}

	setInterval(() => {
    if (Math.random() < 0.15) {
      currentPopulation.update(oldPopulation => oldPopulation + 1)
    }

    if ($zombies >= 10 && !$upgrades) {
			getUpgrade({ type: 'upgrades' })
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
		<h2>and {formatNumber($currentPopulation)} humans</h2>
	{/if}

	<div class="row">
		<ConstructZombie />
	</div>

	{#if $upgrades}
		<div class="upgrades">
			{#if !$zombieHelpers}
				<button on:click={() => getUpgrade({ type: 'zombieHelpers', cost: 20 })} disabled={$zombies < 20}>Get Zombie Helpers (20 Zombies)</button>
      {/if}
		</div>
	{/if}
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

  .upgrades {
    display: flex;
    grid-template-columns: auto 50px 50px 50px 50px auto;
    column-gap: 20px;
    align-items: center;
  }

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
