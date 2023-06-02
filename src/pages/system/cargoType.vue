<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="字段名称或关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态">
                        <el-radio-group v-model="queryObj.status" @change="getData()">
                            <el-radio label="0">启用</el-radio>
                            <el-radio label="1">未启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="能否修改">
                        <el-radio-group v-model="queryObj.canUp" @change="getData()">
                            <el-radio label="0">可修改</el-radio>
                            <el-radio label="1">不可修改</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="8" class="flex items-center justify-center">
                    <el-form-item>
                        <el-button type="primary" @click="getData()">搜索</el-button>
                        <el-button @click="resetQueryObj()">清空</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-divider content-position="center" class="mt-3"></el-divider>

        <!-- 新增 | 刷新 -->
        <div class="flex items-center justify-between mb-4">
            <el-button type="primary" @click="handleCreate()">新增类型</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">
            <el-table-column label="类型名称" align="center">
                <template #default="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="关键字" align="center">
                <template #default="{ row }">
                    <span>{{ row.key }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注说明" align="center">
                <template #default="{ row }">
                    <span v-if="row.remark">{{ row.remark }}</span>
                    <span v-else>无备注</span>
                </template>
            </el-table-column>
            <el-table-column label="启用状态" align="center" width="100">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="'0'" :inactive-value="'1'"
                        @change="handleStatusChange(row, $event)" :loading="row.statusLoading" :disabled="row.canUp === '1'">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div v-if="scope.row.canUp == 0">
                        <div class="op-icon" @click="openInfoDrawer(scope.row)">
                            <el-tooltip content="查看" placement="bottom">
                                <el-icon>
                                    <View />
                                </el-icon>
                            </el-tooltip>
                        </div>
                        <div class="op-icon" @click="handleUpdate(scope.row)">
                            <el-tooltip content="修改" placement="bottom">
                                <el-icon>
                                    <Edit />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </div>
                    <span v-else>
                        该类型不可被修改
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="queryObj.cur"
                :page-size="queryObj.size" @current-change="getData" />
            <small class="ml-6 text-gray-500">共{{ total }}条数据</small>
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" destoryOnClose @submit="handleSubmit()">
            <el-form :model="form" ref="formRef" :rules="optId === 0 ? addRoleRules : updateRoleRules"
                :validate-on-rule-change="false" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="key">
                    <el-input v-model="form.key"></el-input>
                </el-form-item>
                <el-form-item label="能否修改" prop="isMenu">
                    <el-radio-group v-model="form.canUp">
                        <el-radio label="0">可以修改</el-radio>
                        <el-radio label="1">不可修改</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="参数值" prop="path">
                    <el-input :v-model="form.type === '0' ? form.str : form.value"
                        :type="form.type === '0' ? 'text' : 'number'" />
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="form.remark" placeholder="建议对参数做简单介绍"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="菜单/权限详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="2" size="large">
                <el-descriptions-item label="类型名称" align="left">{{ info.name }}</el-descriptions-item>
                <el-descriptions-item label="关键字" align="left">{{ info.key }}</el-descriptions-item>
                <el-descriptions-item label="能否修改" align="left">{{ info.canUp == '0' ? "可以修改" : "不可修改" }}</el-descriptions-item>
                <el-descriptions-item label="备注" align="left">
                    <span v-if="info.remark">{{ info.remark }}</span>
                    <span v-else>无备注</span>
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" size="large">
                <el-descriptions-item label="创建时间" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy | "系统原始" }}创建</el-descriptions-item>
                <el-descriptions-item label="最近更新" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy | "系统原始" }}更新</el-descriptions-item>
            </el-descriptions>
        </InfoDrawer>
    </el-card>
</template>

<script setup>
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate } from "@/api/admin";
import { customNotification, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";

const module = "sys/cargo/type";
const {
    queryObj,
    tableData,
    loading,
    total,
    resetQueryObj,
    getData,
    handleStatusChange
} = tableDataInit({
    module: module,
    queryObj: {
        keyword: "",
        status: "",
        canUp: "",
        cur: 1,
        size: 10
    },
    getList: queryList,
    changeStatus: changeStatus,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.types.map((o) => {
                o.statusLoading = false;
                return o;
            });
            total.value = res.data.data.total;
        } else {
            customNotification("error", res.data.msg);
        }
    }
});
const {
    optId,
    formDrawerRef,
    formRef,
    form,
    drawerTitle,
    handleCreate,
    handleUpdate,
    handleSubmit
} = formDataInit({
    module: module,
    form: {
        name: "",
        key: "",
        remark: "",
        canUp: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
        status: "0"
    },
    getData,
    create: moduleObjAdd,
    update: moduleObjUpdate,
});
const {
    infoDrawerRef,
    info,
    openInfoDrawer
} = infoDataInit({
    info: {
        name: "",
        key: "",
        remark: "",
        canUp: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
        status: "0"
    }
})

const addRoleRules = {}
const updateRoleRules = {}
</script>
<style lang="postcss" scoped>
:deep(.el-descriptions__title) {
    font-size: 24px !important;
}

:deep(.el-descriptions__label) {
    font-weight: bolder !important;
}

:deep(.el-checkbox) {
    @apply mr-6 !important;
}
</style>