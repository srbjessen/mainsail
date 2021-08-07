import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import './plugins/longpress'
import store from '@/store'
import router from '@/plugins/router'
import {WebSocketPlugin} from "@/plugins/webSocketClient";
import {HttpClientPlugin} from "@/plugins/httpClient";

Vue.config.productionTip = false;

// vue-observe-visibility
import VueObserveVisibility from 'vue-observe-visibility'
Vue.use(VueObserveVisibility)

//vue-headful
import vueHeadful from 'vue-headful'
Vue.component('vue-headful', vueHeadful)

//vue-load-image
import VueLoadImage from 'vue-load-image'
Vue.component('vue-load-image', VueLoadImage)

//vue-toast-notification
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

//vue2-perfect-scrollbar
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(PerfectScrollbar)

Vue.use(VueToast, {
    duration: 3000,
})

//vue-echarts-ts
import { plugin } from 'echarts-for-vue'
import * as echarts from "echarts/core"
Vue.use(plugin, { echarts })

//load config.json and init vue
fetch('/config.json')
.then(res => res.json())
.then(file => {
    store.commit('socket/setData', file)

    const websocketUrl = store.getters['socket/getWebsocketUrl']
    Vue.use(WebSocketPlugin, {
        url: websocketUrl,
        store: store,
    })

    const url = store.getters['socket/getUrl']
    Vue.use(HttpClientPlugin, {
        url: url,
        timeout: 1000,
        store: store,
    })

    new Vue({
      vuetify,
      router,
      store,
      i18n,
      render: h => h(App)
    }).$mount('#app')

})
.catch((error) => {
    const p = document.createElement("p");
    const content = document.createTextNode("config.json not found or cannot be decoded!");
    p.appendChild(content);
    document.getElementById('app')?.append(p);
    window.console.error('Error:', error);
});


