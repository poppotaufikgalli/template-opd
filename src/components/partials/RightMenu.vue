<script>
	const lodash = require("lodash");

	export default {
		props: {
			data : {
				type: Object,
				default: () => {},
			},
		},
		data: () => ({
			aplikasi : [],
			internal : [],
			external : [],
		}),
		methods : {
			getAplikasi(){
				if(this.data.aplikasi != '' && this.data.aplikasi != undefined){
					return lodash.sampleSize(this.data.aplikasi, 4)	
				}
				return null
			},
			getInternal(){
				if(this.data.internal != '' && this.data.internal != undefined){
					return lodash.sampleSize(this.data.internal, 4)
				}
				return null
				
			},
			getExternal(){
				if(this.data.external != '' && this.data.external != undefined){
					return lodash.sampleSize(this.data.external, 4)
				}
				return null
			},
		},
		
		setup(){
			const logo = require('@/assets/img/logo-tpi.png');
			const pagging1 = 1
			
			return{
				logo,
				pagging1,
			}
		},
	}
</script>
<template>
	<div class="position-sticky d-none d-sm-block" style="top: 6rem;">
		<div v-if="getAplikasi()" class="mb-4">
			<div class="list-template-opd surface">
				<div class="list-header my-2">
					<h3 class="list-title">
						<span>Pranala Aplikasi Pemerintah Kota Tanjungpinang</span>
					</h3>
				</div>
				<ol class="list-unstyled mb-0">
					<li v-for="(item, key) in getAplikasi()" :key="key" class="d-flex justify-content-start align-items-center gap-1 border-bottom">
						<img v-bind:src="logo" width="20" height="25" />
						<a :href="'https://'+item.alamat_pranala" class="text-link small" target="_blank">{{item.nama_pranala}}</a>
					</li>
				</ol>
				<div class="mt-2">
					<nav class="d-flex gap-2 justify-content-end" aria-label="Pagination">
						<router-link :to="{path:'/pranala/aplikasi'}" class="btn btn-sm btn-outline active">Daftar Pranala Aplikasi</router-link>
					</nav>
				</div>
			</div>
		</div>
		<div v-if="getInternal()" class="mb-4">
			<div class="list-template-opd surface">
				<div class="list-header my-2">
					<h3 class="list-title">
						<span>Pranala Web Internal Pemerintah Kota Tanjungpinang</span>
					</h3>
				</div>
				<ol class="list-unstyled mb-0">
					<li v-for="(item, key) in getInternal()" :key="key" class="d-flex justify-content-start align-items-center gap-1 border-bottom">
						<img v-bind:src="logo" width="20" height="25" />
						<a :href="'https://'+item.alamat_pranala" class="text-link small" target="_blank">{{item.nama_pranala}}</a>
					</li>
				</ol>
				<div class="mt-2">
					<nav class="d-flex gap-2 justify-content-end" aria-label="Pagination">
						<router-link :to="{path:'/pranala/internal'}" class="btn btn-sm btn-outline active">Daftar Pranala Web Internal</router-link>
					</nav>
				</div>
			</div>
		</div>
		<div v-if="getExternal()" class="mb-4">
			<div class="list-template-opd surface">
				<div class="list-header my-2">
					<h3 class="list-title">
						<span>Pranala Eksternal Pemerintah Kota Tanjungpinang</span>
					</h3>
				</div>
				<ol class="list-unstyled mb-0">
					<li v-for="(item, key) in getExternal()" :key="key" class="d-flex justify-content-start align-items-center gap-1 border-bottom">
						<img v-bind:src="logo" width="20" height="25" />
						<a :href="'https://'+item.alamat_pranala" class="text-link small" target="_blank">{{item.nama_pranala}}</a>
					</li>
				</ol>
				<div class="mt-2">
					<nav class="d-flex gap-2 justify-content-end" aria-label="Pagination">
						<router-link :to="{path:'/pranala/external'}" class="btn btn-sm btn-outline active">Daftar Pranala Web External</router-link>
					</nav>
				</div>
			</div>
		</div>
	</div>
</template>