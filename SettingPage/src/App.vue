<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Setting from './components/Setting.vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const locale_m = ref(zhCn)
const locale_t = ref(en)

function changeLang(){
  const temp = locale_t.value
  locale_t.value = locale_m.value
  locale_m.value = temp
}

if(typeof kj === "object"){
  const KJConfig = kj.get('KJConfig') || {}
  let dict = {
    'en-US': en,
    'zh-CN': zhCn
  }
  console.log(KJConfig, locale_m.value, locale_t.value)
  let lang = KJConfig.language ?? 'zh-CN'
  // 目标语言是第二语言
  if(locale_t.value.name === dict[lang].name){
    console.log('切换语言', locale_m, '---->', locale_t)
    changeLang()
  }
}

</script>

<template>
  <ElConfigProvider :locale="locale_m">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <el-button type="primary" @click="changeLang">{{locale_m.name}}</el-button>
    <Setting :lang="locale_m.name" />
  </ElConfigProvider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
