import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'blog',
      component: () => import("@/views/blog/Index.vue")
    },
    {
      path:'/blog',
      name:'blog',
      component: () => import("@/views/blog/Blog.vue"),
      children: [
        {
          path: '/blog',
          component: () => import('@/views/blog/subject/BlogCard.vue'),
          meta: { title: '文章显示' }
        },
        {
          path: '/blog/detail/:id',
          component: () => import('@/views/blog/subject/ArticleDetail.vue'),
          meta: { title: '文章详情'}
        },
        {
          path: '/blog/archive',
          component: () => import('@/views/blog/subject/Archives.vue'),
          meta: { title: '历史归档',keepAlive:true}
        },
        {
          path: '/blog/about',
          component: () => import('@/views/blog/subject/About.vue'),
          meta: { title: '关于我',keepAlive:true}
        },
        {
          path: '/blog/search',
          name:'search',
          component: () => import('@/views/blog/subject/Search.vue'),
          meta: { title: '搜索内容'}
        }
      ]
    },
    {
      path:'/sys',
      name:'login',
      redirect:'/sys/login'
    },
    {
      path:'/sys/login',
      name:'login',
      component:()=>import("@/views/login/Index.vue")
    },
    {
      path: '/sys/home',
      name: 'home',
      component: () => import("@/views/home/Index.vue"),
      children: [
        {
          path: '',
          component: () => import('@/views/home/Home.vue'),
          meta: { title: '系统首页',keepAlive:true }
        },
        {
          path: 'user',
          component: () => import('@/views/home/User.vue'),
          meta: { title: '用户管理',keepAlive:true }
        },
        {
          path: 'navigation',
          component: () => import('@/views/home/Navigation.vue'),
          meta: { title: '页面导航',keepAlive:true }
        },
        {
          path: 'article/publish/:id',
          component: () => import('@/views/home/article/Publish.vue'),
          meta: { title: '发表文章' }
        },
        {
          path: 'article/list',
          component: () => import('@/views/home/article/List.vue'),
          meta: { title: '文章列表',keepAlive:true }
        },
        {
          path: 'article/detail/:id',
          component: () => import('@/views/home/article/Detail.vue'),
          meta: { title: '文章详情'}
        },
        {
          path: 'finance/trend',
          component: () => import('@/views/home/finance/Trend.vue'),
          meta: { title: '基金走势',keepAlive:true }
        },
        {
          path: 'finance/fund',
          component: () => import('@/views/home/finance/Fund.vue'),
          meta: { title: '所有基金',keepAlive:true }
        },
        {
          path: 'finance/fare',
          component: () => import('@/views/home/finance/FareRatio.vue'),
          meta: { title: '费率设置',keepAlive:true }
        },
        {
          path: 'authority/role',
          component: () => import('@/views/home/authority/Role.vue'),
          meta: { title: '角色列表',keepAlive:true }
        },
        {
          path: 'authority/menu',
          component: () => import('@/views/home/authority/Menu.vue'),
          meta: { title: '菜单列表',keepAlive:true }
        },
        {
          path: 'authority/resource',
          component: () => import('@/views/home/authority/Resource.vue'),
          meta: { title: '资源列表',keepAlive:true }
        }


        ]
    },
    {
      path:'/500',
      name:'error',
      component:()=>import("@/views/common/Error.vue")
    },
    {
      path:'*',
      name:'notFound',
      component:()=>import("@/views/common/NotFound.vue")
    }
  ]
});
export default router;
