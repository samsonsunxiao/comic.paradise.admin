<template>
    <div class="article-lists">
        <el-card class="!border-none" shadow="never">
            <el-button @click="handleAddLevel">添加等级</el-button>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="等级ID" prop="name" min-width="50" />
                <el-table-column
                    label="标题"
                    prop="title"
                    min-width="120"
                    show-tooltip-when-overflow
                >
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link @click="handleEdit(row)"> 编辑 </el-button>
                        <el-button type="danger" link @click="handleDelete(row.id)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
            <edit-popup
                v-if="showEdit"
                ref="editRef"
                @success="getLists"
                @close="showEdit = false"
            />
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import { vipLevelDel, vipLevelList } from '@/api/vip/level'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import feedback from '@/utils/feedback'

import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
const { pager, getLists } = usePaging({
    fetchFun: vipLevelList
})

const showEdit = ref(false)
const handleAddLevel = async () => {
    console.log('handleAddLevel')
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.setFormData(data)
    editRef.value?.open('edit')
}

const handleDelete = async (id: number) => {
    await feedback.confirm('确定要删除？')
    await vipLevelDel({ id })
    feedback.msgSuccess('删除成功')
    getLists()
}

const handleOffline = (gid: string) => {}

onActivated(() => {
    getLists()
})

getLists()
</script>
