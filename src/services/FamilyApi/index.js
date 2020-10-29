import {GETFAMILY,POSTFAMILY,PUTFAMILY,DELETEFAMILY} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

const familyService = {
    /**
     * 根据辅警id查找家庭信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getFamilyList(params) {
        return request(GETFAMILY, METHOD.GET, params)
    },
    /**
     * 新增家庭信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postFamily(params) {
        return request(POSTFAMILY, METHOD.POST, Qs.stringify(params))
    },
    
    /**
     * 修改家庭信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putFamily(params) {
        return request(PUTFAMILY, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除家庭信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteFamily(params) {
        return request(DELETEFAMILY, METHOD.DELETE,{params})
    },
}


export default familyService
