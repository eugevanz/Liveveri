import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import LivenessVerification from './plugins/scripts/livenessverification';

Vue.use(LivenessVerification);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
