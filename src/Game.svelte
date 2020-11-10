<script>
	import { onMount } from 'svelte'
	import Notification from './Notification.svelte'
  import Spawn from './Spawn.svelte'
  import Upgrades from './Upgrades.svelte'
  import { formatNumber } from './utils'

  import { spawns, upgrades } from './store'

	let showSaved = false

	onMount(() => {
		loadGame()
  })

  function loadGame () {
    const save = localStorage.getItem('save')
    const game = save ? JSON.parse(save) : {}

    if (Object.keys(game).length) {
      upgrades.load(game.upgrades)
      spawns.load(game.spawns)
    }
  }

  function saveGame () {
    const parsedUpgrades = { }
    Object.keys($upgrades.upgrades).forEach(id => {
      parsedUpgrades[id] = { purchased: $upgrades.upgrades[id].purchased }
    })

		localStorage.setItem('save', JSON.stringify({
			spawns: $spawns,
      upgrades: { available: $upgrades.available, upgrades: parsedUpgrades }
		}))
		showSaved = true
		setTimeout(() => {
			showSaved = false
		}, 2000)
	}

	setInterval(() => {
    if (Math.random() < 0.15) {
      spawns.spawnHuman()
    }
	}, 50)

	setInterval(() => {
		saveGame()
	}, 1000 * 20)

</script>

<main>
  <Notification show={showSaved} text="Saved" />
  <h1>{formatNumber($spawns.free_humans)} humans alive</h1>

  <Spawn
    actionName="Capture Test Subject"
    amount={$spawns.test_subjects}
    spawnFunction={spawns.captureTestSubject}
    spawnDuration={1000}
    enableAutoRun={$upgrades.upgrades['AUTO_CAPTURE'].purchased}
    autoMultiplier={2}
  />

  <Spawn
    actionName="Perform Research"
    amount={$spawns.research}
    available={$spawns.test_subjects > 0}
    spawnFunction={() => {
      spawns.performResearch()
      if (Math.random() > 0.8) spawns.killTestSubject(1)
    }}
    spawnDuration={500}
    enableAutoRun={$upgrades.upgrades['AUTO_RESEARCH'].purchased}
    autoMultiplier={2}
  />

  {#if $upgrades.upgrades['ZOMBIES'].purchased}
    <Spawn
      actionName="Create Zombie"
      amount={$spawns.regular_zombie}
      available={$spawns.test_subjects > 0}
      spawnFunction={() => {
        if (Math.random() > 0.5) spawns.createZombie()
        else spawns.killTestSubject(1)
      }}
      spawnDuration={1500}
      enableAutoRun={$upgrades.upgrades['AUTO_ZOMBIE'].purchased}
      autoMultiplier={2}
    />
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
