<script>
	import { onMount } from 'svelte'
	import Notification from './Notification.svelte'
	import Progress from './Progress.svelte'
	import { formatNumber } from './utils'

	const defaultZombieSpawnDuration = 500
	let currentPopulation = 0
	let zombies = 0
	let zombieHelpers = false
	let upgrades = false

	let spawningZombie = false
	let currentSpawn = null
	let autoZombies = false
	let showSaved = false

	onMount(() => {
		const oldZombies = localStorage.getItem('zombies') ?? parseInt(localStorage.getItem('zombies'), 0)
		const save = localStorage.getItem('save')
		const game = save ? JSON.parse(save) : {}

		currentPopulation = game?.currentPopulation ?? 7824071572
		zombies = game?.zombies || oldZombies || 0
		zombieHelpers = game?.zombieHelpers ?? false
		upgrades = game?.upgrades ?? false
	})

	$: currentZombieSpawnDuration = autoZombies ? 2 * defaultZombieSpawnDuration : defaultZombieSpawnDuration

	function createZombie () {
		spawningZombie = true
		currentSpawn = setTimeout(() => {
			zombies += 1
			currentPopulation -= 1
			spawningZombie = false
		}, currentZombieSpawnDuration)
	}

	function clearSpawn () {
		spawningZombie = false
		clearTimeout(currentSpawn)
	}

	function getUpgrade (upgrade) {
		switch(upgrade.type) {
			case 'upgrades':
				upgrades = true
				return
			case 'zombieHelpers':
				zombies -= upgrade.cost
				zombieHelpers = true
				return
			default: return
		}
	}

	function saveGame () {
		localStorage.setItem('save', JSON.stringify({
			currentPopulation,
			zombies,
			zombieHelpers,
			upgrades
		}))
		showSaved = true
		setTimeout(() => {
			showSaved = false
		}, 2000)
	}

	setInterval(() => {
		if (autoZombies && !spawningZombie) {
			createZombie()
		}
		if (zombies >= 10 && !upgrades) {
			getUpgrade({ type: 'upgrades' })
		}
	}, 50)

	setInterval(() => {
		saveGame()
	}, 1000 * 60)

</script>

<main>
	<Notification show={showSaved} text="Saved" />
	<h1>{zombies > 0 ? formatNumber(zombies) : ''} {zombies === 1 ? 'Zombie' : 'Zombies'}</h1>
	{#if zombies}
		<h2>and {formatNumber(currentPopulation)} humans</h2>
	{/if}

	<div class="row">
		<button on:click={createZombie} disabled={spawningZombie}>
			Construct Zombie
		</button>
		<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
		{#if zombieHelpers}
			<label><input type="checkbox" bind:checked={autoZombies} on:change={clearSpawn}/> Auto zombies</label>
		{/if}
	</div>

	{#if upgrades}
		<div class="upgrades">
			{#if !zombieHelpers}
				<button on:click={() => getUpgrade({ type: 'zombieHelpers', cost: 20 })} disabled={zombies < 20}>Get Zombie Helpers (20 Zombies)</button>
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
