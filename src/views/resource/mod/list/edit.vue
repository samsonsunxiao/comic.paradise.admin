<template>
  <div class="article-edit">
    <el-card class="!border-none" shadow="never">
      <el-page-header content="文章编辑" @back="$router.back()" />
    </el-card>
    <el-card class="mt-4 !border-none" shadow="never" v-loading="loading">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px">
        <div class="xl:flex">
          <div>
            <el-form-item label="MOD标题" prop="title">
              <div class="w-80">
                <el-input v-model="formData.title" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="MOD来源" prop="platform">
              <div class="w-80">
                <el-input v-model="formData.platform" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="源详情链接" prop="detailurl">
              <div class="w-80">
                <el-input v-model="formData.detailUrl" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="游戏" prop="game">
              <!-- <div class="w-80">
                <el-input v-model="formData.game" placeholder="" clearable />
              </div> -->
              <el-select style="width: 240px" v-model="formData.gid">
                <el-option
                  v-for="item in optionsData.gameName"
                  :key="item.gid"
                  :label="item.name"
                  :value="item.gid"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发布日期" prop="date">
              <div class="w-80">
                <el-date-picker
                  v-model="formData.date"
                  type="datetime"
                  placeholder="请选择自定义上架日期和时间"
                />
              </div>
            </el-form-item>
            <el-form-item label="状态" prop="title">
              <div class="w-80">
                <el-select class="w-[280px]" v-model="formData.status">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="图片列表" prop="files">
              <div>
                <el-table :data="formData.images" border style="width: 600px">
                  <el-table-column label="文件名" prop="filename" min-width="200">
                    <template #default="{ row }">
                      <span>{{ getFileName(row.keyuri) }} </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="预览图" prop="size" min-width="200">
                    <template #default="{ row }">
                      <image-contain
                        :src="row.url"
                        :width="60"
                        :height="45"
                        :preview-src-list="[row.url]"
                        preview-teleported
                        fit="contain"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" prop="status" min-width="100">
                    <template #default="{ row }">
                      {{
                        row.status == "online"
                          ? "已上线"
                          : row.status == "upload"
                          ? "上传中"
                          : row.status == "local"
                          ? row.percent + "%"
                          : "未上线"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="scope">
                      <el-button type="danger" link @click="handleDelImage(scope.$index)">
                        删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  style="
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-top: 10px;
                  "
                >
                  <el-upload
                    action="#"
                    :auto-upload="true"
                    :show-file-list="false"
                    :before-upload="handleBeforeUploadImage"
                    :limit="1"
                  >
                    <template #trigger>
                      <el-button type="primary" :disabled="formData.gid === ''"
                        >添加</el-button
                      >
                    </template>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="文件列表" prop="files" v-if="newMod == false">
              <div>
                <el-table :data="formData.files" border style="width: 500px">
                  <el-table-column label="文件名" prop="url" min-width="200">
                    <template #default="{ row }">
                      <a :href="row.url" v-if="row.keyuri != ''"
                        >{{ getFileName(row.url) }}
                      </a>
                    </template>
                  </el-table-column>
                  <el-table-column label="大小" prop="size" min-width="100">
                    <template #default="{ row }">
                      {{
                        row.size == -1 || row.size == null
                          ? "正在获取大小..."
                          : formatSizeUnits(row.size)
                      }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
            <el-form-item label="前置包" prop="managers" v-if="newMod == false">
              <div>
                <el-table :data="formData.managers" border style="width: 500px">
                  <el-table-column label="文件名" prop="filename" min-width="200">
                    <template #default="{ row }">
                      <a :href="row.package_url">{{ getFileName(row.package_url) }} </a>
                    </template>
                  </el-table-column>
                  <el-table-column label="大小" prop="size" min-width="100">
                    <template #default="{ row }">
                      {{ formatSizeUnits(row.size) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" prop="size" min-width="200">
                    <template #default="{ row }">
                      {{ row.descript }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-form-item>
            <el-form-item label="最终合成包" prop="combin">
              <template #default="{}">
                <el-upload
                  action="#"
                  :auto-upload="true"
                  :show-file-list="false"
                  :before-upload="handleBeforeUploadPackage"
                  :limit="1"
                  v-if="
                    (combinData.status == 'local' || combinData.status == 'online') &&
                    combinData.percent < 100
                  "
                >
                  <template #trigger>
                    <el-button type="primary">浏览</el-button>
                  </template>
                </el-upload>
                <el-progress
                  style="width: 200px"
                  :percentage="combinData.percent"
                  v-else-if="combinData.status == 'upload'"
                />
                <div
                  style="display: flex; flex-direction: row; align-items: center"
                  v-else-if="combinData.percent >= 100 || combinData.status == 'online'"
                >
                  <el-link type="primary" :href="combinData.url">{{
                    combinData.filename
                  }}</el-link>
                  <div
                    style="color: #979797; font-size: 22px; flex: none; cursor: pointer"
                    @click="handleCombinClose"
                  >
                    &times;
                  </div>
                </div>
              </template>
            </el-form-item>
            <el-form-item label="简介" prop="descript" v-if="formData.gid != ''">
              <editor
                v-model="formData.descript"
                :height="700"
                :width="800"
                :path="formData.gid + '/mods/' + formData.modid + '/images'"
              />
            </el-form-item>
            <el-form-item label="安装描述" required prop="installdesc">
              <editor
                v-model="formData.installdesc"
                :height="700"
                :width="800"
                :path="formData.gid + '/mods/' + formData.modid + '/images'"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
    <footer-btns>
      <el-button type="primary" @click="handleGoback()">返回</el-button>
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
    </footer-btns>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { modDetail, modSave, getFileSize } from "@/api/xmods";
import { getGameAll } from "@/api/game";
import { formatSizeUnits, generateUniqueNumber } from "@/utils/util";
import useMultipleTabs from "@/hooks/useMultipleTabs";
import { useDictOptions } from "@/hooks/useDictOptions";
import { getAliyunSts } from "@/api/aliyun";
import OSS from "ali-oss";
import feedback from "@/utils/feedback";
import dayjs from "dayjs";

const status = reactive([
  {
    value: "online",
    label: "已上架",
  },
  {
    value: "offline",
    label: "未上架",
  },
  {
    value: "delete",
    label: "已删除",
  },
]);
const formRef = shallowRef<FormInstance>();
const route = useRoute();
const router = useRouter();
const formData = reactive<any>({
  id: 0,
  title: "",
  modid: "",
  gid: "",
  name: "",
  platform: "",
  files: <any>[],
  images: <any>[],
  managers: <any>[],
  combinPackage: <any>null,
  descript: "",
  installdesc: "",
  detailUrl: "",
  date: "",
  status: "",
});
const combinSet = () => {
  return {
    filename: "",
    keyuri: "",
    url: "",
    size: 0,
    percent: 0,
    status: "local",
  };
};
const getTimestampLast6 = () => {
  const timestamp = Date.now(); // 获取当前时间戳（精确到毫秒）
  return timestamp.toString().slice(-6); // 获取时间戳末尾6位
};
const newMod = ref(route.query.modid == null || route.query.modid == "");
const modid = ref(route.query.modid || "MN" + getTimestampLast6());
console.log("modid", modid.value);
const combinData = ref<any>(combinSet());
const { removeTab } = useMultipleTabs();
const loading = ref(false);
const getFileName = (url: string) => {
  if (url == "" || url == null) {
    return "";
  }
  const regex = /.*\/([^\/]+)$/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return "";
};

const getDetails = async () => {
  const data = await modDetail({
    modid: route.query.modid,
  });
  Object.keys(formData).forEach((key) => {
    formData[key] = data[key];
  });
  if (formData.srcId == 0) {
    formData.srcId = Number(generateUniqueNumber());
  }
  if (formData.combinPackage == null) {
    formData.combinPackage = combinSet();
  }
  combinData.value = formData.combinPackage;
  console.log("getDetails formData", formData);
};

const handleBeforeUploadImage = (file: any) => {
  console.log("handleBeforeUploadImage formData.game", formData.gid);
  if (formData.gid == "") {
    feedback.msgError("请选择游戏");
    return false;
  }
  let fileName = "image_" + Date.now() + "." + file.name.split(".").pop();
  let fileinfo = {
    keyuri: "resources/" + formData.gid + "/mods/" + modid.value + "/images/" + fileName,
    url: URL.createObjectURL(file),
    status: "local",
    uid: modid.value,
    percent: 0,
  };
  console.log("handleBeforeUploadImage fileinfo", fileinfo);
  formData.images.push(fileinfo);
  getAliyunSts()
    .then((res) => {
      console.log("handleBeforeUploadImage getAliyunSts", res);
      const ossClient = new OSS({
        region: res.region,
        stsToken: res.SecurityToken,
        accessKeyId: res.AccessKeyId,
        accessKeySecret: res.AccessKeySecret,
        bucket: res.bucket,
      });
      console.log("handleBeforeUploadImage filePath", fileinfo.keyuri);
      ossClient
        .multipartUpload(fileinfo.keyuri, file, {
          progress: function (percentage: any) {
            let percent = Math.ceil(percentage * 100);
            let index = formData.images.findIndex(
              (item: any) => item.keyuri == fileinfo.keyuri
            );
            if (index != -1 && formData.images[index].percent < percent) {
              formData.images[index].percent = percent;
            }
          },
        })
        .then(function (result: any) {
          console.log("upload file ok result", result);
          let index = formData.images.findIndex(
            (item: any) => item.keyuri == fileinfo.keyuri
          );
          let url = res.cdn + "/" + result.name;
          if (index != -1) {
            formData.images[index].url = url;
            formData.images[index].keyuri = result.name;
          }
        })
        .catch(function (err: any) {
          // 上传失败,弹出上传失败的消息
          console.log("upload file faild err", err);
          feedback.msgError("上传失败，请检测！");
          let index = formData.images.findIndex(
            (item: any) => item.keyuri == fileinfo.keyuri
          );
          formData.images.splice(index, 1);
        });
    })
    .catch(function (err: any) {
      let index = formData.images.findIndex(
        (item: any) => item.keyuri == fileinfo.keyuri
      );
      formData.images.splice(index, 1);
    });
  return false;
};

const handleBeforeUploadPackage = (file: any) => {
  combinData.value.filename = file.name;
  (combinData.value.size = file.size),
    (combinData.value.keyuri = "resources/" + formData.gid + "/package/" + file.name);
  combinData.value.url = URL.createObjectURL(file);
  combinData.value.status = "upload";
  combinData.value.percent = 0;
  getAliyunSts()
    .then((res) => {
      console.log("handleBeforeUpload getAliyunSts", res);
      const ossClient = new OSS({
        region: res.region,
        stsToken: res.SecurityToken,
        accessKeyId: res.AccessKeyId,
        accessKeySecret: res.AccessKeySecret,
        bucket: res.bucket,
      });
      console.log("handleBeforeUploadPackage filePath", combinData.value.keyuri);
      ossClient
        .multipartUpload(combinData.value.keyuri, file, {
          progress: function (percentage: any) {
            let percent = Math.ceil(percentage * 100);
            if (combinData.value.percent < percent) {
              combinData.value.percent = percent;
            }
          },
        })
        .then(function (result: any) {
          let url = res.cdn + "/" + result.name;
          combinData.value.url = url;
          combinData.value.keyuri = result.name;
          combinData.value.status = "local";
          console.log("upload file ok result", combinData.value);
        })
        .catch(function (err: any) {
          // 上传失败,弹出上传失败的消息
          console.log("upload file faild err", err);
          feedback.msgError("上传失败，请检测！");
          combinData.value = combinSet();
          combinData.value.status = "local";
        });
    })
    .catch(function (err: any) {
      combinData.value = combinSet();
      combinData.value.status = "local";
    });
  return false;
};

const handleCombinClose = () => {
  combinData.value = combinSet();
};

const handleGoback = () => {
  console.log("handleGoback");
  if (combinData.value.status == "upload") {
    feedback.msgError("正在上传组合包，请稍后");
    return;
  }
  removeTab();
  router.back();
};

const handleDelImage = (i: number) => {
  console.log("handleDelFile i", i);
  formData.images.splice(i, 1);
};

const handleDelFile = (i: number) => {
  console.log("handleDelFile i", i);
  formData.files.splice(i, 1);
};

const handleSave = (formEl: FormInstance | undefined) => {
  console.log("handleSave formEl", formEl);
  if (!formEl) return;
  loading.value = true;
  formRef.value?.validate((valid: Boolean) => {
    if (valid) {
      if (combinData.value.status == "upload") {
        feedback.msgError("正在上传组合包，请稍后");
        return;
      }
      if (formData.date != null && formData.date != "") {
        formData.date = dayjs(formData.date).format("YYYY-MM-DD HH:mm:ss");
      } else {
        formData.date = "";
      }
      if (formData.gid != "") {
        let game = optionsData.gameName.find((item) => item.gid == formData.gid);
        if (game != null) {
          formData.game = game.name;
        }
      }
      formData.modid = modid.value;
      let postFormdata = Object.assign({}, formData);
      let postCombindata = Object.assign({}, combinData.value);
      delete postCombindata.percent;
      postFormdata.combinPackage = postCombindata;
      console.log("handleSave postFormdata ", postFormdata);
      modSave(postFormdata)
        .then((res: any) => {
          loading.value = false;
          console.log("handleSave modAdd", res);
          feedback.msgSuccess("操作成功");
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

onBeforeUnmount(() => {});
const { optionsData } = useDictOptions<{
  gameName: any[];
  params: any;
}>({
  gameName: {
    api: getGameAll,
    params: { status: "" },
  },
});
route.query.modid && getDetails();
</script>
