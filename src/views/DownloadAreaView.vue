<script setup>
	import { ref, watch } from 'vue'
	import { useRoute } from 'vue-router';
	import { getData } from '@/composables/Api';
	import TableView from '@/components/partials/TableView';

	const _ = require("lodash");
	//const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');
	//const env = getEnv();
	const currPage = ref(0);
	const maxPage = ref(1);
	const error = ref(null);

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'download';
		page.value = routename
		try{
			let response = await getData("download");  
			data.value = response.data.download
			console.log(data.value)
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		maxPage.value = parseInt(currPage.value) +1
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)	
</script>
<template>
	<div class="row g-5">
		<div class="col-md-12">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>
			<template v-if="isReady">
				<article class="blog-post blog-post-list rounded overflow-hidden mb-4 surface">
					<TableView :data="data" />
				</article>
				
			</template>

			<div v-else class="loading">
				<article class="blog-post blog-post-list border-bottom rounded overflow-hidden p-1 pb-4 mb-1" aria-hidden="true">
					<h4 class="blog-post-title placeholder-glow">
						<span class="placeholder col-12"></span>
					</h4>
					<p class="blog-post-meta placeholder-glow">
						<span class="placeholder col-9"></span>
					</p>
					<div class="card-text row">
						<svg height="220" class="col-6">
							<rect width="100%" height="100%" fill="#868e96"></rect>
						</svg>
						<p class="col placeholder-glow d-flex flex-column gap-2">
							<span class="small placeholder col-12"></span>
							<span class="small placeholder col-11"></span>
							<span class="small placeholder col-10"></span>
							<span class="small placeholder"></span>
							<span class="small placeholder col-10"></span>
						</p>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>