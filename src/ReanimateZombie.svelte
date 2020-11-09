<script>
    import Progress from './Progress.svelte'
    import { currentPopulation, zombies, upgrades, zombieSpawnDuration } from './store'
    let spawningZombie = false
    let autoZombies
    let currentSpawn

    $: currentZombieSpawnDuration = (autoZombies ? 2 * $zombieSpawnDuration : $zombieSpawnDuration)
      * ($upgrades.upgrades['BETTER_TOOLS'].purchased ? 0.8 : 1)

    function createZombie () {
      spawningZombie = true
      currentSpawn = setTimeout(() => {
        zombies.update(oldZombies => ({ ...oldZombies, regular_zombie: oldZombies.regular_zombie + 1 }))
        currentPopulation.update(oldPopulation => oldPopulation - 1)
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

<button on:click={createZombie} disabled={spawningZombie}>
  Reanimate Zombie
</button>
<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
{#if $upgrades.upgrades.AUTO_ZOMBIES.purchased}
  <label><input type="checkbox" bind:checked={autoZombies} on:change={clearSpawn}/> Auto zombies</label>
{/if}
