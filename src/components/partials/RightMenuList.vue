<script>
  export default {
    props: ['dtList', 'page'],
    mounted() {
      console.log(this.dtList)
    },
    data(){
      return {
        //newTags: (this.tags).split(', ')
      }
    }
  }
</script>
<template>
	<div class="p-4">
    <h4 class="fst-italic">Daftar {{page}}</h4>
    <ol v-for="item in dtList" :key="item.id_post" class="list-unstyled mb-0">
      <li class="mb-1" :class="isActive"><a href="#" class="text-capitalize truncate-text l-1">{{item.post_judul}}</a></li>
    </ol>
  </div>

  <div class="p-4">
    <h4 class="fst-italic">Elsewhere</h4>
    <ol class="list-unstyled">
      <li><a href="#">GitHub</a></li>
      <li><a href="#">Twitter</a></li>
      <li><a href="#">Facebook</a></li>
    </ol>
  </div>
</template>