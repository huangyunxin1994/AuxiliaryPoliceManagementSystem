import {GETLIST,POSTEDUCATION,DELETEEDUCATION,GETDETAILSDATA,PUTEDUCATION} from './api'
import {request, METHOD} from '@/utils/request'

// import Qs from 'qs'
import store from '@/store/index.js'

const trainService = {
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
                creator:store.state.account.user.name,
                organizationId:store.state.account.user.organizationId,//创建者的组织id 
                organizationName:store.state.account.user.organizationName,//创建者的组织名
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

    /**
     * 根据id获得培训详情
     * @param params 培训id
     * @returns {Promise<AxiosResponse<T>>}
     */
    getEducationDetails(params){
        // const GETDETAILS = GETDETAILSDATA + id.id
        return request(GETDETAILSDATA, METHOD.GET,params)
    },

    /**
     * 填写结果  单个
     * @param params 培训id
     * @returns {Promise<AxiosResponse<T>>}
     */
    putEducation(params){
        let obj = {
            id:params.id,
            policeId:params.policeId,
            policeName:params.policeName,
            postId:params.postId,
            postName:params.postName,
            organizationId:params.organizationId,
            organizationName:params.organizationName,
            trainId:params.trainId,
            trainExplain:params.trainExplain,
            state:params.state
        }
        let submitData = []
        submitData.push(obj)
        return request(PUTEDUCATION, METHOD.PUT,submitData)
    },

    /**
     * 填写结果  多个
     * @param params 培训id
     * @returns {Promise<AxiosResponse<T>>}
     */
    putManyEducation(params,selectArr){
        selectArr.forEach((item)=>{
            item.state = params.state
            item.trainExplain = params.trainExplain
        })
        return request(PUTEDUCATION, METHOD.PUT,selectArr)
    }
    
}


export default trainService
