<script setup>
import { ref, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps({
  lang: String,
});
const { locale, t } = useI18n({
  inheritLocale: true,
});
const lang1 = reactive(props);
watch(lang1, (newVal, oldVal) => {
  console.log(newVal);
  locale.value = lang1.lang;
});

// //////////////任务忽略设置////////////////////
let disabledData = {
  discord: false,
  steam: false,
};
if (typeof kj === "undefined") {
  ElMessage({
    message: t('Plugin Lost'),
    type: "error",
  });
} else {
  disabledData = kj.get("taskDisabled") || {
    discord: false,
    steam: false,
  };
}
const disabled = ref(disabledData);

function saveDisabled() {
  if (typeof kj === "undefined") {
    ElMessage({
      message: t('Plugin Lost'),
      type: "error",
    });
  } else {
    kj.set("taskDisabled", disabledData);
    ElMessage({
      message: t('save success'),
      type: "success",
    });
  }
}
// //////////////end 任务忽略设置////////////////////
</script>

<template>
  <div>
    <div style="height: 50px"></div>
    <div class="setting">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{t('Ignored Task')}}</span>
            <el-button class="button" type="text" @click="saveDisabled">{{t('save')}}</el-button>
          </div>
        </template>
        <el-row>
          <el-col :span="12">Discord</el-col>
          <el-col :span="12">
            <el-switch v-model="disabled.discord" />
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">Steam</el-col>
          <el-col :span="12">
            <el-switch v-model="disabled.steam" />
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">Twitter</el-col>
          <el-col :span="12">
            <el-switch v-model="disabled.twitter" />
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="12">Twitch</el-col>
          <el-col :span="12">
            <el-switch v-model="disabled.twitch" />
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.setting {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
a {
  color: #42b983;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-card {
  width: 480px;
}
</style>
<i18n>
{
  "en": {
    "language": "Language",
    "hello": "hello, world!",
    "save": "save",
    "Ignored Task": "Ignored Task",
    "Plugin Lost": "Plugin not detected!!!",
    "save success": "Saved!",
  },
  "zhCn": {
    "language": "语言",
    "hello": "你好，世界！",
    "save": "保存",
    "Ignored Task": "忽略的任务",
    "Plugin Lost": "未检测到插件！！！",
    "save success": "保存成功!",
  }
}
</i18n>