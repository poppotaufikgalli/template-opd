<script>
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
        components: { Line, Bar },
        data: () => ({
            dtGrafik: [],
            pathGrafik : '',
            dtFrame: '',
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
            makeDataset(data, header){
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
                        backgroundColor: [this.randomColor()],
                        data: result[h]
                    };
                }

                return {
                    'labels' : label,
                    'datasets' : dataset,
                };
            },
            randomColor(){
                var o = Math.round, r = Math.random, s = 255;
                return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
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
                                        //console.log([coordinfo[ii][2], coordinfo[ii][3]])
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
            //console.log("Extra Statistik", this.lssetting)
            //console.log((this.lssetting.statistik).includes('Grafik'))
            
            if((!!this.lssetting) && (!!this.lssetting.statistik)){
                if((this.lssetting.statistik).includes('Grafik')){
                    const response = await getData('Grafik'); 

                    //console.log(response) 

                    if(response.data.Grafik){
                        this.pathGrafik = response.data.path;
                        this.dtGrafik = response.data.Grafik;
                        this.isReady = true;

                        this.setupLeafletMap();
                    }    
                }

                if((this.lssetting.statistik).includes('Eksternal Data')){
                    const response = await getData('eksdata');  
                    this.isReady = true;
                    this.dtFrame = response.data.eksdata;
                }
            }
        },
        setup(){
            const logo = require('@/assets/img/logo-tpi.png');
            return{
                logo,
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
                <article  v-for="item in dtGrafik" :key="item.id" class="blog-post blog-post-list surface p-4 my-4 overflow-hidden position-relative border app-background" style="background-color: var(--app-bar-color);">
                    <div class="list-header mb-4">
                        <div class="list-title ">
                            <span class="fw-semibold w-100">{{item.judul}}</span>
                        </div>
                    </div>
                    <template v-if="(item.jns_file == 'G')">
                        <Line
                            :chart-options="chartOptions"
                            :chart-data="makeDataset(item.excel.data, item.excel.header)"
                            :chart-id="chartId"
                            :width="height"
                            :height="width"
                        />
                    </template>
                    <template v-if="(item.jns_file == 'GB')">
                        <Bar
                            :chart-options="chartOptions"
                            :chart-data="makeDataset(item.excel.data, item.excel.header)"
                            
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
            <template v-if="dtFrame">
                <article  v-for="item in dtFrame" :key="item.id" class="blog-post blog-post-list surface p-4 my-4 overflow-hidden position-relative">
                    <p class="text-center fw-bold">{{item.judul}}</p>
                    <div class="d-flex justify-content-center">
                        <div v-html="item.isi"/>
                    </div>
                </article>
            </template>
        </div>
    </template>
</template>