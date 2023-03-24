<template>
    <el-card shadow="never" class="border-0 pl-0">
        <!-- 搜索框 -->
        <el-form :model="queryObj" label-width="auto" class="mb-3 font-bold">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-form-item label="关键词">
                        <el-input v-model="queryObj.keyword" placeholder="用户名或用户姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="用户性别">
                        <el-radio-group v-model="queryObj.gender" @change="getData()">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="0">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="用户角色">
                        <el-select v-model="queryObj.rid" placeholder="未选择" @change="getData()">
                            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户状态">
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
            <el-button type="primary" @click="handleCreate()">新增用户</el-button>
            <el-tooltip content="刷新数据" placement="top" effect="dark">
                <el-button text @click="getData()">
                    <el-icon :size="30">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" size="small">
            <el-table-column label="用户" width="210">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :style="`background:${extractColorByName(row.username)}`">
                            {{ row.name.split("")[0] }}
                        </el-avatar>
                        <div class="ml-5">
                            <h6>{{ row.name }}</h6>
                            <small>ID:{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="性别" align="center" width="50">
                <template #default="{ row }">
                    {{ row.gender ? (row.gender == "0" ? "女" : "男") : "未知" }}
                </template>
            </el-table-column>
            <el-table-column label="用户名" align="center">
                <template #default="{ row }">
                    {{ row.username }}
                </template>
            </el-table-column>
            <el-table-column label="身份信息" align="center" width="200">
                <template #default="{ row }">
                    {{ row.idNo }}
                </template>
            </el-table-column>
            <el-table-column label="联系方式" align="center">
                <template #default="{ row }">
                    {{ row.phone }}
                </template>
            </el-table-column>
            <el-table-column label="联系地址" align="center">
                <template #default="{ row }">
                    {{ row.address }}
                </template>
            </el-table-column>
            <el-table-column label="用户角色" align="center">
                <template #default="{ row }">
                    {{ row.role ? row.role : "默认用户" }}
                </template>
            </el-table-column>
            <el-table-column label="用户状态" align="center" width="100">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="'0'" :inactive-value="'1'"
                        @change="handleStatusChange(row, $event)" :loading="row.statusLoading"
                        :disabled="row.role == '系统管理员'">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
                <template #default="scope">
                    <div class="op-icon">
                        <el-tooltip content="查看" placement="bottom" @click="openInfoDrawer(scope.row)">
                            <el-icon>
                                <View />
                            </el-icon>
                        </el-tooltip>
                    </div>
                    <div class="op-icon" v-if="scope.row.role !== '系统管理员'" @click="handleUpdate(scope.row)">
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
            <el-form :model="form" ref="formRef" :rules="rules" :validate-on-rule-change="false" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-if="optId === 0" v-model="form.password" placeholder="默认密码为用户证件信息后6位" />
                    <el-button v-else type="primary" size="" round @click="handleResetUserPwd(optId)">重置密码</el-button>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="form.gender">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item minlength="15" maxlength="18" show-word-limit label="身份证号" prop="idNo">
                    <el-input v-model="form.idNo"></el-input>
                </el-form-item>
                <el-form-item minlength="11" maxlength="13" show-word-limit label="联系方式" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="联系地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="rid">
                    <el-select v-model="form.rid" :placeholder="form.role ? form.role : '请选择用户角色'">
                        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <InfoDrawer ref="infoDrawerRef" title="用户详细信息" destoryOnClose>
            <el-descriptions :title="info.name" :column="2" size="large">
                <el-descriptions-item label="编号" align="left">{{ info.id }}</el-descriptions-item>
                <el-descriptions-item label="用户名" align="left">{{ info.username }}</el-descriptions-item>
                <el-descriptions-item label="用户角色" align="left">{{ info.role }}</el-descriptions-item>
                <el-descriptions-item label="性别" align="left">{{ info.gender === '1' ? '男' : '女' }}</el-descriptions-item>
                <el-descriptions-item label="联系方式" align="left">{{ info.phone }}</el-descriptions-item>
                <el-descriptions-item label="身份信息" align="left">{{ info.idNo }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions :column="1" size="large">
                <el-descriptions-item label="创建时间" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy ?
                    info.createBy : "系统原始" }}创建</el-descriptions-item>
                <el-descriptions-item label="最近更新" align="left">{{ getTimestampConversion(info.createTime) }},{{
                    info.createBy ?
                    info.createBy : "系统原始" }}更新</el-descriptions-item>
            </el-descriptions>
        </InfoDrawer>
    </el-card>
</template>

<script setup>
import { queryList, changeStatus, moduleObjAdd, moduleObjUpdate, resetUserPwd } from "@/api/admin";
import { checkIdNo, checkUsername } from "@/api/common";
import { customNotification, showModel, extractColorByName, isPhoneNo, isChinaIdNo, getTimestampConversion } from "@/composables/util";
import { ref } from "vue";
import FormDrawer from "@/layouts/components/FormDrawer.vue";
import InfoDrawer from "@/layouts/components/InfoDrawer.vue";
import { tableDataInit, formDataInit, infoDataInit } from "@/composables/useCommon";

const module = "user";
const rules = {
    phone: [
        { required: true, message: "联系方式不能为空", trigger: "blur" },
        // {
        //     validator: function (phone, value, callback) {
        //         if (isPhoneNo(value)) {
        //             callback()
        //         } else {
        //             callback(new Error('联系方式格式错误'))
        //         }
        //     },
        //     trigger: "blur"
        // }
    ],
    idNo: [
        { required: true, message: "身份证号不能为空", trigger: "blur" },
        // {
        //     validator: function (idNo, value, callback) {
        //         // checkIdNo(value).then(res => {
        //         //     if (res.data.code == 200) {
        //         //         callback()
        //         //     } else {
        //         //         callback(new Error('身份证信息重复'))
        //         //     }
        //         // })
        //         // if (isChinaIdNo(value)) {
        //         //     callback()
        //         // } else {
        //         //     callback(new Error('身份证号格式错误'))
        //         // }
        //     },
        //     trigger: "blur"
        // }
    ],
    username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
};
const roles = ref([]);
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
        gender: "",
        status: "",
        rid: "",
        cur: 1,
        size: 10
    },
    getList: queryList,
    changeStatus: changeStatus,
    onGetListSuccess: res => {
        if (res.data.code == 200) {
            tableData.value = res.data.data.users.map((o) => {
                o.statusLoading = false;
                return o;
            });
            total.value = res.data.data.total;
            roles.value = res.data.data.roles;
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
        rid: null,
        role: null,
        username: "",
        password: "",
        name: "",
        gender: "",
        idNo: "",
        phone: "",
        address: "",
        status: "0",
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
        id: null,
        rid: null,
        role: null,
        username: "",
        password: "",
        name: "",
        gender: "",
        idNo: "",
        phone: "",
        address: "",
        status: "0",
        createBy: "",
        createTime: 0,
        updateBy: "",
        updateTime: 0
    }
})

const handleResetUserPwd = (id) => {
    showModel("是否确认重置用户密码?").then((res) => {
        resetUserPwd(id).then((res) => customNotification("success", res.data.msg));
    })
}
</script>
<style lang="postcss" scoped>
:deep(.el-descriptions__title) {
    font-size: 24px !important;
}

:deep(.el-descriptions__label) {
    @apply text-gray-600;
    font-weight: bolder !important;
}
</style>