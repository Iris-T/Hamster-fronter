<template>
  <el-card shadow="hover" class="mt-5">
    <template #header>
      <div class="flex justify-between">
        <span class="text-md font-bold">运输数据统计</span>
        <div>
          <el-check-tag v-for="(item, index) in options" :key="index" :checked="cur == item.value"
            @click="handleChoose(item.value)" style="margin-right: 8px">
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%; height: 326px;"></div>
  </el-card>
</template>
<script setup>
import { error } from "@/composables/util";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { chartInfo } from "@/api/index";
import * as echarts from "echarts";

const cur = ref("m");
const options = [
  {
    text: "近24小时数据",
    value: "d",
  },
  {
    text: "周订单数据",
    value: "w",
  },
  {
    text: "月订单数据",
    value: "m",
  },
];

const handleChoose = (value) => {
  cur.value = value;
  getChartInfo();
};

var myChart = null;
onMounted(() => {
  var chartDom = document.getElementById("chart");
  if (chartDom) {
    myChart = echarts.init(chartDom);
    getChartInfo();
  }
});

onBeforeUnmount(() => {
  if (myChart) {
    echarts.dispose(myChart);
  }
});

function getChartInfo() {
  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {},
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
    },
    // 日期
    yAxis: {
      type: "category",
      data: [],
    },
    // 多组数据
    series: [],
  };

  myChart.showLoading();
  chartInfo(cur.value)
    .then((res) => {
      if (res.data.code === 200) {
        option.yAxis.data = res.data.data.date;
        option.series = [
          {
            name: "总运输订单数",
            type: "bar",
            data: res.data.data.sum,
          },
          {
            name: "进行中订单数",
            type: "bar",
            data: res.data.data.ongoing,
          },
          {
            name: "已完成订单数",
            type: "bar",
            data: res.data.data.finish,
          },
        ];
        myChart.setOption(option);
      } else {
        error(res.data.msg);
      }
    })
    .finally(() => {
      myChart.hideLoading();
    });
}

const el = ref(null);
useResizeObserver(el, (entries) => {
  myChart.resize();
});
</script>
