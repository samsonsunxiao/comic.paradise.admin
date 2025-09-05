<template>
  <div class="article-edit">
    <el-card class="!border-none" shadow="never">
      <el-page-header content="文章编辑" @back="handleGoback" />
    </el-card>
    <el-card class="mt-4 !border-none" shadow="never" v-loading="loading">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px">
        <div class="xl:flex">
          <div>
            <el-form-item label="漫画ID" prop="comic_id">
              <div class="w-80">
                <el-input v-model="formData.comic_id" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="漫画标题" prop="title">
              <div class="w-80">
                <el-input v-model="formData.title" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="评分" prop="score">
              <div class="w-80">
                <el-input v-model="formData.score" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="访问数" prop="views">
              <div class="w-80">
                <el-input v-model="formData.views" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="订阅数" prop="subscribes">
              <div class="w-80">
                <el-input v-model="formData.subscribes" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="权重" prop="score">
              <div class="w-80">
                <el-input v-model="formData.weight" placeholder="" clearable disabled />
              </div>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <div class="w-80">
                <el-select class="w-[280px]" v-model="formData.status">
                  <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="标签" prop="tags">
              <el-select class="w-[280px]" v-model="formData.tags" multiple filterable collapse-tags
                collapse-tags-tooltip :max-collapse-tags="4" allow-create default-first-option value-key="id"
                :reserve-keyword="false">
                <el-option v-for="item in tags" :key="item.title" :label="item.title" :value="item.title" />
              </el-select>
            </el-form-item>
            <el-form-item label="封面" prop="cover_image">
              <div>
                <image-contain :src="formData.cover_image" :width="80" :height="65"
                  :preview-src-list="[formData.cover_image]" preview-teleported fit="contain" />
              </div>
            </el-form-item>
            <el-form-item label="轮播banner">
              <div class="flex flex-col">
                <el-switch style="margin-left: 15px;" v-model="formData.is_banner" :active-value="true"
                  :inactive-value="false" />
                <div class="flex flex-row" v-if="formData.is_banner" style="margin-top: 10px;">
                  <image-contain :src="formData.banner_image_url" :width="80" :height="65"
                    v-if="formData.is_banner && formData.banner_image_url && formData.banner_image_url != ''"
                    :preview-src-list="[formData.banner_image_url]" preview-teleported fit="contain" />
                  <el-input class="w-80 h-[40px]" v-model="formData.banner_image_url" placeholder="请输入Banner图片的链接！"
                    @blur="handleBannerImageBlur" clearable
                    v-if="edit_banner || formData.banner_image_url == null || formData.banner_image_url == ''" />
                  <el-button type="primary" link @click="edit_banner = true"
                    v-if="!edit_banner && formData.banner_image_url != null && formData.banner_image_url != ''">修改</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="简介" prop="descript">
              <editor v-model="formData.descript" :height="300" :width="500" />
            </el-form-item>
            <el-form-item label="章节" prop="files">
              <div>
                <el-table :data="formData.chapters" border style="width: 500px">
                  <el-table-column min-width="50">
                    <template #default="scope">
                      {{ scope.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column label="章节" prop="filename" min-width="200">
                    <template #default="{ row }">
                      <span>{{ row.title }} </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" fixed="right">
                    <template #default="{ row }">
                      <el-button type="primary" @click="handlePreview(row)" link>查看</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
    <footer-btns>
      <el-button type="primary" @click="handleSave(formRef)" v-loading="loading">保存</el-button>
    </footer-btns>
    <ChapterDetail v-if="showDetail" ref="detailRef" @close="showDetail = false" />
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { comicDetail, comicSave, getCategoryAll } from "@/api/comic";
import useMultipleTabs from "@/hooks/useMultipleTabs";
import { useDictOptions } from "@/hooks/useDictOptions";
import feedback from "@/utils/feedback";
import dayjs from "dayjs";
import ChapterDetail from './ChapterDetail.vue'
const detailRef = shallowRef<InstanceType<typeof ChapterDetail>>()
const showDetail = ref(false);
const route = useRoute();
const router = useRouter();
const status = reactive([
  {
    value: "online",
    label: "已上架",
  },
  {
    value: "offline",
    label: "未上架",
  },
]);

const { optionsData } = useDictOptions<{
  categories: any[];
}>({
  categories: {
    api: getCategoryAll,
  },
});

const formData = reactive<any>({
  id: 0,
  comic_id: "",
  title: "",
  score: 0.0,
  is_banner: false,
  cover_image: "",
  banner_image_url: "",
  descript: "",
  status: "offline",
  state: 0,
  tags: [],
  subscribes: 0,
  views: 0,
  weight: 0,
  chapters: [],
});
const edit_banner = ref<boolean>(false);
const tags = ref<any[]>([]);
const { removeTab } = useMultipleTabs();
const formRef = shallowRef<FormInstance>();
const mgrFormRef = shallowRef<FormInstance>();
const loading = ref(false);
const rules: FormRules = {
  url: [
    { required: true, message: "请输入源页面链接", trigger: "blur" },
    {
      pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      message: "请输入URL格式",
      trigger: "blur",
    },
  ],
};

const getDetails = async () => {
  const data = await comicDetail({
    comic_id: route.query.comicid,
  });
  Object.keys(formData).forEach((key) => {
    formData[key] = data[key];
  });
  formData.tags = data.tags.map((item: any) => item.title);
  tags.value = data.tags || [];
  formData.is_banner = formData.banner_image_url && formData.banner_image_url != '';
  console.log("getDetails formData", formData);
}
const handleBannerImageBlur = () => {
  console.log("handleBannerImageBlur");
  edit_banner.value = false;
}
const handlePreview = async (row: any) => {
  console.log("handlePreview row", row);
  showDetail.value = true
  await nextTick()
  detailRef.value?.setFormData(formData.comic_id, row.no)
  detailRef.value?.open()
}

const handleGoback = () => {
  console.log("handleGoback");
  removeTab();
  router.back();
};

const handleSave = (formEl: FormInstance | undefined) => {
  console.log("handleSave formEl", formEl);
  if (!formEl) return;
  loading.value = true;
  formRef.value?.validate((valid: Boolean) => {
    if (valid) {
      let postFormdata = Object.assign({}, formData);
      //章节，封面不提交
      delete postFormdata.chapters;
      delete postFormdata.cover_image;
      if (postFormdata.is_banner == false) {
        postFormdata.banner_image_url = "";
      }
      delete postFormdata.is_banner;
      console.log("handleSave postFormdata ", postFormdata);
      comicSave(postFormdata)
        .then((res: any) => {
          loading.value = false;
          console.log("handleSave comicSave", res);
          feedback.msgSuccess("保存成功");
          removeTab();
          router.back();
        })
        .catch(function (err: any) {
          loading.value = false;
        });
    } else {
      feedback.msgError("保存失败");
      loading.value = false;
    }
  });
};

route.query.comicid && getDetails();
</script>
