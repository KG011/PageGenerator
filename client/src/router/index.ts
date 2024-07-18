import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Home from '@/package/Editor-home'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/Login'
    },
    // {path:'/home',name:'HOME',component:()=> import("@/views/Home.vue")},
    {
        path: '/Login',
        name: 'Login',
        component: () => import("@/views/Login.vue")
    },
    {
        path: '/Home',
        name: 'Home',
        component:Home
    },
    {
        path: '/Register',
        name: 'Register',
        component: () => import("@/views/Register.vue")
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router;