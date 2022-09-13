// stores/counter.js
import { defineStore } from 'pinia'
import { sendData } from '@/composables/Api';

export const useCounterStore = defineStore('template-opd', {
  state: () => {
    return { 
      modal: true,
      visitList: [],
    }
  },
  getters: {
    getModal(){
      return this.modal;
    },
    getVisitList(){
      return this.visitList;
    }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    setModal() {
      //console.log("isClose")
      this.modal = false
    },

    setModalA() {
      //console.log("can Open")
      this.modal = true
    },

    async setVisitList(id){
      if(!this.visitList.includes(id)){
        this.visitList.push(id);  
        try{
          var data = {
            "id": id.toString()
          };
          await sendData('klik_berita', data);  
          //console.log(id + " => Berita is Click")
          //console.log(response)
        } catch(err){
          err.value = err.toString()
        }
      }
    }
  },
})