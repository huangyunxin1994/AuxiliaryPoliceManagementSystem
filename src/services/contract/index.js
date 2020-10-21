import {GETDATA,POSTdATA} from './api'
import {request, METHOD} from '@/utils/request'

const contractService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    // getOverTimeLeave(params) {
    //     return request(GETDATA, METHOD.GET, params)
    // },
    //获取合同信息
    getContractData(params){
        return request(GETDATA, METHOD.GET, params)
    },
    // 批量添加合同信息
    addContractData(obj){
        const para = {
            contract:obj,
            policeId:obj.policeId
          }
        return request(POSTdATA, METHOD.POST, para)
    },
}


export default contractService
