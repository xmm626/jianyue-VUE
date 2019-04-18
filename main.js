import Vue from 'vue'
import App from './App'


window.eventBus = new Vue();
// #ifdef H5
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
// #endif
Vue.config.productionTip = false
Vue.prototype.apiServer = 'http://localhost:8080/api'
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
