import {GETDOC,POSTDOC,PUTDOC,DELETEDOC,DOWNLAODDOC,GETNOC,POSTNOC,PUTNOC,DELETENOC,DOWNLAODNOC} from './api'
import {request, METHOD} from '@/utils/request'

const organizationService = {
    /**
     * 获取文档列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    getDocument(params){
        return request(GETDOC, METHOD.GET, params)
    }
}


export default organizationService
