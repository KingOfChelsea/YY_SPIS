<!--
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-23 10:20:37
 * @LastEditTime: 2025-04-27 17:13:13
 * @LastEditors: Zane Xu
-->
<template>
  <div class="page-wrapper">
    <el-watermark :font="font" :content="userStore.userInfo.EmployeeName">
      <!-- 操作按钮 ✅改为居中按钮 -->
      <div class="btnGroup">
        <el-button type="success" size="default">完成创建</el-button>
        <el-button type="primary" size="default" @click="loadMoreAttributes">填写更多</el-button>
        <el-button type="danger" size="default">取消</el-button>
      </div>

      <div>
        <el-card class="max-w-4xl mx-auto">
          <el-form :model="form" label-position="top" class="space-y-6">
            <h2 class="text-2xl font-bold mb-4">1.商品创建</h2>
            <el-divider />
            <!-- 基本信息 -->
            <h3>基本信息</h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="名称">
                  <el-input v-model="form.name" placeholder="请输入商品名称" maxlength="500" size="large" clearable>
                    <template #suffix>
                      <el-tooltip content="商品名称将展示在前台页面，请填写准确" placement="top">
                        <el-icon style="cursor: pointer;">
                          <question-filled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-tooltip effect="dark" content="选择类目和类型" placement="top-start">
                  <el-form-item label="类目和类型">
                    <el-cascader v-model="form.category" :options="categoryStore.OzonCategoryList"
                      :props="categoryStore.cascaderProps" placeholder="请选择分类" clearable filterable size="large"
                      class="w-full" @change="handleCategoryChange" />
                  </el-form-item>
                </el-tooltip>
              </el-col>
            </el-row>

            <!-- 条形码和货号 ✅条形码带按钮 -->
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="条形码">
                  <el-input v-model="form.barcode" placeholder="请输入条形码" size="large" clearable>
                    <!-- 自动生成按钮 -->
                    <template #append>
                      <el-button @click="form.barcode = generateBarcode()" type="primary">自动生成</el-button>
                    </template>

                    <!-- 提示图标 -->
                    <template #suffix>
                      <el-tooltip content="自动条形码或自定义" placement="top-start">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="货号">
                  <el-input v-model="form.sku" placeholder="请输入货号" clearable size="large">
                    <template #suffix>
                      <el-tooltip content="建议设置为唯一标识" placement="top-start">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 售价相关 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="您的价格 ¥">
                  <el-input v-model="form.price" type="number" placeholder="请输入售价">
                    <template #suffix>
                      <el-tooltip effect="dark" content="商品价格，包括折扣，显示在商品卡上。如无折扣，请在下方填写原价。" placement="top">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="折扣前价格 ¥">
                  <el-input v-model="form.old_price" type="number" placeholder="原价（可选）">
                    <template #suffix>
                      <el-tooltip effect="dark" content="商品价格，包括折扣，显示在商品卡上。如无折扣，请在下方填写原价。" placement="top">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>


            <!-- 尺寸和重量 -->
            <h3 class="text-lg font-semibold mt-10 mb-4">尺寸和重量</h3>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="包装长度 *">
                  <el-input v-model="form.length" type="number" placeholder="请输入长度">
                    <template #append>cm</template>
                    <template #suffix>
                      <el-tooltip content="请填写商品外包装长度" placement="top">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="包装宽度 *">
                  <el-input v-model="form.width" type="number" placeholder="请输入宽度">
                    <template #append>cm</template>
                    <template #suffix>
                      <el-tooltip content="请填写商品外包装宽度" placement="top">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="包装高度 *">
                  <el-input v-model="form.height" type="number" placeholder="请输入高度">
                    <template #append>cm</template>
                    <template #suffix>
                      <el-tooltip content="请填写商品外包装高度" placement="top">
                        <el-icon style="cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="含包装重量 *">
              <el-input v-model="form.weight" type="number" placeholder="请输入重量">
                <template #append>
                  g(克)
                  <!-- <el-select v-model="weightUnit"  style="width: 100px">
                    <el-option label="g" value="g" />
                    <el-option label="kg" value="kg" />
                  </el-select> -->
                </template>
                <template #suffix>
                  <el-tooltip content="请填写含包装的总重量，系统将统一转换为克" placement="top">
                    <el-icon style="cursor: pointer;">
                      <QuestionFilled />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>


            <el-divider></el-divider>

            <!-- 动态生成填写更多的属性 -->
            <h2 class="text-2xl font-bold mb-4">2.更多属性</h2>
            <div v-if="showMoreAttributes">
              <el-row :gutter="24">
                <el-col :span="12" v-for="attr in attributeList" :key="attr.id">
                  <el-form-item :label="attr.name" :required="attr.is_required">
                    <template #label>
                      {{ attr.name }}
                      <el-tooltip v-if="attr.description || attr.type" :content="attr.description || attr.type"
                        placement="top">
                        <el-icon style="margin-left: 4px; cursor: pointer;">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </template>

                    <!-- 图片 / 文件上传类型 -->
                    <el-upload v-if="attr.type === 'URL'" class="upload-demo"
                      action="http://localhost:49131/api/v1/ImageUpload"
                      :on-success="(res, file) => handleUploadSuccess(attr.id, res, file)"
                      :file-list="form[`attr_${attr.id}`]" :limit="10" list-type="picture-card">
                      <el-icon>
                        <Plus />
                      </el-icon>
                    </el-upload>

                    <!-- category_dependent 为 true 的选择类型 -->
                    <el-select v-else-if="attr.category_dependent === true" v-model="attr.selectedValue"
                      placeholder="请选择属性值" clearable filterable :loading="selectLoading"
                      @visible-change="(visible) => ChangeAttributes(visible, attr.id)" class="w-full">
                      <el-option v-for="item in attrOptions" :key="item.id" :value="item.value">
                        <el-text class="mx-1" size="large">{{ item.value }}</el-text>
                      </el-option>
                    </el-select>

                    <!-- 集合类型 -->
                    <el-button v-else-if="attr.is_collection === true" type="primary" icon="Edit"
                      @click="openDialog(attr)">
                      编辑
                    </el-button>

                    <!-- 普通文本输入组件 -->
                    <component v-else :is="getInputComponent(attr.type)" v-model="form[`attr_${attr.id}`]"
                      :placeholder="attr.description" type="textarea" :autosize="true" min="0" />

                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 上传图片 -->
             <h2>3.图片媒体视频</h2>
            <el-row :gutter="24">
              <el-col :span="8">
                <h3 class="text-lg font-semibold mt-10 mb-4">图片</h3>
                <el-upload class="upload-demo" list-type="picture-card" action="#" :auto-upload="false">
                  <el-button color="#626aef">+</el-button>
                  <template #tip>
                    <div class="el-upload__tip">支持 jpg/png 格式，大小不超过 2MB</div>
                  </template>
                </el-upload>
              </el-col>
              <!-- <el-col :span="16">
                <el-upload class="upload-PDF" multiple drag action="http://localhost:49131/api/v1/ImageUpload"
                  :auto-upload="true">
                  <el-button color="#626aef">上传PDF</el-button>
                  <template #tip>
                    <div class="el-upload__tip">支持 PDF 格式，大小不超过 20MB</div>
                  </template>
                </el-upload>
              </el-col> -->
            </el-row>

          </el-form>
        </el-card>
      </div>

      <el-dialog v-model="dialogVisible" title="编辑集合属性" width="1000px" fullscreen destroy-on-close>
        <AttrCollectionEditor :attribute="selectedAttr" :categoryValue="form.category" @close="dialogVisible = false" />
      </el-dialog>

    </el-watermark>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useOzonCategoryStore } from '@/stores/Ozon/OzonCategory'
