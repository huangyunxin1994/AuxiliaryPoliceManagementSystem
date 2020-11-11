import {GETDATA,PUTDATA,POSTBYAUX,POSTBYUSER,STATISTICS} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from "qs"

const overTimeService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getOverTimeLeave(params) {
        return request(GETDATA, METHOD.GET, params)
    },
    /**
     * 审批请假或加班
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putOverTimeLeave(params) {
        return request(PUTDATA, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 辅警申请请假或者加班
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postByAux(params) {
        return request(POSTBYAUX, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 管理员新增辅警请假或加班申请
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postByUser(params) {
        const police = Object.assign([],params.police)
        delete params.police
        let overtimeLeaveList = []
        police.map(i =>{
            let para = {}
            para.userId = i.id;
            para.number = i.number;
            para.policeName = i.name;
            para.organizationId = i.organizationId;
            para.organizationName = i.organizationName;
            para = Object.assign(para,params)
            overtimeLeaveList.push(para)
        })
        return request(POSTBYUSER, METHOD.POST, overtimeLeaveList)
    },
    /**
     * 获取加班或请假统计分页列表
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    statistics(params) {
        return request(STATISTICS, METHOD.GET, params)
    },
}


export default overTimeService
