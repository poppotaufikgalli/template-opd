<script>
	export default {
		props: ['tags', 'page'],
		mounted() {
			//console.log(this.tags)
		},
		data(){
			return {
				newTags: (this.tags).split(', ')
			}
		}
	}
</script>
<template>
	<template v-for="(item, index) in newTags" :key="index">
		<router-link :to="{path : '/list/'+item, query : {type: 'tag', page: page} }" class="pr-4">{{item}}</router-link>   
		<span>, </span>
	</template>
</template>