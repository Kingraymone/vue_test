// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from './utils/request'
import ElementUI from 'element-ui'
// 样式文件单独引入
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
// 公共方法
import commons from './utils/common'
// 图表
import echarts from 'echarts'
import JSEncrypt from 'jsencrypt';


Vue.prototype.$echarts=echarts;
//阻止启动生产消息
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.commons=commons;
// 加密相关
Vue.prototype.Base64=require('js-base64').Base64;
Vue.prototype.$getRsaCode = function(str){ // 注册方法
  let pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCWFo+/ojb7DVLim01VELRnQ503fV+cUFC4uzZ04uaDjZedNUWu9OEG8EGsSHDef3V+Ciap0FgS4c5LKo+KC8xzGcQ8at/fdriRgGkYP+qqAEFmQu3o1SGqOTOpKiIjU3Ho9RRpDIQRuKjshD6ICzjMbT1/eSiz2j+yj3eYOUdxnwIDAQAB';// ES6 模板字符串 引用 rsa 公钥
  let encryptStr = new JSEncrypt();
  encryptStr.setPublicKey(pubKey); // 设置 加密公钥
  let  data = encryptStr.encrypt(str.toString());  // 进行加密
  return data;
};

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
