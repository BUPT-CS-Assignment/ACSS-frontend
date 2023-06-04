import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import axios from 'axios';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

import { reactive }  from 'vue'
const time = reactive({
  year: '0000',
  month: '00',
  day: '00',
  hour: '00',
  minute: '00',
});

var basetime = 0;
var sys_timer = null;
const time_sync = () => {
  console.log('sync system time');
  axios.get('/api/time')
  .then(res => {
      console.log(res.data)
      basetime = res.data.data.stamp;
      update_time(basetime);
      var ratio = res.data.data.ratio;
      sys_timer = setInterval(() => {
          update_time(basetime + 60)
      }, 60 * 1000 / ratio);
  }).catch(err => {
      console.log(err);
  })
}
const update_time = (stamp) => {
  basetime = stamp;
  var date = new Date(stamp * 1000);
  time.year = date.getFullYear();
  var m = date.getMonth() + 1;
  time.month = m < 10 ? '0' + m : m;
  var d = date.getDate();
  time.day = d < 10 ? '0' + d : d;
  var h = date.getHours();
  time.hour = h < 10 ? '0' + h : h;
  var mi = date.getMinutes();
  time.minute = mi < 10 ? '0' + mi : mi;
}


const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')


app.provide('time', time)
app.provide('time_sync', time_sync)
app.provide('sys_timer', sys_timer)