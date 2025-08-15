<!-- 网站信息 -->
<template>
    <div class="website-information">
        <el-form ref="formRef" :rules="rules" :model="formData" label-width="200px">
            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">官网设置</div>
                <!--el-form-item label="PC端LOGO" prop="pcLogo">
                    <div>
                        <material-picker v-model="formData.pcLogo" :limit="1" />
                        <div class="form-tips">建议尺寸：120*28px，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
                <el-form-item label="网站标题" prop="pcTitle">
                    <div class="w-80">
                        <el-input
                            v-model.trim="formData.pcTitle"
                            placeholder="请输入PC端网站标题"
                            maxlength="30"
                            show-word-limit
                        />
                    </div>
                </el-form-item-->
                <el-form-item label="网站图标" prop="pcIco">
                    <div>
                        <material-picker v-model="formData.pcIco" :limit="1" />
                        <div class="form-tips">建议尺寸：100*100像素，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
                <!--el-form-item label="网站描述" prop="pcDesc">
                    <div class="w-80">
                        <el-input v-model.trim="formData.pcDesc" placeholder="请输入PC端网站描述" />
                    </div>
                </el-form-item>
                <el-form-item label="网站关键词" prop="pcKeywords">
                    <div class="w-80">
                        <el-input
                            v-model.trim="formData.pcKeywords"
                            placeholder="请输入PC端网站关键词"
                        />
                    </div>
                </el-form-item-->
            </el-card>
            <el-card shadow="never" class="!border-none">
                <div class="text-xl font-medium mb-[20px]">后台设置</div>
                <el-form-item label="网站名称" prop="name">
                    <div class="w-80">
                        <el-input
                            v-model="formData.name"
                            placeholder="请输入网站名称"
                            maxlength="30"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="网站图标" prop="favicon">
                    <div>
                        <material-picker v-model="formData.favicon" :limit="1" />
                        <div class="form-tips">建议尺寸：100*100像素，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
                <el-form-item label="网站logo" prop="logo">
                    <div>
                        <material-picker v-model="formData.logo" :limit="1" />
                        <div class="form-tips">建议尺寸：200*200像素，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
                <el-form-item label="登录页广告图" prop="backdrop">
                    <div>
                        <material-picker v-model="formData.backdrop" :limit="1" />
                        <div class="form-tips">建议尺寸：400*400像素，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
            </el-card>
            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">阿里云OSS配置</div>
                <!--el-form-item label="Access Key" prop="aliAk">
          <div style="width: 350px">
            <el-input
              v-model="formData.aliAk"
              placeholder="请输入Access Key"
              maxlength="32"
              show-word-limit
            ></el-input>
          </div>
        </!--el-form-item>
        <el-form-item label="Secret Key" prop="aliSk">
          <div style="width: 350px">
            <el-input
              v-model="formData.aliSk"
              placeholder="请输入AccessKey Secret"
              maxlength="32"
              show-word-limit
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="Role Arn" prop="aliRoleArn">
          <div style="width: 350px">
            <el-input
              v-model="formData.aliRoleArn"
              placeholder="请输入roleArn"
              maxlength="100"
              show-word-limit
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="RoleSession Name" prop="aliRoleSessionName">
          <div style="width: 350px">
            <el-input
              v-model="formData.aliRoleSessionName"
              placeholder="请输入roleArn"
              maxlength="32"
              show-word-limit
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item-- label="Duration Seconds" prop="aliDurationSeconds">
          <div style="width: 350px">
            <el-input-number
              v-model="formData.aliDurationSeconds"
              placeholder="请输入DurationSeconds"
              style="width: 250px;"
            ></el-input-number>
          </div>
        </el-form-item-->
                <el-form-item label="Bucket" prop="aliBucket">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliBucket"
                            placeholder="请输入Bucket"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="策略" prop="aliPolicy">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliPolicy"
                            placeholder="Policy"
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 6 }"
                            maxlength="200"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="OSS节点" prop="aliEndpoint">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliEndpoint"
                            placeholder="请输入End Point"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="存储路径" prop="aliPath">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliPath"
                            placeholder="请输入Path"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="OSS区域" prop="aliRegion">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliRegion"
                            placeholder="请输入Region"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="CDN" prop="aliCdn">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.aliCdn"
                            placeholder="请输入cdn域名(示例:cdn.itqm.com)"
                            maxlength="100"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        font-size: 14px;
                        color: RGB(190, 88, 89);
                    "
                >
                    <span class=""
                        >1.这里最好由技术人员修改,修改这里会对网站的图片文件链接有影响，请谨慎修改</span
                    >
                    <span class=""
                        >2.修改BUCKET或者修改存储路径，需要手动在OSS把原路径上的所有文件拷贝到目标BUCKET的路径上</span
                    >
                    <span class="">3.cdn配置后，将优先使用CDN域名,如为空则使用OSS域名</span>
                    <span class=""
                        >3.策略中的acs:oss是表示为哪个文件夹授权访问，如示例acs:oss:*:*:/*即为整个BUCKET根目录下的所有文件授权,详情参考阿里云文档</span
                    >
                </div>
            </el-card>
            <el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">百度平台设置</div>
                <el-form-item label="百度站长token" prop="bdSite">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.bdSiteToken"
                            placeholder="请输入百度站长token"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="百度地图token" prop="bdMap">
                    <div style="width: 350px">
                        <el-input
                            v-model="formData.bdMapToken"
                            placeholder="请输入百度地图token"
                            maxlength="32"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
            </el-card>
            <!--el-card shadow="never" class="!border-none mt-4">
                <div class="text-xl font-medium mb-[20px]">前台设置</div>
                <el-form-item label="商城名称" prop="shopName">
                    <div class="w-80">
                        <el-input
                            v-model="formData.shopName"
                            placeholder="请输入店铺/商城名称"
                            maxlength="30"
                            show-word-limit
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="商城LOGO" prop="shopLogo">
                    <div>
                        <material-picker v-model="formData.shopLogo" :limit="1" />
                        <div class="form-tips">建议尺寸：100*100px，支持jpg，jpeg，png格式</div>
                    </div>
                </el-form-item>
            </el-card-->
        </el-form>
        <footer-btns v-perms="['setting:website:save']">
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
    </div>
</template>

<script lang="ts" setup name="webInformation">
import type { FormInstance } from 'element-plus'

import { getWebsite, setWebsite } from '@/api/setting/website'
import useAppStore from '@/stores/modules/app'
import feedback from '@/utils/feedback'
const formRef = ref<FormInstance>()
const { getConfig } = useAppStore()
// 表单数据
const formData = reactive({
    name: '', // 网站名称
    favicon: '', // 网站图标
    logo: '', // 网站logo
    backdrop: '', // 登录页广告图
    shopName: '',
    shopLogo: '',
    pcDesc: '',
    pcIco: '',
    pcKeywords: '',
    pcLogo: '',
    pcTitle: '',
    bdSiteToken: '',
    bdMapToken: '',
    // aliAk:"",
    // aliSk:"",
    // aliRoleArn:"",
    // aliRoleSessionName:"",

    // aliDurationSeconds:3000,
    aliPolicy: '',
    aliEndpoint: '',
    aliPath: '',
    aliBucket: '',
    aliRegion: '',
    aliCdn: ''
})

// 表单验证
const rules = {
    name: [
        {
            required: true,
            message: '请输入网站名称',
            trigger: ['blur']
        }
    ],
    favicon: [
        {
            required: true,
            message: '请选择网站图标',
            trigger: ['change']
        }
    ],
    logo: [
        {
            required: true,
            message: '请选择网站logo',
            trigger: ['change']
        }
    ],
    backdrop: [
        {
            required: true,
            message: '请选择登录页广告图',
            trigger: ['change']
        }
    ],
    shopName: [
        {
            required: true,
            message: '请输入店铺/商城名称',
            trigger: ['blur']
        }
    ],
    shopLogo: [
        {
            required: true,
            message: '请选择商城LOGO',
            trigger: ['change']
        }
    ],
    pcLogo: [
        {
            required: true,
            message: '请选择PC端LOGO',
            trigger: ['change']
        }
    ],
    pcTitle: [
        {
            required: true,
            message: '请输入PC端网站标题',
            trigger: ['blur']
        }
    ],
    aliAk: [
        {
            required: true,
            message: '请输入AccessKey',
            trigger: ['blur']
        }
    ],
    aliSk: [
        {
            required: true,
            message: '请输入Secret Key',
            trigger: ['blur']
        }
    ],
    aliRoleArn: [
        {
            required: true,
            message: '请输入Role Arn',
            trigger: ['blur']
        }
    ],
    aliRoleSessionName: [
        {
            required: true,
            message: '请输入Role Session Name',
            trigger: ['blur']
        }
    ],
    aliPolicy: [
        {
            required: true,
            message: '请输入Policy',
            trigger: ['blur']
        }
    ],
    aliDurationSeconds: [
        {
            required: true,
            message: '请输入Duration Seconds',
            trigger: ['blur']
        }
    ],
    aliEndpoint: [
        {
            required: true,
            message: '请输入End Point',
            trigger: ['blur']
        }
    ],
    aliBucket: [
        {
            required: true,
            message: '请输入Bucket',
            trigger: ['blur']
        }
    ],
    aliRegion: [
        {
            required: true,
            message: '请输入Region',
            trigger: ['blur']
        }
    ]
}

// 获取备案信息
const getData = async () => {
    const data = await getWebsite()
    for (const key in formData) {
        //@ts-ignore
        formData[key] = data[key]
    }
}

// 设置备案信息
const handleSubmit = async () => {
    await formRef.value?.validate()
    await setWebsite(formData)
    feedback.msgSuccess('操作成功')
    getConfig()
    getData()
}

getData()
</script>

<style lang="scss" scoped></style>
