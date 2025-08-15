<template>
 <div class="edit-popup">
  <popup ref="popupRef" title="支付模式编辑" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px" :rules="rules">
          <el-form-item label="ID" prop="keyid">
              <div class="w-80">
                <el-input v-model="formData.keyid" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="标题" prop="title">
              <div class="w-80">
                <el-input v-model="formData.title" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="价格" prop="price">
              <div class="w-80">
                <el-input-number v-model="formData.price" :precision="2" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="图片" prop="cover_image">
              <div>
                <image-upload :isShowTip="false" showTipText="" :limit="1" v-model="formData.image" path="images"></image-upload>
              </div>
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
import { vipPayDetail, vipPaySave } from '@/api/vip/pay'
const rules = reactive({
    keyid: [
        { required: true, message: "请输入支付模式ID", trigger: "blur" },
        { pattern: /^[\-\_\a-\z\A-\Z0-9]+$/, message: "请输入英文/数字/下划线/横线", trigger: "blur" },
    ],
    title: [
        { required: true, message: "请输入支付模式标题", trigger: "blur" },
    ]
});
const emit = defineEmits(['success', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formRef = shallowRef<FormInstance>();
const mode = ref('add');
const formData = reactive(<any>{
    keyid:"",
    title:"",
    price: 0.00,
    image:"",
});

const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}
const handleSubmit = async () => {
    await formRef.value?.validate()
    console.log("handleSubmit formData",formData)
    await vipPaySave(formData)
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
}

defineExpose({
    open,
    setFormData,
})
</script>
