<template>
    <div class="">
        <el-card class="!border-none" shadow="never">
            <div class="flex items-center" v-if="sync_status < 2">
                <el-radio-group v-model="sync_type">
                    <el-radio :value="1" size="large">增量更新</el-radio>
                    <el-radio :value="0" size="large">全量更新</el-radio>
                </el-radio-group>
                <el-button class="ml-[20px]" type="primary" @click="handleDataSync" :disabled="sync_status == 1">开始同步</el-button>
            </div>
            <div class="mt-4" v-if="sync_status == 1">
                <span class="text-[#666]">正在同步数据源</span>
                <el-progress class="mt-4":text-inside="true" :stroke-width="26" :percentage="sync_data.percent" />
            </div>
            <div class="mt-4" v-if="sync_status == 2">
                <span class="text-[#666]">正在转入数据库,请稍后</span>
                <el-progress :percentage="100" :indeterminate="true" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { } from 'vue'
import { comicSync, getSyncState } from '@/api/comic'

const sync_type = ref(1);//全量或者增量更新
const sync_status = ref(0);
const sync_data = ref<any>(null);
const handleDataSync = async () => {
    console.log("handleDataSync sync_type", sync_type.value);
    let key = await comicSync({ synctype: sync_type.value });
    checkSyncState();
}

const checkSyncState = () => {
    getSyncState().then((data: any) => {
        console.log("checkSyncState", data);
        if (data == null) {
            sync_status.value = 0;
            // 清除定时器
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        } else {
            // data不为null则继续定时器
            sync_data.value = data;
            sync_status.value = data.state;
            if (!timer) {
                timer = setInterval(checkSyncState, 1000);
            }
        }
        
    });
}

let timer: any = null;

onMounted(() => {
    checkSyncState();
})
onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
})
</script>

<style scoped></style>