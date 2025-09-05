<template>
    <div class="edit-popup">
        <popup ref="popupRef" title="分类编辑" :async="true" width="550px" @confirm="handleSubmit" @close="handleClose">
            <el-form ref="formRef" class="ls-form" :model="formData" label-width="85px" :rules="rules">
                <el-form-item label="分类标题" prop="title">
                    <div>
                        <el-input style="width: 400px; " v-model="formData.title" placeholder="" clearable />
                    </div>
                </el-form-item>
                <el-form-item label="漫画" prop="comics">
                    <el-select style="width: 400px; margin-top: 10px" v-model="formData.comics" multiple collapse-tags
                        collapse-tags-tooltip :max-collapse-tags="4" allow-create default-first-option value-key="id"
                        :reserve-keyword="false" placeholder="请选择漫画">
                        <el-option v-for="item in optionsData.comics" :key="item.comic_id" :label="item.title"
                            :value="item.comic_id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup>
import type { FormInstance } from "element-plus";
import feedback from "@/utils/feedback";
import Popup from "@/components/popup/index.vue";
import { getRoutePath } from "@/router";
import { useDictOptions } from "@/hooks/useDictOptions";
import { categoryDetail, categorySave, getComicAll } from "@/api/comic";
const rules = reactive({
    name: [{ required: true, message: "请输入分类标题", trigger: "blur" }],
});
const emit = defineEmits(["success", "close"]);
const popupRef = shallowRef<InstanceType<typeof Popup>>();
const formRef = shallowRef<FormInstance>();
const mode = ref("add");
const formData = reactive(<any>{
    title: "",
    comics: <any>[],
});

const { optionsData } = useDictOptions<{
    comics: any[];
}>({
    comics: {
        api: getComicAll,
        params: { status: "online" },
    },
});
const open = (type = "add") => {
    mode.value = type;
    popupRef.value?.open();
};
const handleSubmit = async () => {
    await formRef.value?.validate();
    console.log("handleSubmit formData", formData);
    await categorySave(formData);
    popupRef.value?.close();
    feedback.msgSuccess("操作成功");
    emit("success");
};
const handleClose = () => {
    emit("close");
};
const setFormData = async (row: any) => {
    for (const key in formData) {
        if (row[key] != null && row[key] != undefined) {
            //@ts-ignore
            formData[key] = row[key];
        }
    }
    console.log("setFormData", formData, row);
    categoryDetail({ categoryid: row.category_id }).then((res: any) => {
        console.log("categoryDetail", res);
        formData.comics = res.comics.map((item: any) => item.comic_id);
    });
};

defineExpose({
    open,
    setFormData,
});
</script>
