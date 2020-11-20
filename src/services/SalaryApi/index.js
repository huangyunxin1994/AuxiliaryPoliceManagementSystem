import {GETSALARY,POSTSALARY,GETSALARYFILETER,GETFORMWORK,GETSYNCHRO,GETBYAUX,GETSALARYSTATE} from './api'
import {request, METHOD} from '@/utils/request'

// import Qs from 'qs'

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
        const file = Object.assign([],params.fileList) 
        const formData = new FormData();
        const requestBody = {
            month:params.month,
            organizationId:params.organizationId
        }
        formData.append("file", file[0]);
        formData.append("requestBody", JSON.stringify(requestBody)  );
        return request(POSTSALARY, METHOD.POST, formData)
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
    /**
     * 根据id查询工资条
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    getSalaryByAux(params){
        return request(GETBYAUX, METHOD.GET, params)
    },
    /**
     * 判断是否创建模板（1：是，2：否）
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    validateSalary(params){
        return request(GETSALARYSTATE, METHOD.GET, params)
    },
    
}


export default salaryService
