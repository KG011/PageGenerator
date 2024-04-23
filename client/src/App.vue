<template>
    <div class="app">
      <router-view v-model="state" :FormData="FormData"/>
    </div>
  </template>
  <script>
  import { ref,provide } from 'vue'
  import data from './data.json'
  import Home from '@/package/Editor-home'
  import {registerConfig as config} from './utils/editor-config'
  export default {
    components: { Home },
    setup() {
      const state = ref(data);
      provide('config',config)
      const FormData={
        username:'大爹无疑',
        password:'123456',
        start:0,
        end:100
      }
      return {state,FormData};
    },
  }
  </script>
  <style lang="less">
    html,body,#app,.app { height: 100%;margin: 0; padding: 0;}
  </style>
  