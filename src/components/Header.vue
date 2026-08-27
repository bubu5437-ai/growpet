<template>

<v-app-bar
  flat
  class="pixel-header"
>


  <!-- 手機版：漢堡選單按鈕（專案沒有安裝 mdi 圖示字型，直接用文字符號畫漢堡圖示） -->
  <v-app-bar-nav-icon
    v-if="mobile"
    @click="drawer = !drawer"
  >
    <span class="hamburger-icon">☰</span>
  </v-app-bar-nav-icon>


  <!-- Logo / 名稱
       注意：這裡故意不用 <v-app-bar-title>，因為它內部會把 slot 內容
       再包一層 Vuetify 自己的 .v-toolbar-title__placeholder，
       我們外面補的 flex 版面完全套不到那層，圖片跟文字才會跑版、換行。
       直接用一個自己的 div 掌控排版比較單純。 -->
  <div class="pixel-logo">
    <img
      :src="logo"
      alt="GrowPet"
      class="logo-icon"
    />
    <span>GrowPet</span>
  </div>



  <!-- 電腦版：橫向選單 -->
  <template v-if="!mobile">

    <router-link
      v-for="item in menu"
      :key="item.title"
      :to="item.path"
      class="nav-link"
      active-class="nav-link--active"
    >

      {{ item.title }}

    </router-link>

  </template>



</v-app-bar>


<!-- 手機版：漢堡選單展開的側邊抽屜 -->
<v-navigation-drawer
  v-if="mobile"
  v-model="drawer"
  class="pixel-drawer"
>

  <v-list>

    <v-list-item
      v-for="item in menu"
      :key="item.title"
      :to="item.path"
      :title="item.title"
      @click="drawer = false"
    />

  </v-list>

</v-navigation-drawer>


</template>


<script setup>

import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import logo from '../assets/logo.png'

// Vuetify 內建的響應式判斷：只有畫面寬度小於 600px（xs 斷點，真正的手機尺寸）
// 才視為手機版，桌面瀏覽器縮小視窗不會誤判成手機版
const { xs: mobile } = useDisplay()

const drawer = ref(false)

const menu = [

{
 title:'大廳',
 path:'/'
},

{
 title:'任務紀錄',
 path:'/tasks'
},

{
 title:'商城',
 path:'/shop'
},

{
 title:'背包',
 path:'/bag'
},

{
 title:'備忘錄',
 path:'/memo'
},

{
 title:'使用者',
 path:'/user'
}

]


</script>


<style scoped>
.hamburger-icon {
  font-size: 22px;
  line-height: 1;
  color: var(--pixel-ink);
}

.pixel-header {
  background: #cdeeff !important;
  border-bottom: 3px solid var(--pixel-ink);
}

.pixel-logo {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 0 16px;
  white-space: nowrap;
  font-family: var(--font-pixel);
  font-size: 16px;
  color: var(--pixel-pink);
  flex: none;
}

.logo-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex: none;
}

.nav-link {
  font-family: var(--font-pixel);
  font-size: 13px;
  font-weight: 700;
  color: var(--pixel-ink);
  text-decoration: none;
  padding: 10px 16px;
  margin: 0 2px;
  border: 2px solid transparent;
}

.nav-link:hover {
  border-color: var(--pixel-ink);
  background: #fff;
}

.nav-link--active {
  border-color: var(--pixel-ink);
  background: var(--pixel-yellow);
  box-shadow: 3px 3px 0 var(--pixel-ink);
}

.pixel-drawer {
  border-right: 3px solid var(--pixel-ink) !important;
}
</style>
