import {GETDATA,PUTDATA} from './api'
import {request, METHOD} from '@/utils/request'

const overTimeService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    getOverTimeLeave(params) {
        return request(GETDATA, METHOD.GET, params)
    },
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    putOverTimeLeave(params) {
        return request(PUTDATA, METHOD.PUT, params)
    },
}


export default overTimeService
