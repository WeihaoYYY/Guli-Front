import request from '@/utils/request'

export default{
    //1 查询所有
    getChapterVideo(courseId) {
        return request({
            url: `/eduService/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },

    //2 添加章节
    addChapter(chapter) {
        return request({
            url: `/eduService/chapter/addChapter`,
            method: 'post',
            data:chapter
        })
    },
    //3 修改章节
    updateChapter(chapter) {
        return request({
            url: `/eduService/chapter/updateChapter`,
            method: 'post',
            data:chapter
        })
    },
    //4 删除章节
    deleteChapter(chapterId) {
        return request({
            url: `/eduService/chapter/deleteChapter/${chapterId}`,
            method: 'delete'
        })
    },
    //5 根据id进行查询
    getChapterInfo(chapterId) {
        return request({
            url: `/eduService/chapter/getChapterInfo/${chapterId}`,
            method: 'get'
        })
    }

}
