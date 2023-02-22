<template>
    <el-result class=" items-center justify-center">
        <template #icon>
            <el-image :src="image404" />
        </template>
        <template #title>
            <h2 class=" text-6xl font-bold text-stone-700">
                404
            </h2>
        </template>
        <template #sub-title>
            <p class=" font-bold text-stone-500">
                对不起,您请求的页面不存在
            </p>
        </template>
        <template #extra>
            <el-button class="w-[100px]" color="#8b5cf6" round type="primary" @click="$router.push('/')">返回首页</el-button>
        </template>
    </el-result>
</template>

<script setup>
import image404 from '@/assets/404.png'
</script>