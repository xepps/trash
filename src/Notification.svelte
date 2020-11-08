<script>
  import { fade, fly } from 'svelte/transition';

  export let show
  export let text
</script>

{#if show}
  <p in:fly="{{ y: -200, duration: 1000}}" out:fade>{text}</p>
{/if}

<style>
	p {
		position: absolute;
		top: 20px;
		right: 40px;
		display: block;
		padding: 20px 40px;
		background-color: #C0FFBB;
  }
</style>
