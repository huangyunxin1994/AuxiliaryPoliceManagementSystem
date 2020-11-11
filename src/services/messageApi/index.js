import {GETLIST,GETDBLIST,POSTNOTICE,GETPOLICELIST,DELETENOTICE} from './api'
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
    
}


export default messageService
