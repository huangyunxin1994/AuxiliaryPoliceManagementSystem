import {GETRANKDATA,GETDIMISSIONDATA,POSTDIMISSION,GETPROFESSIONDATA,POSTPROFESSION,
    GETPERSONROFESSIOND,GETRANKPOSTHIS,CHANGERANKPOST} from './api'
import {request, METHOD} from '@/utils/request'
import Qs from 'qs'

const personAdminService = {
    // /**
    //  * 获取岗位配置列表
    //  * @param params 条件参数
    //  * @returns {Promise<AxiosResponse<T>>}
    //  */
    // getPostList(params) {
    //     return request(GETPOST, METHOD.GET, params)
    // },
    // /**
    //  * 添加岗位
    //  * @param params 证件或装备修改数据
    //  * @returns {Promise<AxiosResponse<T>>}
    //  */
    // postPost(params) {
    //     return request(POSTPOST, METHOD.POST, Qs.stringify(params))
    // },

    /**
     * 获取职级列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getRankList(params){
        return request(GETRANKDATA, METHOD.GET,params)
    },

    /**
     * 获取职级列表个人历史信息
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getRankPostHistory(params){
        return request(GETRANKPOSTHIS, METHOD.GET,params)
    },
    /**
     * 变更职级
     * @param params 用户ID 变动前职级 当前职级 原因 生效日期  type1：职级 2：岗位  警员编号  警员名称   组织id 组织名  审批人
     * @returns {Promise<AxiosResponse<T>>}
     */
    changePostRank(params){
        let arr = []
        arr.push(params)
        console.log(params)
        return request(CHANGERANKPOST, METHOD.POST, arr)
    },

    /**
     * 变更岗位 
     * @param params 用户ID 变动前职级 当前职级 原因 生效日期  type1：职级 2：岗位  警员编号  警员名称   组织id 组织名  审批人
     * @returns {Promise<AxiosResponse<T>>}
     */
    changePost(params){
        let arr = []
        console.log(params)
        let obj = { 
            userId:params.userId,
            beforeRank:params.beforeRank,
            currentRank:params.currentRank,
            reason:params.reason,
            effectiveDate:params.effectiveDate,
            type:2,
            number:params.number,
            policeName:params.policeName,
            organizationId:params.organizationId,
            organizationName:"",
            approvedBy:params.approvedBy
        }
        arr.push(obj)
        console.log(obj.effectiveDate)
        if(obj.effectiveDate == undefined){
            return false
        }else{
            return request(CHANGERANKPOST, METHOD.POST, arr)
        }
        
    },

    /**
     * 变更多个职级
     * @param params 用户ID 变动前职级 当前职级 原因 生效日期  type1：职级 2：岗位  警员编号  警员名称   组织id 组织名  审批人
     * @returns {Promise<AxiosResponse<T>>}
     */
    changeManyPostRank(params){
        console.log(params)
        let arr = params.policeArr
        arr.forEach((item)=>{
            item.currentRank = params.currentRank,
            item.effectiveDate = params.effectiveDate,
            item.reason = params.reason
            if(item.beforeRank == params.currentRank){
                this.$message.warning('存在变动前职级和变动后职级相同的情况，请修改!');
            }
        })
        console.log(params)

        return request(CHANGERANKPOST, METHOD.POST, arr)
    },
    /**
     * 变更多个岗位 
     * @param params 用户ID 变动前职级 当前职级 原因 生效日期  type1：职级 2：岗位  警员编号  警员名称   组织id 组织名  审批人
     * @returns {Promise<AxiosResponse<T>>}
     */
    changeManyPost(params){
        console.log(params)
        let arr = params.policeArr
        console.log(arr)
        arr.forEach((item)=>{
            item.currentRank = params.currentRank,
            item.effectiveDate = params.effectiveDate,
            item.reason = params.reason
            item.organizationId = params.organizationId
            if(item.beforeRank == params.currentRank){
                this.$message.warning('存在变动前职级和变动后职级相同的情况，请修改!');
            }
        })
        console.log(params)

        return request(CHANGERANKPOST, METHOD.POST, arr)
    },

    /**
     * 获取离职人员列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getDimissionList(params){
        return request(GETDIMISSIONDATA, METHOD.GET,params)
    },

    /**
     * 新增离职
     * @param params 用户id  警员编号  警员名称 组织id 组织名 生效日期  原因  审批人
     * @returns {Promise<AxiosResponse<T>>}
     */
    addDimission(params) {
        let arr = []
        params.police.forEach(item => {
            let obj = {
                userId:item.id,
                number:item.number,
                policeName:item.name,
                organizationId:item.organizationId || '',
                organizationName:item.organizationName,
                effectiveDate:params.effectiveDate,
                reason:params.reason,
                approval:params.approval
            }
            arr.push(obj)
        });
        // return request(POSTDIMISSION, METHOD.POST, Qs.stringify(params))
        return request(POSTDIMISSION, METHOD.POST, arr)
    },
    // PUTPDIMISSION
    /**
     * 离职修改证件装备回收状态
     * @param params 条件参数 辅警用户id  回收状态
     * @returns {Promise<AxiosResponse<T>>}
     */
    putDimission(params){
        return request(POSTDIMISSION, METHOD.PUT, Qs.stringify(params))
    },

    /**
     * 获取专业技术辅警资格列表
     * @param params 条件参数
     * @returns {Promise<AxiosResponse<T>>}
     */
    getProfessionData(params){
        return request(GETPROFESSIONDATA, METHOD.GET,params)
    },

    /**
     * 新增专业辅警任职人员
     * @param params 用户id  警员编号  警员名称 组织id 组织名 专业技术任职资格 资格审批单位 获得资格日期
     * @returns {Promise<AxiosResponse<T>>}
     */
    addProfession(params) {
        let arr = []
        params.police.forEach(item => {
            let obj = {
                userId:item.id,
                number:item.number,
                policeName:item.name,
                organizationId:item.organizationId || '',
                organizationName:item.organizationName,
                approvalUnit:params.approvalUnit,
                acquireDate:params.acquireDate,
                qualification:params.qualification
            }
            arr.push(obj)
        });
        return request(POSTPROFESSION, METHOD.POST, arr)
    },
    /**
     * 新增记录
     * @param params 用户id  警员编号  警员名称 组织id 组织名 专业技术任职资格 资格审批单位 获得资格日期
     * @returns {Promise<AxiosResponse<T>>}
     */
    addProfessionMess(params) {
        let arr = []
        arr.push(params)
        return request(POSTPROFESSION, METHOD.POST, arr)
    },
    /**
     * 获取专业技术辅警资格个人列表
     * @param params 用户id 
     * @returns {Promise<AxiosResponse<T>>}
     */
    getPersonProfession(params){
        return request(GETPERSONROFESSIOND, METHOD.GET,params)
    },
}


export default personAdminService
