import {GETDATA,GETDETAILS,POSTdATA,PODTEXTENSION,DOWNLAODNOC,POSTFILES} from './api'
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
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&")
        console.log(params)
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
        // if(params.fileList.length>0){
        if(params.fileList){    
            formData.append("file", params.fileList[0]);
        }else{
            formData.append("file", "");
        }
        formData.append("requestBody", JSON.stringify(para) );
        // form.fileData = formData
        return request(POSTdATA, METHOD.POST, formData)
        
    },
    //根据辅警id查询合同信息
    getdetails(params){
        return request(GETDETAILS, METHOD.GET, params)
    },

    // 续约合同(单选)
    postExtensionCon(params){
        let policeId=[]
        policeId.push(params.policeId)
        const formData = new FormData();
        const contract = {
            contractPeriod:params.contractPeriod
        }
        const para = {
            contract:contract,
            policeId:policeId,
        }
        if(params.fileList){
            formData.append("file", params.fileList[0]);
        }else{
            formData.append("file", "");
        }
        formData.append("requestBody", JSON.stringify(para))
        return request(PODTEXTENSION, METHOD.POST, formData)
        
        // console.log(PODTEXTENSION)
        
    },

    // 续约合同，多选
    postManyExtensionCon(params){
        // const file = Object.assign([],params.fileList) 
        // console.log(file)
        let policeId=params.policeId
        console.log(policeId)

        const formData = new FormData();
        // console.log(formData)
        const contract = {
            contractPeriod:params.contractPeriod
        }
        const para = {
            contract:contract,
            policeId:policeId,
        }
        console.log(para)
        formData.append("file", "");
        formData.append("requestBody", JSON.stringify(para))
        // console.log(PODTEXTENSION)
        return request(PODTEXTENSION, METHOD.POST, formData)
    },

    
    /**
     * 下载合同
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async downNotice(params){
        return request(DOWNLAODNOC, METHOD.GET, params)
    },

    /**
     * 合同上传
     * @param params 
     * @returns {Promise<AxiosResponse<T>>}
     */
    async postFiles(params){
        const formData = new FormData();
        formData.append("file", params.file);
        formData.append("contractId", params.contractId)
        return request(POSTFILES, METHOD.POST, formData)
    },
}


export default contractService
