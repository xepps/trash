<script>
  import { zombies, upgrades } from './store'

  $: if ($zombies.regular_zombie >= 10 && !$upgrades.available) {
    upgrades.getUpgrade('SHOW_UPGRADES')
  }
</script>

{#if $upgrades.available}
  <div class="upgrades">
    {#each Object.keys($upgrades.upgrades) as id}
      <button
        on:click={() => upgrades.getUpgrade(id)}
        disabled={$upgrades.upgrades[id].purchased}
      >
        {$upgrades.upgrades[id].name} ({$upgrades.upgrades[id].purchased
          ? 'Purchased'
          : `${$upgrades.upgrades[id].cost.description}`
        })
      </button>
    {/each}
  </div>
{/if}

<style>
  .upgrades {
    display: flex;
    column-gap: 20px;
    align-items: center;
  }

  button {
    width: 200px;
    height: 60px;
  }
</style>
