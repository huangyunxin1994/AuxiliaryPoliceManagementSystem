import {GETDATA} from './api'
import {request, METHOD} from '@/utils/request'

const organizationService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    // getOverTimeLeave(params) {
    //     return request(GETDATA, METHOD.GET, params)
    // },
    // getContractData(params){
    //     return request(GETDATA, METHOD.GET, params)
    // },
    getOrganization(params){
        return request(GETDATA, METHOD.GET, params)
    }
}


export default organizationService
