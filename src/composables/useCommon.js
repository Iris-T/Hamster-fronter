import { ref, reactive, computed } from "vue";
import { success, warning } from "@/composables/util";

// Table数据获取，分页，刷新，更新状态
export function tableDataInit(opt = {}) {
  let queryObj = null;
  let resetQueryObj = null;
  if (opt.queryObj) {
    // 初始化搜索对象
    queryObj = reactive({ ...opt.queryObj });
    resetQueryObj = () => {
      for (const k in opt.queryObj) {
        queryObj[k] = opt.queryObj[k];
      }
      getData();
    };
  }
  const tableData = ref([]);
  const loading = ref(false);
  const total = ref(0);

  // 更新状态
  const handleStatusChange = (row, status) => {
    row.statusLoading = true;
    opt
      .changeStatus(opt.module, row.id, status)
      .then((res) => {
        if (res.data.code === 200) {
          success(res.data.msg);
          getData(queryObj);
        } else {
          warning(res.data.msg);
        }
      })
      .finally(() => (row.statusLoading = false));
  };

  async function getData(cur = {type: Number, default: 1}) {
    if (typeof cur == "number") {
      queryObj.cur = cur;
    }

    loading.value = true;
    opt
      .getList(opt.funcPath, queryObj)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          total.value = res.data.data.total;
          roles.value = res.data.data.roles;
          perms.value = res.data.data.perms;
        }
      })
      .finally(() => (loading.value = false));
  }
  getData();

  return {
    queryObj,
    tableData,
    loading,
    total,
    resetQueryObj,
    getData,
    handleStatusChange,
  };
}
// 新增、修改对象信息
export function formDataInit(opt = {}) {
  const optId = ref(0);
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const defualtForm = opt.form;
  const form = reactive({});
  const drawerTitle = computed(() =>
    optId.value == 0 ? "新增用户" : "修改用户"
  );

  // 设置表单数据
  function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate();
    if (row) {
      for (const key in defualtForm) {
        form[key] = row[key];
      }
    }
  }

  const handleCreate = () => {
    resetForm(defualtForm);
    optId.value = 0;
    formDrawerRef.value.open();
  };

  const handleUpdate = (row) => {
    resetForm(row);
    optId.value = row.id;
    formDrawerRef.value.open();
  };

  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();
      const func =
        optId.value != 0
          ? opt.update(opt.module, optId.value, form)
          : opt.create(opt.module, form);
      func
        .then((res) => {
          if (res.data.code == 200) {
            success(res.data.msg);
            // 刷新数据
            opt.getData();
            // 成功则关闭Drawer组件
            formDrawerRef.value.close();
          } else {
            warning(res.data.msg);
          }
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  return {
    optId,
    formDrawerRef,
    formRef,
    form,
    drawerTitle,
    handleCreate,
    handleUpdate,
    handleSubmit,
  };
}

// 查看对象信息
export function infoDataInit(opt = {}) {
  const infoDrawerRef = ref(null);
  const info = reactive({});
  const defualtInfo = opt.info;

  // 设置查阅信息数据
  function resetInfo(row = false) {
    if (row) {
      for (const k in defualtInfo) {
        info[k] = row[k];
      }
    }
  }

  // 打开InfoDrawer
  const openInfoDrawer = (row) => {
    resetInfo(row);
    infoDrawerRef.value.open();
  };

  return {
    infoDrawerRef,
    info,
    openInfoDrawer,
  };
}
