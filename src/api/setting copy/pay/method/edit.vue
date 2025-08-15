<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            title="支付场景"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <el-form-item label="支付场景" prop="name">
                    <div class="flex-1">
                        <el-select style="width: 240px" v-model="formData.sceneId">
                            <el-option
                                :label="item.label"
                                :key="i"
                                :value="item.value"
                                v-for="(item, i) in scenes"
                            />
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="descript">
                    <div class="flex-1">
                        <el-input v-model="formData.descript" placeholder="场景描述" />
                    </div>
                </el-form-item>
                <el-form-item label="支付商家">
                    <el-select
                        style="width: 450px; margin-top: 10px"
                        v-model="formData.pays"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        value-key="id"
                        :reserve-keyword="false"
                        placeholder="请选择支付商家"
                    >
                        <el-option
                            v-for="item in optionsData.pays"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { getPayConfig, getPayConfigLists, savePayScene, setPayConfig } from '@/api/setting/pay'
import Popup from '@/components/popup/index.vue'
import { useDictOptions } from '@/hooks/useDictOptions'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const curScene = ref('')
const scenes = reactive([
    {
        value: 1,
        label: '微信小程序'
    },
    {
        value: 2,
        label: '微信公众号'
    },
    {
        value: 3,
        label: 'H5场景'
    },
    {
        value: 4,
        label: 'PC场景'
    }
])
const formData = reactive({
    id: 0,
    sceneId: '',
    name: '',
    descript: '',
    pays: []
})
const formRules: FormRules = {}
const { optionsData } = useDictOptions<{
    pays: any[]
}>({
    pays: {
        api: getPayConfigLists
    }
})

const open = () => {
    popupRef.value?.open()
}

const handleSubmit = async () => {
    console.log('handleSubmit', formData)
    if (formData.id == 0) {
        const pay = scenes.find((item) => Number(formData.sceneId) == item.value)
        if (pay) {
            formData.name = pay.label
        }
    }
    await formRef.value?.validate()
    await savePayScene(formData)
    feedback.msgSuccess('操作成功')
    popupRef.value?.close()
    emit('success')
}

const setFormData = (data: Record<any, any>) => {}

const getDetail = async (row: Record<string, any>) => {
    const data = await getPayConfig({
        id: row.id
    })
    setFormData(data)
}

const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
