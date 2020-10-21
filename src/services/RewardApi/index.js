import {GETREWARDS,POSREWARD,DELETEREWARD,GETREWARD} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

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
        return request(POSREWARD, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 根据id删除奖励信息
     * @param id 删除的证件或装备id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteReward(id) {
        const DELETERERSFLWARD = DELETEREWARD+ id
        return request(DELETERERSFLWARD, METHOD.DELETE)
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
