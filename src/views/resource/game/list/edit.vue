<template>
  <div class="article-edit">
    <el-card class="!border-none" shadow="never">
      <el-page-header content="文章编辑" @back="$router.back()" />
    </el-card>
    <el-card class="mt-4 !border-none" shadow="never" v-loading="loading">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px">
        <div class="xl:flex">
          <div>
            <el-form-item label="游戏ID" prop="title">
              <div class="w-80">
                <el-input v-model="formData.gid" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="游戏名" prop="title">
              <div class="w-80">
                <el-input v-model="formData.name" placeholder="" clearable />
              </div>
            </el-form-item>
            <el-form-item label="评分" prop="title">
              <div class="w-80">
                <el-input v-model="formData.score" placeholder="" clearable />
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
            <el-form-item
              label="上架时间"
              prop="online"
              v-if="formData.status == 'online'"
            >
              <div class="w-80">
                <el-date-picker
                  v-model="formData.onlineTime"
                  type="datetime"
                  placeholder="请选择自定义上架日期和时间"
                />
              </div>
            </el-form-item>
            <el-form-item label="游戏链接" prop="detailurl">
              <div class="w-80">
                <el-input v-model="formData.detailUrl" placeholder="" clearable />
                <!-- <el-link type="primary" :href="formData.detailUrl" :underline="false" target="_blank">{{ formData.detailUrl }}</el-link> -->
              </div>
            </el-form-item>
            <el-form-item label="封面" prop="cover_image">
              <div>
                <image-upload
                  :isShowTip="false"
                  showTipText=""
                  :limit="1"
                  v-model="formData.coverImage"
                  :path="formData.gid + '/images'"
                ></image-upload>
              </div>
            </el-form-item>
            <el-form-item label="归属模块" prop="files">
              <el-select
                style="width: 450px; margin-top: 10px"
                v-model="formData.modules"
                multiple
                filterable
                allow-create
                default-first-option
                value-key="id"
                :reserve-keyword="false"
                placeholder="请选择模块"
              >
                <el-option
                  v-for="item in optionsData.modules"
                  :key="item.moduleid"
                  :label="item.name"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="前置修改器" prop="files">
              <div>
                <el-table :data="formData.managers" border style="width: 900px">
                  <el-table-column label="文件名" prop="filename" min-width="150">
                    <template #default="{ row }">
                      <el-link
                        type="primary"
                        :href="row.package_url"
                        :underline="false"
                        target="_blank"
                        >{{ row.filename }}</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="页面链接" prop="url" min-width="300">
                    <template #default="{ row }">
                      <el-link
                        type="primary"
                        :href="row.url"
                        :underline="false"
                        target="_blank"
                        >{{ row.url }}</el-link
                      >
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" prop="descript" min-width="200" />
                  <el-table-column label="大小" prop="size" min-width="100">
                    <template #default="{ row }">
                      {{ formatSizeUnits(row.size) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="scope">
                      <div v-if="scope.row.status == 'online'">
                        <el-button link @click="handleEditManager(scope.$index)">
                          编辑
                        </el-button>
                        <el-button
                          type="danger"
                          link
                          @click="handleDelManager(scope.$index)"
                        >
                          删除
                        </el-button>
                      </div>
                      <span v-else-if="scope.row.status == 'upload'"
                        >上传中({{ scope.row.percent }} %)</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <el-button
                  style="margin-top: 10px"
                  @click="handleAddManager"
                  type="primary"
                  >添加</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="图片列表" prop="files">
              <div>
                <el-table :data="formData.images" border style="width: 800px">
                  <el-table-column min-width="50">
                    <template #default="scope">
                      {{ scope.$index + 1 }}
                    </template>
                  </el-table-column>
                  <el-table-column label="文件名" prop="filename" min-width="200">
                    <template #default="{ row }">
                      <span v-if="row.status != 'local'">{{ getFileName(row.url) }}</span>
                      <span v-else>{{ row.filename }} </span>
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
                      <el-button
                        type="danger"
                        link
                        @click="handleDelFile(scope.$index)"
                        v-if="scope.row.status != 'uploading'"
                      >
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
                    :before-upload="handleBeforeUpload"
                    :limit="1"
                  >
                    <template #trigger>
                      <el-button type="primary">添加</el-button>
                    </template>
                  </el-upload>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="Banner广告语" prop="banner">
              <editor
                v-model="formData.banner"
                :height="500"
                :width="800"
                :path="formData.gid + '/images'"
              />
            </el-form-item>
            <el-form-item label="简介" prop="descript">
              <editor
                v-model="formData.descript"
                :height="700"
                :width="800"
                :path="formData.gid + '/images'"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-card>
    <footer-btns>
      <el-button type="primary" @click="handleSave(formRef)" v-loading="loading"
        >保存</el-button
      >
    </footer-btns>
  </div>
  <el-dialog v-model="showManagerDlg" title="添加游戏MOD前置修改器" width="500">
    <el-form ref="mgrFormRef" :model="managerData" :rules="rules">
      <el-form-item label="源页面链接:" label-width="120px" prop="url">
        <el-input v-model="managerData.url" style="width: 300px" />
      </el-form-item>
      <el-form-item label="描述:" label-width="120px" prop="descript">
        <el-input
          :rows="5"
          type="textarea"
          v-model="managerData.descript"
          style="width: 300px"
        />
      </el-form-item>
      <template v-if="managerData.size > 0">
        <el-form-item label="文件名:" label-width="120px">
          <span>{{ managerData.filename }}</span>
          <el-button type="primary" link @click="handleResetPackge">重置</el-button>
        </el-form-item>
        <el-form-item label="包大小:" label-width="120px">
          <span>{{ formatSizeUnits(managerData.size) }}</span>
        </el-form-item>
      </template>
      <el-form-item label="上传修改器包" label-width="120px" prop="package" v-else>
        <el-upload
          action="#"
          :auto-upload="true"
          :show-file-list="false"
          :before-upload="handleBeforeUploadPackage"
          :limit="1"
        >
          <template #trigger>
            <el-button type="primary">浏览</el-button>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleManagerCancel">取消</el-button>
        <el-button
          type="primary"
          v-loading="confirming"
          @click="handleManagerOk(mgrFormRef)"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from "element-plus";
import { gameDetail, gameSave, gameCheckFileObjectExisted } from "@/api/game";
import { moduleAll } from "@/api/module";
import useMultipleTabs from "@/hooks/useMultipleTabs";
import { useDictOptions } from "@/hooks/useDictOptions";
import { formatSizeUnits } from "@/utils/util";
import { getAliyunSts } from "@/api/aliyun";
import feedback from "@/utils/feedback";
import OSS from "ali-oss";
import dayjs from "dayjs";

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
  {
    value: "delete",
    label: "已删除",
  },
]);

