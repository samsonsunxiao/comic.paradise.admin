<template>
    <div class="article-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="漫画名">
                    <el-input class="w-[280px]" v-model="queryParams.title" clearable @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 240px" v-model="queryParams.status">
                        <el-option label="全部" value />
                        <el-option v-for="item in sources" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索关键词">
                    <el-input class="w-[280px]" v-model="queryParams.text" clearable @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <router-link v-perms="['resource:game:add', 'resource:game:add/edit']" :to="{
                        path: getRoutePath('resource:game:add/edit'),
                        query: {
                            order: (pager.lists.length || 0) > 0 ? pager.lists[0].sort : 0
                        }
                    }">
                        <el-button type="primary" class="ml-[20px]">
                            <template #icon>
                                <icon name="el-icon-Plus" />
                            </template>
                            新增漫画
                        </el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="漫画ID" prop="comic_id" min-width="50" />
                <el-table-column label="" min-width="80">
                    <template #default="{ row }">
                        <image-contain :src="row.cover_image" :width="80" :height="65"
                            :preview-src-list="[row.cover_image]" preview-teleported fit="contain" />
                    </template>
                </el-table-column>
                <el-table-column label="漫画名称" prop="title" min-width="120" show-tooltip-when-overflow>
                    <!-- <template #default="{ row }">
                        <a :href="row.detailUrl" target="_blank">{{ row.title }} </a>
                    </template> -->
                </el-table-column>
                <el-table-column label="分类" prop="category" min-width="80" />
                <el-table-column label="漫画类型" prop="type" min-width="80" />
                <el-table-column label="漫画状态" prop="state" min-width="80" />
                <el-table-column label="章节数" prop="chapter_count" min-width="50" />
                <el-table-column label="状态" prop="status" min-width="80" show-tooltip-when-overflow>
                    <template #default="{ row }">
                        <span>
                            {{
                                row.status == 'online'
                                    ? '已上架'
                                    : row.status == 'offline'
                                        ? '未上架'
                                        : '已删除'
                            }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['resource:comic:edit', 'resource:comic:add/edit']" type="primary" link>
                            <router-link :to="{
                                path: getRoutePath('resource:comic:add/edit'),
                                query: {
                                    comicid: row.comic_id
                                }
                            }">
                                编辑
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup name="articleLists">
import { getComicList } from '@/api/comic'
import { useDictOptions } from '@/hooks/useDictOptions'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import feedback from '@/utils/feedback'
const queryParams = reactive({
    text: '',
    title: '',
    status: ''
})
const sources = reactive([
    {
        value: 'online',
        label: '已上架'
    },
    {
        value: 'offline',
        label: '未上架'
    },
    {
        value: 'delete',
        label: '已删除'
    }
])

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getComicList,
    params: queryParams
})

onActivated(() => {
    getLists()
})

getLists()
</script>
