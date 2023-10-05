<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a
            :href="
              OSS_PATH + '/excel/example.xlsx'
            "
            >点击下载模版</a
          >
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"  
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API + '/eduService/subject/addSubject'"
          name="file"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        >
        
        <!-- //auto-upload="false"  上传文件之前不自动上传到服务器
        //:on-success="fileUploadSuccess"  上传成功的回调
        //:on-error="fileUploadError"  上传失败的回调
        //:disabled="importBtnDisabled"  是否禁用上传功能
        //:limit="1"  限制上传文件数量
        //:action="BASE_API + '/eduservice/subject/addSubject'"  api
        //name="file"  上传文件的参数名
        //accept="application/vnd.ms-excel"  限制上传文件的类型 -->


          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            :loading="loading"
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >{{ fileUploadBtnText }}</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    export default  {
        data() {
            return {
                BASE_API: process.env.BASE_API,
                OSS_PATH: process.env.OSS_PATH,
                loading: false,
                importBtnDisabled: false,
                fileUploadBtnText: '开始导入'
            }
        },
        created() {
            this.$store.dispatch('setting/getSetting')
        },
        methods:{
          submitUpload(){
            this.loading = true
            this.importBtnDisabled = true
            this.$refs.upload.submit()  //这个upload对应的是el-upload的ref="upload"
            //对应js里面的document.getElementById('upload').submit()

          },
          fileUploadSuccess(){
            //重置按钮
            this.loading = false
            //提示信息
            this.$message.success('导入成功')

            this.$router.push({path: '/subject/list'})
            
          },
          fileUploadError(){
            //重置按钮
            this.loading = false
            //提示信息
            this.$message.error('导入失败')

            this.$router.push({path: '/subject/list'})
          }
        }

    }
</script>
  