<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
  interface Menu {
    [key: string]: any
  }
  interface CurrentInstance extends ComponentInternalInstance {
    ctx: any
  }
  import { reactive, ref, toRefs, onMounted, getCurrentInstance, nextTick } from 'vue';
  import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';
  import { Ref } from '@vue/reactivity'
  import { AppContext, ComponentInternalInstance } from '@vue/runtime-core'
  export default {
    name: 'APP',
    mounted(): void {
      console.log(this)
    },
    setup(props: any, ctx: any) {
      const sideMenu: Menu = {
        defaultOpeneds: [],
        defaultActive: '/',
        onOpen: (index: string, indexPath: string) => {
          console.log(index, indexPath, 'onOpen')
        },
        onSelect: (index: string, indexPath: string) => {
          console.log(index, indexPath, 'onSelect')
          sideMenuRef.defaultActive.value = index
        }
      }
      const sideMenuRef = toRefs(reactive(sideMenu))
      let currentRoute: string
      onMounted(() => {
        currentRoute = useRoute().path
        // const currentInstance: any = getCurrentInstance()
        console.log(location.pathname, ctx.root)
        if(currentRoute) {
          // todo useRoute(r) 在刷新页面的时候获取不到path值（一直是'/'）
          sideMenuRef.defaultActive.value = location.pathname || currentRoute
        }
      })
      return {
        ...sideMenuRef
      }
    }
  }
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  height 100%
  box-sizing border-box
</style>
