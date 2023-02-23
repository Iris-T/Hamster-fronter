<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="角色名称或关键字"></el-input>
                    </el-form-item>
                    <el-form-item label="启用状态">
                        <el-radio-group v-model="queryObj.status">
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
            <el-button type="primary" @click="handleCreate()">新增角色</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">
            <el-table-column label="角色名称" align="center">
                <template #default="{ row }">
                    {{ row.name }}
                </template>
            </el-table-column>
            <el-table-column label="关键字" align="center">
                <template #default="{ row }">
                    {{ row.rkey }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template #default="{ row }">
                    {{ getTimestampConversion(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="最近一次更新" align="center">
                <template #default="{ row }">
                    {{ getTimestampConversion(row.updateTime) }}
                </template>
            </el-table-column>
            <el-table-column label="备注说明" align="center">
                <template #default="{ row }">
                    {{ row.remark }}
                </template>
            </el-table-column>
            <el-table-column label="角色状态" align="center" width="100">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="'0'" :inactive-value="'1'"
                        @change="handleStatusChange(row, $event)" :loading="row.statusLoading" :disabled="row.name == '系统管理员'">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <small v-if="scope.row.name == '系统管理员'">该角色不可被修改</small>
                    <el-button v-else type="primary" size="small" text @click="handleUpdate(scope.row)">修改信息</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="queryObj.cur"
                :page-size="queryObj.size" @current-change="getData()" />
            <small class="ml-6 text-gray-500">共{{ total }}条数据</small>
        </div>

        <FormDrawer ref="formDrawerRef" :title="drawerTitle" destoryOnClose @submit="handleSubmit()">
            <el-form :model="form" ref="formRef" :rules="rules" :validate-on-rule-change="false" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="关键字" prop="rkey">
                    <el-input v-model="form.rkey"></el-input>
                </el-form-item>
                <el-form-item label="角色备注" prop="remark">
                    <el-input v-model="form.remark" placeholder="建议对角色权限做简单介绍"></el-input>
                </el-form-item>
                <el-form-item label="启用状态" prop="status">
                    <el-switch :modelValue="form.status" active-value="0" inactive-value="1"
                        @change="form.status = form.status == '0' ? '1' : '0'"></el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate } from "@/api/admin";
import { ref } from "vue";
import { error, ms2LocalDateStr, getTimestampConversion } from "@/composables/util";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import { tableDataInit, formDataInit } from "@/composables/useCommon";

const module = "role";
const path = "role/list";
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
    funcPath: path,
    queryObj: {
        keyword: "",
        status: ""
    },
    getList: queryList,
    changeStatus: changeStatus,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.roles.map((o) => {
                o.statusLoading = false;
                return o;
            });
            total.value = res.data.data.total;
        } else {
            error(res.data.msg);
        }
    }
});
const {
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
        rKey: "",
        remark: "",
        status: "0"
    },
    getData,
    create: moduleObjAdd,
    update: moduleObjUpdate,
});
</script>