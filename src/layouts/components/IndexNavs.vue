<template>
    <el-row :gutter="20" class="mt-5">
        <el-col v-permission="item.perms" :span="3" :offset="0" v-for="(item, index) in navs" :key="index">
            <el-card shadow="hover" @click="$router.push(item.path)">
                <div class="flex flex-col items-center justify-center cursor-pointer">
                    <el-icon :size="25" :class="item.color">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span class="text-sm mt-2">{{ item.title }}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
const navs = [
    {
        icon: "Position",
        title: "系统角色",
        path: "/role/list",
        color: "text-blue-500",
        perms: ['admin', 'role:manage']
    },
    {
        icon: "Pointer",
        title: "系统权限",
        path: "/perms/list",
        color: "text-sky-500",
        perms: ['admin', 'perms:manage']
    },
    {
        icon: "User",
        title: "用户数据",
        path: "/user/list",
        color: "text-indigo-500",
        perms: ['admin', 'user:manage']
    },
    {
        icon: "Service",
        title: "客户数据",
        path: "/co/list",
        color: "text-cyan-500",
        perms: ['admin', 'co:manage']
    },
    {
        icon: "Van",
        title: "车辆数据",
        path: "/vehicle/list",
        color: "text-green-500",
        perms:['admin', 'vehicle:manage']
    },
    {
        icon: "Box",
        title: "货物数据",
        path: "/cargo/list",
        color: "text-amber-500",
        perms:['admin', 'cargo:manage']
    },
    {
        icon: "House",
        title: "仓库数据",
        path: "/wh/list",
        color: "text-green-500",
        perms: ['admin', 'wh:manage']
    },
    {
        icon: "Money",
        title: "财务数据",
        path: "/finance/list",
        color: "text-rose-500",
        perms: ['admin', 'finance:manage']
    }
]
</script>