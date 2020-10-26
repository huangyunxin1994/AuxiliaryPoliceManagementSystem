import {GETDATA,GETDETAILS,POSTdATA} from './api'
// ,PODTEXTENSION
import {request, METHOD} from '@/utils/request'
import {DateAdd} from '@/utils/util'
import moment from 'moment'

const contractService = {
    /**
     * 获取加班或请假的分页列表
     * @param params 查询条件
     * @returns {Promise<AxiosResponse<T>>}
     */
    // getOverTimeLeave(params) {
    //     return request(GETDATA, METHOD.GET, params)
    // },
    //获取合同信息
    getContractData(params){
        return request(GETDATA, METHOD.GET, params)
    },
    // 批量添加合同信息
    addContractData(params){
        const endDate =  DateAdd('m',params.contractPeriod,new Date(params.startDate))
        params.endDate = moment(endDate).format('YYYY-MM-DD')
        const contract = params;
        const policeId=[]
        params.police.map( i => policeId.push(i.id))
        const para = {
            contract:contract,
            policeId:policeId
        }
        const formData = new FormData();
        formData.append("file", params.fileList[0]);
        formData.append("requestBody", JSON.stringify(para) );
        // form.fileData = formData
        return request(POSTdATA, METHOD.POST, formData)
        
    },
    //根据辅警id查询合同信息
    getdetails(params){
        return request(GETDETAILS, METHOD.GET, params)
    },

    // 续约合同
    postExtensionCon(params){
        console.log(params)
        // return request(PODTEXTENSION, METHOD.POST, params)
    }
}


export default contractService