import { useOzonAttributeStore } from '@/stores/Ozon/OzonAttribute'
import { useUserStore } from '@/stores/Roles/roles'
import AttrCollectionEditor from './component/AttributionCollection.vue';
import { QueryAttributeValueAPI } from '@/apis/ozon/DescriptionCategory/QueryAttributeValue';

const dialogVisible = ref(false);
const selectedAttr = ref(null);

const openDialog = (attr) => {
  selectedAttr.value = attr;
  dialogVisible.value = true;
};

const OzonAttributeStore = useOzonAttributeStore()
const categoryStore = useOzonCategoryStore()
const userStore = useUserStore();

const font = ref({
  color: 'rgba(239, 238, 238, 0.8)',
  fontSize: 24 // 数字类型，单位为 px
})
const attributeList = ref([])
const showMoreAttributes = ref(false)
const attrOptions = ref([])
const selectLoading = ref(false)

function loadMoreAttributes() {
  showMoreAttributes.value = !showMoreAttributes.value
}

// 动态组件选择
function getInputComponent(type) {
  switch (type) {
    case 'Integer':
      return ElInputNumber
    case 'Boolean':
      return ElSwitch
    case 'String':
      return ElInput
    case 'URL':
      return ElUpload
    case 'Decimal':
      return ElInputNumber
    default:
      return ElInput
  }
}

