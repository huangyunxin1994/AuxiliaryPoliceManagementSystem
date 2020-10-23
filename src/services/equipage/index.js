import {GETLIST} from './api'
// ,POSTEDUCATION
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'

const equipageService = {
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
     * 获取证件或装备列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    geteducationList(params) {
        return request(GETLIST, METHOD.GET, params)
    },
    /**
     * 新增发放证件或装备
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    addEducation(params) {
        console.log("******************************")
        console.log(params)
        // return request(POSTEDUCATION, METHOD.POST, arr)
    },

}


export default equipageService
