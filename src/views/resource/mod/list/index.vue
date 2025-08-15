<template>
    <div class="article-lists">
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="关键词">
                    <el-input
                        class="w-[280px]"
                        v-model="queryParams.text"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="游戏">
                    <el-select style="width: 240px" v-model="queryParams.gid">
                        <el-option label="全部" value />
                        <el-option
                            v-for="item in optionsData.gameName"
                            :key="item.id"
                            :label="item.name"
                            :value="item.gid"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 240px" v-model="queryParams.status">
                        <el-option label="全部" value />
                        <el-option
                            v-for="item in status"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select style="width: 240px" v-model="queryParams.platform">
                        <el-option label="全部" value />
                        <el-option
                            v-for="item in sources"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <router-link
                        v-perms="['resource:mod:add', 'resource:mod:add/edit']"
                        :to="{
                            path: getRoutePath('resource:mod:add/edit'),
                            query: {
                                order: (pager.lists.length || 0) > 0 ? pager.lists[0].sort : 0
                            }
                        }"
                    >
                        <el-button type="primary" class="ml-[20px]">
                            <template #icon>
                                <icon name="el-icon-Plus" />
                            </template>
                            新增MOD
                        </el-button>
                    </router-link>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="MODID" prop="modid" min-width="100" />
                <el-table-column label="" min-width="80">
                    <template #default="{ row }">
                        <image-contain
                            :src="row.thumb_image"
                            :width="60"
                            :height="45"
                            :preview-src-list="[row.thumb_image]"
                            preview-teleported
                            fit="contain"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    label="标题"
                    prop="title"
                    min-width="120"
                    show-tooltip-when-overflow
                >
                    <template #default="{ row }">
                        <a :href="row.detailUrl" target="_blank">{{ row.title }} </a>
                    </template>
                </el-table-column>
                <el-table-column label="来源" prop="platform" min-width="100" />
                <el-table-column
                    label="状态"
                    prop="status"
                    min-width="80"
                    show-tooltip-when-overflow
                >
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
                <el-table-column label="游戏" prop="game" min-width="80"> </el-table-column>
                <el-table-column label="发布时间" prop="date" min-width="100" />
                <el-table-column label="操作" fixed="right">
                    <template #default="{ row }">
                        <el-button v-perms="['resource:mod:add/edit']" type="primary" link>
                            <router-link
                                :to="{
                                    path: getRoutePath('resource:mod:add/edit'),
                                    query: {
                                        modid: row.modid
                                    }
                                }"
                            >
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
import { getGameAll } from '@/api/game'
import { getModList } from '@/api/xmods'
import { useDictOptions } from '@/hooks/useDictOptions'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
const queryParams = reactive({
    text: '',
    gid: '',
    platform: '',
    status: ''
})
const sources = reactive(['dl.3dmgame.com'])
const status = reactive([
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
    fetchFun: getModList,
    params: queryParams
})

const { optionsData } = useDictOptions<{
    gameName: any[]
    params: any
}>({
    gameName: {
        api: getGameAll,
        params: { status: '' }
    }
})

onActivated(() => {
    getLists()
})

getLists()
</script>
