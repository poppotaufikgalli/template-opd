<script setup>
	import { ref, watch, computed, onUpdated } from 'vue'
	//import { useMeta } from 'vue-meta'
	import { useActiveMeta } from 'vue-meta'
	//import ExtraStatistik from '@/components/partials/ExtraStatistik';
	import OnProgresPage from '@/components/partials/OnProgresPage';
	import { useRoute } from 'vue-router';
	import { getData, setMeta } from '@/composables/Api';
	import { makeJudul } from '@/composables/myfunc';
	import { useCounterStore } from '@/stores/counter'
	import ogImage from "@/assets/img/logo-tpi.png"

	import { Line, Bar } from 'vue-chartjs'
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		LinearScale,
		PointElement,
		CategoryScale,
	} from 'chart.js'

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		LinearScale,
		PointElement,
		CategoryScale,
	)

	const _ = require("lodash");
	const moment = require("moment");

	const data = ref({});
	const isReady = ref(false);
	const router = useRoute();
	const page = ref('');

	const currPage = ref(0);
	const maxPage = ref(1);
	const error = ref();

	const width = ref(300)
	const height = ref(400)
	const chartOptions = ref({
		responsive: true,
        maintainAspectRatio: false
	})
	//const lssetting = ref({});
	const store = useCounterStore()

	const activeMeta = useActiveMeta()

	onUpdated(() => {
		if(data.value){
			var curr = _.find(data.value, function(e, i) {
				return i == currPage.value;
			});
			
			if(curr && page.value == 'statistik'){
				//console.log("update Meta Berita")
				var metaGbr = window.location.origin+ogImage;

				setMeta(activeMeta, curr.judul, curr.judul, curr.yg_ngupload, metaGbr)
			}
		}
	})

	async function fetchData() {
		isReady.value = false;
		var routename = router.params.page ? router.params.page : 'statistik';
		//console.log(routename)
		page.value = routename
		
		try{
			let response = await getData('statistik');  
			data.value = response.data.Grafik
		} catch(err){
			error.value = err.toString()
		}

		if(router.query.id){
			var id = router.query.id;
			setCurrPage(id)
		}
		
		isReady.value = true;
	}

	const searchPopulerNews = computed(()=> {
		return _.orderBy(data.value, o => +o.jum_klik, ['desc']);
	})

	const searchToday = computed(()=> {
		var currentDate =  moment(new Date()).format('YYYY-MM-DD');
		return _.filter(data.value, (o) => {
			return moment(o.tgl_terbit).isSame(currentDate, 'day');
		});
	})

	function setCurrPage(id){
		currPage.value = _.findKey(data.value, ['id', id]);
		maxPage.value = parseInt(currPage.value) +1
		store.setVisitList(id);
	}

	function makeDataset(data, header){
		var labels = _.values(header.slice(1))
				
		var label = _.map(data, function(value){
			return value[1]
		})

		var result = []
		for (var i = 0; i < data.length; i++) {
			var dd = _.values(data[i])
			
			for (var j = 0; j < dd.length; j++) {
				//console.log(dd[j])
				(result[j] || (result[j] = [])).push(dd[j])
			}
		}

		result = result.slice(1)
		var dataset = []
		for (var h = 0; h < result.length; h++) {
			dataset[h] = {
				label: labels[h],
				backgroundColor: [randomColor()],
				data: result[h]
			};
		}

		return {
			'labels' : label,
			'datasets' : dataset,
		};
	}

	function randomColor(){
		var o = Math.round, r = Math.random, s = 255;
		return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
	}

	// fetch immediately
	fetchData()
	// ...then watch for url change
	watch(router, fetchData)
