import request from '@/utils/request'

export default{
    //1 查询所有
    getChapterVideo(courseId) {
        return request({
            url: `/eduService/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    }
}
