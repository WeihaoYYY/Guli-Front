import request from '@/utils/request'

export default{
    //1 添加课程信息
    addCourseInfo(courseInfo){
        return request({
            url: `/eduService/course/addCourseInfo`,
            method: 'post',
            data:courseInfo  //courseInfo对象转换成json传递到接口里面
        })
    },

    getListTeacher() {
        return request({
            url: `/eduService/teacher/findAll`,
            method: 'get',
        })
    },

    //根据课程id查询课程基本信息
    getCourseInfoId(id) {
        return request({
            url: `/eduService/course/getCourseInfo/${id}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: `/eduService/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },

    //课程确认信息显示
    getPublishCourseInfo(id) {
        return request({
            url: `/eduService/course/getPublishCourseInfo/${id}`,
            method: 'get'
        })
    },

    //课程最终发布
    publishCourse(id) {
        return request({
            url: `/eduService/course/publishCourse/${id}`,
            method: 'post'
        })
    },

    //课程列表（条件查询分页）
    //current当前页 limit每页记录数 courseQuery条件对象
    pageCourseCondition(current,limit,courseQuery){
        return request({
            url: `/eduService/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },

    ///7.课程列表
    getListCourse() {
        return request({
            url: `/eduService/course/getCourseList`,
            method: 'get'
        })
    },

    //8.根据课程id删除课程
    deleteCourseById(courseId) {
        return request({
        url: `/eduService/course/deleteCourse/${courseId}`,
        method: 'delete'
        })
    },
  



    




}
