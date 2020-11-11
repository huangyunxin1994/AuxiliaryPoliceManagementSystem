import {GETDOC,POSTDOC,PUTDOC,DELETEDOC,DOWNLAODDOC,GETNOC,POSTNOC,PUTNOC,DELETENOC,DOWNLAODNOC} from './api'
import {request, METHOD} from '@/utils/request'
const documentAnnouncementService = {
    /**
     * 获取文档列表
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getDocument(params){
        return request(GETDOC, METHOD.GET, params)
    },
    /**
     * 新建文档并上传
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postDocument(params){
        const file = Object.assign([],params.fileList) 
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("remake", params.remake );
        formData.append("publisher", params.publisher||"" );
        formData.append("publisherId", params.publisherId||"" );
        formData.append("organizationId", params.organizationId||"" );
        return request(POSTDOC, METHOD.POST, formData)
    },
    /**
     * 修改文档
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putDocument(params){
        return request(PUTDOC, METHOD.PUT, params)
    },
    /**
     * 删除文档
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteDocument(params){
        // let id = ""
        // params.id.map( i=> id=id+i+",")
        // id = id.slice(0,id.length-1)
        // const obj ={
        //     id:id
        // }
        return request(DELETEDOC, METHOD.DELETE,{data:params})
    },
    /**
     * 下载文档文件
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async downDocument(params){
        return request(DOWNLAODDOC, METHOD.GET, params)
    },
    /**
     * 获取公告列表
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async getNotice(params){
        return request(GETNOC, METHOD.GET, params)
    },
    /**
     * 新建公告并上传
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postNotice(params){
        const file = Object.assign([],params.fileList) 
        const formData = new FormData();
        formData.append("file", file[0]);
        formData.append("title", params.title );
        formData.append("content", params.content||"" );
        formData.append("publisher", params.publisher||"" );
        formData.append("publisherId", params.publisherId||"" );
        formData.append("expireDate", params.expireDate||"" );
        formData.append("organizationId", params.organizationId||"" );
        return request(POSTNOC, METHOD.POST, formData)
    },
    /**
     * 修改公告
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async putNotice(params){
        return request(PUTNOC, METHOD.PUT, params)
    },
    /**
     * 删除公告
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async deleteNotice(params){
        return request(DELETENOC, METHOD.DELETE, {data:params})
    },
    /**
     * 下载公告文件
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async downNotice(params){
        return request(DOWNLAODNOC, METHOD.GET, params)
    },
}


export default documentAnnouncementService
