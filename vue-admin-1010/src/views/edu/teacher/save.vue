<template>
<div class="app-container">
    讲师表单
    <el-form label-width="120px">
        <el-form-item label="讲师名称">
            <el-input v-model="teacher.name" />
        </el-form-item>
        <el-form-item label="讲师排序">
            <el-input-number v-model="teacher.sort" controls-position="right" min="0" /> <!-- :min="0" 代表最小值为0 -->
        </el-form-item>
        <el-form-item label="讲师头衔">
            <el-select v-model="teacher.level" clearable placeholder="请选择">
                <el-option :value="1" label="高级讲师" />
                <el-option :value="2" label="首席讲师" />
            </el-select>
        </el-form-item>
        <el-form-item label="讲师资历">
            <el-input v-model="teacher.career" />
        </el-form-item>
        <el-form-item label="讲师简介">
            <el-input v-model="teacher.intro" :rows="10" type="textarea" />
        </el-form-item>

        <!-- 讲师头像 -->
        <el-form-item label="讲师头像">
            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar" />
            <!-- 文件上传按钮 -->
            <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
            </el-button>
            <!--
                v-show：是否显示上传组件，通过imagecropperShow(true/false)控制
                :key：类似于id，如果一个页面多个图片上传控件，可以做区分
                :url：后台上传的url地址
                @close：关闭上传组件
                @crop-upload-success：上传成功后的回调 -->
            <image-cropper 
                v-show="imagecropperShow"
                :width="300" 
                :height="300" 
                :key="imagecropperKey" 
                :url="BASE_API+'/eduoss/fileoss'" 
                field="file" @close="close" @crop-upload-success="cropSuccess" 
            />
            </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        </el-form-item>
    </el-form>

</div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'  //引入组件

export default {
    components: {  //注册组件后，就可以在页面中使用了
        ImageCropper,
        PanThumb
    },
    data() {
        return {
            teacher: { ////下面这些属性加不加都可以，但是加上可以让代码更加规范
                name: '',
                sort: 0,
                level: 1,
                career: '',
                intro: '',
                avatar: ''
            },
            BASE_API: process.env. BASE_API, //Nginx基础路径
            imagecropperShow: false, //是否显示上传组件
            imagecropperKey: 0, //上传组件的key
            saveBtnDisabled: false // 保存按钮是否禁用,
        }
    },
    created() { //页面渲染之前执行
        this.init()
    },
    watch: { //监听
        $route(to, from) { //路由变化方式，路由发生变化，方法就会执行
            this.init()
        }
    },
    methods: {
        init() {
            //判断路径有id值,做修改
            if (this.$route.params && this.$route.params.id) {
                //从路径获取id值
                const id = this.$route.params.id
                //调用根据id查询的方法
                this.getInfo(id)
            } else { //路径没有id值，做添加
                //清空表单
                this.teacher = {}
            }
        },
        getInfo(id) { //this.$route.params.id 从路由路径中获取id
            teacherApi.getTeacherInfo(id).then(response => {
                this.teacher = response.data.teacher //对应这个teacher return R.ok().data("teacher", teacherService.getById(id));
            }).catch(error => {
                console.log(error)
            })
        },

        saveOrUpdate() {
            //判断修改还是添加
            //根据teacher是否有id
            if (!this.teacher.id) {
                //添加
                this.saveTeacher()
            } else {
                //修改
                this.updateTeacher()
            }
        },
        saveTeacher() {
            console.log('保存')
            teacherApi.addTeacher(this.teacher).then(response => {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                });
                this.$router.push({ //$router.push
                    path: '/teacher/table'
                })

            }).catch(error => {
                console.log(error)
            })

        },
        updateTeacher() {
            console.log('修改')
            teacherApi.updateTeacherInfo(this.teacher).then(response => {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                });
                this.$router.push({ //$router.push
                    path: '/teacher/table'
                })

            }).catch(error => {
                console.log(error)
            })
        },
        close(){  //关闭上传组件
            this.imagecropperShow = false
            this.imagecropperKey += 1
        },
        cropSuccess(response){  //上传成功后的回调
            console.log(response)
            this.teacher.avatar = response.url
            this.imagecropperShow = false
            this.imagecropperKey += 1  //每次上传成功后，key值加1，这样可以让上传组件重新渲染
        }
        

    }

}
</script>

<style>

</style>
