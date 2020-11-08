<script>
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  export let duration
  export let run

  $: if (run) {
    progress.set(1)
  } else {
    progress.set(0, { duration: 0 })
  }

	const progress = tweened(0, {
		duration,
		easing: linear
	});
</script>

<style>
  progress {
    width: 300px;
  }
</style>

<progress value={$progress} />
