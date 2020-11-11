import {GETSALARYRECORD, POSTSALARYRECORD} from './api'
import {request, METHOD} from '@/utils/request'

// import Qs from 'qs'

const salaryRecordService = {
    /**
     * 查询已打勾月份
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    getSalaryRecord(params) {
        return request(GETSALARYRECORD, METHOD.GET, params)
    },
     /**
     * 新增打勾记录月份
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    postSalaryRecord(params) {
        return request(POSTSALARYRECORD, METHOD.POST, params)
    },

    
}


export default salaryRecordService
