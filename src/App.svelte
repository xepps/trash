<script>
	import Progress from './Progress.svelte'

	const defaultZombieSpawnDuration = 500
	let spawningZombie = false
	let zombies = 0
	let currentSpawn = null

	$: currentZombieSpawnDuration = autoZombies ? 2 * defaultZombieSpawnDuration : defaultZombieSpawnDuration

	let autoZombies = false

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

	setInterval(() => {
		if (autoZombies && !spawningZombie) {
			createZombie()
		}
	}, 50)

</script>

<main>
	<h1>Zombies</h1>

	<button on:click={createZombie} disabled={spawningZombie}>
		Spawn Zombie
	</button>
	<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
	{zombies} {zombies === 1 ? 'zombie' : 'zombies'}
	<label><input type='checkbox' bind:checked={autoZombies} on:change={clearSpawn}/> Auto zombies</label>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
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
