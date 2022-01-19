import { createApp } from 'vue'
import App from './App.vue'

import { createI18n } from 'vue-i18n'
import en from './languages/en.json'
import zhCn from './languages/zh-cn.json'

const i18n = createI18n({
    locale: 'zhCn',
    messages: {
      en,
      zhCn
    }
  })
createApp(App).use(i18n).mount('#app')
