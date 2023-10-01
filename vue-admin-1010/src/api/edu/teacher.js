import request from '@/utils/request'

export default {
    // 1.讲师列表（条件查询分页）
    // current当前页 limit每页记录数 teacherQuery条件对象
    getTeacherListPage(current, limit, teacherQuery) {
        return request({
            url: `/eduService/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // teacherQuery条件对象，后端使用RequestBody获取数据
            // data表示把对象(teacherQuery)转换成json进行传递到接口里面
            data: teacherQuery
        })
    },
    deleteTeacherId(id) {
        return request({
            url: `/eduService/teacher/${id}`,
            method: 'delete'
        })
    },
    addTeacher(teacher) {
        return request({
            url: `/eduService/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    getTeacherInfo(id) {
        return request({
            url: `/eduService/teacher/getTeacher/${id}`,
            method: 'get'
        })
    },
    updateTeacherInfo(teacher) {
        return request({
            url: `/eduService/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }
}