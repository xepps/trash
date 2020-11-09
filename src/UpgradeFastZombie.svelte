<script>
    import Progress from './Progress.svelte'
    import { zombies, upgrades, zombieSpawnDuration } from './store'
    let autoZombies
    let currentSpawn

    let spawningZombie = false
    $: currentZombieSpawnDuration = (autoZombies ? 4 * $zombieSpawnDuration : 2 * $zombieSpawnDuration)
      * ($upgrades.upgrades['BETTER_TOOLS'].purchased ? 0.8 : 1)

    function createZombie () {
      spawningZombie = true
      currentSpawn = setTimeout(() => {
        zombies.update(oldZombies => ({
          ...oldZombies,
          regular_zombie: oldZombies.regular_zombie -2,
          fast_zombie: oldZombies.fast_zombie + 1
        }))
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
  Create Fast Zombie
</button>
<Progress duration={currentZombieSpawnDuration} run={spawningZombie}/>
{#if $upgrades.upgrades.AUTO_FAST_ZOMBIES.purchased}
  <label><input type="checkbox" bind:checked={autoZombies} on:change={clearSpawn}/> Auto fast zombies</label>
{/if}
