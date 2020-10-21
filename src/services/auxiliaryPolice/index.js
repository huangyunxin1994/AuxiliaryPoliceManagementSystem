import {GETDATA} from './api'
import {request, METHOD} from '@/utils/request'

const auxiliaryPoliceService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    // getOverTimeLeave(params) {
    //     return request(GETDATA, METHOD.GET, params)
    // },
    getAuxiliaryPoliceData(params){
        return request(GETDATA, METHOD.GET, params)
    }
}


export default auxiliaryPoliceService
