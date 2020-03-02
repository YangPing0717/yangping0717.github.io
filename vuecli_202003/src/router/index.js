import Vue from 'vue'
import Router from 'vue-router'
import Hello1 from '@/components/Hello1'
import Hello2 from '@/components/Hello2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloHello1',
      component: Hello1
    }, {
      path: '/Hello2',
      name: 'HelloHello2',
      component: Hello2
    }
  ]
})
