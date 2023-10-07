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


}
