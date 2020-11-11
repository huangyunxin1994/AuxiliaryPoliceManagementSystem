import {GETCERTEQUPUSER,POSTCERTEQUP,PUTCERTEQUP,GETCERTEQUPLIST,GETCERTEQUPTYPES} from './api'
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'
import { Object } from 'core-js'
const certEquipService = {
    /**
     * 获取新增证件或装备发放和未发放人员列表
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getCertEqupUser(params){
        return request(GETCERTEQUPUSER, METHOD.GET, params)
    },
    /**
     * 新增发放证件或装备
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postCertEqup(params){
        const police = Object.assign([],params.police)
        delete params.police
        let arr = []
        police.map(i=>{
            let param = {}
            param.userId = i.id
            param.policeName = i.name;
            param.number = i.number;
            param.organizationId = i.organizationId;
            param.organizationName = i.organizationName;
            param = Object.assign({},param,params)
            arr.push(param)

        })
        return request(POSTCERTEQUP, METHOD.POST,arr)
    },
    /**
     * 回收证件或装备
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putCertEqup(params){
        return request(PUTCERTEQUP, METHOD.PUT, params)
    },
    /**
     * 获取证件或装备列表
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getCertEqup(params){
        return request(GETCERTEQUPLIST, METHOD.GET, params)
    },
    /**
     * 获取证件或装备的类型
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getCertEqupType(params){
        return request(GETCERTEQUPTYPES, METHOD.GET, params)
    }
}


export default certEquipService
