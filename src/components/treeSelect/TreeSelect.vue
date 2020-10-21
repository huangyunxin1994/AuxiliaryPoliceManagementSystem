<template>
  <a-tree-select
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="tree"
    :allowClear="allowClear"
    :replaceFields="replaceFields"
    :treeCheckStrictly="treeCheckStrictly"
    :tree-checkable="checkable"
    placeholder="请选择组织"
    tree-default-expand-all
    @change="change"
  >
  </a-tree-select>
</template>
<script>
function filterArray(data) {
  data.forEach(function (item) {
    delete item.children;
  });
  var map = {};
  data.forEach(function (item) {
    map[item.id] = item;
  });
  var val = [];
  data.forEach(function (item) {
    var parent = map[item.parentId] || map[item.code];
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      val.push(item);
    }
  });
  console.log(val);
  return val;
}
export default {
  props: {
    allowClear: {
      type: Boolean,
      default: true,
    },
    replaceFields: {
      type: Object,
      default() {
        return {
          children: "children",
          title: "name",
          key: "id",
          value: "id",
        };
      },
    },
    treeCheckStrictly: {
      type: Boolean,
      default: true,
    },
    checkable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tree: [],
      value: "",
    };
  },
  mounted() {
    this.$api.organizationService.getOrganization().then((res)=>{
        let tree = res.data.data.data
        tree.forEach(item => {
            item.scopedSlots = { title: "custom" }
        })
        this.tree = filterArray(res.data.data.data)
        console.log(this.tree);
        // this.$emit("getTreeData",this.filterTree)
    })
    // this.initData();
  },
  methods: {
    initData() {
      const tree1 = [
        {
          id: 1,
          name: "根组织",
          code: "000001",
        },
        {
          id: 2,
          name: "西乡塘",
          code: "000002",
          parentId: 1,
        },
        {
          id: 3,
          name: "青秀",
          code: "000003",
          parentId: 1,
        },
        {
          id: 4,
          name: "西乡塘1",
          code: "000004",
          parentId: 2,
        },
        {
          id: 5,
          name: "青秀1",
          code: "000005",
          parentId: 3,
        },
      ];
      this.tree = filterArray(tree1);
      console.log(this.tree);
    },
    change(value) {
      // 将组织id传出去
      console.log(value);
      let val = "";
      if (Array.isArray(value)) {
        value.map((i) => (val += i.value + ","));
        val = val.slice(0, val.length - 1);
        console.log(val);
      } else {
        val = value;
      }
      this.$emit("handleTreeChange", val);
    },
  },
};
</script>