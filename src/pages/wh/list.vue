<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="仓库名或地址"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态">
                        <el-radio-group v-model="queryObj.status" @change="getData()">
                            <el-radio label="0">启用</el-radio>
                            <el-radio label="1">未启用</el-radio>
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
            <div class="flex items-center">
                <el-button type="primary" @click="handleCreate()">新增仓库</el-button>
            </div>
            <div class="flex items-center justify-end">
                <el-button type="warning" @click="exportExcelTemp()">导出数据模板</el-button>
                <el-button type="primary" @click="exportExcelData()">导出当前条件数据</el-button>
                <!-- <el-button type="success" @click="importExcelData()">一键导入数据</el-button> -->
                <el-upload action="#" :before-upload="importExcelData" :limit="1" :show-file-list="false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    class="ml-3">
                    <el-button slot="trigger" type="success">一键导入数据</el-button>
                </el-upload>

                <el-tooltip content="刷新数据" placement="top" effect="dark">
                    <el-button text @click="getData()">
                        <el-icon :size="30">
                            <Refresh />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">

            <el-table-column label="仓库名称" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="仓库空间/m³" align="center">
                <template #default="{ row }">
                    <span>{{ row.space }}</span>
                </template>
            </el-table-column>
            <el-table-column label="库存货物重量/KG" align="center">
                <template #default="{ row }">
                    <span>{{ row.load ? row.load : 0 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="已使用空间/m³" align="center">
                <template #default="{ row }">
                    <span>{{ row.usedSpace ? row.usedSpace : 0 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="仓库地址" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.address }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注说明" align="center">
                <template #default="{ row }">
                    <span v-if="row.remark">{{ row.remark }}</span>
                    <span v-else>无备注</span>
                </template>
            </el-table-column>
            <el-table-column label="使用状态" align="center" width="100">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="'0'" :inactive-value="'1'"
                        @change="handleStatusChange(row, $event)" :loading="row.statusLoading">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="op-icon">
                        <el-tooltip content="查看" placement="bottom">
                            <el-icon @click="openInfoDrawer(scope.row)">
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
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="存储空间" prop="space">
                    <el-input v-model="form.space">
                        <template #append>立方/m³</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="key">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="form.remark" placeholder="建议对仓库做简单介绍"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="1" size="large">
                <el-descriptions-item label="存储空间" align="left">
                    {{ info.space }}
                    <el-tag class="info-tag" type="success" effect="plain">m³</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="仓库地址" align="left">{{ info.address }}</el-descriptions-item>
                <el-descriptions-item label="备注信息" align="left">
                    <span v-if="info.remark">{{ info.remark }}</span>
                    <span v-else>无备注</span>
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" size="large">
                <el-descriptions-item label="创建时间" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy ? info.createBy : "系统原始" }}创建</el-descriptions-item>
                <el-descriptions-item label="最近更新" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy ? info.createBy : "系统原始" }}更新</el-descriptions-item>
            </el-descriptions>
        </InfoDrawer>
    </el-card>
</template>

<script setup>
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate, exportTemplate, exportData, importData } from "@/api/admin";
import { customNotification, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";

const module = "wh";
const {
    queryObj,
    tableData,
    loading,
    total,
    resetQueryObj,
    getData,
    handleStatusChange,
    exportExcelTemp,
    exportExcelData,
    importExcelData
} = tableDataInit({
    module: module,
    queryObj: {
        keyword: "",
        status: "",
        cur: 1,
        size: 10
    },
    getList: queryList,
    changeStatus: changeStatus,
    exportTemplate: exportTemplate,
    exportData: exportData,
    importData: importData,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.whs.map((o) => {
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
        space: null,
        address: "",
        cityCode: "",
        remark: "",
        status: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
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
        space: null,
        address: "",
        cityCode: "",
        load: null,
        usedSpace: null,
        remark: "",
        status: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
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