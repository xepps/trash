<script>
	import Notification from './Notification.svelte'
import Progress from './Progress.svelte'

	const defaultZombieSpawnDuration = 500
	let spawningZombie = false
	let zombies = parseInt(localStorage.getItem('zombies'), 10) ?? 0
	let currentSpawn = null
	let autoZombies = false
	let showSaved = false

	$: currentZombieSpawnDuration = autoZombies ? 2 * defaultZombieSpawnDuration : defaultZombieSpawnDuration


	function createZombie () {
		spawningZombie = true
		currentSpawn = setTimeout(() => {
			zombies += 1
			spawningZombie = false
		}, currentZombieSpawnDuration)
	}

	function clearSpawn () {
		spawningZombie = false
		clearTimeout(currentSpawn)
	}

	function saveGame () {
		localStorage.setItem('zombies', zombies)
		showSaved = true
		setTimeout(() => {
			showSaved = false
		}, 2000)
	}

	setInterval(() => {
		if (autoZombies && !spawningZombie) {
			createZombie()
		}
	}, 50)

	setInterval(() => {
		saveGame()
	}, 1000 * 60)

</script>

<main>
	<Notification show={showSaved} text="Saved" />
	<h1>{zombies > 0 ? zombies : ''} {zombies === 1 ? 'Zombie' : 'Zombies'}</h1>

	<div class="row">
		<button on:click={createZombie} disabled={spawningZombie}>
			Construct Zombie
		</button>
		<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
		<label><input type="checkbox" bind:checked={autoZombies} on:change={clearSpawn}/> Auto zombies</label>
	</div>
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
