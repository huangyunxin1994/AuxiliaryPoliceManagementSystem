import {GETPOST,POSTPOST,PUTPOST,DELETEPOST,GETRANK,POSTRANK,PUTRANK,DELETERANK} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

const rankPostService = {
    /**
     * 获取岗位配置列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getPostList(params) {
        return request(GETPOST, METHOD.GET, params)
    },
    /**
     * 添加岗位
     * @param params 证件或装备修改数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    postPost(params) {
        return request(POSTPOST, METHOD.POST, Qs.stringify(params))
    },
    
    /**
     * 修改岗位
     * @param params 添加的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    putPost(params) {
        return request(PUTPOST, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除岗位
     * @param id 删除的证件或装备id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deletePost(id) {
        const DELETERSFLPOST = DELETEPOST+ id
        return request(DELETERSFLPOST, METHOD.DELETE)
    },
    /**
     * 获取职级配置列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getRankList(params) {
        return request(GETRANK, METHOD.GET, params)
    },
    /**
     * 添加职级
     * @param params 添加的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    postRank(params) {
        return request(POSTRANK, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 修改职级
     * @param params 修改的数据
     * @returns {Promise<AxiosResponse<T>>}
     */
    putRank(params) {
        return request(PUTRANK, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除职级
     * @param id 删除的职级id
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteRank(id) {
        const DELETERSFLRANK = DELETERANK+ id
        console.log(DELETERSFLRANK)
        return request(DELETERSFLRANK, METHOD.DELETE)
    }
}


export default rankPostService