const { optionsData } = useDictOptions<{
  modules: any[];
}>({
  modules: {
    api: moduleAll,
  },
});

const formData = reactive<any>({
  id: 0,
  gid: "",
  name: "",
  banner: "",
  score: 0.0,
  coverImage: "",
  images: [] as any[],
  managers: [] as any[],
  descript: "",
  status: "offline",
  modules: [] as any[],
  detailUrl: "",
  onlineTime: ""
});

const ossdata = ref<any>();
const managerSet = () => {
  return {
    id: -1,
    filename: "",
    keyuri: "",
    package_url: "",
    url: "",
    descript: "",
    file: <any>null,
    size: 0,
    percent: 0,
    status: "online",
  };
};
const managerData = ref<any>(managerSet());
const showManagerDlg = ref(false);
const confirming = ref(false);
const { removeTab } = useMultipleTabs();
const formRef = shallowRef<FormInstance>();
const mgrFormRef = shallowRef<FormInstance>();
const loading = ref(false);
const filesValidator = (rule: object, value: string, callback: any) => {
  console.log("filesValidator", formData.files);
  if (managerData.value.file == null) {
    callback(new Error("请上传文件"));
    return;
  }
  callback();
};
const rules: FormRules = {
  url: [
    { required: true, message: "请输入源页面链接", trigger: "blur" },
    {
      pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      message: "请输入URL格式",
      trigger: "blur",
    },
  ],
  package: [
    {
      validator: filesValidator,
      trigger: "blur",
    },
  ] as any[],
};

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
  const data = await gameDetail({
    gid: route.query.gid,
  });
  Object.keys(formData).forEach((key) => {
    formData[key] = data[key];
  });

  if (formData.managers == null) {
    formData.managers = [];
  }
  if (formData.onlineTime == null) {
    formData.onlineTime = "";
  }
  if (formData.banner == null) {
    formData.banner = "";
  }
  console.log("getDetails formData", formData);
};
const uploadManagerPackage = async (packageMgr: any) => {
  let keyuri = packageMgr.keyuri;
  console.log("uploadManagerPackage keyuri", keyuri);
  let index = formData.managers.findIndex((item: any) => item.keyuri == keyuri);
  if (index == -1) {
    console.log("uploadManagerPackage cannot find keyuri index");
    return;
  }
  formData.managers[index].status = "upload";
  let fileCheck: any = null;
  try {
    let checkres = await gameCheckFileObjectExisted(keyuri);
    console.log("uploadManagerPackage keyuri checkres", checkres);
    fileCheck = checkres;
  } catch (error: any) {
    throw new Error(`Error gameCheckFileObjectExisted failed" ${error.message}`);
  }
  if (fileCheck == null) {
    return;
  }
  if (fileCheck.existed == false) {
    formData.managers[index].percent = 1;
    //const res = await frontcontentSts();
    console.log("uploadManagerPackage frontcontentSts", fileCheck.oss);
    const ossClient = new OSS({
      region: fileCheck.oss.region,
      stsToken: fileCheck.oss.SecurityToken,
      accessKeyId: fileCheck.oss.AccessKeyId,
      accessKeySecret: fileCheck.oss.AccessKeySecret,
      bucket: fileCheck.oss.bucket,
    });
    //校验keyuri是否存在了。存在直接赋值返回
    ossClient
      .multipartUpload(keyuri, packageMgr.file, {
        progress: function (percentage: any) {
          let percent = Math.ceil(percentage * 100);
          let index = formData.managers.findIndex((item: any) => item.keyuri == keyuri);
          if (index != -1 && formData.managers[index].percent < percent) {
            formData.managers[index].percent = percent;
          }
        },
      })
      .then(function (result: any) {
        console.log("upload file ok result", result);
        let index = formData.managers.findIndex((item: any) => item.keyuri == keyuri);
        let url = fileCheck.oss.cdn + "/" + result.name;
        if (index != -1) {
          formData.managers[index].package_url = url;
          formData.managers[index].keyuri = result.name;
          formData.managers[index].status = "online";
        }
        console.log("formData.managers", formData.managers);
      })
      .catch(function (err: any) {
        // 上传失败,弹出上传失败的消息
        console.log("upload file faild err", err);
        feedback.msgError("上传失败，请检测！");
        let index = formData.managers.findIndex((item: any) => item.keyuri == keyuri);
        formData.managers.splice(index, 1);
      });
  } else {
    let index = formData.managers.findIndex((item: any) => item.keyuri == keyuri);
    let url = fileCheck.oss.cdn + "/" + packageMgr.keyuri;
    if (index != -1) {
      formData.managers[index].percent = 100;
      formData.managers[index].package_url = url;
      formData.managers[index].status = "online";
    }
  }
};
const handleAddManager = () => {
  showManagerDlg.value = true;
  managerData.value = managerSet();
};
const handleManagerCancel = () => {
  showManagerDlg.value = false;
  managerData.value = managerSet();
  confirming.value = false;
};
const handleManagerOk = (formEl: FormInstance | undefined) => {
  console.log("handleManagerOk", managerData.value);
  if (!formEl) return;
  confirming.value = true;
  formEl
    .validate((valid: Boolean) => {
      if (valid) {
        let newManager = Object.assign({}, managerData.value);
        //上传前置包
        console.log("handleManagerOk newManager", newManager);
        if (newManager.id >= 0 && newManager.id < formData.managers.length) {
          formData.managers[newManager.id] = newManager;
          uploadManagerPackage(newManager);
        } else {
          let index = formData.managers.findIndex(
            (item: any) => item.keyuri == newManager.keyuri
          );
          if (index == -1) {
            formData.managers.push({ ...newManager, id: formData.managers.length });
            uploadManagerPackage(newManager);
          } else {
            feedback.msgError("包已存在，请勿重复上传");
          }
        }
        showManagerDlg.value = false;
      }
      confirming.value = false;
    })
    .catch(() => {
      confirming.value = false;
    });
};
const handleBeforeUploadPackage = (file: any) => {
  managerData.value.size = file.size;
  managerData.value.file = file;
  managerData.value.filename = file.name;
  managerData.value.keyuri =
    "resources/" + formData.gid + "/package/" + managerData.value.filename;
  return false;
};

