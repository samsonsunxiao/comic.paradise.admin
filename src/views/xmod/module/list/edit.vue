<template>
 <div class="edit-popup">
  <popup ref="popupRef" title="模块编辑" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px" :rules="rules">
          <el-form-item label="模块ID" prop="moduleid">
              <div class="w-80">
                <el-input v-model="formData.moduleid" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="模块标题" prop="name">
              <div class="w-80">
                <el-input v-model="formData.name" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="添加游戏"  prop="files">
              <el-select style="width: 450px;margin-top: 10px;" v-model="formData.games" multiple filterable allow-create
                default-first-option value-key="id" :reserve-keyword="false" placeholder="请选择游戏">
                <el-option v-for="item in optionsData.gameName" :key="item.gid" :label="item.name" :value="item.gid" />
            </el-select>
          </el-form-item>
      </el-form>
  </popup>
 </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import feedback from "@/utils/feedback";
import Popup from '@/components/popup/index.vue'
import { getRoutePath } from '@/router'
import { useDictOptions } from "@/hooks/useDictOptions";
import { getGameAll } from '@/api/game'
import { moduleDetail,moduleSave } from '@/api/module'
const rules = reactive({
  moduleid: [
        { required: true, message: "请输入模块ID", trigger: "blur" },
        { pattern: /^[A-Za-z0-9]+$/, message: "请输入英文/数字", trigger: "blur" },
    ],
    name: [
        { required: true, message: "请输入模块标题", trigger: "blur" },
    ]
});
const emit = defineEmits(['success', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formRef = shallowRef<FormInstance>();
const mode = ref('add');
const formData = reactive(<any>{
    moduleid:"",
    name:"",
    games:<any>[]
});

const { optionsData } = useDictOptions<{
    gameName: any[],
}>({
    gameName: {
        api: getGameAll,
        params: {status: "online"}
    },
   
})
const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}
const handleSubmit = async () => {
    await formRef.value?.validate()
    console.log("handleSubmit formData",formData)
    await moduleSave(formData)
    popupRef.value?.close()
    feedback.msgSuccess('操作成功')
    emit('success')
}
const handleClose = () => {
    emit('close')
}
const setFormData = async (row: any) => {
    for (const key in formData) {
        if (row[key] != null && row[key] != undefined) {
            //@ts-ignore
            formData[key] = row[key]
        }
    }
    console.log("setFormData",formData)
    moduleDetail({moduleid:row.moduleid}).then((res: any) => {
        console.log("moduleDetail",res)
        formData.games = res.games.map((item: any) => item.gid);
    })
}

defineExpose({
    open,
    setFormData,
})
</script>
