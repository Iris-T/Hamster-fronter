<template>
    <el-row :gutter="20" class="mt-5">
        <el-col v-permission="item.perms" :span="4" :offset="0" v-for="(item, index) in navs" :key="index">
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
        icon: "User",
        title: "用户",
        path: "/user/list",
        color: "text-indigo-500",
        perms: ['admin', 'user:manage']
    },
    {
        icon: "Service",
        title: "合作伙伴",
        path: "/co/list",
        color: "text-blue-500",
        perms: ['admin', 'co:manage']
    },
    {
        icon: "Van",
        title: "车辆",
        path: "/vehicel/list",
        color: "text-sky-500",
        perms:['admin', 'vehicel:manage']
    },
    {
        icon: "Box",
        title: "货物",
        path: "/cargo/list",
        color: "text-teal-500",
        perms:['admin', 'cargo:manage']
    },
    {
        icon: "Location",
        title: "运输",
        path: "/trans/list",
        color: "text-green-500",
        perms: ['admin', 'trans:manage']
    },
    {
        icon: "Money",
        title: "财务",
        path: "/finance/list",
        color: "text-rose-500",
        perms: ['admin', 'finance:manage']
    }
]
</script>