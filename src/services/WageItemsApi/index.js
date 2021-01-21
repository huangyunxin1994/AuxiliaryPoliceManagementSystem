import {GETDATA,DELETEDATA,POSTREL} from './api'
import {request, METHOD} from '@/utils/request'
const wageItemsService = {
    /**
     * 查询工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getWageItems(params) {
        return request(GETDATA, METHOD.GET, params)
    },
    /**
     * 添加工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    postWageItems(params) {
        const state =  params.compareData.some(i=>i.itemName===params.itemName&&i.state!=='delete')
        delete params.compareData
        const res = {
            data:{
                code:!state?0:-1,
                msg:!state?'添加成功':`工资项名称 [ ${params.itemName} ] 已存在，添加失败`,
                data:params
            }
        }
        return new Promise((resolve) => {
            // return params
            
            resolve(res);
          });
        // return request(POSTDATA, METHOD.POST, Qs.stringify(params))
    },
    /**
     * 编辑工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    putWageItems(params) {
        // return request(PUTDATA, METHOD.PUT, Qs.stringify(params))
        const oldData = params.compareData.find(i=>i.key === params.key)
        let flag = true
        if(oldData.itemName === params.itemName &&oldData.itemExplain === params.itemExplain){
            flag = false
        }
        const state =  params.compareData.some(i=>i.itemName===params.itemName&&i.id!==params.id&&i.state!=='delete')

        delete params.compareData
        const res = {
            data:{
                code: state ? -2 : ( flag ? 0 : -1 ),
                msg:  state ? `工资项名称 [ ${params.itemName} ] 已存在，修改失败` : ( flag ? '修改成功' : '未修改任何内容'),
                data:params
            }
        }
        return new Promise((resolve) => {
            // return params
            resolve(res);
          });
    },
    /**
     * 删除工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    deleteWageItems(params) {
        return request(DELETEDATA, METHOD.DELETE, {params})
    },
    /**
     * 发布工资项
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    releaseWageItems(params) {
        return request(POSTREL, METHOD.POST, params)
    },
}


export default wageItemsService