</script>
<template>
	<div class="row g-4">
		<div class="col-md-8 mb-4">
			<div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
				<i class="bi bi-exclamation-triangle-fill"></i><div>&nbsp;Error : {{ error }}</div>
			</div>
			<template v-if="isReady">
				<template v-if="data">
					<article v-for="item in data.slice(currPage, maxPage)" :key="item.id" class="blog-post blog-post-list overflow-hidden surface">
						<h3 class="blog-post-title text-capitalize">{{ item.judul }}</h3>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-calendar-fill"></i> {{ item.tgl_terbit }}  |  
							<i class="bi bi-pen-fill"></i> Oleh <router-link :to="{path: '/list/'+item.yg_ngupload, query: {type : 'penulis', page: page} }">{{ item.yg_ngupload}}</router-link>  |  
							<i class="bi bi-eye-fill"></i> Dilihat : {{item.jum_klik ? item.jum_klik : 0}}
						</p>
						<br/>
						<template v-if="isReady">
							<article class="blog-post blog-post-list surface p-4 my-4 overflow-hidden position-relative border app-background" style="background-color: var(--app-bar-color);">
								<template v-if="(item.jns_file == 'G')">
									<Line
										:chart-options="chartOptions"
										:chart-data="makeDataset(item.excel.data, item.excel.header)"
										:width="width"
										:height="height"
									/>
								</template>
								<template v-if="(item.jns_file == 'GB')">
									<Bar
										:chart-options="chartOptions"
										:chart-data="makeDataset(item.excel.data, item.excel.header)"
										:width="width"
										:height="height"
									/>
								</template>
								<template v-if="(item.jns_file == 'T')">
									<table class="table table-sm small table-bordered">
										<thead class="table-secondary">
											<tr>
												<template v-for="header in item.excel.header" :key="header.id">
													<th class="text-center">{{header}}</th>
												</template>
											</tr>
										</thead>
										<tbody>
											<template v-for="rows in item.excel.data" :key="rows.id">
												<tr>
													<template v-for="cell in rows" :key="cell.id">
														<td :class="typeof cell !== 'string' ? 'text-center' : ''">{{cell}}</td>
													</template>
												</tr>
											</template>
										</tbody>
									</table>
								</template>
								<template v-if="(item.jns_file == 'P')">
									<div class="overflow-hidden">
										<div :id="'mapContainer'+item.id" ref="mapElement" class="mapStyle"></div>
									</div>
								</template>
							</article>
						</template>
						<div v-html="item.guid" class="small"></div>
						<p class="blog-post-meta badge info-post small">
							<i class="bi bi-stack"></i> Jenis : {{item.jenis_file}}
						</p>
					</article>
				</template>
				<template v-else>
					<OnProgresPage />
				</template>
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
		<template v-if="isReady">
			<div class="col-md-4">
				<div class="position-sticky" style="top: 4rem;">
					<template v-if="searchToday.length > 0 && data">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Hari Ini</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchToday" :key="item.id">
									<router-link 
										:to="{path : '/statistik/'+makeJudul(item.judul), query : {id: item.id} }" 
										class="truncate-text l-2 fw-bold"
										:class="{isActive : currPage == item.id}"
									>
										<span>{{item.judul}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
						
					<template v-if="searchPopulerNews.length > 0 && data">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Terpopuler</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item) in searchPopulerNews.slice(0,4)" :key="item.id">
									<router-link 
										:to="{path : '/statistik/'+makeJudul(item.judul), query : {id: item.id} }" 
										class="d-flex justify-content-between align-items-center"
										:class="{isActive : currPage == item.id}"
									>
										<span class="truncate-text l-1 fw-bold">{{item.judul}}</span>
										<span class="badge info-post bg-transparent"><i class="bi bi-eye-fill"></i>&nbsp;{{item.jum_klik}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>

					<template v-if="data && data.length > 0">
						<div class="list-template-opd surface">
							<div class="list-header">
								<h5 class="list-title">
									<span>{{page}} Lainnya</span>	
								</h5>
							</div>
							<div class="list-body">
								<template v-for="(item, key) in data.slice(0,4)" :key="item.id">
									<router-link v-if="currPage != key"
										:to="{path : '/statistik/'+makeJudul(item.judul), query : {id: item.id} }" 
										class="truncate-text l-1 fw-bold"
									>
										<span>{{item.judul}}</span>
									</router-link>
								</template>
							</div>
						</div>
					</template>
					<div class="list-template-opd surface">
						<div class="list-footer">
							<router-link :to="{path:'/list/statistik'}" class="truncate-text">Lihat Daftar Statistik</router-link>
						</div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>