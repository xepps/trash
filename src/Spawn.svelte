<script>
  import Progress from './Progress.svelte'

  export let actionName
  export let amount
  export let available = true
  export let spawnFunction
  export let spawnDuration
  export let enableAutoRun
  export let autoMultiplier

  let spawning = false
  let autoRun
  let currentSpawn
  $: currentSpawnDuration = autoRun ? autoMultiplier * spawnDuration : spawnDuration

  function createZombie () {
    if (!available) return

    spawning = true
    currentSpawn = setTimeout(() => {
      if (available) spawnFunction()
      spawning = false
    }, currentSpawnDuration)
  }

  function clearSpawn () {
    spawning = false
    clearTimeout(currentSpawn)
  }

  setInterval(() => {
    if (autoRun && !spawning) {
      createZombie()
    }
  }, 50)
</script>

<div class="row">
  <button on:click={createZombie} disabled={spawning || !available}>{actionName}</button>
  <p>{amount}</p>
  <Progress duration={currentSpawnDuration} run={spawning}/>
  {#if enableAutoRun}
  <label><input type="checkbox" bind:checked={autoRun} on:change={clearSpawn}/> Auto {actionName}</label>
  {/if}
</div>

<style>
.row {
  display: grid;
  grid-template-columns: 140px 150px auto 140px;
  column-gap: 20px;
  align-items: center;
}
</style>
