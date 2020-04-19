<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addRole" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe row-key="id">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom','vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row,item1.id)" closable> {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row :class="['vcenter',i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRightById(scope.row,item2.id)" closable type="success">
                      {{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning"
                      v-for="(item3) in item2.children" :key="item3.id">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button @click="editRole(scope.row.id)" type="primary" icon="el-icon-edit"
              size="mini">编辑</el-button>
            <el-button @click="delRole(scope.row.id)" type="danger" icon="el-icon-delete"
              size="mini">删除</el-button>
            <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting"
              size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%"
      @close="setRightDialogClosed">

      <!-- 树形控件 -->
      <el-tree ref="treeRef" :default-checked-keys="defKeys" :default-expand-all="true"
        node-key="id" show-checkbox :data="rightsList" :props="treeProps">
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRolesDialogVisible" width="50%"
      @close="addRolesDialogClosed" ref="addRolesRef">
      <!-- 添加角色表单 -->
      <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAddRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesDialogVisible" width="50%"
      @close="editRolesDialogClosed" ref="editRolesRef">
      <!-- 编辑角色表单 -->
      <el-form :model="editRolesForm" :rules="addRolesFormRules" ref="editRolesFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditRoles">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
      setRightDialogVisible: false,
      // 保存所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // tree型默认选中数据
      defKeys: [],
      // 当前将要分配权限的角色id
      roleId: '',
      // 添加角色对话框
      addRolesDialogVisible: false,
      // 添加角色表单数据
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单校验规则
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '角色名称在2-10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { max: 50, message: '角色描述在50个字符之内', trigger: 'blur' }
        ]
      },
      // 编辑角色表单数据
      editRolesForm: {},
      // 控制编辑角色对话框显示与隐藏
      editRolesDialogVisible: false
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色失败')
      this.rolesList = res.data
    },
    // 实现展开栏下删除权限
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除！')
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      // 调用递归获取所有三级权限的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归获取所有角色三级权限的id
    getLeafKeys(node, arr) {
      if (!node.children) {
        // 如果当前节点不包含children属性则是第三节点，直接获取它的id即可
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const isStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: isStr }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    // 添加角色
    addRole() {
      this.addRolesDialogVisible = true
    },
    // 关闭添加角色表单清空表单数据
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields()
      this.addRolesForm = {}
    },
    // 发起请求保存添加的角色
    async saveAddRoles() {
      const { data: res } = await this.$http.post('roles', this.addRolesForm)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.addRolesDialogVisible = false
    },
    // 控制编辑角色对话框显示隐藏
    async editRole(id) {
      this.roleId = id
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRolesForm = res.data
      this.editRolesDialogVisible = true
    },
    // 关闭编辑对话框清楚表单内容
    editRolesDialogClosed() {
      this.$refs.editRolesFormRef.resetFields()
      this.editRolesForm = {}
    },
    // 保存角色编辑
    async saveEditRoles() {
      const { data: res } = await this.$http.put(
        `roles/${this.roleId}`,
        this.editRolesForm
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      this.editRolesDialogVisible = false
      this.$message.success('编辑成功')
    },
    // 删除角色
    async delRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      this.$message.success('删除成功')
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
