import Vue from 'vue'
import Router from 'vue-router'
import todolist from '@/components/todolist'
import home from '@/components/home'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/todolist',
      name: 'todolist',
      component: todolist
    }, {
      path: '/',
      name: 'home',
      component: home
    }
  ]
})
