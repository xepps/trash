<script>
	import Progress from './Progress.svelte'

	let spawningZombie = false
	let zombies = 0
	let zombieSpawnDuration = 500

	let autoZombieDuration = 1500
	let autoZombies = false
	let autoZombieTimer = null

	function createZombie () {
		spawningZombie = true
		setTimeout(() => {
			spawningZombie = false
			zombies += 1
		}, zombieSpawnDuration)
	}

	function runAutoZombies () {
		if (autoZombies) {
			createZombie()
			autoZombieTimer = setInterval(() => createZombie(), autoZombieDuration)
		} else {
			clearInterval(autoZombieTimer)
		}
	}

</script>

<main>
	<h1>Zombies</h1>
	<button on:click={createZombie} disabled={spawningZombie}>
		Spawn Zombie
	</button>
	<Progress duration={zombieSpawnDuration} run={spawningZombie}/>
	{zombies} {zombies === 1 ? 'zombie' : 'zombies'}
	<label><input type='checkbox' bind:checked={autoZombies} on:change={runAutoZombies}/> Auto zombies</label>
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
