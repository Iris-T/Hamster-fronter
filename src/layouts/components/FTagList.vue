<template>
  <div class="f-tag-list">
    <el-tabs v-model="activeTab" type="card" class="flex-1" style="min-width: 100px" @tab-change="changeTab"
      @tab-remove="removeTab">
      <el-tab-pane v-for="item in tabList" :key="item.path" :label="item.title" :name="item.path"
        :closable="item.path !== '/'">
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleCloseTag">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他标签页</el-dropdown-item>
            <el-dropdown-item command="clearAll">关闭所有标签页</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 40px"></div>
</template>

<script setup>
import { useTabList } from "@/composables/useTabList"

const {
  activeTab,
  tabList,
  removeTab,
  changeTab,
  handleCloseTag
} = useTabList();
</script>

<style lang="postcss" scoped>
.f-tag-list {
  @apply fixed flex items-center;
  top: 64px;
  left: 200px;
  right: 0;
  height: 52px;
  backdrop-filter: blur(5px);
  z-index: 100;
}

.tag-btn {
  @apply rounded ml-auto flex justify-center items-center;
  height: 38px;
  width: 38px;
}

:deep(.el-tabs__header) {
  border: 0 !important;
  @apply mb-0;
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  border: 0 !important;
  height: 38px;
  line-height: 38px;
  @apply bg-gray-100 mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 38px;
  height: 38px;
}

:deep(.is-disable) {
  cursor: not-allowed;
  @apply bg-light-50;
}
</style>
