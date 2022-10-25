<script>
    import { Line } from 'vue-chartjs'
    import {
      Chart as ChartJS,
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale,
    } from 'chart.js'

    ChartJS.register(
      Title,
      Tooltip,
      Legend,
      LineElement,
      LinearScale,
      PointElement,
      CategoryScale,
    )

    import "leaflet/dist/leaflet.css";
    import L from "leaflet";

    import { getEnv } from '@/composables/myfunc';
    import { getData } from '@/composables/Api';
    const _ = require("lodash");

    export default {
        props: {
            lssetting : {
                type: Object,
                default: () => {},
            },
            chartId: {
                type: String,
                default: 'line-chart'
            },
            width: {
                type: Number,
                default: 300
            },
            height: {
                type: Number,
                default: 300
            },
            cssClasses: {
                default: '',
                type: String
            },
            styles: {
                type: Object,
                default: () => {}
            },
        },
        components: { Line },
        data: () => ({
            dtGrafik: [],
            pathGrafik : '',
            isReady: false,
            //modal: null,
            //modalContainer: null,
            env: getEnv(),
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false
            }
        }),
        methods : {
            getExceldata(data, idx){
                const ret = _.map(data, function(o) { return o[idx]; });
                //console.log(ret)
                return ret;
            },
            setupLeafletMap: function () {
                this.$nextTick(() => {
                    //console.log(this.show, this.$refs.content);

                    if(this.dtGrafik){
                        const dt = this.dtGrafik;
                        for (var i = 0; i < dt.length; i++) {
                            if(dt[i].jns_file == 'P'){
                                //console.log(dt[i].id)
                                const markerIcon = L.icon({
                                    iconSize: [31, 42],

                                    // specify the path here
                                    //iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
                                    iconUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Map_pin_icon_green.svg"
                                });
                                const mapContainer = document.getElementById('mapContainer'+dt[i].id)
                                
                                const mapDiv = []
                                if(mapContainer){
                                    mapDiv[i] = L.map(mapContainer).setView([0.917062, 104.4845973], 13);
                                    L.tileLayer("http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",{
                                        maxZoom: 20,
                                        subdomains:['mt0','mt1','mt2','mt3']
                                    }).addTo(mapDiv[i]);    

                                    var route = L.featureGroup().addTo(mapDiv[i]);
                                    var coordinfo = dt[i].excel.data;
                                    var labels = []
                                    for (var ii = coordinfo.length - 1; ii >= 0; ii--) {
                                        //coordinfo[i]
                                        labels[ii] = '<b>'+coordinfo[ii][1]+'</b>';
                                        if(coordinfo[ii][4] !== null){
                                            labels[ii] = labels[ii] + '<br >' +coordinfo[ii][4]
                                        }
                                        var marker = new L.Marker([coordinfo[ii][2], coordinfo[ii][3]], {
                                            draggable: false, // Make the icon dragable
                                            opacity: 1,
                                            icon: markerIcon // here assign the markerIcon var
                                        }).bindPopup(labels[ii]);
                                        console.log([coordinfo[ii][2], coordinfo[ii][3]])
                                        route.addLayer(marker)
                                    }
                                    //console.log(dt[i].excel.data)
                                    mapDiv[i].fitBounds(route.getBounds(), {padding: [70,70]});
                                }
                            }
                        }
                    }
                });
                
            },
        },
        computed : {
            
        },
        async mounted(){
            console.log("Extra Statistik")
            //console.log((this.lssetting.statistik).includes('Grafik'))
            
            if((!!this.lssetting) && (!!this.lssetting.statistik)){
                if((this.lssetting.statistik).includes('Grafik')){
                    const response = await getData('Grafik');  
                    if(response.data.Grafik){
                        this.pathGrafik = response.data.path;
                        this.dtGrafik = response.data.Grafik;
                        this.isReady = true;

                        this.setupLeafletMap();
                    }    
                }
            }
        },
        setup(){
            //const statistik = this.lssetting.statistik
            //const isReady = false
            const logo = require('@/assets/img/logo-tpi.png');
            return{
                logo,
                //statistik
                //isReady,
            }
        },
    }
</script>
<style scoped>
    .mapStyle {
        width: 300;
        height: 300px;
    }
</style>
<template>
    <template v-if="isReady">
        <div class="list-template-opd mt-2 px-1 pb-1">
            <div class="list-header">
                <h3 class="list-title">
                    <div class="d-flex justify-content-between">
                        <span>Statistik</span>
                    </div>
                </h3>
            </div>
            <template v-if="dtGrafik">
                <article  v-for="item in dtGrafik" :key="item.id" class="blog-post blog-post-list surface p-4 my-4 overflow-hidden position-relative">
                    <template v-if="(item.jns_file == 'G')">
                        <Line
                            :chart-options="chartOptions"
                            :chart-data="{
                                'labels' : getExceldata(item.excel.data, 1),
                                'datasets' : [{ 
                                    label: (item.judul).toUpperCase(),
                                    backgroundColor: '#f87979',
                                    data: getExceldata(item.excel.data, 2),
                                }],
                            }"
                            :chart-id="chartId"
                            :width="height"
                            :height="width"
                        />
                    </template>
                    <template v-if="(item.jns_file == 'P')">
                        <p class="text-center">{{item.judul}}</p>
                        <div class="overflow-hidden">
                            <div :id="'mapContainer'+item.id" ref="mapElement" class="mapStyle"></div>
                        </div>
                    </template>
                </article>
            </template>
        </div>
    </template>
</template>