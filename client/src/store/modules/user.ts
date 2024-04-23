// 定义user数据
// store/modules/user.ts
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
import { defineStore } from 'pinia'
import { ElNotification } from 'element-plus';
import { Login, userInfoApi,getDataJson } from '@/api/apis/index'
// 第一个参数是应用程序中 store 的唯一 id
const useUserStore = defineStore('user', {
    state: () => {
        return {
            token: GET_TOKEN(),//用户唯一标识token
            username: String,
            avatar: String,
            userId: Number,
            isLogin:false,
            JsonData:JSON
        }
    },
    //异步|逻辑的地方
    actions: {
        //用户登录的方法
        async userLogin(data: User) {
            //登录请求
            const result: any = await Login(data)
            switch (result.data.status) {
                case 200:
                    this.username = result.data.username;
                    this.userId = result.data.userId;
                    //本地存储持久化存储一份
                    this.token = result.data.token;
                    this.avatar = result.data.avatar
                    SET_TOKEN(result.data.token);
                    this.isLogin=true
                    
                    break;
                case 403:
                    // this.token = REMOVE_TOKEN()
                    alert("登陆失败，用户名 未注册！");
                    break;
                case 401:
                    // this.token = REMOVE_TOKEN()
                    alert("登录失败，密码错误！");
                    break;
            }
        },
        //获取用户信息方法
        async userInfo() {

            //获取用户信息进行存储仓库当中[用户头像、名字]
            let result = await userInfoApi();
            //如果获取用户信息成功，存储一下用户信息
            switch (result.data.status) {
                case 200:
                    this.username = result.data.username;
                    this.avatar = result.data.avatar
                    this.userId = result.data.userId
                    let res=await getDataJson({userId:result.data.userId})
                    this.JsonData=res.data.JsonData[0]
                    break;
                case 500:
                    this.token = REMOVE_TOKEN()
                    alert("Token已过期，请重新登录！");
                    break;
            }

        },
        // //退出登录
        // async userLogout() {
        //     //退出登录请求
        //     this.token = '';
        //     this.username = '';
        //     this.avatar = '';
        //     REMOVE_TOKEN();
        //     return 'ok';
        //     // let result= await reqLogout();

        //     // if (result.code == 200) {
        //     //     //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        //     //     this.token = '';
        //     //     this.username = '';
        //     //     this.avatar = '';
        //     //     REMOVE_TOKEN();
        //     //     return 'ok';
        //     // } else {
        //     //     return Promise.reject(new Error(result.message));
        //     // }

        // },
        // updateAvatar(data, url) {
        //     this.avatar = url
        //     updateAvatarApi(data)
        //     updateCMTAvatarApi(data)
        //     return 'ok';
        // }

    },
    getters: {

    }
})

export default useUserStore