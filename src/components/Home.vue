<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu :collapse="isCollapse" :collapse-transition="false" unique-opened router
          background-color="#333744" text-color="#fff" active-text-color="#409EFF"
          :default-active="activePath">
          <el-menu-item index="/welcome" class="home">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menulist" :key="item.id" :index="item.id+''">
            <!-- 一级菜单得模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavstate('/' + subitem.path)" :index=" '/' + subitem.path "
              v-for="subitem in item.children" :key="subitem.id">
              <!-- 二级菜单得模板区 -->
              <template slot="title">
                <!-- 二级图标 -->
                <i class="el-icon-menu"></i>
                <!-- 二级文本 -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('actionPath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.console.error(res.meta.msg)
      }
      this.menulist = res.data
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavstate(actionPath) {
      window.sessionStorage.setItem('actionPath', actionPath)
      this.activePath = actionPath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // background: url('../assets/img/logo.png');
  background-size: cover;
  background-color: #373d41;
  > div {
    display: flex;
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
}

.el-main {
  background-color: #eaedf1;
  padding: 5px;
  box-sizing: border-box;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
