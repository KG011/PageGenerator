<template>
    <div class="cantainer">
        <el-form ref="ruleFormRef" :model="state.ruleForm" status-icon :rules="rules" label-width="80px"
            class="demo-ruleForm">
            <h2>即时通讯</h2>
            <el-form-item label="账号：" prop="username">
                <el-input v-model="state.ruleForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="state.ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" class="login-btn" @click="submitForm(ruleFormRef)">登录
                </el-button>
            </el-form-item>
            <router-link to="/Register" class="register">注册账号←</router-link>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElNotification } from 'element-plus';
import { useRouter } from 'vue-router';
import useUserStore from "@/store/modules/user";
const useStore = useUserStore();
const $router = useRouter();
const loading = ref(false);
const state = reactive({
    ruleForm: {
        username: 'KG01',
        password: '123456',
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

const rules = reactive<FormRules<typeof state.ruleForm>>({
    username: [{ validator: validateUsername, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
})
const submitForm = async () => {
    if (state.ruleForm.username == '' || state.ruleForm.password == '') {
        alert("账号和密码不能为空!");
        return
    }
    loading.value = true;
    try {
        await useStore.userLogin(state.ruleForm);
        if (useStore.isLogin) {
            $router.push('/Home')
            //登录成功提示信息
            ElNotification({
                type: 'success',
                message: '欢迎回来',
                title: `HI,你好`
            });
            useStore.isLogin=false
        }

        loading.value = false;
    } catch (error: any) {
        //登录失败的提示信息
        ElNotification({
            type: 'error',
            message: "登录失败，密码错误！"
        })
        loading.value = false;
    }

    // await useStore.userLogin(state.ruleForm);
    // // const result: any = await Login(state.ruleForm)
    // switch (result.data.status) {
    //     case 200:
    //         localStorage.setItem('token',result.data.token)
    //         $router.push({ path:'/home' })
    //         break;
    //     case 403:
    //         // this.token = REMOVE_TOKEN()
    //         alert("登陆失败，用户名 未注册！");
    //         break;
    //     case 401:
    //         // this.token = REMOVE_TOKEN()
    //         alert("登录失败，密码错误！");
    //         break;
    // }
    state.ruleForm.username = ''
    state.ruleForm.password = ''
}

</script>

<style lang="less" scoped>
@import url('@/less/LoginRegister.less');
</style>
