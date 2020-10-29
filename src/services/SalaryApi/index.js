import {GETSALARY,POSTSALARY,GETSALARYFILETER,GETFORMWORK,GETSYNCHRO} from './api'
import {request, METHOD} from '@/utils/request'

// import Qs from 'qs'
import store from '@/store/index.js'

const salaryService = {
    /**
     * 查询工资条
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getSalary(params) {
        return request(GETSALARY, METHOD.GET, params)
    },

    /**
     * 上传工资工资条
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    postSalary(params) {
        return request(POSTSALARY, METHOD.POST, Qs.stringify(params))
    },

    /**
     * 查询该管理员已经导入过工资条的组织
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getSalaryfileter(params) {
        return request(GETSALARYFILETER, METHOD.GET, params)
    },

    /**
     * 查看工资模板
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getFormwork(params) {
        return request(GETFORMWORK, METHOD.GET, params)
    },
    
    /**
     * 同步工资条
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getSynchro(params) {
        return request(GETSYNCHRO, METHOD.GET, params)
    },
}


export default salaryService
