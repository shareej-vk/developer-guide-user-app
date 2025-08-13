<script lang="ts">
    import { BASE_PATH } from '$lib/app.config';
	import '../app.css';


	let { children } = $props();
</script>

<svelte:head>
	<!-- <title>Developer Buddy</title>
	<meta name="description" content="A Svelte 5 application for developers to learn and practice coding." />
	<link rel="icon" href="/favicon.ico" />
	<link rel="stylesheet" href="{BASE_PATH}/css/codemirror.min.css" />
	<script src="{BASE_PATH}/js/codemirror.min.js"></script>
	<script src="{BASE_PATH}/js/htmlmixed.min.js"></script>
	<script src="{BASE_PATH}/js/css.min.js"></script>
	<script src="{BASE_PATH}/js/javascript.min.js"></script> -->


	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>

<!-- CodeMirror modes -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js"></script>

<!-- Optional: theme -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material.min.css">

</svelte:head>

{@render children()}
