<template>
  <div id="app">
    <Pannellum :config="data" @ready="onready">
      <div class="pnlm-render-container">
        <template v-for="spot of hotSpots.get(sceneId)">
          <div 
            v-if="spot.type == 'warn'"
            class="pnlm-hotspot-base pnlm-hotspot pnlm-sprite pnlm-warn pnlm-pointer pnlm-tooltip pnlm-customer" 
            :data-showtxt="showDetail(spot.id)"
            :data-direction="spot.direction"
            :style="renderHotSpot(spot)" 
            :key="spot.id"
            @click="spotClick(spot)">
            <span class=" pnlm-pointer" style="margin-top: -85px">
              <Component :is='spot.components' :data="spot" @click.stop="spot.clickHandlerFunc"/>
            </span>
          </div>
          <div 
            v-else-if="spot.type == 'scene'"
            class="pnlm-hotspot-base pnlm-hotspot pnlm-sprite pnlm-scene pnlm-pointer pnlm-tooltip pnlm-customer" 
            data-showtxt="true"
            :style="renderHotSpot(spot)" 
            :key="spot.id">
            <span class=" pnlm-pointer">{{test}}</span>
          </div>
          <div 
            v-else
            class="pnlm-hotspot-base pnlm-hotspot pnlm-sprite pnlm-info pnlm-pointer pnlm-tooltip pnlm-customer" 
            :data-showtxt="showDetail(spot.id)"
            :data-direction="spot.direction"
            :style="renderHotSpot(spot)" 
            :key="spot.id"
            @click="spotClick(spot)">
            <span class=" pnlm-pointer" style="margin-top: -130px">
              <Component :is='spot.components' :data="spot" @click.stop="spot.clickHandlerFunc"/>
            </span>
          </div>
        </template>
      </div>
      <div class="btn-bar">
        <el-tooltip effect="light" v-if="loading" content="正在加载中···请稍后" placement="bottom">
          <span style="margin-right: 10px">
            <el-button size="mini" @click="autoRotate" type="primary" :disabled="isInspection" :loading="loading">自动巡检</el-button>
          </span>
        </el-tooltip>
        <el-button size="mini" @click="autoRotate" type="primary" :disabled="isInspection" :loading="loading" v-else>自动巡检</el-button>
        <el-button size="mini" @click="toggleFullscreen" >全屏</el-button>
      </div>
      <div id="map">
        <span class="map_arrow" :style="mapArrowStyle"><img src="img/map_arrow.png" /></span>
      </div>
      <ul id="scene-list">
        <li>
          <img src="img/20210308163721.jpg" width="100" height="100"/>
          <p>低压配电房</p>
        </li>
      </ul>
      <Result :show="detail == 'result'" @close="closeDetail"/>
      <Detail :show="detail == 'cover'" @close="closeDetail"/>
      <Video :show="detail == 'video'" @close="closeDetail"/>
    </Pannellum>
  </div>
</template>

