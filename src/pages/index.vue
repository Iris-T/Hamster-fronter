<template>
  <div>
    <el-row :gutter="20">
      <template v-if="staticInfo.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col :span="8" v-for="(item, index) in staticInfo" :key="item.key">
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between">
              <span class="text-md font-bold">{{ item.title }}</span>
              <el-tag size="large" :type="item.type" effect="light">{{
                item.unit
              }}</el-tag>
            </div>
          </template>
          <span class="text-5xl font-bold text-gray-500 flex justify-center">
            <CountTo v-if="item.unit == '人民币/元'" :value="Intl.NumberFormat('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                    currencyDisplay: 'symbol',
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: decimals,
                }).format(item.value)" />
            <CountTo v-else :value="item.value" />
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <IndexNavs />

    <el-row :gutter="20" class="flex">
      <el-col :span="12" :offset="0">
        <IndexChart v-permission="['sys:board']" />
      </el-col>
      <el-col :span="12" :offset="0">
        <IndexCard v-permission="['sys:board']" title="系统登记车辆信息展示" tip="查看详细信息" :info="car" />
        <IndexCard v-permission="['sys:board']" title="系统登记仓库信息展示" tip="查看详细信息" :info="wh" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import CountTo from "@/layouts/components/CountTo.vue";
import IndexNavs from "@/layouts/components/IndexNavs.vue";
import IndexChart from "@/layouts/components/IndexChart.vue";
import IndexCard from "@/layouts/components/IndexCard.vue";

import { ref } from "vue";
import { getInfo, facility } from "@/api/index";
import { customNotification } from "@/composables/util";

const staticInfo = ref({});
const car = ref([]);
const wh = ref([]);

getInfo()
  .then((res) => {
    if (res.data.code === 200) {
      staticInfo.value = res.data.data;
    } else {
      customNotification("error", res.data.msg);
    }
  });

facility()
  .then((res) => {
    if (res.data.code === 200) {
      car.value = res.data.data.car;
      wh.value = res.data.data.wh;
    } else {
      customNotification("error", res.data.msg);
    }
  });
</script>
