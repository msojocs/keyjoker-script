<script setup>
import { ref, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
const configList = [
  {
    id: "steam",
    text: "Steam"
  },
  {
    id: "discord",
    text: "Discord"
  },
  {
    id: "twitter",
    text: "Twitter"
  },
  {
    id: "twitch",
    text: "Twitch"
  },
]
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
const disabledData = {};
if (typeof kj === "undefined") {
  ElMessage({
    message: t('Plugin Lost'),
    type: "error",
  });
} else {
  const temp = kj.get("taskDisabled") || {};
  for(let task of configList){
    disabledData[task.id] = temp[task.id] ?? false
  }
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
        <div v-for="task in configList" v-bind:key="task.id">
          <el-row>
            <el-col :span="12">{{task.text}}</el-col>
            <el-col :span="12">
              <el-switch v-model="disabled[task.id]" />
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
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