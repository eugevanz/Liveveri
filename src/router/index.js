import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'PermissionForm',
    component: () => import('../views/PermissionForm.vue')
  },
  {
    path: '/CaptureIDCamera',
    name: 'CaptureIDCamera',
    component: () => import('../views/CaptureIDCamera.vue')
  },
  {
    path: '/CaptureIDManually',
    name: 'CaptureIDManually',
    component: () => import('../views/CaptureIDManually.vue')
  },
  {
    path: '/ScreenPreview',
    name: 'ScreenPreview',
    component: () => import('../views/ScreenPreview.vue')
  },
  {
    path: '/ThirdPartySource',
    name: 'ThirdPartySource',
    component: () => import('../views/ThirdPartySource.vue')
  },
  {
    path: '/UploadProgress',
    name: 'UploadProgress',
    component: () => import('../views/UploadProgress.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
