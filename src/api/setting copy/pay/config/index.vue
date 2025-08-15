<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <!-- <el-alert
                type="warning"
                title="温馨提示：设置系统支持的支付方式"
                :closable="false"
                show-icon
            /> -->
            <el-button v-perms="['setting:payment:editConfig']" type="primary" @click="handleAdd()">
                新增支付方式
            </el-button>
        </el-card>
        <el-card shadow="never" class="mt-4 !border-none">
            <div>
                <el-table :data="payConfigList">
                    <el-table-column prop="name" label="支付方式" min-width="150">
                        <template #default="{ row }">
                            <div class="pay-type">
                                <el-image
                                    :src="row.icon"
                                    alt="图标"
                                    style="width: 34px; height: 34px"
                                />
                                <span>{{ row.name || '' }}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="showName" label="显示名称" min-width="150" /> -->
                    <el-table-column label="商户名称" min-width="150">
                        <template #default="{ row }">
                            <span>{{ row.params.merchant_name || '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="环境" min-width="150">
                        <template #default="{ row }">
                            <span>{{
                                (row.params.mode || '') == 'online_mode' ||
                                (row.params.mode || '') == ''
                                    ? '线上环境'
                                    : '沙箱模式'
                            }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="sort" label="排序" min-width="150" /> -->
                    <el-table-column label="操作" min-width="80" fixed="right">
                        <!-- 操作 -->
                        <template #default="{ row }">
                            <el-button
                                v-perms="['setting:payment:editConfig']"
                                link
                                type="primary"
                                @click="handleEdit(row)"
                            >
                                配置
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" @success="getConfig" @close="showEdit = false" />
        <el-dialog v-model="showTestDlg" width="500">
            <span>This is a message</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="showTestDlg = false">Cancel</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { getPayConfigLists } from '@/api/setting/pay'

import EditPopup from './edit.vue'
const payConfigList = ref<any[]>([])
const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const showEdit = ref(false)
const getConfig = async () => {
    const data = await getPayConfigLists()
    payConfigList.value = data
}
const showTestDlg = ref(false)
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open()
    editRef.value?.getDetail(data)
}
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open()
}

getConfig()
</script>

<style scoped>
.pay-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
        margin-left: 10px;
    }
}
</style>
