<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader v-model="selectedKeys" :options="cateList" :props="cateProps"
            @change="handleChange" clearable>
          </el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addParams">添加参数
          </el-button>

          <!-- 动态参数数据表格 -->
          <el-table :data="manyTableData" border stripe row-key="id">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">
                  {{ item }}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit"
                  size="mini">
                  编辑
                </el-button>
                <el-button @click="delParams(scope.row.attr_id)" type="danger" icon="el-icon-delete"
                  size="mini">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addAttribute">添加属性
          </el-button>

          <!-- 静态属性面板 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable @close="handleClose(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">
                  {{ item }}
                </el-tag>
                <!-- 输入框 -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="showEditDialog(scope.row)" type="primary" icon="el-icon-edit"
                  size="mini">编辑
                </el-button>
                <el-button @click="delParams(scope.row.attr_id)" type="danger" icon="el-icon-delete"
                  size="mini">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数\添加属性对话框 -->
    <el-dialog @close="addDialogClosed" :title="'添加'+addDialogTitle"
      :visible.sync="addDialogVisible" width="50%">
      <!-- 添加表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px"
        class="demo-ruleForm">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数\编辑属性对话框 -->
    <el-dialog @close="editDialogClosed" :title="'编辑'+addDialogTitle"
      :visible.sync="editDialogVisible" width="50%">
      <!-- 添加表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px"
        class="demo-ruleForm">
        <el-form-item :label="addDialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类列表
      cateList: [],
      // 配置级联选择框
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选中项的id数组
      selectedKeys: [],
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 控制添加对话框显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单对象
      addForm: {
        attr_name: ''
      },
      // 编辑表单
      editForm: {},
      // 添加参数表单校验规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      editFormRules: {
        attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }]
      },
      // 控制编辑对话框的展示与隐藏
      editDialogVisible: false
    }
  },
  methods: {
    async handleInputConfirm(info) {
      if (info.inputValue.trim().length === 0) {
        info.inputValue = ''
        info.inputVisible = false
        return
      }
      info.attr_vals.push(info.inputValue.trim())
      info.inputValue = ''
      info.inputVisible = false
      // 发起请求，保存数据
      this.saveAttrVals(info)
    },
    // 点击按钮，展示tag文本添加框
    showInput(info) {
      info.inputVisible = true
      // 让文本框获得焦点
      // $nextTick 当页面上元素被重新渲染后，才会执行回调
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(i, info) {
      info.attr_vals.splice(i, 1)
      this.saveAttrVals(info)
    },
    // 发起请求保存tag
    async saveAttrVals(info) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${info.attr_id}`,
        {
          attr_name: info.attr_name,
          attr_sel: info.attr_sel,
          attr_vals: info.attr_vals.join(',')
        })
      if (res.meta.status !== 200) {
        return this.$message.error('操作失败')
      }
      this.$message.success('操作成功')
    },
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data
    },
    // 级联选择项改变触发
    handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件处理函数
    handleClick() {
      this.getParamsData()
    },
    // 封装获取全部分类参数数据方法
    async getParamsData() {
      // 如果选中的不是三级分类，直接返回
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选分类的id和当前所处的面板获取对应的分类参数
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      // 处理展开栏数据，服务器返回的是字符串
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)

      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加参数按钮事件
    addParams() {
      this.addDialogVisible = true
    },
    // 监听添加属性按钮事件
    addAttribute() {
      this.addDialogVisible = true
    },
    // 监听添加对话框确定按钮事件
    saveParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败')
        this.$message.success('添加成功')
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.addForm = {}
    },
    // 展示编辑对话框
    async showEditDialog(info) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${info.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听编辑对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 提交编辑
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败')
        }
        this.$message.success('修改成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 删除
    async delParams(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 取消删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('删除已取消')
      }
      // 删除
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getParamsData()
      this.$message.success('删除成功')
    }
  },
  created() {
    // 获取所有商品分类列表
    this.getCateList()
  },
  // 计算属性
  computed: {
    // 控制按钮是否禁用
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取级联选择器选中的第三级分类的id
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    // 获取对应的添加对话框的标题显示
    addDialogTitle() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
.el-tabs {
  margin-top: 15px;
}
.input-new-tag {
  width: 120px;
}

.el-tag{
  margin: 0 5px;
}
</style>
