<script setup>
	import { useTheme } from '../../composables/useTheme';

	const { theme, toggleTheme } = useTheme();
</script>
<template>
	<div class="fixed-bottom">
		<div class="container d-flex justify-content-end pb-4">
			<a href="#" class="btn btn-circle cshadow btn-primary ms-3 d-flex align-items-center">
				<i class="bi bi-arrow-up-square"></i>
			</a>
			<button v-if="theme === 'light'" 
				@click="toggleTheme"
				class="btn btn-circle cshadow btn-secondary ms-3"
			>
				<i class="bi bi-moon-fill"></i>
			</button>
			<button v-else 
				@click="toggleTheme"
				class="btn btn-circle cshadow btn-warning ms-3"
			>
				<i class="bi bi-brightness-high"></i>
			</button>
		</div>
	</div>
</template>