import {GETWORK,POSTWORK,PUTWORK,DELETEWORK} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

const workService = {
    /**
     * 根据辅警id查找工作经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getWorkList(params) {
        return request(GETWORK, METHOD.GET, params)
    },
    /**
     * 新增工作经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postWork(params) {
        return request(POSTWORK, METHOD.POST, Qs.stringify(params))
    },
    
    /**
     * 修改工作经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putWork(params) {
        return request(PUTWORK, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除工作经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteWork(params) {
        return request(DELETEWORK, METHOD.DELETE,{params})
    },
}


export default workService
