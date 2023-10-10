<template>
    <div class="app-container">
  
      <!-- 表格 -->
      <el-table
        :data="list"
        border
        fit
        highlight-current-row>
  
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
  
        <el-table-column prop="title" label="课程名称" width="80" />
  
        <el-table-column label="课程状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status==='Normal'?'已发布':'未发布' }}
          </template>
        </el-table-column>
  
        <el-table-column prop="lessonNum" label="课时数"/>
  
        <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
  
        <el-table-column prop="viewCount" label="浏览数量" width="80" />
  
        <el-table-column label="操作" width="450" align="center">
  
          <template slot-scope="scope">
            <router-link :to="'/course/info/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
            </router-link>
  
            <router-link :to="'/course/chapter/'+scope.row.id">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
            </router-link>
  
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除课程信息</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script>
  //引入course.js文件
  import course from '@/api/edu/course'
  
  export default {
    data() { //定义变量和初始值
      return {
        list: null //查询之后接口返回的数据赋值给list
      }
    },
    created() { //页面渲染之前执行,一般用来调用methods中定义的方法
      //调用
      this.getList()
    },
    methods: { //创建具体的方法,调用course.js中定义的方法
        //课程列表的方法
        getList() {
            //调用方法,使用axios发送ajax请求
            course.getListCourse()
            .then(response => {
                this.list = response.data.list
            })
        },

      //根据课程id删除课程
        deleteCourse(courseId) {
            this.$confirm('此操作将永久删除课程记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                course.deleteCourseById(courseId)
                .then(response => {
                    //1.提示删除成功
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                    //2.回到列表页面
                    this.getList()
                })
                .catch(error => {}) //删除失败
            })
        },

    }
  }
  </script>
  