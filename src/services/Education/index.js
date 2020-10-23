import {GETLIST,POSTEDUCATION,DELETEEDUCATION} from './api'
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'

const educationService = {
    // /**
    //  * 获取岗位配置列表
    //  * @param params 条件参数
    //  * @returns {Promise<AxiosResponse<T>>}
    //  */
    // getPostList(params) {
    //     return request(GETPOST, METHOD.GET, params)
    // },
    // /**
    //  * 添加岗位
    //  * @param params 证件或装备修改数据
    //  * @returns {Promise<AxiosResponse<T>>}
    //  */
    // postPost(params) {
    //     return request(POSTPOST, METHOD.POST, Qs.stringify(params))
    // },

    /**
     * 获取培训配置列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    geteducationList(params) {
        return request(GETLIST, METHOD.GET, params)
    },
    /**
     * 添加培训
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    addEducation(params) {
        let submitData = {
            train:{
                className:params.className,
                startTime:params.startTime,
                endTime:params.endTime,
                classHour:params.classHour,
                learningStyle:params.learningStyle,
                learningContent:params.learningContent,
                creator:'',
                organizationId:'',//创建者的组织id 
                organizationName:'',//创建者的组织名
            }
        }
        let arr = []
        let dataArr = params.police
        dataArr.forEach(element => {
            let obj = {
                policeId:element.id,
                policeName:element.name,
                postId:element.postId,
                postName:element.postName,
                organizationId:element.organizationId,
                organizationName:element.organizationName,
            }
            arr.push(obj)
        });
        submitData.list = arr
        return request(POSTEDUCATION, METHOD.POST, submitData)
    },

    /**
     * 删除培训
     * @param params 培训id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteEducation(id){
        return request(DELETEEDUCATION, METHOD.DELETE, {data:id})
    },



    // deleteCertEquip(id) {
    //     DELETERSFL = DELETERSFL+ id
    //     return request(DELETERSFL, METHOD.DELETE)
    // },
}


export default educationService
