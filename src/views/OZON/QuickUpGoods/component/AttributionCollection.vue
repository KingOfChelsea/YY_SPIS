<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-24 17:58:40
 * @LastEditTime: 2025-04-25 16:35:18
 * @LastEditors: Zane Xu
-->
<template>
  <div v-if="dataLoaded">
    <p style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">
      你正在编辑属性：{{ attribute.name }}
    </p>
    <!-- 搜索框 -->
    <el-input v-model="searchText" :placeholder="'请选择' + attribute.name + '...'" clearable prefix-icon="Search" />

    <el-divider>{{ attribute.name }}</el-divider>

    <!-- 可勾选标签 -->
    <div class="tag-container">
      <el-check-tag v-for="(item, index) in filteredData" :key="item.id" :checked="selectedColors.includes(item.value)"
        @change="handleCheck(item.value)" style="margin: 5px">
        <template #default>
          <div style="display: flex; align-items: center; max-width: 150px; justify-content: space-between;">
            <el-tooltip effect="dark" :content="item.value" placement="top">
              <el-text class="mx-1"
                style="  overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 120px; color: black;">
                {{ item.value }}
              </el-text>
            </el-tooltip>
            <el-icon style="flex-shrink: 0; margin-left: 4px;">
              <QuestionFilled />
            </el-icon>
          </div>
        </template>
      </el-check-tag>
    </div>

    <el-divider>选中{{ attribute.name }}的属性值</el-divider>
    <div class="tag-container_check">
      <el-check-tag v-for="(item, index) in selectedColors" :key="index" checked>
        <template #default>
          <div style="display: flex; align-items: center; max-width: 150px; justify-content: space-between;">
            <el-text class="mx-1"
              style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; max-width: 120px;">
              {{ item }}
            </el-text>
            <el-tooltip effect="dark" :content="item" placement="top">
              <el-icon style="flex-shrink: 0; margin-left: 4px;">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-check-tag>
    </div>

    <el-divider>操作</el-divider>
    <div style="margin-top: 30px; text-align: right;">
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
    <el-divider></el-divider>
  </div>

  <div v-else>
    <el-skeleton :rows="10" animated />
  </div>
</template>


<script setup>
import { QueryAttributeValueAPI } from '@/apis/ozon/DescriptionCategory/QueryAttributeValue';
import { showMessage } from '@/utils/Ealert';
import { ref, watch, computed, onMounted,nextTick } from 'vue';

const props = defineProps({
  attribute: Object,
  categoryValue: Array,
});



const data = ref([]);
const selectedColors = ref([]);
const searchText = ref('');
const dataLoaded = ref(false);

// 属性变化时重置
watch(() => props.attribute, (newVal) => {
  if (newVal) {
    selectedColors.value = [];
  }
}, { immediate: true });

// 筛选数据
const filteredData = computed(() => {
  if (!searchText.value) return data.value;
  return data.value.filter(item =>
    item.value.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const handleCheck = (value) => {
  const index = selectedColors.value.indexOf(value);
  if (index === -1) {
    selectedColors.value.push(value);
  } else {
    selectedColors.value.splice(index, 1);
  }
};

const submit = () => {
  console.log('选中的颜色：', selectedColors.value);
  emit('close');
};

onMounted(async () => {
  // attribute.id =attribute_id
  // console.log('attribute.id:', props.attribute.id);
  // console.log(props.attribute.id, props.categoryValue[0], props.categoryValue[1], props.categoryValue[2]);
  try {
    const res = await QueryAttributeValueAPI(props.attribute.id, props.categoryValue[1], props.categoryValue[2]);
    data.value = res.result;

    nextTick();
    console.log("页面加载完成！");
    dataLoaded.value = true;

  } catch (error) {
    showMessage("error", error)
  }


});
</script>
<style lang="scss" scoped>
.tag-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  /* 自动换行，最小100px */
  flex-wrap: wrap;
  gap: 5px;
  padding: 1px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  background-color: #fafafa;
  text-align: center;
}

.tag-container_check {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  /* 自动换行，最小100px */
  text-align: center;
  gap: 5px;
  box-sizing: border-box;
}
</style>
