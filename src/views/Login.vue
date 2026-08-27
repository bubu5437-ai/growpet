<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '../api/axios'
import { useUserStore } from '../stores/user'


const router = useRouter()
const userStore = useUserStore()


// true = 顯示登入表單，false = 顯示註冊表單
const isLoginMode = ref(true)

const account = ref('')
const password = ref('')


const login = async()=>{


  try{


    // 登入成功後，Access Token 會存進 Pinia（userStore.accessToken）
    await userStore.login({
      account: account.value,
      password: password.value
    })


    alert('登入成功')


    // 檢查新手引導有沒有做完：先選寵物、再選年度目標
    const profileRes = await api.get('/user/profile')
    const { pet, activeGoal } = profileRes.data.user

    if (!pet) {
      router.push('/onboarding/pet')
    } else if (!activeGoal) {
      router.push('/onboarding/goal')
    } else {
      router.push('/')
    }


  }catch(error){

  console.log('完整錯誤：', error)

  console.log('response：', error.response)

  console.log('request：', error.request)

  console.log('message：', error.message)


  alert(
    error.response?.data?.message || error.message
  )

}

}


const register = async()=>{

  try{

    // 註冊成功後不會自動登入，這裡直接切回登入表單讓使用者再登入一次
    await userStore.register({
      account: account.value,
      password: password.value
    })

    alert('註冊成功，請登入')

    isLoginMode.value = true
    password.value = ''

  }catch(error){

    console.log('完整錯誤：', error)

    alert(
      error.response?.data?.message || error.message
    )

  }

}


</script>


<template>

<div class="login">

<div class="login-card pixel-card">

<h1>
GrowPet {{ isLoginMode ? '登入' : '註冊' }}
</h1>


<input
v-model="account"
placeholder="帳號"
class="pixel-input"
/>


<input
v-model="password"
type="password"
placeholder="密碼"
class="pixel-input"
/>


<button v-if="isLoginMode" class="pixel-btn" @click="login">

登入

</button>

<button v-else class="pixel-btn" @click="register">

註冊

</button>


<p>

<a href="#" @click.prevent="isLoginMode = !isLoginMode">

{{ isLoginMode ? '還沒有帳號？前往註冊' : '已經有帳號了？前往登入' }}

</a>

</p>

</div>

</div>


</template>

<style scoped>
.login {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-card {
  width: 100%;
  max-width: 340px;
  padding: 32px;
  text-align: center;
}

.login-card h1 {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 24px;
  color: var(--pixel-pink);
}

.login-card .pixel-input {
  display: block;
  width: 100%;
  margin-bottom: 14px;
}

.login-card .pixel-btn {
  width: 100%;
  padding: 12px;
}

.login-card p {
  margin: 18px 0 0;
  font-size: 13px;
}

.login-card a {
  color: var(--pixel-pink-dark);
}
</style>
