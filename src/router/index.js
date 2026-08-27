import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '../stores/user'

import Login from '../views/Login.vue'
import SelectPet from '../views/SelectPet.vue'
import SelectGoal from '../views/SelectGoal.vue'

import Dashboard from '../views/Dashboard.vue'

import Tasks from '../views/Tasks.vue'
import Shop from '../views/Shop.vue'
import Bag from '../views/Bag.vue'
import Memo from '../views/Memo.vue'
import User from '../views/User.vue'
import AnchorEditor from '../views/AnchorEditor.vue'


const router = createRouter({

history:createWebHistory(import.meta.env.BASE_URL),

routes:[

{
path:'/login',
component:Login,
meta:{ public:true }
},


{
path:'/onboarding/pet',
component:SelectPet
},


{
path:'/onboarding/goal',
component:SelectGoal
},


{
path:'/',
component:Dashboard
},


{
path:'/tasks',
component:Tasks
},


{
path:'/shop',
component:Shop
},


{
path:'/bag',
component:Bag
},


{
path:'/memo',
component:Memo
},


{
path:'/user',
component:User
},


{
path:'/dev/anchor-editor',
component:AnchorEditor
}


]


})


// 全站登入守衛：沒登入的話一律導去登入頁
router.beforeEach(async (to) => {

  const userStore = useUserStore()

  // 剛打開網站時 Access Token 在記憶體裡是空的，先試著用 Refresh Token 換回來
  await userStore.restoreSessionOnce()

  // 需要登入的頁面，未登入就導到登入頁
  if (!to.meta.public && !userStore.isLoggedIn) {
    return { path: '/login' }
  }

  // 已登入還想去登入頁，直接帶回首頁
  if (to.path === '/login' && userStore.isLoggedIn) {
    return { path: '/' }
  }

})


export default router
