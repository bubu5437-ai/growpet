import { createRouter, createWebHistory } from 'vue-router'

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

history:createWebHistory(),

routes:[

{
path:'/login',
component:Login
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


export default router