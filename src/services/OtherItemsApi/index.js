import {POSTDATA,PUTDATA,DELETERSFL,POSTSETTING,PUTSETTING,GETEQUPDATA,GETCREDDATA,GETCOMMDATA} from './api'
import {request, METHOD} from '@/utils/request'

const otherItemsService = {
    /**
     * 添加证件或装备
     * @param params 证件或装备数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    postCertEquip(params) {
        return request(POSTDATA, METHOD.POST, params)
    },
    /**
     * 修改证件或装备
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    putCertEquip(params) {
        return request(PUTDATA, METHOD.PUT, params)
    },
    /**
     * 删除证件或装备
     * @param id 删除的证件或装备id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteCertEquip(id) {
        DELETERSFL = DELETERSFL+ id
        return request(DELETERSFL, METHOD.DELETE)
    },
    /**
     * 添加上下班时间
     * @param params 添加的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    postCommuting(param) {
        return request(POSTSETTING, METHOD.POST, param)
    },
    /**
     * 修改上下班时间
     * @param params 修改的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    putCommuting(param) {
        return request(PUTSETTING, METHOD.PUT, param)
    },
    /**
     * 获取装备配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getEqupDataList(param) {
        return request(GETEQUPDATA, METHOD.GET, param)
    },
    /**
     * 获取证件配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getCredDataList(param) {
        return request(GETCREDDATA, METHOD.GET, param)
    },
    /**
     * 获取上下班配置列表
     * @param params 查询参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getCommDataList(param) {
        return request(GETCOMMDATA, METHOD.GET, param)
    },
}


export default otherItemsService