const handleResetPackge = () => {
  managerData.value.size = 0;
  managerData.value.filename = "";
  managerData.value.keyuri = "";
  managerData.value.file = null;
};

const handleBeforeUpload = (file: any) => {
  let fileinfo = {
    filename: file.name,
    size: file.size,
    keyuri: "resources/" + formData.gid + "/images/" + file.name,
    url: URL.createObjectURL(file),
    status: "local",
    uid: formData.gid,
    percent: 0,
  };
  formData.images.push(fileinfo);
  getAliyunSts()
    .then((res) => {
      console.log("handleBeforeUpload getAliyunSts", res);
      ossdata.value = res;
      const ossClient = new OSS({
        region: ossdata.value.region,
        stsToken: ossdata.value.SecurityToken,
        accessKeyId: ossdata.value.AccessKeyId,
        accessKeySecret: ossdata.value.AccessKeySecret,
        bucket: ossdata.value.bucket,
      });
      console.log("handleUploadFile filePath", fileinfo.keyuri);
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
          let url = ossdata.value.cdn + "/" + result.name;
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

const handleDelFile = (i: number) => {
  console.log("handleDelFile i", i);
  formData.images.splice(i, 1);
};
const handleDelManager = (i: number) => {
  console.log("handleDelManagerFile i", i);
  formData.managers.splice(i, 1);
};

const handleEditManager = (i: number) => {
  console.log("handleEditManager i", i);
  managerData.value = Object.assign({}, formData.managers[i]);
  console.log("handleEditManager managerData", managerData.value);
  showManagerDlg.value = true;
};
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
      formData.modules = formData.modules.map((item: any) => item.moduleid);
      console.log("handleSave onlineTime ", formData.onlineTime);
      if (formData.onlineTime != null && formData.onlineTime != "") {
        formData.onlineTime = dayjs(formData.onlineTime).format("YYYY-MM-DD HH:mm:ss");
      } else {
        formData.onlineTime = "";
      }
      let postFormdata = Object.assign({}, formData);
      postFormdata.managers.forEach((manager: any) => {
        delete manager.status;
        delete manager.percent;
        delete manager.file;
        delete manager.id;
      });
      postFormdata.images.forEach((image: any) => {
        delete image.percent;
      });
      console.log("handleSave postFormdata ", postFormdata);
      gameSave(postFormdata)
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

route.query.gid && getDetails();
</script>