const form = ref({
  name: '', // 商品名称
  category: [],
  barcode: '',
  sku: '',
  price: '', //商品价格
  old_price: '',//old_price 折扣前的价格（将在产品卡上划掉）。 以卢布表示。分数分隔 符号 — 点, 在点之后最多两个字符。
  length: '',
  width: '', //包装宽度 integer
  weight_unit: '', //测重单位 string
  height: '', //包装高度
  weight: '', // 含包装的商品重量。 限值为1000公斤或其他换算值 计量单位。
  vat: '', //商品增值税税率
  pdf_list: [], //pdf
  offer_id: '',//货号
  images360: [], //图像组360。至70件。
  service_type: '',//服务类型 以大写形式传递其中的一个值 	Default: "IS_CODE_SERVICE"
  primary_image: '', //链接到商品主图。
  images: [], //图像组。 最多15件。 图像以与组中相同的顺序显示在网站上。
  dimension_unit: '', //尺寸测量单位
  depth: '', //包装厚度
  currency_code: 'CNY', //默认
  complex_attributes: [],
  color_image: '', //营销色彩
  description_category_id: '', //	integer <int64> 类别ID。可以使用方法 /
  attributes: [],// 商品特征组
})

attributeList.value.forEach(attr => {
  switch (attr.type) {
    case 'Boolean':
      form.value[`attr_${attr.id}`] = false
      break
    case 'Integer':
    case 'Number':
      form.value[`attr_${attr.id}`] = 0 // 初始化为数字类型
      break
    default:
      form.value[`attr_${attr.id}`] = ''
  }
})

function handleCategoryChange(val) {
  attributeList.value = [];
  showMoreAttributes.value = false;
  // console.log('选中分类ID路径:',val)
  if (!val || val.length === 0) {
    showMoreAttributes.value = false;
    attributeList.value = [];
    return
  }
  OzonAttributeStore.getOzonAttributeList(val[1], val[2])
  form.value.description_category_id = val[0]

  showMoreAttributes.value = true;
  attributeList.value = OzonAttributeStore.OzonAttributeList
}

//#region 条形码自动生成方法 add by xu.zhenyu @2024-04-24
/** 条形码自动生成方法 add by xu.zhenyu @2024-04-24  */
function generateBarcode() {
  const prefix = 'YySelectOzon'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `${prefix}${timestamp}${random}`
}
//#endregion


function handleUploadSuccess(attrId, response, file) {
  console.log(attrId, response, file);
}

async function ChangeAttributes(visible, id) {
  if (visible) {
    selectLoading.value = true;
    console.log(
      id,
      form.value.category[1],
      form.value.category[2]);

    try {
      const res = await QueryAttributeValueAPI(
        id,
        form.value.category[1],
        form.value.category[2]
      );
      attrOptions.value = res.result;
    } catch (error) {
      ElMessage.error('加载属性值失败');
    } finally {
      selectLoading.value = false;
    }
  }
}
onMounted(() => {
  categoryStore.getOzonCategoryList()
})
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  background-color: #f9fafb;
  padding: 10px 10px;
  overflow-y: auto;
  box-sizing: border-box;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.btnGroup {
  position: fixed;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.3);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2000;
}

.pagpage-wrapper::-webkit-scrollbar {
  display: none;
}

.upload-demo {
  display: flex;
  flex-wrap: wrap;
}

.upload-PDF {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
</style>
