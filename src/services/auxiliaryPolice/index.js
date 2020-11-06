import {GETDATA,POSTDATA,PUTDATA,POSTHEAD} from './api'
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
        console.log(params)
        return request(POSTHEAD, METHOD.POST, params)
    },
}


export default auxiliaryPoliceService
