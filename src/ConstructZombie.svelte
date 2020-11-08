<script>
    import Progress from './Progress.svelte'
    import { currentPopulation, zombies, zombieHelpers, autoZombies, defaultZombieSpawnDuration } from './store'

    let spawningZombie = false
    $: currentZombieSpawnDuration = $autoZombies ? 2 * $defaultZombieSpawnDuration : $defaultZombieSpawnDuration

    function createZombie () {
      spawningZombie = true
      currentSpawn = setTimeout(() => {
        zombies.update(oldZombies => oldZombies + 1)
        currentPopulation.update(oldPopulation => oldPopulation - 1)
        spawningZombie = false
      }, currentZombieSpawnDuration)
    }

    function clearSpawn () {
      spawningZombie = false
      clearTimeout(currentSpawn)
    }

    setInterval(() => {
      if ($autoZombies && !spawningZombie) {
        createZombie()
      }
    }, 50)
</script>

<button on:click={createZombie} disabled={spawningZombie}>
  Construct Zombie
</button>
<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
{#if $zombieHelpers}
  <label><input type="checkbox" bind:checked={$autoZombies} on:change={clearSpawn}/> Auto zombies</label>
{/if}
