<template>
  <div class="body">
    <!-- 面包屑导航
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    </el-breadcrumb> -->

    <el-card class="border" style="box-sizing:border-box">

    </el-card>

    <el-card style="margin:10px 0;height:150px;box-sizing:border-box;position:relative" class="border">
      <el-carousel trigger="click" height="100px">
      <el-carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    </el-card>

    <el-row :gutter="10">
      <el-col :span="12">
        <el-card style="height:500px" class="border">

        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height:200px;box-sizing:border-box" class="border">

        </el-card>
        <el-card style="height:350px;margin-top:10px;box-sizing:border-box" class="border">

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.body{
  height: 100%;
   background: url('../assets/img/bg.jpg') no-repeat;
  background-size: cover;
  background-color: transparent;
}
.title{
  position: relative;
  box-sizing: border-box!important;
}

.border{
  border: 2px solid red;
  border-image: url('../assets/img/border.png') 51 38 21 132;
  border-width: 51px 38px 21px 132px;
  background-color: transparent;
}

.el-carousel{
position: absolute;
top: 0;
left: 0;
}
</style>
