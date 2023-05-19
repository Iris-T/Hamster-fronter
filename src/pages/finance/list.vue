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
        <div class="flex items-center justify-end mb-4">
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">
            <el-table-column label="货物编号" align="center" width="150">
                <template #default="{ row }">
                    <span>{{ row.cid }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运输编号" align="center" width="150">
                <template #default="{ row }">
                    <span>{{ row.tid }}</span>
                </template>
            </el-table-column>
            <el-table-column label="货物名称" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.cargoName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="目的地" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.target }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运输费用" align="center" width="150">
                <template #default="{ row }">
                    <span>￥{{ (row.weight * row.space * row.distance * row.baseFee).toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作业司机" align="center" width="150">
                <template #default="{ row }">
                    <span>{{ row.driver }}</span>
                </template>
            </el-table-column>
            <el-table-column label="作业车辆" align="center" width="150">
                <template #default="{ row }">
                    <span>{{ row.vehicle }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <div class="op-icon" @click="openInfoDrawer(scope.row)">
                        <el-tooltip content="查看详细费用信息" placement="bottom">
                            <el-icon>
                                <View />
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

        <InfoDrawer ref="infoDrawerRef" title="费用详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="1" size="large">
                <el-descriptions-item label="货物名称" align="left">{{ info.cargoName }}</el-descriptions-item>
                <el-descriptions-item label="货物编号" align="left">{{ info.cid }}</el-descriptions-item>
                <el-descriptions-item label="运单编号" align="left">{{ info.tid }}</el-descriptions-item>
                <el-descriptions-item label="目的地" align="left">{{ info.target }}</el-descriptions-item>
                <el-descriptions-item label="起始点" align="left">{{ info.startWh }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" size="large">
                <el-descriptions-item label="货物重量(kg)" align="left">{{ info.weight }}</el-descriptions-item>
                <el-descriptions-item label="货物占地(m³)" align="left">{{ info.space }}</el-descriptions-item>
                <el-descriptions-item label="运输距离(km)" align="left">{{ info.distance.toFixed(2) }}</el-descriptions-item>
                <el-descriptions-item label="费用基数(元/km·kg·m³)" align="left">{{ info.baseFee }}</el-descriptions-item>
                <el-descriptions-item label="计算公式" align="left">费用基数*货物重量*占地空间*运输距离</el-descriptions-item>
            </el-descriptions>
        </InfoDrawer>
    </el-card>
</template>

<script setup>
import { queryList, changeStatus } from "@/api/admin";
import { customNotification } from "@/composables/util";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, infoDataInit } from "@/composables/useCommon";

const module = "finance";
const {
    queryObj,
    tableData,
    loading,
    total,
    resetQueryObj,
    getData
} = tableDataInit({
    module: module,
    queryObj: {
        keyword: "",
        status: "",
        cur: 1,
        size: 10
    },
    getList: queryList,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.fee.map((o) => {
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
    infoDrawerRef,
    info,
    openInfoDrawer
} = infoDataInit({
    info: {
        cid: 0,
        tid: 0,
        cargoName: "",
        weight: 0.000,
        space: 0.000,
        baseFee: 0.00,
        distance: 0.00,
        cooperative: "",
        cargoType: "",
        driver: "",
        vehicle: "",
        startWh: "",
        target: "",
    }
})
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