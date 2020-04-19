<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容"
            v-model.trim="queryInfo.query">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width:100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- scope.row 获取当前行的数据 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- scope.row 获取当前行的数据 -->
            <!-- 修改 -->
            <el-button @click="editUser(scope.row.id)" type="primary" icon="el-icon-edit"
              size="mini"></el-button>
            <!-- 删除 -->
            <el-button @click="delUser(scope.row.id)" type="danger" icon="el-icon-delete"
              size="mini"></el-button>
            <!-- 分配角色 -->
            <el-tooltip :enterable="false" class="item" effect="dark" content="分配角色"
              placement="top">
              <el-button @click="showAllotRoleDialog(scope.row)" type="warning"
                icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5,10, 20, 30, 40,50,100]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog @close="addDialogClosed" title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户对话框  -->
    <el-dialog @close="editDialogClosed" title="修改用户信息" :visible.sync="editDialogVisible"
      width="50%">
      <!-- 主体内容区 -->
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加分配角色对话框 -->
    <el-dialog @close="allotRoleDialogClosed" title="分配角色" :visible.sync="allotRoleDialogVisible"
      width="50%">
      <!-- 主体内容区 -->
      <p>当前用户：{{ userinfo.username }}</p>
      <p>当前角色：{{ userinfo.role_name }}</p>
      <p>分配角色：
        <el-select v-model="selectedRoleId" placeholder="请选择角色">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <!-- 底部按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAllotDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入正确的邮箱'))
    }
    // 自定义验证手机规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户列表得参数数据
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户表单的数据对象
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 添加用户表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度为3-10个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度为6-15个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户信息对话框的显示与隐藏
      editDialogVisible: false,
      // 控制分配角色对话框显示与隐藏
      allotRoleDialogVisible: false,
      // 需要分配角色的用户
      userinfo: {},
      // 所有角色列表
      rolesList: [],
      // 选中的角色id值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pageSize
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听页码值变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关的状态
    async userStateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户Dialog关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 发起请求添加用户
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 编辑用户（根据ID获取要编辑用户的信息）
    async editUser(id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('未取到对应用户信息')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 发起请求保存编辑
    saveEditUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        // 发起请求更新用户
        const { email, mobile } = this.editForm
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          { email, mobile }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 监听编辑Dialog关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.editForm = {}
    },
    // 删除用户
    delUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`)
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success(res.meta.msg)
          this.getUserList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 显示分配角色对话框
    async showAllotRoleDialog(info) {
      this.userinfo = info
      // 获取全部角色
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      this.allotRoleDialogVisible = true
    },
    // 保存分配角色
    async saveAllotDialog() {
      if (!this.selectedRoleId) return this.$message.error('请选择用户角色')
      const { data: res } = await this.$http.put(
        `users/${this.userinfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户角色失败')
      }
      this.$message.success('更新用户角色成功')
      this.getUserList()
      this.allotRoleDialogVisible = false
    },
    // 监听分配角色对话框关闭
    allotRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
