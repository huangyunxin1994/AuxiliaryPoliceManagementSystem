import {GETORGAN, POSTORGAN, PUTORGAN, DELETEORGAN, GETROLE, GETUSER, POSTUSER} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'
const organizationService = {
    /**
     * 查询该组织所有下级及人数
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getOrganization(params){
        return request(GETORGAN, METHOD.GET, params)
    },
    /**
     * 添加组织
     * @param params 添加数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postOrganization(params){
        return request(POSTORGAN, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 修改组织信息
     * @param params 修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putOrganization(params){
        return request(PUTORGAN, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除组织信息
     * @param params 删除信息
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteOrganization(params){
        return request(DELETEORGAN, METHOD.DELETE, {params})
    },
    /**
     * 查询角色
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getRole(params){
        return request(GETROLE, METHOD.GET, params)
    },
    /**
     * 查找管理员信息
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getUser(params){
        return request(GETUSER, METHOD.GET, params)
    },
    /**
     * 添加管理员
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postUser(params){
        const role = Object.assign([],params.role) 
        delete params.role
        const obj = {
            user:params,
            role:role
        }
        return request(POSTUSER, METHOD.POST, obj)
    }
}


export default organizationService
