<script>
  import spawns from './store/spawns'
  import upgrades, { SHOW_UPGRADES } from './store/upgrades'

  let newUpgrades
  let purchasedUpgrades

  $: if ($spawns.research >= 10 && !$upgrades.available) {
    upgrades.getUpgrade(SHOW_UPGRADES)
  }

  $: newUpgrades = Object.keys($upgrades.upgrades).filter(id => !$upgrades.upgrades[id].purchased)
  $: purchasedUpgrades = Object.keys($upgrades.upgrades).filter(id => $upgrades.upgrades[id].purchased)
</script>

<div class="upgrades">
  <h2>Upgrades</h2>
  {#if $upgrades.available}
    <div class="upgrade-list">
      {#each newUpgrades as id}
        <button
          on:click={() => upgrades.getUpgrade(id)}
          disabled={$upgrades.upgrades[id].purchased || !$upgrades.upgrades[id].cost.isAvailable($spawns)}
        >
          {$upgrades.upgrades[id].name} <br /> ({$upgrades.upgrades[id].cost.description})
        </button>
      {/each}
    </div>
    <h2>Purchased Upgrades</h2>
    <div class="upgrade-list">
      {#each purchasedUpgrades as id}
        <button disabled={true}>
          {$upgrades.upgrades[id].name}
        </button>
      {/each}
    </div>
  {:else}
    <p>Perform more research...</p>
  {/if}
</div>

<style>
  h2 {
    display: block;
  }

  .upgrades {
    text-align: left;
  }

  .upgrade-list {
    display: flex;
    column-gap: 20px;
    align-items: center;
  }

  button {
    width: 200px;
    height: 100px;
  }
</style>
