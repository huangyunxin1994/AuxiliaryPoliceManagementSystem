import {GETEDU,POSTEDU,PUTEDU,DELETEEDU} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

const educationService = {
    /**
     * 根据辅警id查找学习经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getEduList(params) {
        return request(GETEDU, METHOD.GET, params)
    },
    /**
     * 新增学习经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postEdu(params) {
        return request(POSTEDU, METHOD.POST, Qs.stringify(params))
    },
    
    /**
     * 修改学习经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putEdu(params) {
        return request(PUTEDU, METHOD.PUT, Qs.stringify(params))
    },
    /**
     * 删除学习经历
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteEdu(params) {
        return request(DELETEEDU, METHOD.DELETE,{params})
    },
}


export default educationService
