<template>
 <div class="edit-popup">
  <popup ref="popupRef" title="漫画查看编辑" :async="true" width="1250px" @close="handleClose">
    <div class="image-grid-container">
      <div class="image-grid">
        <div class="image-item" v-for="(item, index) in pager.lists" :key="index">
            <image-contain :src="item.uri" :width="100" :height="85"
                  :preview-src-list="pager.lists.map((item: any) => item.uri)" preview-teleported fit="contain" />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <pagination v-model="pager" @change="getLists" />
      </div>
    </div>
  </popup>
 </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import feedback from "@/utils/feedback";
import Popup from '@/components/popup/index.vue'
import { getComicItems } from "@/api/comic";
import { useDictOptions } from '@/hooks/useDictOptions'
import { usePaging } from '@/hooks/usePaging'

const popupRef = shallowRef<InstanceType<typeof Popup>>()
const formRef = shallowRef<FormInstance>();
const queryParams = reactive(<any>{
    comic_id: '',
    chapter_no: 0,
});

// 图片数据
const items = ref<any[]>([]);

const emit = defineEmits(['close'])
const open = () => {
    popupRef.value?.open()
}
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getComicItems,
    params: queryParams,
    page: 1,
    size: 50,
})
const setFormData = (comic_id: string, chapter_no: number) => {
    console.log('setFormData comic_id:', comic_id, 'chapter_no:', chapter_no);
    queryParams.comic_id = comic_id
    queryParams.chapter_no = chapter_no
    resetPage();
}
const handleClose = () => {
    emit('close')
}

defineExpose({
    open,
    setFormData,
})
</script>

<style scoped>
.image-grid-container {
  overflow-x: auto;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  padding: 10px;
}

.image-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  width: 100px;
  height: 100px;
}
</style>
