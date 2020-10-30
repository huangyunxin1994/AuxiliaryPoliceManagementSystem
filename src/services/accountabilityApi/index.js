import {GETACCOUNTABILITYS,POSACCOUNTABILITY,DELETEACCOUNTABILITY,GETACCOUNTABILITY} from './api'
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'

const accountabilityService = {
    /**
     * 查询责任追究列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getAccountabilityList(params) {
        return request(GETACCOUNTABILITYS, METHOD.GET, params)
    },
    /**
     * 批量新增责任追究信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postAccountability(params) {
        let accountability = Object.assign({},params)
         delete accountability.police
        let police = []
        params.police.map(i =>{
            let params ={}
            const {id,name,number,organizationName,organizationId} = i
            params.id = id
            params.name = name
            params.number = number
            params.organizationName = organizationName
            params.organizationId = organizationId
            police.push(params)
        })
        const para = {
            accountability:accountability,
            police:police
        }
        return request(POSACCOUNTABILITY, METHOD.POST, para)
    },
    /**
     * 根据id删除责任追究信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteAccountability(params) {
        console.log(params)
        return request(DELETEACCOUNTABILITY, METHOD.DELETE, {data:params} )
    },
    /**
     * 根据辅警id查询责任追究信息
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getAccountabilityById(params) {
        const GETRSFLACCOUNTABILITY = GETACCOUNTABILITY+ params.id
        return request(GETRSFLACCOUNTABILITY, METHOD.GET)
    },
}


export default accountabilityService
