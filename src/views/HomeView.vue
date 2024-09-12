<script setup>
	import { ref, watch, onBeforeMount } from 'vue';
	import MainCarousel from '@/components/partials/MainCarousel';
	import SambutanView from '@/components/partials/SambutanView';
	import ModalPengumumanKhusus from '@/components/partials/ModalPengumumanKhusus';
	import ExtraStatistik from '@/components/partials/ExtraStatistik';

	import InfografisDiskominfo from '@/composables/InfografisDiskominfo';
	import GprKominfo from '@/composables/GprKominfo';
	import RightMenu from '@/components/partials/RightMenu';
	import { getMainPageInfo } from '../composables/Api';

	import { cleanTextP, beautifyDate1, getEnv, makeJudul } from '@/composables/myfunc';

	const _ = require("lodash");

	const sambutan = ref({});
	const pengumuman = ref({});
	const pengumuman_khusus = ref({});
	const event = ref({});
	const pranala_luar = ref({});

	const allberita = ref({});
	const berita = ref({});
	const lenBerita = ref(0);
	const currPage = ref(0);
	const maxPage = ref(3);
	const isReady = ref(false);
	const isDisabledPrev = ref(false)
	const isDisabledNext = ref(true)
	const lssetting = ref({});

	const env = getEnv();

	onBeforeMount(async() => {
		const data = await getMainPageInfo()

		sambutan.value = data.data.kata_sambutan;
		lssetting.value = data.data.lssetting;
		//console.log("lssetting",lssetting.value)

		pengumuman.value = _.max(data.data.pengumuman, function(el) { 
			return new Date(el.tgl_terbit.date).getTime();
		});

		pengumuman_khusus.value = data.data.pengumuman_khusus;

		pranala_luar.value = data.data.pranala_luar;

		event.value = _.max(data.data.event, function(el) { 
			return new Date(el.tgl_terbit.date).getTime();
		});
		//console.log(data.data.berita_gabung)

		allberita.value = data.data.berita_gabung;
		lenBerita.value = allberita.value != undefined ? allberita.value.length : 0
		pagging();

		isReady.value = true;
		//console.log((allberita.value))
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
				berita.value = allberita.value != undefined ? allberita.value.slice(currPage.value,maxPage.value) : null;
				break;

			case "prev":
				currPage.value = currPage.value + 3
				maxPage.value = maxPage.value + 3
				if(maxPage.value > lenBerita.value){
					maxPage.value = lenBerita.value
					isDisabledPrev.value = true;
				}
				berita.value = allberita.value != undefined ? allberita.value.slice(currPage.value,maxPage.value) : null;
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
				berita.value = allberita.value != undefined ? allberita.value.slice(currPage.value,maxPage.value) : null;
				//console.log(berita.value)
		}
	}

	function sliceData(){
		isReady.value = false;

		//console.log("watch currPage : "+currPage.value)
		//console.log("watch maxPage : "+maxPage.value)
		
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
	<MainCarousel v-if="isReady" :pengumuman="pengumuman" :event="event"/>
	<template v-if="isReady">
		<ModalPengumumanKhusus v-if="pengumuman_khusus" :data="pengumuman_khusus"/>	
	</template>
	<div class="row g-4">
		<div class="col-md-8">
			<div class="list-template-opd mt-2 px-1 pb-1">
				<div class="list-header">
					<h3 class="list-title">
						<div class="d-flex justify-content-between">
							<span>Berita</span>
							<nav v-if="berita && allberita.length > 3" class="d-flex gap-2 align-items-center" aria-label="Pagination">
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
					<h4 class="blog-post-title">{{ (item.judul_post).toUpperCase() }}</h4>
					<div class="d-flex">
						<span class="blog-post-meta badge info-post small"><i class="bi bi-calendar-fill"></i> {{ beautifyDate1(item.tgl_terbit) }}</span>
						<span v-if="item.tayang_portal == 'Y'" class="blog-post-meta badge info-post small"><i class="bi bi-globe"></i> https://tanjungpinangkota.go.id</span>
					</div>
					<template v-if="item.post_gambar">
						<img 
							:src="env.imgUrl+'posting/berita/'+env.kunker+'/original/'+ item.post_gambar" 
							class="col-md-6 img-fluid" 
							:alt="item.judul" 
							@error="(() => item.post_gambar = null)"
						> 
					</template>
					<span v-html="cleanTextP(item.isi)" class="small truncate-text l-10"></span>
					<a 
						v-if="item.tayang_portal == 'Y' && item.kunker !== env.kunker" 
						href="https://tanjungpinangkota.go.id" 
						target="_blank" 
						class="stretched-link small"
						>Kunjungi https://tanjungpinangkota.go.id</a>
					<router-link v-else
						:to="{path : '/berita/'+makeJudul(item.judul_post), query : {id: item.id} }" 
						class="stretched-link small">Lanjutkan Membaca</router-link>   
				</article>
			</template>
			<template v-if="isReady">
				<ExtraStatistik :lssetting="lssetting" />	
			</template>
		</div>

		<div class="col-md-4">
			<div class="position-sticky" style="top: 6rem;">
				<template v-if="sambutan">
					<SambutanView v-if="isReady" :sambutan="sambutan" />	
				</template>
				<InfografisDiskominfo />
				<GprKominfo />
				<template v-if="pranala_luar">
					<RightMenu :data="pranala_luar"/>	
				</template>
			</div>
		</div>
	</div>
</template>
