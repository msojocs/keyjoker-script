<script setup>
import { ref, watch, reactive } from "vue";
import { useI18n } from "vue-i18n";
const configList = [
  {
    id: "steam",
    text: "Steam",
  },
  {
    id: "discord",
    text: "Discord",
  },
  {
    id: "twitter",
    text: "Twitter",
  },
  {
    id: "twitch",
    text: "Twitch",
  },
];

// 初始化语言
const props = defineProps({
  lang: String,
});
const { locale, t } = useI18n({
  inheritLocale: true,
});
locale.value = props.lang;

// 监听语言切换
const p = reactive(props);
watch(p, (newVal, oldVal) => {
  console.log('setting', newVal);
  locale.value = p.lang;
  if(typeof kj === "object"){
    const KJConfig = kj.get('KJConfig') || {}
    let dict = {
      en: 'en-US',
      'zh-cn': 'zh-CN'
    }
    KJConfig.language = dict[newVal.lang]
    kj.set('KJConfig', KJConfig)
  }
});

// 检测KJ插件是否加载
const checkPluginLoaded = () => {
  if (typeof kj === "undefined") {
    ElMessage({
      message: t("Plugin Lost"),
      type: "error",
    });
    return false;
  }
  return true;
};

// //////////////DISCORD
const discord = ref({
  enable: false,
});
if (checkPluginLoaded()) {
  const temp = kj.get("discordAuth") || {};
  discord.value.enable = temp.enable || false;
}
// //////////////END DISCORD

// //////////////任务忽略设置////////////////////
const disabledData = {};
if (checkPluginLoaded()) {
  const temp = kj.get("taskDisabled") || {};
  for (let task of configList) {
    disabledData[task.id] = temp[task.id] ?? false;
  }
}
const disabled = ref(disabledData);

function saveData(key, value) {
  if (checkPluginLoaded()) {
    switch (key) {
      case "discordAuth":
        const temp = kj.get("discordAuth") || {};
        temp.enable = value;
        value = temp;
        break;
    }
    kj.set(key, value);
    ElMessage({
      message: t("save success"),
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
            <span>{{t('Discord')}}</span>
          </div>
        </template>
        <div>
          <el-row>
            <el-col :span="12">{{ t('USE API MODE') }}</el-col>
            <el-col :span="12">
              <el-switch v-model="discord.enable" @change="saveData('discordAuth', $event)" />
            </el-col>
          </el-row>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>{{t('Ignored Task')}}</span>
            <el-button
              class="button"
              type="text"
              @click="saveData('taskDisabled', disabledData)"
            >{{t('save')}}</el-button>
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
    "USE API MODE": "USE API MODE",
    "Ignored Task": "Ignored Task",
    "Plugin Lost": "Plugin not detected!!!",
    "save success": "Saved!",
  },
  "zhCn": {
    "language": "语言",
    "hello": "你好，世界！",
    "save": "保存",
    "USE API MODE": "使用API模式",
    "Ignored Task": "忽略的任务",
    "Plugin Lost": "未检测到插件！！！",
    "save success": "保存成功!",
  }
}
</i18n>