<script>
/* eslint-disable */
import Pannellum from "@/components/Pannellum.vue";
import Result from "@/components/result.vue";
import Detail from "@/components/detail.vue";
import Video from "@/components/video.vue";
import Detail01 from "@/components/detail01.vue";
import Detail02 from "@/components/detail02.vue";
import Detail03 from "@/components/detail03.vue";
import Detail04 from "@/components/detail04.vue";
import http from '@/util/http.js'
export default {
  name: "App",
  components: {
    Pannellum,
    Result,
    Detail,
    Video,
    Detail01,
    Detail02,
    Detail03,
    Detail04
  },
  data() {
    return {
      loading: true,
      data: undefined,
      isAuto: false,
      isErr: false,
      viewer: undefined,
      test: '001',
      config: {pitch: 0, yaw: 0, hfov: 120},
      hotSpots: new Map(),
      sceneId: '',
      hotSpotId: new Set(),
      animatefinished: false,
      autoSpotMap: new Map(),
      autoRotateTimeout: 0,
      autoInterval: 0,
      detail: false,
      isInspection: false,
      isLoadSence: false,
      inspectionPath: [],
      inspectionPathLast: {},
      inspectionTimeOut: null,
      mapData: [],
      mapInfo: {
        left: 327,
        top: 190,
      },
      mapArrowStyle: {}
    };
  },
  mounted() {
    http.get('/data/default.json').then(res=>{
      this.data = res.data
      this.sceneId =  res.data.default.firstScene
      this.mapData = res.data.mapData
      this.inspectionPath = res.data.inspectionPath.slice()
    })
  },
  watch: {
    isLoadSence() {
      if(this.isLoadSence) this.hotSpotId = new Set()
    },
    sceneId() {
      let mapInfo = this.mapData.find(d=>d.sceneId == this.sceneId)
      let style = mapInfo.map || {}
      let { left = 0, top = 0, rotate = 0} = style
      this.mapArrowStyle =  {transform: "translate("+left+"px, "+top+"px) rotate("+rotate+"deg)"}
    },
  },
  methods: {
    init() {
      if(!this.loading) return
      let index = 0
      function loaded() {
        index ++
        if(index == 3) {
          this.loading = false
        }
      }
      var img2 = new Image()
      img2.src = 'room/1/1_2.jpg'
      var img3 = new Image()
      img3.src = 'room/1/1_3.jpg'
      var img4 = new Image()
      img4.src = 'room/1/1_4.jpg'
      img2.onload = loaded.bind(this)
      img3.onload = loaded.bind(this)
      img4.onload = loaded.bind(this)
    },
    findSpot(sceneId) {
      let obj = this.data.scenes[sceneId]
      return obj.hotSpots.find(d=>d.type == "scene")
    },
    onready(viewer) {
      this.viewer = viewer
      viewer.on("load", this.onload);
      viewer.on("scenechangefadedone", this.onscenechangefadedone);
      viewer.on("render", this.onrender);
      viewer.on("animatefinished", e=>{
        this.animatefinished = false
      });
      viewer.on("zoomchange", e=>{
        //console.log(e)
      });
    },

    onload(e) {
      let viewer = this.viewer
      let scene = viewer.getScene();
      this.sceneId = scene
      this.hotSpots = new Map()
      let obj = this.data.scenes[scene]
      let inspectionPath = this.inspectionPath[0]
      this.viewer.setPitch(0, false)
      if(this.isInspection && inspectionPath) {
        this.viewer.setYaw(inspectionPath.yaw, false)
      } else {
        let sceneSpot = obj.hotSpots.find(d=>d.type == "scene")
        this.viewer.setYaw(sceneSpot.yaw, false)
      }
      if(!this.isInspection) this.viewer.startAutoRotate(-5)
      if(Array.isArray(obj.spots)) {
        obj.spots.forEach(d=>{
          let clickHandlerFunc = { clickHandlerFunc: this.clickHandlerFunc }
          this.addHotSpot(Object.assign(clickHandlerFunc, d), e);
        })
      }

      this.init()
    },

    onscenechangefadedone(e) {
      let viewer = this.viewer
      let scene = viewer.getScene();
      this.sceneId = scene
      //let spots = this.hotSpots.get(scene)
      //var isAutoRotate = viewer.getConfig().autoRotate
      this.isLoadSence = false
      if(this.isInspection) {
        let inspectionPath = this.inspectionPath.splice(0, 1)[0]
        this.inspectionPathLast = inspectionPath
        let scenes = inspectionPath.sceneId
        let rotate = inspectionPath.rotate || []
        let focusId = inspectionPath.focusId || []
        //let spots = inspectionPath.spotId
        if(!Array.isArray(rotate)) rotate = [rotate]
        if(!Array.isArray(focusId)) focusId = [focusId]

        let yaw = inspectionPath.yaw
        let yaw2 = inspectionPath.yaw2 || yaw
        let obj = this.data.scenes[scenes]

        let i = 0;
        let timeOut = 0
        let delay = 3000
        function MyFun() {
          if(i >= rotate.length) {
            if(!this.inspectionPath.length) {
              //this.viewer.setPitch(0)
              this.detail = 'result'
              this.isInspection = false
              this.inspectionPathLast = {}
              return
            }
            this.nextinspectionSence()
            return
          }
          let yawR = yaw + rotate[i++]
          let spots = obj.spots.filter(d=>Math.abs(yawR - d.yaw) < 60)
          this.viewer.setYaw(yawR, delay, ()=>{
            let hotSpotId = new Set()
            spots.forEach((d, i)=>{
              timeOut = 1000 * i
              setTimeout(()=>{
                this.hotSpotId = null
                hotSpotId.add(d.id)
                this.hotSpotId = hotSpotId
              }, timeOut)
            })
            clearTimeout(this.inspectionTimeOut)
            this.inspectionTimeOut = setTimeout(MyFun.bind(this), timeOut + delay)
          })
        }

        let n = 0
        function MyFun2() {
          this.viewer.setPitch(0)
          this.viewer.setHfov(120)
          if(n >= focusId.length) {
            MyFun.bind(this)()
            return
          }
          let id = focusId[n++]
          let spot = obj.spots.find(d=>d.id == id)
          this.viewer.setPitch(spot.pitch)
          this.viewer.setYaw(spot.yaw, 1000, () => {
            let hotSpotId = new Set()
            this.viewer.setHfov(60)
            this.hotSpotId = null
            hotSpotId.add(id)
            this.hotSpotId = hotSpotId
            clearTimeout(this.inspectionTimeOut)
            this.inspectionTimeOut = setTimeout(MyFun2.bind(this), delay)
          })

        }
        MyFun2.bind(this)()
      }
    },

    nextinspectionSence() {
      let inspectionPath = this.inspectionPathLast
      let yaw2 = inspectionPath.yaw2 || inspectionPath.yaw
      this.viewer.setPitch(0)
      this.viewer.setYaw(yaw2, 2000, ()=>{
        let inspectionPath2 = this.inspectionPath[0]
        let scenes2 = inspectionPath2.sceneId
        this.viewer.loadScene(scenes2)
        this.isLoadSence = true
      })

    },

    onrender(e) {
      let viewer = this.viewer
      this.config = viewer.getConfig()
      let hotSpots = this.hotSpots.get(this.sceneId) || []
      if(!this.isInspection && hotSpots.length) {
        let hotSpots = this.hotSpots.get(this.sceneId) || []
        let yaw = this.config.yaw
        let pitch = this.config.pitch
        if(this.config.yaw < 0) yaw = 360 + this.config.yaw
        let spots = hotSpots.filter(d=>Math.abs(yaw - d.yaw) < 60 && Math.abs(pitch - d.pitch) < 30)
        let hotSpot = spots.sort((a, b)=> {
          let yaw1 = a.yaw
          let yaw2 = b.yaw
          if(a.yaw < 0) yaw1 = 360 + a.yaw
          if(b.yaw < 0) yaw2 = 360 + b.yaw
          return Math.abs(yaw - yaw1) - Math.abs(yaw - yaw2)
        })[0]
        if(hotSpot) {
          let hotSpotId = new Set()
          this.hotSpotId = null
          hotSpotId.add(hotSpot.id)
          this.hotSpotId = hotSpotId
        }
      }
    },

    renderHotSpot(hs) {
      if(!this.viewer) return {}
      var config = this.config
      var origHfov = config.hfov
      var visibility = 'hidden'
      var hsPitchSin = Math.sin(hs.pitch * Math.PI / 180),
          hsPitchCos = Math.cos(hs.pitch * Math.PI / 180),
          configPitchSin = Math.sin(config.pitch * Math.PI / 180),
          configPitchCos = Math.cos(config.pitch * Math.PI / 180),
          yawCos = Math.cos((-hs.yaw + config.yaw) * Math.PI / 180);
      var z = hsPitchSin * configPitchSin + hsPitchCos * yawCos * configPitchCos;
      if ((hs.yaw <= 90 && hs.yaw > -90 && z <= 0) ||
        ((hs.yaw > 90 || hs.yaw <= -90) && z <= 0)) {
          return {visibility}
      } else {
          var yawSin = Math.sin((-hs.yaw + config.yaw) * Math.PI / 180),
              hfovTan = Math.tan(config.hfov * Math.PI / 360);
          var canvas = this.viewer.getCanvas(),
              canvasWidth = canvas.clientWidth,
              canvasHeight = canvas.clientHeight;
          var coord = [-canvasWidth / hfovTan * yawSin * hsPitchCos / z / 2,
              -canvasWidth / hfovTan * (hsPitchSin * configPitchCos -
              hsPitchCos * yawCos * configPitchSin) / z / 2];
          var rollSin = Math.sin(config.roll * Math.PI / 180),
              rollCos = Math.cos(config.roll * Math.PI / 180);
          coord = [coord[0] * rollCos - coord[1] * rollSin,
                  coord[0] * rollSin + coord[1] * rollCos];
          coord[0] += (canvasWidth - 56) / 2;
          coord[1] += (canvasHeight - 56) / 2;
          var transform = 'translate(' + coord[0] + 'px, ' + coord[1] +
              'px) translateZ(9999px) rotate(' + config.roll + 'deg)';
          if (hs.scale) {
              transform += ' scale(' + (origHfov/config.hfov) / z + ')';
          }
          visibility = 'visible';
          return {transform, visibility}
      }
    },
    showDetail(id) {
      return this.hotSpotId.has(id)
    },
    showDetailByYaw(spotYaw = 0) {
      let yaw = 0
      if(this.config.yaw < 0) yaw = 360 + this.config.yaw
      else yaw = this.config.yaw
      return yaw >= spotYaw && yaw <= spotYaw + 50
    },
    addHotSpot(spot, sceneId) {
      if(!this.viewer) return
      var sceneId = sceneId
      var hotSpots = this.hotSpots
      this.hotSpots = null
      if(!sceneId) {
        sceneId = this.viewer.getScene();
      }
      if(hotSpots.has(sceneId)) {
        let sceneSpots = hotSpots.get(sceneId)
        sceneSpots.push(spot)
      } else {
        hotSpots.set(sceneId, [spot])
      }
      this.hotSpots = hotSpots
    },
    removeHotSpot(spotId, sceneId) {
      if(!this.viewer) return
      var sceneId = sceneId
      if(this.hotSpots.has(sceneId)) {
        let hotSpots = this.hotSpots.get(sceneId)
        let hotSpotIndex = hotSpots.findIndex(s=>s.id == spotId)
        if(hotSpots) {
          hotSpots.splice(hotSpotIndex,1)
          return hotSpots
        }
        return null
      }
      return null
    },
    clickHandlerFunc(e) {
      console.log(e)
      if(e.target.className == 'detail') {
        this.detail = 'cover'
        this.viewer.stopMovement();
        clearTimeout(this.inspectionTimeOut)
      }
    },
    spotClick(e) {
      this.viewer.stopMovement();
      this.viewer.setPitch(e.pitch)
      this.viewer.setYaw(e.yaw)
      this.viewer.setHfov(60)
      clearTimeout(this.inspectionTimeOut)
    },
    autoRotate() {
      if(!this.viewer) return false

      if(this.loading) return this.$message({
          message: '正在加载中···请稍后再试',
          type: 'warning'
        });

      this.inspectionPath = this.data.inspectionPath.slice()

      let inspectionPath = this.inspectionPath[0]
      let scenes = inspectionPath.sceneId
      this.viewer.stopMovement()
      this.isInspection = true
      this.viewer.loadScene(scenes)
      this.isLoadSence = true

    },

    toggleFullscreen() {
      this.viewer.toggleFullscreen()
    },
    closeDetail() {
      this.detail = false
      if(!this.isInspection) this.viewer.startAutoRotate(-5)
      else {
        clearTimeout(this.inspectionTimeOut)
        this.inspectionTimeOut = setTimeout(this.nextinspectionSence, 3000)
      }
    }
  },
};
</script>

<style>
  html {
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: fixed;
    cursor: default;
    width: 100%;
    height: 100%;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
  }
</style>
<style lang="stylus" scoped>
.btn-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: right;
    z-index: 2;
    padding: 20px 10px;
}
</style>
