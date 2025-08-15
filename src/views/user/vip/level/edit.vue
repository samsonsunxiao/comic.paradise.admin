<template>
 <div class="edit-popup">
  <popup ref="popupRef" title="等级编辑" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
      <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px" :rules="rules">
          <el-form-item label="等级ID" prop="name" label-width="100px">
              <div class="w-80">
                <el-input v-model="formData.name" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="标题" prop="title" label-width="100px">
              <div class="w-80">
                <el-input v-model="formData.title" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="数值" prop="title" label-width="100px">
              <div class="w-80">
                <el-input v-model="formData.value" placeholder="" clearable />
              </div>
          </el-form-item>
          <el-form-item label="添加权益"  prop="rights" label-width="100px">
            <div class="w-80">
                <el-select v-model="formData.rights" multiple filterable allow-create
                    default-first-option value-key="keyid" :reserve-keyword="false" placeholder="请选择权益">
                    <el-option v-for="item in rightsData.rights" :key="item.keyid" :label="item.descript" :value="item.keyid" />
                </el-select>
            </div>
          </el-form-item>
          <el-form-item label="添加支付模式"  prop="pays" label-width="100px">
            <div class="w-80">
                <el-select v-model="formData.pays" multiple filterable allow-create
                    default-first-option value-key="keyid" :reserve-keyword="false" placeholder="请选择支付模式">
                    <el-option v-for="item in payData.pays" :key="item.keyid" :label="item.title" :value="item.keyid" />
                </el-select>
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
import { useDictOptions } from "@/hooks/useDictOptions";
import { vipLevelDetail, vipLevelSave } from '@/api/vip/level'
import { vipRightsAll } from '@/api/vip/rights'
import { vipPayAll } from '@/api/vip/pay'
const rules = reactive({
    name: [
        { required: true, message: "请输入等级ID", trigger: "blur" },
        { pattern: /^[\-\_\a-\z\A-\Z0-9]+$/, message: "请输入英文/数字/下划线/横线", trigger: "blur" },
    ],
    title: [
        { required: true, message: "请输入等级标题", trigger: "blur" },
    ]
});
const emit = defineEmits(['success', 'close'])
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formRef = shallowRef<FormInstance>();
const mode = ref('add');
const formData = reactive(<any>{
    name:"",
    title:"",
    value:0,
    rights:<any>[],
    pays:<any>[],
});

const { optionsData: rightsData } = useDictOptions<{
    rights: any[],
}>({
    rights: {
        api: vipRightsAll,
    },
});

const { optionsData: payData } = useDictOptions<{
    pays: any[],
}>({
    pays: {
        api: vipPayAll,
    },
});
const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}
const handleSubmit = async () => {
    await formRef.value?.validate()
    console.log("handleSubmit formData",formData)
    await vipLevelSave(formData)
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
    vipLevelDetail({name:row.name}).then((res: any) => {
        console.log("vipLevelDetail res",res,payData.pays);
        formData.rights = res.rights.map((item:any)=>item.keyid);
        formData.pays = res.pays.map((item:any)=>item.keyid);
        console.log("vipLevelDetail",formData.rights,formData.pays)
    })
}

defineExpose({
    open,
    setFormData,
})
</script>
