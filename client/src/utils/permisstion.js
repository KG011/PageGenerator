import router from '@/router'
import nprogress from 'nprogress'
import "nprogress/nprogress.css"
import useUserStore from "@/store/modules/user";
router.beforeEach((to, from, next) => {
    let userStore =useUserStore()
    nprogress.start()
    // if (userStore.token&& to.name === 'Login') {
    //     router.push('/')
    // } else {
    //    next()
    // }
    next()

})
router.afterEach((to, from, next) => {
    nprogress.done()

})