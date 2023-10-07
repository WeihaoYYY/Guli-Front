<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>

    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin-bottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select @change="subjectLevelOneChanged"
            v-model="courseInfo.subjectParentId" placeholder="一级分类">

            <el-option
                v-for="subject in subjectOneList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
            <el-option
                v-for="subject in subjectTwoList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>

        
    </el-form-item>


      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
    <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">

            <el-option  
                v-for="teacher in teacherList"
                :key="teacher.id"  
                :label="teacher.name"
                :value="teacher.id"/>

        </el-select>
    </el-form-item>



        <el-form-item label="总课时">
            <el-input-number
            :min="0"
            v-model="courseInfo.lessonNum"
            controls-position="right"
            placeholder="请填写课程的总课时数"
            />
        </el-form-item>

        <!-- 课程简介-->
        <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>


      
        <!-- 课程封面-->
        <el-form-item label="课程封面">
            <!-- show-file-list:不显示文件上传信息
                on-success:上传成功
                before-upload：上传之前
            -->
            <el-upload
                :show-file-list="true"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/eduoss/fileoss'"
                class="avatar-uploader">
                <img :src="courseInfo.cover">
            </el-upload>

        </el-form-item>



      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course";
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'


export default {
    components: { Tinymce },
    data() {
        return {
            saveBtnDisabled: false, // 保存按钮是否禁用
            courseInfo: {
                title: "",
                subjectId: "",  //二级分类ID
                subjectParentId: "", //一级分类ID
                teacherId: "",
                lessonNum: 0,
                description: "",
                cover: "https://uni032.oss-cn-hongkong.aliyuncs.com/avatar/cover_example.jpg",
                price: 0,
            },
            teacherList: [],
            subjectOneList:[],//一级分类
            subjectTwoList:[],//二级分类
            BASE_API: process.env.BASE_API,
        };
    },

    created() {
        this.getTeacherList();
        this.getSubjectOneList();
    },

    methods: {
        saveOrUpdate() {
        course.addCourseInfo(this.courseInfo).then((response) => {
            this.$message({
            type: "success",
            message: "课程信息保存成功",
            });
            //跳转到第二步
            this.$router.push({ path: "/course/chapter/" + response.data.courseId });
        });
        },

        // 获取讲师列表
        getTeacherList() {
        course.getListTeacher().then((response) => {
            this.teacherList = response.data.items;
        });
        },

        // 获取一级分类
        getSubjectOneList() {
            subject.getSubjectList().then(response => {
                this.subjectOneList = response.data.list
            })
        },

        subjectLevelOneChanged(value) {  //这里value默认对应的是 :value="subject.id"/>
            this.courseInfo.subjectId = null;
            for (const [index, subject] of this.subjectOneList.entries()) {
                if (subject.id == value) {
                    this.subjectTwoList = this.subjectOneList[index].children;
                    break;
                }
            }
        },

        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },

        //封面上传之前，判断文件类型必须是图片，限制图片大小
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2  //文件大小限制为2M

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M

        },



    }
};
</script>

<style scoped>
    .tinymce-container {
        line-height: 29px;
    }
</style>

  