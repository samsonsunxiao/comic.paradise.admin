<template>
    <div>
        <div>
            <el-button type="primary" @click="handelAddPayWay"> 添加支付场景 </el-button>
            <el-button
                type="primary"
                v-perms="['setting:payment:editMethod']"
                @click="handelsetupPayScene"
            >
                设置支付方式
            </el-button>
        </div>
        <el-card
            shadow="never"
            class="mt-4 !border-none"
            v-for="(item, i) in payScenes"
            :key="item"
        >
            <div>
                <div class="text-lg mb-[24px]">
                    {{ item.name }}
                    <span class="form-tips ml-[10px]">{{ item.descript }}</span>
                </div>
                <el-table v-if="item.payWayList.length" :data="item.payWayList" style="width: 100%">
                    <el-table-column label="图标" min-width="150">
                        <template #default="{ row }">
                            <el-image
                                :src="row.icon"
                                alt="图标"
                                style="width: 34px; height: 34px"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="支付方式" min-width="150" />
                    <el-table-column label="默认支付" min-width="150">
                        <template #default="{ row, $index }">
                            <div>
                                <template v-if="setupPayScene">
                                    <el-radio
                                        v-model="row.isDefault"
                                        :label="1"
                                        @change="changePayDefault(i, $index)"
                                    >
                                        设为默认
                                    </el-radio>
                                </template>
                                <template v-else>
                                    <el-tag v-if="row.isDefault == 1">默认</el-tag>
                                    <span v-else>-</span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="开启状态" min-width="150">
                        <template #default="{ row }">
                            <el-switch
                                v-if="setupPayScene"
                                v-model="row.status"
                                :active-value="1"
                                :inactive-value="0"
                            />
                            <span v-else>
                                {{ row.status == 1 ? '开启' : '关闭' }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!-- <el-card
      shadow="never"
      class="mt-4 !border-none"
      v-for="(value, scene) in payWay"
      :key="scene"
    >
      <div>
        <div class="text-lg mb-[24px]" v-if="scene == PaySceneEnum.MP_WEIXIN">
          微信小程序
          <span class="form-tips ml-[10px]">在微信小程序中付款的场景</span>
        </div>
        <div class="text-lg mb-[24px]" v-if="scene == PaySceneEnum.OA">
          微信公众号
          <span class="form-tips ml-[10px]">
            在微信公众号H5页面中付款的场景，公众号类型一般为服务号
          </span>
        </div>
        <div class="text-lg mb-[24px]" v-if="scene == PaySceneEnum.H5">
          H5支付
          <span class="form-tips ml-[10px]">在浏览器H5页面中付款的场景</span>
        </div>
        <el-table v-if="value.length" :data="value" style="width: 100%">
          <el-table-column label="图标" min-width="150">
            <template #default="{ row }">
              <el-image :src="row.icon" alt="图标" style="width: 34px; height: 34px" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="支付方式" min-width="150" />
          <el-table-column label="默认支付" min-width="150">
            <template #default="{ row, $index }">
              <div>
                <template v-if="setupPayScene">
                  <el-radio
                    v-model="row.isDefault"
                    :label="1"
                    @change="changePayDefault($index, scene)"
                  >
                    设为默认
                  </el-radio>
                </template>
                <template v-else>
                  <el-tag v-if="row.isDefault == 1">默认</el-tag>
                  <span v-else>-</span>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="开启状态" min-width="150">
            <template #default="{ row }">
              <el-switch
                v-if="setupPayScene"
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
              />
              <span v-else>
                {{ row.status == 1 ? "开启" : "关闭" }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card> -->
        <footer-btns v-if="setupPayScene">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
        </footer-btns>
        <edit-popup v-if="showEdit" ref="editRef" @success="getConfig" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from 'lodash'

import { getPayScenes, getPayWay, savePayWay } from '@/api/setting/pay'
import feedback from '@/utils/feedback'

import EditPopup from './edit.vue'
const showEdit = ref(false)
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
enum PaySceneEnum {
    MP_WEIXIN,
    OA,
    H5,
    PC
}
const payWay = ref<Record<number, any[]>>({})
const payScenes = ref<any[]>([])
const setupPayScene = ref(false)
let defaultPayWay: any[] = []
const getConfig = async () => {
    payScenes.value = await getPayScenes()
    console.log('getConfig payScenes', payScenes.value)
    defaultPayWay = cloneDeep(payScenes.value)
}

const handelAddPayWay = async () => {
    console.log('添加支付场景')
    showEdit.value = true
    await nextTick()
    editRef.value?.open()
}

const handelsetupPayScene = () => {
    setupPayScene.value = true
}

const changePayDefault = (scene: number, pay: number) => {
    payScenes.value[scene].payWayList.forEach((item: any) => {
        item.isDefault = 0
    })
    payScenes.value[scene].payWayList[pay].isDefault = 1
}

const handleCancel = () => {
    payScenes.value = cloneDeep(defaultPayWay)
    setupPayScene.value = false
}

const handleSubmit = async () => {
    const payWays: any[] = []
    payScenes.value?.forEach((item: any) => {
        item.payWayList?.forEach((way: any) => {
            const payWay = {
                id: way.id,
                isDefault: way.isDefault,
                status: way.status
            }
            payWays.push(payWay)
        })
    })
    console.log('handleSubmit payWays', payWays)
    await savePayWay({
        data: payWays
    })
    setupPayScene.value = false
    feedback.msgSuccess('操作成功')
    getConfig()
}

getConfig()
</script>
