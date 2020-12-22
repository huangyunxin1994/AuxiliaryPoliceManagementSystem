import {GETLIST,GETDBLIST,POSTNOTICE,GETPOLICELIST,DELETENOTICE,GETSTATISDATA,GETDISTRIBUTE} from './api'
// DELETEMESS,GETPOLICELIST,GETDBLIST,POSTNOTICE,
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'
const messageService = {
    /**
     * 获取管理员个人消息通知列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getUSerList(params){
        return request(GETLIST, METHOD.GET, params)
    },

    /**
     * 管理员获取代办列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getDbList(params){
        return request(GETDBLIST, METHOD.GET, params)
    },

    /**
     * 删除通知
     * @param params 删除信息
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteNotice(params){
        let arr = []
        arr.push(params)
        return request(POSTNOTICE, METHOD.POST, arr)
    },
    /**
     * 辅警获取通知列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getPoliceList(params){
        return request(GETPOLICELIST, METHOD.GET, params)
    },

    /**
     * 辅警删除通知
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteMess(params){
        const DELETENOT =DELETENOTICE+params.id
        return request(DELETENOT, METHOD.DELETE)
    },
    /**
     * 获取首页当前管理员前8周的组织人数统计
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getOrganStatis(params){
        return request(GETSTATISDATA, METHOD.GET, params)
    },
    /**
     * 获取首页当前管理员下一级组织人数统计
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getDistribute(params){
        return request(GETDISTRIBUTE, METHOD.GET, params)
    },
    
}


export default messageService
