<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="车牌号"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆状态">
                        <el-radio-group v-model="queryObj.status" @change="getData()">
                            <el-radio label="0">闲置</el-radio>
                            <el-radio label="1">作业</el-radio>
                            <el-radio label="2">检修</el-radio>
                            <el-radio label="3">停用</el-radio>
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
            <el-button type="primary" @click="handleCreate()">新增车辆</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">

            <el-table-column label="车牌号" align="center">
                <template #default="{ row }">
                    <span>{{ row.plateNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="准载重量/KG" align="center">
                <template #default="{ row }">
                    <span>{{ row.load }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运载空间/m³" align="center">
                <template #default="{ row }">
                    <span>{{ row.space }}</span>
                </template>
            </el-table-column>
            <el-table-column label="当前所在仓库" align="center">
                <template #default="{ row }">
                    <span v-if="row.localWh">{{ row.localWh }}</span>
                    <span v-else>车辆尚未派遣</span>
                </template>
            </el-table-column>
            <el-table-column label="备注说明" align="center">
                <template #default="{ row }">
                    <span v-if="row.remark">{{ row.remark }}</span>
                    <span v-else>无备注</span>
                </template>
            </el-table-column>
            <el-table-column label="车辆状态" align="center" width="300">
                <template #default="{ row }">
                    <el-radio-group v-model="row.status" @change="handleStatusChange(row, $event)">
                        <el-radio-button label="0">闲置</el-radio-button>
                        <el-radio-button label="1">工作</el-radio-button>
                        <el-radio-button label="2">检修</el-radio-button>
                        <el-radio-button label="3">停用</el-radio-button>
                    </el-radio-group>
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
                <el-form-item label="车牌号" prop="plateNo">
                    <el-input v-model="form.plateNo" placeholder="请加上·标识" />
                </el-form-item>
                <el-form-item label="准载重量" prop="load">
                    <el-input v-model="form.load">
                        <template #append>千克/KG</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="运载空间" prop="space">
                    <el-input v-model="form.space">
                        <template #append>立方/m³</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="form.remark" placeholder="建议对车辆信息做简单说明"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="菜单/权限详细信息" destoryOnClose>
            <el-descriptions :title="info.plateNo" :column="2" size="large"></el-descriptions>
            <el-descriptions :column="2" size="large">
                <el-descriptions-item label="准载重量" align="left">
                    {{ info.load }}
                    <el-tag class="info-tag" type="success" effect="plain">KG</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="运载空间" align="left">
                    {{ info.space }}
                    <el-tag class="info-tag" type="success" effect="plain">m³</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="备注说明" align="left">{{ info.remark }}</el-descriptions-item>
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
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate } from "@/api/admin";
import { customNotification, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import ElIconPicker from "@/layouts/components/ElIconPicker.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";

const module = "vehicle";
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
        cur: 1,
        size: 10
    },
    getList: queryList,
    changeStatus: changeStatus,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.vehicles.map((o) => {
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
        plateNo: "",
        load: null,
        space: null,
        localWh: "",
        status: "",
        remark: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0
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
        plateNo: "",
        load: 0.00,
        space: 0.00,
        localWh: "",
        status: "",
        remark: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0
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