import {POSTDATA,PUTDATA,DELETERDATA,POSTSETTING,PUTSETTING,GETEQUPDATA,GETCREDDATA,GETCOMMDATA,GETSALARYTIME,POSTSALARYTIME,GETAUXPOSTRANK,GETPERPOSTRANK} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'
const otherItemsService = {
    /**
     * 添加证件或装备
     * @param params 证件或装备数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postCertEquip(params) {
        return request(POSTDATA, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 修改证件或装备
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putCertEquip(params) {
        return request(PUTDATA, METHOD.PUT,  Qs.stringify(params))
    },
    /**
     * 删除证件或装备
     * @param id 删除的证件或装备id
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteCertEquip(id) {
        const DELETERSFL = DELETERDATA+ id
        return request(DELETERSFL, METHOD.DELETE)
    },
    /**
     * 添加上下班时间
     * @param params 添加的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postCommuting(params) {
        return request(POSTSETTING, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 修改上下班时间
     * @param params 修改的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putCommuting(params) {
        return request(PUTSETTING, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 获取装备配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getEqupDataList(param) {
        return request(GETEQUPDATA, METHOD.GET, param)
    },
    /**
     * 获取证件配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getCredDataList(param) {
        return request(GETCREDDATA, METHOD.GET, param)
    },
    /**
     * 获取上下班配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getCommDataList(param) {
        return request(GETCOMMDATA, METHOD.GET, param)
    },
    /**
     * 获取工资表生成时间配置
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getSalaryTime(param) {
        return request(GETSALARYTIME, METHOD.GET, param)
    },
    /**
     * 添加工资表生成时间
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postSalaryTime(param) {
        return request(POSTSALARYTIME, METHOD.POST, Qs.stringify(param))
    },
    /**
     * 获取辅警人员列表职级和岗位的类型
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getAuxPostRank(param) {
        return request(GETAUXPOSTRANK, METHOD.GET, param)
    },
    /**
     * 获取人事职级和岗位的类型
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getPerPostRank(param) {
        return request(GETPERPOSTRANK, METHOD.GET, param)
    },
    
}


export default otherItemsService
