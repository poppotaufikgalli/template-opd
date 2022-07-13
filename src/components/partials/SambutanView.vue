<script>
	export default {
		props: {
			sambutan : {
                type: Object,
                default: () => {},
            },
		},
		setup(){
			const base_url = process.env.VUE_APP_API_URL;
			const kunker = process.env.VUE_APP_OPD_ID;
			return{
				base_url,
				kunker,
			}
		},
	}
</script>
<template>
	<div class="mb-4">
		<div class="list-template-opd surface position-relative">
			<div class="list-header my-2">
				<h3 class="list-title">
					<span>{{sambutan.judul}}</span>
				</h3>
			</div>
			<div class="list-body mb-2">
				<div class="d-flex justify-content-center pb-3">
					<img :src="base_url + 'image/posting/halaman/' + kunker +'/'+ sambutan.gambar" class="d-block w-100" alt="{{sambutan.judul}}">
				</div>
				<div v-html="sambutan.isi" class="small truncate-text l-5"></div>
			</div>
			<router-link :to="{path : '/post/kata-sambutan', query : {id: sambutan.id} }" class="regular-link stretched-link small">Lanjutkan Membaca</router-link> 
		</div>
	</div>
</template>