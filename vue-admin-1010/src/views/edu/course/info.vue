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
            courseId: '',
        };
    },

    created() {
        //获取路由中的id值
        if(this.$route.params && this.$route.params.id) {  //
            this.courseId = this.$route.params.id
            //调用 根据课程id查询章节和小节
            this.getInfo()
        }else{
            //初始化所有讲师
            this.getTeacherList()
            //初始化一级分类
            this.getSubjectOneList()
        }

    },

    methods: {
        	//添加课程
        saveCourse() {
            course.addCourseInfo(this.courseInfo)
                .then(response => {
                    //提示
                    this.$message({
                        type: 'success',
                        message: '添加课程信息成功!'
                    });
                    //跳转到第二步
                    this.$router.push({path:'/course/chapter/'+response.data.courseId})
                })
        },

        //修改课程
        updateCourse() {
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    //提示
                    this.$message({
                        type: 'success',
                        message: '修改课程信息成功!'
                    });
                    //跳转到第二步
                    this.$router.push({path:'/course/chapter/'+this.courseId})
                })
        },

        saveOrUpdate() {
            //判断添加还是修改
            if(!this.courseInfo.id) {
                //添加
                this.saveCourse()
            }else{
                //更新
                this.updateCourse()
            }
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

        getInfo(){
	    course.getCourseInfoId(this.courseId)
	        .then(response => {
	            //在courseInfo课程基本信息，包含一级分类id和二级分类id
	            this.courseInfo = response.data.courseInfoVo
                //console.log(response.data)
	            subject.getSubjectList()
                    .then(response => {
                        //2 获取所有一级分类
                        this.subjectOneList = response.data.list
                        //3 把所有的一级分类数组进行遍历，比较当前courseInfo里面一级分类id和所有的一级分类id
                        for(var i=0;i<this.subjectOneList.length;i++){
                            //获取每一个一级分类
                            var oneSubject = this.subjectOneList[i]
                            //比较当前courseInfo里面一级分类id和所有的一级分类id
                            if(this.courseInfo.subjectParentId == oneSubject.id){
                                //获取一级分类所有的二级分类
                                this.subjectTwoList = oneSubject.children
                            }
                        }
                    })

                //初始化所有讲师
                this.getTeacherList()
	        })
	}



    }
};
</script>

<style scoped>
    .tinymce-container {
        line-height: 29px;
    }
</style>

  