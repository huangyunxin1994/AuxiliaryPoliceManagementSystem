import {GETREWARDS,POSREWARD,DELETEREWARD,GETREWARD} from './api'
import {request, METHOD} from '@/utils/request'
// import Qs from 'qs'

const rewardService = {
    /**
     * 查询奖励列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getRewardList(params) {
        return request(GETREWARDS, METHOD.GET, params)
    },
    /**
     * 批量新增奖励信息
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    postReward(params) {
        let reward = Object.assign({},params)
         delete reward.police
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
            reward:reward,
            police:police
        }
        return request(POSREWARD, METHOD.POST, para)
    },
    /**
     * 根据id删除奖励信息
     * @param params 删除的证件或装备id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteReward(params) {
        console.log(params)
        return request(DELETEREWARD, METHOD.DELETE, {data:params} )
    },
    /**
     * 根据辅警id查询奖励信息
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getRewardById(id) {
        const GETRSFLREWARD = GETREWARD+ id
        return request(GETRSFLREWARD, METHOD.GET)
    },
}


export default rewardService
