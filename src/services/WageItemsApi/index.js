import {GETDATA,POSTDATA,DELETEDATA,PUTDATA,POSTREL} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'
const wageItemsService = {
    /**
     * 查询工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getWageItems(params) {
        return request(GETDATA, METHOD.GET, params)
    },
    /**
     * 添加工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postWageItems(params) {
        return request(POSTDATA, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 编辑工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putWageItems(params) {
        return request(PUTDATA, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteWageItems(params) {
        return request(DELETEDATA, METHOD.DELETE, {params})
    },
    /**
     * 发布工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    releaseWageItems(params) {
        return request(POSTREL, METHOD.POST, params)
    },
}


export default wageItemsService
