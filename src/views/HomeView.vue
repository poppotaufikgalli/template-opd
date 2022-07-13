<script setup>
	import { ref, watch, onBeforeMount } from 'vue';
	import MainCarousel from '@/components/partials/MainCarousel';
	import SambutanView from '@/components/partials/SambutanView';
	import GprKominfo from '@/composables/GprKominfo';
	import RightMenu from '@/components/partials/RightMenu';
	import { getMainPageInfo } from '../composables/Api';

	import { cleanTextP, beautifyDate1, getEnv, makeJudul } from '@/composables/myfunc';

	const _ = require("lodash");

	const sambutan = ref({});
	const banner = ref({});
	const pengumuman = ref({});
	const event = ref({});

	const allberita = ref({});
	const berita = ref({});
	const lenBerita = ref(0);
	const currPage = ref(0);
	const maxPage = ref(3);
	const isReady = ref(false);
	const isDisabledPrev = ref(false)
	const isDisabledNext = ref(true)
	const env = getEnv();

	onBeforeMount(async() => {
		const data = await getMainPageInfo()
		sambutan.value = data.data.kata_sambutan;
		banner.value = data.data.banner;

		pengumuman.value = _.max(data.data.pengumuman, function(el) { 
			return new Date(el.tgl_terbit.date).getTime();
		});

		event.value = _.max(data.data.event, function(el) { 
			return new Date(el.tgl_terbit.date).getTime();
		});
		console.log(data.data.event)

		allberita.value = data.data.berita_gabung;
		lenBerita.value = allberita.value.length
		pagging();

		isReady.value = true;
	});

	function pagging(argument) {
		switch(argument){
			case "next":
				currPage.value = currPage.value - 3
				maxPage.value = maxPage.value - 3
				if(currPage.value > 0){
					//maxPage.value = lenBerita.value
					isDisabledPrev.value = false;
				}
				berita.value = allberita.value.slice(currPage.value,maxPage.value);
				break;

			case "prev":
				currPage.value = currPage.value + 3
				maxPage.value = maxPage.value + 3
				if(maxPage.value > lenBerita.value){
					maxPage.value = lenBerita.value
					isDisabledPrev.value = true;
				}
				berita.value = allberita.value.slice(currPage.value,maxPage.value);
				break;

			default:
				if(maxPage.value > lenBerita.value){
					maxPage.value = lenBerita.value
					isDisabledPrev.value = true;
					isDisabledNext.value = false;
				}else{
					isDisabledNext.value = true;
					isDisabledPrev.value = false;
				}
				berita.value = allberita.value.slice(currPage.value,maxPage.value);
		}
	}

	function sliceData(){
		isReady.value = false;

		console.log("watch currPage : "+currPage.value)
		console.log("watch maxPage : "+maxPage.value)
		
		maxPage.value = currPage.value + 3

		if(maxPage.value > lenBerita.value){
			maxPage.value = lenBerita.value
		}

		if(maxPage.value == 3){
			isDisabledPrev.value = false
			isDisabledNext.value = true
		}else if(maxPage.value == lenBerita.value){
			isDisabledPrev.value = true
			isDisabledNext.value = false
		}else{
			isDisabledPrev.value = false
			isDisabledNext.value = false
		}
		
		berita.value = allberita.value.slice(currPage.value,maxPage.value);
		isReady.value = true;
	}

	function nextPagging() {
		currPage.value = currPage.value - 3
	}

	function prevPagging(){
		currPage.value = currPage.value + 3
	}

	watch(currPage, sliceData)

</script>
<template>
	<MainCarousel v-if="isReady" :banner="banner" :pengumuman="pengumuman" :event="event"/>
	<div class="row g-4">
		<div class="col-md-8">
			<div class="list-template-opd mt-2 px-1 pb-1">
				<div class="list-header">
					<h3 class="list-title">
						<div class="d-flex justify-content-between">
							<span>Berita</span>
							<nav class="d-flex gap-2 align-items-center" aria-label="Pagination">
								<router-link :to="{path:'/list/berita'}" class="btn btn-sm btn-outline active">Lihat Daftar Berita</router-link>
								<button @click="nextPagging" class="btn btn-sm btn-outline" :disabled="isDisabledNext">&lt;&lt;</button>
								<button @click="prevPagging" class="btn btn-sm btn-outline" :disabled="isDisabledPrev">&gt;&gt;</button>
							</nav>
						</div>
					</h3>
				</div>
			</div>
			<template v-if="isReady">
				<article  v-for="item in berita" :key="item.id" class="blog-post blog-post-list surface py-4 mb-4 overflow-hidden position-relative">
					<h4 class="blog-post-title">{{ (item.judul).toUpperCase() }}</h4>
					<div class="d-flex">
						<span class="blog-post-meta badge info-post small"><i class="bi bi-calendar-fill"></i> {{ beautifyDate1(item.tgl_terbit) }}</span>
					</div>
					<template v-if="item.gambar">
						<img 
							:src="env.imgUrl+'posting/berita/'+env.kunker+'/'+ item.gambar" 
							class="col-md-6" 
							:alt="item.judul"
							style="max-height: 250px; object-fit: cover;" 
							@error="(() => item.gambar = null)"
						> 
					</template>
					<span v-html="cleanTextP(item.isi)" class="small truncate-text l-10"></span>
					<router-link 
						:to="{path : '/berita/'+makeJudul(item.judul), query : {id: item.id} }" 
						class="stretched-link small">Lanjutkan Membaca</router-link>   
				</article>
			</template>
		</div>

		<div class="col-md-4">
			<div class="position-sticky" style="top: 6rem;">
				<SambutanView v-if="isReady" :sambutan="sambutan" />
				<GprKominfo />
				<RightMenu />
			</div>
		</div>
	</div>
</template>
