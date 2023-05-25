<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="查询起始或结束仓库"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="运输状态">
                        <el-radio-group v-model="queryObj.status" @change="getData()">
                            <el-radio label="0">未确认</el-radio>
                            <el-radio label="1">未开始</el-radio>
                            <el-radio label="2">运输中</el-radio>
                            <el-radio label="3">已结束</el-radio>
                            <el-radio label="-1">未知</el-radio>
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
            <el-button type="primary" @click="handleCreate()">新增运输单</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">

            <el-table-column label="运输编号" align="center" width="160">
                <template #default="{ row }">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column label="运输司机" align="center">
                <template #default="{ row }">
                    <span>{{ row.driver }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作业车辆" align="center">
                <template #default="{ row }">
                    <span>{{ row.vehicle }}</span>
                </template>
            </el-table-column>
            <el-table-column label="起始地" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.startWh }}</span>
                </template>
            </el-table-column>
            <el-table-column label="终止地" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.endWh }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运输状态" align="center" width="400">
                <template #default="{ row }">
                    <el-radio-group v-model="row.status" @change="handleStatusChange(row, $event)"
                        :disabled="row.status == '3'">
                        <el-radio-button label="0">未确认</el-radio-button>
                        <el-radio-button label="1">未开始</el-radio-button>
                        <el-radio-button label="2">运输中</el-radio-button>
                        <el-radio-button label="3">已结束</el-radio-button>
                        <el-radio-button label="-1">未知</el-radio-button>
                    </el-radio-group>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="op-icon" @click="openInfoDrawer(scope.row)">
                        <el-tooltip content="查看" placement="bottom">
                            <el-icon>
                                <View />
                            </el-icon>
                        </el-tooltip>
                    </div>
                    <div class="op-icon" v-if="scope.row.status != '3'"
                        @click="handleUpdate(scope.row)">
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
                :page-size="queryObj.size" @current-change="getData()" />
            <small class="ml-6 text-gray-500">共{{ total }}条数据</small>
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" destoryOnClose @submit="handleSubmit()">
            <el-form :model="form" ref="formRef" :rules="optId == 0 ? addRoleRules : updateRoleRules"
                :validate-on-rule-change="false" label-width="80px">
                <el-form-item label="发出地" prop="startWhId">
                    <el-select v-model="form.startWhId" placeholder="请选择运输发出地">
                        <el-option v-for="w in whs" :key="w.id" :label="w.name" :value="w.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目的地" prop="endWhId">
                    <el-select v-model="form.endWhId" placeholder="请选择运输目的地">
                        <el-option v-for="w in whs" :key="w.id" :label="w.name" :value="w.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作业人员" prop="driverId">
                    <el-select v-model="form.driverId" placeholder="请选择作业人员">
                        <el-option v-for="d in drivers" :key="d.id" :label="d.name" :value="d.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作业车辆" prop="driverId">
                    <el-select v-model="form.vehicleId" placeholder="请选择作业车辆">
                        <el-option v-for="v in vehicles" :key="v.id" :label="v.plateNo" :value="v.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="form.remark" placeholder="建议为作业人员提供部分作业须知"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="运单详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="2" size="large">
                <el-descriptions-item label="发出地" align="left">{{ info.startWh }}</el-descriptions-item>
                <el-descriptions-item label="目的地" align="left">{{ info.endWh }}</el-descriptions-item>
                <el-descriptions-item label="作业人员" align="left">{{ info.driver }}</el-descriptions-item>
                <el-descriptions-item label="作业车辆" align="left">{{ info.vehicle }}</el-descriptions-item>
                <el-descriptions-item label="备注" align="left">{{ info.remark }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" size="large">
                <el-descriptions-item label="创建时间" align="left">{{ getTimestampConversion(info.startTime)
                }}任务创建</el-descriptions-item>
                <el-descriptions-item label="最近更新" align="left">{{ getTimestampConversion(info.endTime)
                }}任务结束</el-descriptions-item>
            </el-descriptions>
        </InfoDrawer>
    </el-card>
</template>

<script setup>
import { ref } from "vue";
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate } from "@/api/admin";
import { customNotification, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";

const drivers = ref([]);
const vehicles = ref([]);
const whs = ref([]);
const module = "trans";
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
            tableData.value = res.data.data.trans.map((o) => {
                o.statusLoading = false;
                return o;
            });
            total.value = res.data.data.total;
            whs.value = res.data.data.whs;
            drivers.value = res.data.data.drivers;
            vehicles.value = res.data.data.vehicles;
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
        id: 0,
        driverId: null,
        vehicleId: null,
        startWhId: null,
        endWhId: null,
        driver: "",
        vehicle: "",
        startWh: "",
        endWh: "",
        startTime: 0,
        endTime: 0,
        status: "0",
        remark: ""
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
        id: 0,
        driver: "",
        vehicle: "",
        startWh: "",
        endWh: "",
        startKeeper: "",
        startTime: 0,
        endKeeper: "",
        endTime: 0,
        status: "0",
        remark: ""
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