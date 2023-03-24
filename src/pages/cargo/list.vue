<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="权限名称或关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="货物状态">
                        <el-select v-model="queryObj.status" placeholder="未选择" @change="getData()">
                            <el-option v-for="s in cargoStatus" :key="s.key" :label="s.value" :value="s.key">
                            </el-option>
                        </el-select>
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
            <el-button type="primary" @click="handleCreate()">新增货物</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">
            <el-table-column label="货物名称" align="center">
                <template #default="{ row }">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="货物类型" align="center">
                <template #default="{ row }">
                    <span>{{ row.typeName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="委托客户" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.cooperativeName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="目的地" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.destAddr }}</span>
                </template>
            </el-table-column>
            <el-table-column label="验收仓/发货仓" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.startWh }}</span>
                </template>
            </el-table-column>
            <el-table-column label="所在仓/收货仓" align="center" width="200">
                <template #default="{ row }">
                    <span>{{ row.localWh }}</span>
                </template>
            </el-table-column>
            <el-table-column label="货物状态" align="center" width="100">
                <template #default="{ row }">
                    <div v-for="s in cargoStatus" :key="s.key">
                        <span v-show="s.key === row.status">{{ s.value }}</span>
                    </div>
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
                    <div class="op-icon" v-if="scope.row.status == '0'" @click="handleUpdate(scope.row)">
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
                <el-form-item label="货物名称" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="货物类型" prop="type">
                    <el-select v-model="form.type" placeholder="未选择" class="w-1/1">
                        <el-option v-for="t in cargoTypes" :key="t.id" :label="t.name" :value="t.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="目的地" prop="dest">
                    <el-cascader :props="addressProps" :options="pcas" v-model="form.dest" placeholder="未选择" class="w-1/1" />
                </el-form-item>
                <el-form-item label="详细地址" prop="sup">
                    <el-input v-model="form.destAddr" placeholder="请补充目的地详细地址" />
                </el-form-item>
                <el-form-item label="占用空间" prop="space">
                    <el-input v-model="form.space">
                        <template #append>立方/m³</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="货物重量" prop="space">
                    <el-input v-model="form.weight">
                        <template #append>KG</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="remark">
                    <el-input v-model="form.remark" placeholder="货物运送注意事项"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="菜单/权限详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="2" size="large"></el-descriptions>
            <el-descriptions :column="2" size="large">
                <el-descriptions-item label="备注" align="left">
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
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate } from "@/api/admin";
import { customNotification, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";
import { ref } from "vue";

// 城市联级选择器
import pcas from "@/assets/pca-code.json";
const cascaderAddr = ref(null);
const addressProps = {
    label: 'name',
    value: 'code',
    emitPath: false
}

const cargoStatus = ref([]);
const cargoTypes = ref([]);
const module = "cargo";
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
            tableData.value = res.data.data.cargos.map((o) => {
                o.statusLoading = false;
                return o;
            });
            total.value = res.data.data.total;
            cargoStatus.value = res.data.data.cargoStatus;
            cargoTypes.value = res.data.data.cargoTypes;
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
        type: null,
        typeName: "",
        space: null,
        weight: null,
        cooperativeId: null,
        dest: "",
        sup: "",
        destAddr: "",
        startWh: null,
        endWh: null,
        localWh: null,
        remark: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
        status: "-1"
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
        type: null,
        typeName: "",
        space: null,
        weight: null,
        cooperativeId: null,
        dest: "",
        sup: "",
        destAddr: "",
        startWh: null,
        endWh: null,
        localWh: null,
        remark: "",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0,
        status: "-1"
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