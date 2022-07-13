<script>
	//import { getEnv } from '@/composables/myfunc';

	export default {
		props: {
			submenu: {
				type: Object,
				default: () => {},
			},
		},
		mounted(){
			console.log(this.submenu)
		},
		methods:{
			dropdownStart(){
				var dropdown = document.querySelector(".dropdown-menu");

				dropdown.addEventListener('click', function(e){
					e.stopPropagation();
				})

					// make it as accordion for smaller screens
				if (screen.width < 992) {
					var anchor = dropdown.querySelector("a");
					anchor.addEventListener('click', function(e){
						e.preventDefault();
						if(this.nextElementSibling('.submenu').length){
							this.nextElementSibling('.submenu').toggle();
						}
						dropdown.addEventListener('hide.bs.dropdown', function(){
							this.getElementsByClassName("submenu").classList.add('hide')
						})
					})
				}
			}
		},
	}
</script>
<template>
	<template v-for="(value, index) in submenu" :key="index">
		<template v-if="value.submenu">
			<li>
				<a class="dropdown-item " href="#">{{value.nama_menu}} &raquo;</a>
				<ul class="submenu dropdown-menu">
					<CollapseMenu :data="value.submenu" />
				</ul>
			</li>
		</template>
		<template v-else>
			<li v-if="value.jenis_menu === 'M' && (value.id_post === null || value.id_post === '')">
				<a href="#" class="dropdown-item">{{value.nama_menu}}</a>   
			</li>
			<li v-else-if="value.jenis_menu === 'M' && (value.id_post != null || value.id_post != '')">
				<router-link class="dropdown-item" :to="{ path: '/pages/'+value.route, redirect: { name: 'halaman' }, query: { id_post: value.id_post, nama_menu: value.nama_menu }}">{{value.nama_menu}}</router-link>    
			</li>
			<li v-else>
				<a :href="value.hyperlink" target="_blank" class="dropdown-item">{{value.nama_menu}}</a>
			</li>
		</template>
	</template>
</template>