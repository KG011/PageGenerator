<template>
  <div class="cantainer">
      <el-form ref="ruleFormRef" :model="state.ruleForm" status-icon :rules="rules" label-width="80px"
          class="demo-ruleForm">
          <!-- <div class="avater" :style="`background: ${headImg[Math.floor(Math.random() * 5)]}`"> -->
              <!-- <input type="file" id="file" multiple="multiple" class="inputfile" @change="insertAvater"> -->
              <!-- <img src="../../public/vite.svg" alt=""> -->
          <!-- </div> -->
          <el-form-item label="账号:" prop="username">
              <el-input v-model="state.ruleForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码:" prop="password">
              <el-input v-model="state.ruleForm.password" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码:" prop="confirm">
              <el-input v-model="state.ruleForm.confirm" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item>
              <el-button :loading="loading" type="primary" class="login-btn" @click="submitForm(ruleFormRef)">注册
              </el-button>
          </el-form-item>
          <router-link to="/Login" class="register">已有账号？返回登录←</router-link>

      </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import useUserStore from "@/store/modules/user";
// import {  headImg } from '@/utils/avater'
import { Register } from '@/api/apis/index'
const useStore = useUserStore();
const $router = useRouter();
const loading = ref(false);
const state = reactive({
  ruleForm: {
      username: '',
      password: '',
      confirm: ''
  }
})
const ruleFormRef = ref<FormInstance>()
const validateUsername = (rule: any, value: any, callback: any) => {
  if (typeof value === 'string' && value.length >= 3 && value.length <= 8) {
      callback();
  } else {
      callback(new Error('用户名为3到8位的字母或文字'));
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
      callback();
  } else {
      callback(new Error('密码长度至少六位'));
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
      callback(new Error('请再次输入密码!'))
  } else if (value !== state.ruleForm.password) {
      callback(new Error("两次密码不匹配！"))
  } else {
      callback()
  }
}
const rules = reactive<FormRules<typeof state.ruleForm>>({
  username: [{ validator: validateUsername, trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirm: [{ validator: validatePass2, trigger: 'blur' }],
})
const submitForm = async () => {
  if (state.ruleForm.username == '' || state.ruleForm.password == '') {
      alert("账号和密码不能为空!");
      return
  }
  loading.value = true;
  try {
      const res = await Register(state.ruleForm);
      //编程式导航跳转到展示数据首页
      //判断登录的时候,路由路径当中是否有query参数，如果有就往query参数挑战，没有跳转到首页
      switch (res.data.status) {
          case 200:
              $router.push({ path: '/Login' })
              //登录成功提示信息
              ElNotification({
                  type: 'success',
                  message: '注册成功',
                  title: `HI,你好`
              });
              break;
          case 400:
              ElNotification({
                  type: 'error',
                  message: res.data.msg,
                  title: `用户名已被占用，请重新注册！`
              })
              break;
          case 401:
      }


      //登录成功加载效果也消失
      loading.value = false;

  } catch (error: any) {
      //登录失败加载效果消息
      loading.value = false;
      //登录失败的提示信息
      ElNotification({
          type: 'error',
          message: (error).message,
          title: `用户名已被占用，请重新注册！`
      })
  }
  state.ruleForm.username = ''
  state.ruleForm.password = ''
  state.ruleForm.confirm = ''
}
const insertAvater=()=>{
  // let file = document.getElementById('file')
  // if (file.files.length > 0) {
  //     let formData = new FormData()
  //     formData.append('image', file.files[0])
  //     let data = {
  //         imgurl: '',
  //         username: useStore.username
  //     }
  //     profileApi(formData).then((res) => {
  //         data.imgurl = res
  //         useStore.updateAvatar(data,res)
  //     })
  // }
}
</script>

<style lang="less" scoped>
@import url('@/less/LoginRegister.less');
</style>
