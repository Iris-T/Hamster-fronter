<template>
  <div class="f-menu">
    <el-menu :default-active="$route.path" class="border-0" @select="handleSelect">
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component v-if="item.icon" :is="item.icon"></component>
              <Expand v-else />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.children" :key="index2" :index="item2.path">
            <template #title>
              <el-icon>
                <component v-if="item2.icon" :is="item2.icon"></component>
                <Guide v-else />
              </el-icon>
              <span>{{ item2.name }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item v-else :index="item.path">
          <template #title>
            <el-icon>
              <component v-if="item.icon" :is="item.icon"></component>
              <Expand v-else />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { ref, reactive } from "vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

const defaultActive = ref(route.path);

const asideMenus = reactive(store.state.menu);

const handleSelect = (e) => {
  router.push(e);
};
</script>

<style lang="postcss">
.f-menu {
  width: 200px;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow: auto;
  @apply shadow-sm fixed bg-light-200;
}

.f-menu::-webkit-scrollbar {
  width: 0;
}

.el-submenu .el-menu-item {
  min-width: 200px !important;
  max-width: 200px !important;
}

.el-menu-item.is-active {
  color: #6366f1!important;

  span {
    color: #6366f1!important;
  }
}
</style>
