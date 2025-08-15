<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="84px" :rules="formRules">
                <el-form-item label="支付方式">
                    <el-select style="width: 240px" v-model="formData.way" v-if="formData.id == 0">
                        <el-option
                            :label="pay.label"
                            :key="i"
                            :value="pay.value"
                            v-for="(pay, i) in payWays"
                        />
                    </el-select>
                    <el-radio :label="formData.name" :model-value="formData.name" v-else />
                </el-form-item>
                <!-- <el-form-item label="显示名称" prop="showName">
                    <el-input v-model="formData.showName" placeholder="请输入显示名称" />
                </el-form-item> -->
                <el-form-item label="显示图标" prop="icon">
                    <div>
                        <material-picker :limit="1" :disabled="false" v-model="formData.icon" />
                        <span class="form-tips">建议尺寸：200*200px</span>
                    </div>
                </el-form-item>
                <template v-if="formData.way == PayWayEnum.WECHAT">
                    <el-form-item prop="params.interface_version" label="微信支付接口版本">
                        <div>
                            <el-radio-group v-model="formData.params.interface_version">
                                <el-radio label="v3"></el-radio>
                            </el-radio-group>
                            <div class="form-tips">暂时只支持V3版本</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商户类型" prop="params.merchant_type">
                        <div>
                            <el-radio-group v-model="formData.params.merchant_type">
                                <el-radio label="ordinary_merchant">普通商户</el-radio>
                            </el-radio-group>
                            <div class="form-tips">
                                暂时只支持普通商户类型，服务商户类型模式暂不支持
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="微信支付商户号" prop="params.mch_id">
                        <div class="flex-1">
                            <el-input
                                v-model="formData.params.mch_id"
                                placeholder="请输入微信支付商户号"
                            />
                            <div class="form-tips">微信支付商户号（MCHID）</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商户API密钥" prop="params.pay_sign_key">
                        <el-input
                            v-model="formData.params.pay_sign_key"
                            placeholder="请输入微信支付商户API密钥"
                        />
                        <span class="form-tips">微信支付商户API密钥（paySignKey）</span>
                    </el-form-item>

                    <el-form-item label="微信支付证书" prop="params.private_cert">
                        <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.params.private_cert"
                            placeholder="请输入微信支付证书"
                        />

                        <span class="form-tips">
                            微信支付证书（apiclient_cert.pem），前往微信商家平台生成并黏贴至此处
                        </span>
                    </el-form-item>

                    <el-form-item label="微信支付证书密钥" prop="params.private_key">
                        <el-input
                            type="textarea"
                            :rows="3"
                            v-model="formData.params.private_key"
                            placeholder="请输入微信支付证书密钥"
                        />
                        <span class="form-tips">
                            微信支付证书密钥（apiclient_key.pem），前往微信商家平台生成并黏贴至此处
                        </span>
                    </el-form-item>
                </template>
                <template v-if="formData.way == PayWayEnum.ALIPAY">
                    <el-form-item label="环境" prop="params.mode">
                        <div>
                            <el-radio-group v-model="formData.params.mode">
                                <el-radio label="online_mode">线上环境</el-radio>
                                <el-radio label="sandbox_mode">沙箱环境</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="商户名称" prop="params.merchant_name">
                        <el-input
                            v-model="formData.params.merchant_name"
                            placeholder="请输入商户名称"
                        />
                    </el-form-item>
                    <!-- <el-form-item label="商户类型" prop="params.merchant_type">
                        <div>
                            <el-radio-group v-model="formData.params.merchant_type">
                                <el-radio label="ordinary_merchant">普通商户</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item> -->

                    <el-form-item label="应用ID" prop="params.app_id">
                        <div class="flex-1">
                            <el-input
                                v-model="formData.params.app_id"
                                placeholder="请输入支付宝应用ID"
                            />
                            <span class="form-tips"> 支付宝应用APP_ID </span>
                        </div>
                    </el-form-item>

                    <el-form-item label="应用私钥" prop="params.private_key">
                        <div class="flex-1">
                            <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.params.private_key"
                                placeholder="请输入支付宝应用私钥"
                            />
                            <span class="form-tips">支付宝应用私钥（private_key） </span>
                        </div>
                    </el-form-item>

                    <el-form-item label="支付宝公钥" prop="params.ali_public_key">
                        <div class="flex-1">
                            <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.params.ali_public_key"
                                placeholder="请输入支付宝公钥"
                            />
                            <span class="form-tips">支付宝公钥（ali_public_key） </span>
                        </div>
                    </el-form-item>
                </template>
                <el-form-item label="排序" prop="sort">
                    <div>
                        <el-input-number v-model="formData.sort" :min="0" :max="9999" />
                        <div class="form-tips">默认为0， 数值越大越排前</div>
                    </div>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { getPayConfig, setPayConfig } from '@/api/setting/pay'
import Popup from '@/components/popup/index.vue'
import feedback from '@/utils/feedback'
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
enum PayWayEnum {
    BALANCE = 1,
    WECHAT = 2,
    ALIPAY = 3
}
const popupTitle = computed(() => {
    switch (formData.way) {
        case PayWayEnum.BALANCE:
            return '余额支付'
        case PayWayEnum.WECHAT:
            return '微信支付'
        case PayWayEnum.ALIPAY:
            return '支付宝支付'
    }
})
const payWays = reactive([
    {
        value: PayWayEnum.WECHAT,
        label: '微信支付'
    },
    {
        value: PayWayEnum.ALIPAY,
        label: '支付宝支付'
    }
])
const formData = reactive({
    id: 0,
    way: 0,
    name: '',
    showName: '',
    icon: '',
    sort: 0,
    remark: '',
    params: {
        interface_version: '',
        merchant_name: '',
        merchant_type: '',
        mch_id: '',
        pay_sign_key: '',
        private_cert: '',
        private_key: '',
        mode: '',
        app_id: '',
        ali_public_key: ''
    }
})

const formRules: FormRules = {
    // showName: [
    //     {
    //         required: true,
    //         message: '请输入显示名称'
    //     }
    // ],
    'params.mch_id': [
        {
            required: true,
            message: '请输入微信支付商户号'
        }
    ],
    'params.merchant_name': [
        {
            required: true,
            message: '请输入商户名称'
        }
    ],
    'params.pay_sign_key': [
        {
            required: true,
            message: '请输入微信支付商户API密钥'
        }
    ],
    'params.private_cert': [
        {
            required: true,
            message: '请输入微信支付证书'
        }
    ],
    'params.private_key': [
        {
            required: true,
            message: '请输入微信支付证书密钥'
        }
    ],
    'params.app_id': [
        {
            required: true,
            message: '请输入支付宝应用ID'
        }
    ],
    'params.ali_public_key': [
        {
            required: true,
            message: '请输入支付宝公钥'
        }
    ]
}

const handleSubmit = async () => {
    console.log('handleSubmit', formData)
    if (formData.id == 0) {
        const pay = payWays.find((item) => formData.way == item.value)
        if (pay) {
            formData.name = pay.label
            formData.showName = pay.label
        }
    }
    await formRef.value?.validate()
    await setPayConfig(formData)
    feedback.msgSuccess('操作成功')
    popupRef.value?.close()
    emit('success')
}

const open = () => {
    popupRef.value?.open()
}

const setFormData = (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
}

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
