<script>
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  export let duration
  export let run
  let progress

  $: if (run) {
    progress.set(1)
  } else {
    progress.set(0, { duration: 0 })
  }

	$: progress = tweened(0, {
		duration,
		easing: linear
	});
</script>

<style>
  progress {
    width: 100%;
  }
</style>

<progress value={$progress} />
