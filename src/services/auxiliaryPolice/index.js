import {GETDATA,POSTDATA,PUTDATA,POSTHEAD,POSTAUXDATA,GETAUXDATA,POSTAUXFORMDATA} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'
const auxiliaryPoliceService = {
    /**
     * 获取辅警列表信息
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    getAuxiliaryPoliceData(params){
        params.tenureStatus = 1
        return request(GETDATA, METHOD.GET, params)
    },
    /**
     * 添加辅警信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postAuxiliaryPolice(params){
        return request(POSTDATA, METHOD.POST, params)
    },
    /**
     * 修改辅警信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putAuxiliaryPolice(params){
        return request(PUTDATA, METHOD.PUT, Qs.stringify(params))
    },
     /**
     * 修改头像
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postAuxiliaryHead(params){
        return request(POSTHEAD, METHOD.POST, params)
    },
    /**
     * 获取所有辅警的编号
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getAuxiliaryNum(params){
        return request(GETAUXDATA, METHOD.GET, params)
    },
    /**
     * 批量导入辅警资料
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postAuxiliaryData(params){
        return request(POSTAUXDATA, METHOD.POST, params)
    },
    /**
     * 批量导入辅警个人表单资料
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postAuxiliaryFormData(params){
        return request(POSTAUXFORMDATA, METHOD.POST, params)
    },
    
}


export default auxiliaryPoliceService
