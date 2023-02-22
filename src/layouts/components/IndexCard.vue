<template>
  <el-card shadow="never" class="mt-5">
    <template #header>
      <div class="flex justify-between">
        <span class="text-md font-bold">{{ title }}</span>
        <el-tag size="large" type="danger" effect="light">{{ tip }}</el-tag>
      </div>
    </template>
    <el-row :gutter="20">
        <el-col :span="6" :offset="0" v-for="(item, index) in info" :key="index">
            <el-card shadow="hover" class="border-0">
                <div class="flex flex-col justify-center items-center">
                    <span class="text-2xl mb-2">{{ item.value }}</span>
                    <span class="text-xs text-gray-500">{{ item.title }}</span>
                </div>
            </el-card>
        </el-col>
    </el-row>
    
  </el-card>
</template>
<script setup>
defineProps({
  title: String,
  tip: String,
  info: Array
});
</script>
<style scoped>
/* ::deep(.el-col-24/5) {
    width: 20%;
} */
</style>
