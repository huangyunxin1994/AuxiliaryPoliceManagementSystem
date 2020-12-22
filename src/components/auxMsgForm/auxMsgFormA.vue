<template>
  <!-- <div class="new-page" :style="`min-height: ${pageMinHeight}px`"> -->
  <div>
    <a-card :bordered="true">
      <div class="saveBtn">
        <a-button type="primary" @click="saveBtn" icon="save">保存</a-button>
        <a-button @click="cancelBtn" style="margin-left:8px">取消并返回</a-button>
      </div>
    </a-card>
    <a-card :bordered="true">
      <div class="baseMess">
        <div class="title">
          <div
            class="position-and-level-title"
            :style="{ 'border-color': theme.color }"
          >
            基础资料
          </div>
        </div>
        <div>
          <a-form-model
            ref="ruleForm"
            :model="form"
            :label-col="labelCol"
            :rules="baseRules"
            :wrapper-col="wrapperCol"
            class="baseForm"
          >
            <a-row :gutter="24">
              <a-col
                v-for="(item, index) in baseMessTitle"
                :key="index"
                :md="24"
                :lg="12"
                :xl="12"
                :xxl="6"
              >
                <a-form-model-item
                  :label="item.label"
                  :labelCol="{ span: 7 }"
                  :wrapperCol="{ span: 13 }"
                  :prop="item.title"
                >
                  <a-input
                    v-model="form[item.title]"
                    v-if="item.type == 'input' && item.title == 'idCard'"
                    @blur.native.capture="getIdData"
                  />
                  <a-input
                    v-model="form[item.title]"
                    v-if="item.type == 'input' && item.title != 'idCard'"
                    :disabled="item.disabled"
                  />
                  <a-input-number
                    v-model="form[item.title]"
                    v-else-if="item.type == 'number'"
                    :disabled="item.disabled"
                     style="width: 100%"
                  />
                  <tree-select  
                    v-if="item.type == 'select' && item.title == 'organizationId'"
                    style="width: 100%" 
                    ref="selectTree" 
                    :value="form.organizationId" 
                    labelName="organizationName"
                    @handleTreeChange="handleTreeChange"
                  ></tree-select>
                  <a-select
                    show-search
                    v-model="form[item.title]"
                    :placeholder="item.placeholder"
                    :filter-option="filterOption"
                    v-else-if="item.type == 'select'"
                    :disabled="item.disabled"
                    @change="handleChange(item)"
                  >
                    <a-select-option
                      v-for="(i, j) in item.select"
                      :key="j"
                      :value="i.id || i.name"
                      
                    >
                      {{ i.name }}
                    </a-select-option>
                  </a-select>
                  <a-date-picker
                    v-model="form[item.title]"
                    type="date"
                    placeholder="请选择入职时间"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                    v-else-if="item.type == 'time' && item.title == 'entryTime'"
                    @change="getDate"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                <a-form-model-item
                  label="是否是专业辅警"
                  :labelCol="{
                    sm: { span: 24 },
                    md: { span: 7 },
                    lg: { span: 11 },
                  }"
                  :wrapperCol="{ sm: { span: 24 }, md: { span: 13 } }"
                >
                  <a-radio-group :default-value="2" v-model="form.isMajor" @change="changeRadio">
                    <a-radio :value="1"> 是 </a-radio>
                    <a-radio :value="2"> 否 </a-radio>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.isMajor== 1">
              <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                <a-form-model-item
                  prop="major.qualification"
                  label="专业技术职业资格"
                  :labelCol="{
                    sm: { span: 24 },
                    md: { span: 7 },
                    lg: { span: 11 },
                  }"
                  :wrapperCol="{ sm: { span: 24 }, md: { span: 13 } }"
                >
                  <a-input v-model="form.major.qualification"/>
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                <a-form-model-item
                prop="major.approvalUnit"
                  label="资格审批单位"
                  :labelCol="{
                    sm: { span: 24 },
                    md: { span: 7 },
                    lg: { span: 11 },
                  }"
                  :wrapperCol="{ sm: { span: 24 }, md: { span: 13 } }"
                >
                  <a-input v-model="form.major.approvalUnit" />
                </a-form-model-item>
              </a-col>
              <a-col :md="24" :lg="12" :xl="12" :xxl="6">
                <a-form-model-item
                prop="major.acquireDate"
                  label="获得资格日期"
                  :labelCol="{
                    sm: { span: 24 },
                    md: { span: 7 },
                    lg: { span: 11 },
                  }"
                  :wrapperCol="{ sm: { span: 24 }, md: { span: 13 } }"
                >
                  <a-date-picker
                    v-model="form.major.acquireDate"
                    value-format="YYYY-MM-DD"
                    type="date"
                    placeholder="请选择时间"
                    style="width: 100%"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
    </a-card>
    <a-card :bordered="true">
      <div class="othoderMess">
        <div class="importSwrap">
          <a-button type="primary" style="margin-right:10px" icon="vertical-align-bottom" @click="downloadExcel">
            模板下载
          </a-button>
          <excel-btn
            :tableTitle="allTableTitle"
            @getTableData="getTableData"
          ></excel-btn>
        </div>
        <div class="studyHis">
          <div class="title">
            <div
              class="position-and-level-title"
              :style="{ 'border-color': theme.color }"
            >
              学习经历
            </div>
            <a-button type="primary" @click="addStudyData('table1')" icon="plus"
              >添加记录</a-button
            >
          </div>
          <standard-table
            ref="table1"
            rowKey="key"
            :columns="studyColumns"
            :data="studySource"
            :scroll="{ y: 600, x: 650 }"
            showPagination="auto"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="editRecord(record, 'table1')">编辑</a>
              <a-divider type="vertical" />
              <a @click="del(record, 'table1')">删除</a>
            </span>
          </standard-table>
        </div>
        <div class="workHis">
          <div class="title">
            <div
              class="position-and-level-title"
              :style="{ 'border-color': theme.color }"
            >
              工作经历
            </div>
            <a-button type="primary" @click="addStudyData('table2')" icon="plus"
              >添加记录</a-button
            >
          </div>
          <standard-table
            ref="table2"
            rowKey="key"
            :columns="workColumns"
            :data="workSource"
            showPagination="auto"
            :scroll="{ y: 600, x: 650 }"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <span slot="workaction" slot-scope="text, record">
              <a @click="editRecord(record, 'table2')">编辑</a>
              <a-divider type="vertical" />
              <a @click="del(record, 'table2')">删除</a>
            </span>
          </standard-table>
        </div>
        <div class="familyHis">
          <div class="title">
            <div
              class="position-and-level-title"
              :style="{ 'border-color': theme.color }"
            >
              家庭及社会关系
            </div>
            <a-button type="primary" @click="addStudyData('table3')" icon="plus"
              >添加记录</a-button
            >
          </div>
          <standard-table
            ref="table3"
            rowKey="key"
            :columns="familyColumns"
            :data="familySource"
            showPagination="auto"
            :scroll="{ y: 600, x: 650 }"
          >
            <template slot="status" slot-scope="status">
              <a-badge :status="status" :text="status | statusFilter" />
            </template>
            <template slot="sex" slot-scope="sex">
              <span>{{sex | statusSex}}</span>
            </template>
            <span slot="familyaction" slot-scope="text, record">
              <a @click="editRecord(record, 'table3')">编辑</a>
              <a-divider type="vertical" />
              <a @click="del(record, 'table3')">删除</a>
            </span>
          </standard-table>
        </div>
      </div>
    </a-card>

    <dialog-data ref="studyData" :formTitle="fromTitle[tableName]" :rules="rules[tableName]" :record="record" :option="option" @handleOk="handleOk" ></dialog-data>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import excelBtn from "@/components/importExcel/importExcel";
import dialogData from "@/components/dialogPersonalData/dialogPersonalData";
import fromModel from "@/components/formModel/formModel";
import StandardTable from "@/components/Table_/";
import treeSelect from "@/components/treeSelect/TreeSelect"
import { validateIdNo, validatePhone } from "@/config/default/rules";
import {daysDistance} from '@/utils/dateTime'
const studyColumns = [
  {
    title: "毕业院校",
    dataIndex: "school",
    key: "school",
    width:150,
  },
  {
    title: "所在院系",
    dataIndex: "courtyard",
    key: "courtyard",
    width:150,
  },
  {
    title: "学习形式",
    dataIndex: "learningForm",
    key: "learningForm",
    width:150,
  },
  {
    title: "学制",
    dataIndex: "schoolSystem",
    key: "schoolSystem",
    width:100,
  },
  {
    title: "入学日期",
    dataIndex: "startDate",
    key: "startDate",
    type:"date",
    width:150,
  },
  {
    title: "毕业日期",
    dataIndex: "endDate",
    key: "endDate",
    type:"date",
    width:150,
  },
  {
    title: "所学专业",
    dataIndex: "major",
    key: "major",
    width:150,
  },
  {
    title: "学历",
    dataIndex: "education",
    key: "education",
    width:150,
  },
  {
    title: "学位",
    dataIndex: "academic",
    key: "academic",
    width:100,
  },
  {
    title: "学位授予日期",
    dataIndex: "academicTime",
    key: "academicTime",
    type:"date",
    width:150,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    width:150,
  },
];

const workColumns = [
  {
    title: "工作起始日期",
    dataIndex: "startDate",
    key: "startDate",
    type:"date",
    width:100,
  },
  {
    title: "工作结束日期",
    dataIndex: "endData",
    key: "endData",
    type:"date",
    width:100,
  },
  {
    title: "所在单位",
    dataIndex: "company",
    key: "company",
    width:150,
  },
  {
    title: "单位类型",
    dataIndex: "unitType",
    key: "unitType",
    width:100,
  },
  {
    title: "职务级别",
    dataIndex: "jobLevel",
    key: "jobLevel",
    width:100,
  },
  {
    title: "是否公务员",
    dataIndex: "orderly",
    key: "orderly",
    width:80,
  },
  {
    title: "从事或担任工作",
    dataIndex: "post",
    key: "post",
    width:150,
  },
  {
    title: "备注",
    dataIndex: "remarks",
    scopedSlots: { customRender: "description" },
    key: "remarks",
    width:150,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "workaction" },
    width:150,
  },
];

const familyColumns = [
  {
    title: "成员姓名",
    dataIndex: "familyName",
    key: "familyName",
    width:100,
  },
  {
    title: "与本人关系",
    dataIndex: "relationship",
    key: "relationship",
    width:100,
  },
  {
    title: "性别",
    dataIndex: "sex",
    key: "sex",
    width:80,
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "成员身份证",
    dataIndex: "idCard",
    key: "idCard",
    width:150,
  },
  {
    title: "出生日期",
    dataIndex: "birthday",
    key: "birthday",
    type:"date",
    width:100,
  },
  {
    title: "民族",
    dataIndex: "nation",
    key: "nation",
    width:80,
  },
  {
    title: "操作",
    scopedSlots: { customRender: "familyaction" },
    width:150,
  },
];

const fromTitle = {
  table1: [
    {
      label: "毕业院校",
      name: "school",
      type: "input",
      refName: "name",
      placeholder: "请输入毕业院校",
    },
    {
      label: "所在院系",
      name: "courtyard",
      type: "input",
      refName: "courtyard",
      placeholder: "请输入所在院系",
    },
    {
      label: "学习形式",
      name: "learningForm",
      type: "select",
      refName: "learningForm",
      placeholder: "请输入学习形式",
      select: [
        { name: "全日制" },
        { name: "在职教育" },
      ],
    },
    {
      label: "学制",
      name: "schoolSystem",
      type: "select",
      refName: "schoolSystem",
      placeholder: "请选择学制",
      select: [
        { name: "2年制" },
        { name: "3年制" },
        { name: "4年制" },
        { name: "5年制" },
      ],
    },
    {
      label: "入学日期",
      name: "startDate",
      type: "picker",
      refName: "startDate",
      placeholder: "请选择入学日期",
    },
    {
      label: "毕业日期",
      name: "endDate",
      type: "picker",
      refName: "endDate",
      placeholder: "请选择毕业日期",
    },
    {
      label: "所学专业",
      name: "major",
      type: "input",
      refName: "major",
      placeholder: "请输入毕业院校",
    },
    {
      label: "学历",
      name: "education",
      props: "name",
      type: "select",
      refName: "education",
      placeholder: "请选择学历",
      select: [
        { name: '小学' },
          { name: "初中" },
          { name: "高中" },
          { name: "大专" },
          { name: "大学本科" },
          { name: "研究生" }
      ],
    },
    {
      label: "学位",
      name: "academic",
      props: "name",
      type: "input",
      refName: "academic",
      placeholder: "请输入学位"
    },
    {
      label: "学位授予日期",
      name: "academicTime",
      type: "picker",
      refName: "academicTime",
      placeholder: "请选择入学位授予日期",
    },
    {
      name: "poilceId",
    },
  ],
  table2: [
    {
      label: "工作起始日期",
      name: "startDate",
      type: "picker",
      refName: "startDate",
      placeholder: "请选择工作起始日期",
    },
    {
      label: "工作结束日期",
      name: "endData",
      type: "picker",
      refName: "endData",
      placeholder: "请选择工作结束日期",
    },
    {
      label: "所在单位",
      name: "company",
      type: "input",
      refName: "company",
      placeholder: "请输入所在单位",
    },
    {
      label: "单位类型",
      name: "unitType",
      type: "input",
      refName: "unitType",
      placeholder: "请输入单位类型",
    },
    {
      label: "职务级别",
      name: "jobLevel",
      type: "input",
      refName: "jobLevel",
      placeholder: "请输入职务级别",
    },
    {
      label: "是否公务员",
      name: "orderly",
      type: "radio",
      refName: "orderly",
      placeholder: "请选择性别",
      select: [
        { name: "是", value: 1 },
        { name: "否", value: 2 },
      ],
    },
    {
      label: "从事或担任的工作",
      name: "post",
      type: "input",
      refName: "post",
      placeholder: "请输入从事或担任的工作",
    },
    {
      label: "备注",
      name: "remarks",
      type: "textarea",
      refName: "remarks",
      placeholder: "请输入备注",
    },
  ],
  table3: [
    {
      label: "成员姓名",
      name: "familyName",
      type: "input",
      refName: "familyName",
      placeholder: "请输入成员姓名",
    },
    {
      label: "与本人关系",
      name: "relationship",
      type: "select",
      refName: "relationship",
      placeholder: "请选择关系",
      select: [
        { name: "父子" },
        { name: "母子" },
        { name: "父女" },
        { name: "母女" },
        { name: "兄弟" },
        { name: "兄妹" },
        { name: "姐弟" },
        { name: "姐妹" },
      ],
    },
    {
      label: "成员身份证",
      name: "idCard",
      type: "input",
      refName: "idCard",
      placeholder: "请输入成员身份证",
    },
    {
      label: "民族",
      name: "nation",
      type: "input",
      refName: "nation",
      placeholder: "请输入民族",
    },
  ],
};

const rules = {
  table1: {
    school: [{ required: true, message: "请输入学院姓名", trigger: "blur" }],
    courtyard: [{ required: false, message: "请输入所在院系", trigger: "blur" }],
    learningForm: [
      { required: false, message: "请输入学习形式", trigger: "blur" },
    ],
    schoolSystem: [
      { required: false, message: "请选择学制", trigger: "change" },
    ],
    startDate: [
      { required: true, message: "请选择入学时间", trigger: "change" },
    ],
    endDate: [{ required: true, message: "请选择毕业时间", trigger: "change" }],
    major: [{ required: false, message: "请输入专业", trigger: "blur" }],
    education: [{ required: false, message: "请选择学历", trigger: "change" }],
    academic: [{ required: false, message: "请选择学位", trigger: "change" }],
    academicTime: [
      { required: false, message: "请选择学位授予日期", trigger: "change" },
    ],
  },
  table2: {
    startDate: [
      { required: true, message: "请选择工作起始日期", trigger: "change" },
    ],
    endData: [
      { required: true, message: "请选择工作结束日期", trigger: "change" },
    ],
    company: [{ required: true, message: "请输入所在单位", trigger: "blur" }],
    unitType: [{ required: true, message: "请输入单位类型", trigger: "blur" }],
    jobLevel: [{ required: true, message: "请输入职务级别", trigger: "blur" }],
    orderly: [
      { required: true, message: "请选择是否是公务员", trigger: "change" },
    ],
    post: [
      { required: true, message: "请输入从事或担任的工作", trigger: "blur" },
    ],
  },
  table3: {
    familyName: [
      { required: true, message: "请输入成员姓名", trigger: "blur" },
    ],
    relationship: [
      { required: true, message: "请选择关系", trigger: "change" },
    ],
    idCard: [{ required: true, message: "请输入身份证", trigger: "blur" }],
    sex: [{ required: true, message: "请选择性别", trigger: "change" }],
    birthday: [
      { required: true, message: "请选择出生日期", trigger: "change" },
    ],
    nation: [{ required: true, message: "请输入民族", trigger: "blur" }],
  },
};

export default {
  name: "Demo",
  components: {
    StandardTable,
    excelBtn,
    dialogData,
    treeSelect,
  },
  props: {
    policeId: String,
    fileList: Array
  },
  data() {
    return {
      record: {},
      fromTitle,
      rules,
      option:{},
      tableName:"",
      teamSpinning: true,
      tagInputVisible: false,

      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      isSpecialty: false,
      baseRules: {},
      form: {
        number: "",
        name: "",
        idCard: "",
        phone: "",
        organizationId: "",
        rankId: "",
        nation: "",
        education: "",
        nativePlace: "",
        height: "",
        entryTime: "",
        politicalStatus: "",
        birthday: "",
        sex: "",
        age: "",
        isMajor:2,
        major:{ 
        qualification:"",//资格
        approvalUnit:"",//单位
        acquire_date:"",//时间
      },
      },
       
      baseMessTitle: [
        {
          title: "number",
          label: "辅警编号",
          type: "input",
          placeholder: "请输入辅警编号",
          disabled: false,
        }, //
        {
          title: "name",
          label: "姓名",
          type: "input",
          placeholder: "请输入辅警姓名",
          disabled: false,
        }, //
        {
          title: "idCard",
          label: "身份证号",
          type: "input",
          placeholder: "请输入身份证号",
          disabled: false,
        }, //
        {
          title: "phone",
          label: "手机号码",
          type: "input",
          placeholder: "请输入手机号码",
          disabled: false,
        }, //
        {
          title: "organizationId",
          titleName: "organizationName",
          label: "所属组织",
          type: "select",
          placeholder: "请选择所属组织",
          select: [],
        },
        {
          title: "postId",
          titleName: "postName",
          label: "所属岗位",
          type: "select",
          placeholder: "请选择所属岗位",
          select: [],
        },
        {
          title: "rankId",
          titleName: "rankName",
          label: "所属职级",
          type: "select",
          placeholder: "请选择所属职级",
          select: [],
        },
        {
          title: "nation",
          label: "民族",
          type: "input",
          placeholder: "请输入民族",
          disabled: false,
        }, //
        {
          title: "education",
          label: "学历",
          type: "select",
          placeholder: "请选择学历",
          select: [
            { name: '小学' },
            { name: "初中" },
            { name: "高中" },
            { name: "大专" },
            { name: "本科" },
            { name: "研究生" },
          ],
        }, //
        {
          title: "nativePlace",
          label: "籍贯",
          type: "input",
          placeholder: "请输入籍贯",
          disabled: false,
        }, //
        {
          title: "height",
          label: "身高(cm)",
          type: "number",
          placeholder: "请输入身高",
          disabled: false,
        },
        {
          title: "entryTime",
          label: "入职时间",
          type: "time",
          placeholder: "请选择入职时间",
        }, //
        {
          title: "politicalStatus",
          label: "政治面貌",
          type: "select",
          placeholder: "请选择政治面貌",
          select: [
            { name: "中共党员" },
            { name: "中共预备党员" },
            { name: "共青团员 " },
            { name: "群众" },
          ],
        }, //
        {
          title: "birthday",
          label: "出生日期",
          type: "input",
          placeholder: "请输入出生日期",
          disabled: true,
        }, //
        {
          title: "sex",
          label: "性别",
          type: "select",
          placeholder: "请输入性别",
          disabled: true,
          select: [
            { id:1,name: "男" },
            { id:2,name: "女" },
          ],
        }, //
        {
          title: "age",
          label: "年龄",
          type: "input",
          placeholder: "请输入年龄",
          disabled: true,
        }, //
        {
          title: "seniority",
          label: "工龄(年)",
          type: "input",
          placeholder: "请输入工龄",
          disabled: true,
        }, //  //
      ],
      studyColumns: studyColumns,
      workColumns: workColumns,
      familyColumns: familyColumns,
      queryPa: {
        id: "",
      },
      studySource: (params) => {
        let param = Object.assign(params, this.queryPa);
        return this.$api.educationService.getEduList(param).then((res) => {
          res.data.data.count = res.data.data.list.length;
          res.data.data.currentPage = 1;
          return res.data;
        });
      },
      workSource: (params) => {
        let param = Object.assign(params, this.queryPa);
        return this.$api.workService.getWorkList(param).then((res) => {
          res.data.data.count = res.data.data.list.length;
          res.data.data.currentPage = 1;
          return res.data;
        });
      },
      familySource: (params) => {
        let param = Object.assign(params, this.queryPa);
        return this.$api.familyService.getFamilyList(param).then((res) => {
          res.data.data.count = res.data.data.list.length;
          res.data.data.currentPage = 1;
          return res.data;
        });
      },
      allTableData: [],
      imageUrl: "", // 用来存放图片的路径
      allTableTitle: [], // 所有的title
      deleteMess: "", // 在点击删除时，会获取到该条信息的所有值，保存在该变量中
      tableDataIndex: "",
    };
  },
  computed: {
    ...mapState("setting", ["theme", "pageMinHeight"]),
    ...mapGetters("account", ["user"]),
    desc() {
      return this.$t("description");
    },
  },
  created() {
    this.form.organizationId=this.user.isSystem !==1 && this.user.organizationId || ""
    this.queryPa.id = this.policeId || "";
    this.form.organizationName= this.user.organizationName
    this.$api.auxiliaryPoliceService
      .getAuxiliaryPoliceData({ policeId: this.policeId || "undefined" })
      .then((res) => {
        this.form = Object.assign({}, this.form, res.data.data.list[0]);
      });
    // this.$api.organizationService
    //   .getOrganization({ organizationId: this.user.organizationId })
    //   .then((res) => {
    //     this.baseMessTitle.find((i) => {
    //       if (i.title === "organizationId")
    //         i.select = Object.assign([], res.data.data.data);
    //     });
    //   });
    this.$api.rankPostService
      .getPostList({ organizationId: this.user.isSystem !==1 && this.user.organizationId || "",state:1 })
      .then((res) => {
        this.baseMessTitle.find((i) => {
          if (i.title === "postId")
            i.select = Object.assign([], res.data.data.list);
        });
      });
    this.$api.rankPostService
      .getRankList({ organizationId: this.user.isSystem !==1 && this.user.organizationId || "" })
      .then((res) => {
        this.baseMessTitle.find((i) => {
          if (i.title === "rankId")
            i.select = Object.assign([], res.data.data.list);
        });
      });
  },
  methods: {
    //基础信息规则
    getBaseRules() {
      let myrules = {};
      this.baseMessTitle.forEach((item) => {
        if (
          item.title == "number" ||
          item.title == "name" ||
          item.title == "nation" 
        ) {
          myrules[item.title] = [
            { required: true, message: "请输入必填项", trigger: "blur" },
          ];
        } else if (item.title == "idCard") {
          myrules[item.title] = [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: validateIdNo, trigger: "blur" },
          ];
        } else if (item.title == "phone") {
          myrules[item.title] = [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: validatePhone, trigger: "blur" },
          ];
        } else if (
          item.title == "organizationId" ||
          item.title == "postId" ||
          item.title == "rankId" ||
          item.title == "education" ||
          item.title == "politicalStatus"
        ) {
          myrules[item.title] = [
            { required: true, message: "请选择必填项", trigger: "change" },
          ];
        } else if (item.title == "entryTime") {
          myrules[item.title] = [
            { required: true, message: "请选择日期", trigger: "change" },
          ];
        }
        myrules['major.qualification'] = [
           { required: true, message: "请输入必填项", trigger: "blur" }
        ],
        myrules['major.approvalUnit'] = [
           { required: true, message: "请输入必填项", trigger: "blur" }
        ],
        myrules['major.acquireDate'] = [
          { required: true, message: "请选择日期", trigger: "change" },
        ]
      });
      this.baseRules = myrules;
    },
    // 获取base64格式的图片
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    // 学习经历删除按钮
    deleteRecord(key, index) {
      this.deleteMess = key;
      this.tableDataIndex = index;
    },
    // 编辑
    editRecord(key, index) {
      this.record = key
      this.tableName = index
      this.option = {
          title: index === 'table1' ? "新增学习经历" : (index === 'table2' ? '新增工作经历' : '新增家庭及社会关系'),
          width: 500,
          centered: true,
          maskClosable: false,
          okText: "确认",
      };
      this.$refs.studyData.visible = true
    },
    modal(obj, option, callback) {
      const defaultProps = {
        on: {
          ok() {
            callback();
          },
          cancel() {
          },
          close() {
          },
        },
      };
      let formProps = Object.assign(obj, defaultProps);
      this.$dialog(
        fromModel,
        // form props
        formProps,
        // modal props
        option
      );
    },
    getAllTableTitle() {
      this.allTableTitle.push(this.studyColumns);
      this.allTableTitle.push(this.workColumns);
      this.allTableTitle.push(this.familyColumns);
    },
    // 获取到Excel表格数据
    getTableData(tdata) {
      tdata.map((item) => {
        item.map((j, k) => {
          j.key = k;
        });
      });
      tdata[2].map(i=>{
        const mes = this.IdCard(i.idCard)
        i.sex = mes.sex
        i.birthday = mes.birth
      })
      this.$refs.table1.changeDataForImport(tdata[0]);
      this.$refs.table2.changeDataForImport(tdata[1]);
      this.$refs.table3.changeDataForImport(tdata[2]);
    },
    // 点击删除
    del(key, index) {
      const _this = this;
      this.$confirm({
        title: "警告",
        content: `真的要删除这条记录吗?`,
        okText: "删除",
        okType: "danger",
        centered: true,
        cancelText: "取消",
        onOk() {
          _this.$refs[index].localDataSource.splice(_this.$refs[index].localDataSource.findIndex(i=>i.key === key.key),1)
        },
        onCancel() {},
      });
    },
    changeRadio(){
    },
    // 添加记录
    addStudyData(index) {
      this.tableName = index
      this.option = {
          title: index === 'table1' ? "新增学习经历" : (index === 'table2' ? '新增工作经历' : '新增家庭及社会关系'),
          width: 500,
          centered: true,
          maskClosable: false,
          okText: "确认",
      };
      this.$refs.studyData.visible = true
    },
    handleOk(form){
      const mess = this.IdCard(form.idCard)
      form.birthday = mess.birth;
      form.sex = mess.sex;
      if(!form.key){

        let arr =[]
      arr.push(form)
      this.$refs[this.tableName].changeDataForImport(arr);
      }else{
        this.$refs[this.tableName].localDataSource.splice(this.$refs[this.tableName].localDataSource.findIndex(i=>i.key === form.key),1,form)
      }
      
    },
    // 点击保存按钮
    saveBtn() {
      const _this = this;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm({
            title: "提醒",
            content: `真的要保存吗?`,
            okText: "保存",
            okType: "primary",
            centered: true,
            cancelText: "取消",
            onOk() {
              _this.$refs.table1.localDataSource.map((i) => delete i.key);
              _this.$refs.table2.localDataSource.map((i) => {
                delete i.key;
                i.orderly = i.orderly === "是" ? 1 : 2;
              });
              _this.$refs.table3.localDataSource.map((i) => {
                delete i.key;
                i.sex = i.sex === "男" ? 1 : 2;
              });
              const param = {
                basic: _this.form,
                major:_this.form.isMajor === 1 && _this.major || {},
                education: _this.$refs.table1.localDataSource,
                work: _this.$refs.table2.localDataSource,
                family: _this.$refs.table3.localDataSource,
              };
               const formData = new FormData();
              formData.append("file", _this.fileList&&_this.fileList[0]||null);
              formData.append("requestBody ", JSON.stringify(param) )
              _this.$api.auxiliaryPoliceService
                .postAuxiliaryPolice(formData)
                .then((res) => {
                  if (res.data.code == 0) {
                    _this.$message.success(
                      res.data.msg,
                      { duration: 1 },
                      () => {
                        _this.$router.go(-1);
                      }
                    );
                  } else {
                    _this.$message.error(res.data.msg);
                  }
                });
            },
            onCancel() {},
          });
        } 
      });
    },
    cancelBtn(){
      const _this = this;
        this.$confirm({
        title: "警告",
        content: `系统不会保存填写的内容，真的要返回吗?`,
        okText: "确认",
        okType: "primary",
        centered: true,
        cancelText: "取消",
        onOk() {
         _this.$router.push("/auxMess/personList")
        },
        onCancel() {},
      });
    },
    handleChange(item){
      if(item.titleName){
        const param = item.select.find(i=>i.id === this.form[item.title])
        this.form[item.titleName] = param.name
      }
    },
    // 获取身份证里面的信息
    getIdData() {
      let mess = this.IdCard(this.form.idCard);
      this.form.birthday = mess.birth;
      this.form.sex = mess.sex;
      this.form.age = mess.age;
    },
    IdCard(UUserCard) {
      // 获取生日
      let birth =
        UUserCard.substring(6, 10) +
        "-" +
        UUserCard.substring(10, 12) +
        "-" +
        UUserCard.substring(12, 14);
      // 获取性别
      let sex = "";

      
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        //男
        sex = 1;
        // return "男";
      } else {
        //女
        sex = 2;
        // return "女";
      }
      // 获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (
        UUserCard.substring(10, 12) < month ||
        (UUserCard.substring(10, 12) == month &&
          UUserCard.substring(12, 14) <= day)
      ) {
        age++;
      }
      let obj = {
        birth: birth,
        sex: sex,
        age: age,
      };
      return obj;
    },
    //获取入职时间，计算工龄
    getDate(date, dateString) {
      // let year = this.compareDate(dateString);
      // year = Math.ceil(year * 10) / 10;
      
      let now = new Date()
      
      console.log(daysDistance(now,dateString,'year'))
      this.form.seniority = daysDistance(now,dateString,'year')
    },
    compareDate(date) {
      var d1 = new Date(date);
      d1 = Date.parse(d1);
      var d2 = Date.parse(new Date());
      return (d2 - d1) / 1000 / 60 / 60 / 24 / 365;
    },
    // 获取修改的组织
    handleTreeChange(data){
      this.form.organizationId = data.val
      this.form[data.labelName] = data.label
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    //下载批量导入模板操作
    downloadExcel() {
      window.location.href = `${process.env.VUE_APP_API_BASE_URL}/img/辅警个人表单.xlsx`;
    },
  },
  mounted() {
    this.getBaseRules();
    this.getAllTableTitle();
  },
  filters:{
    statusSex(sex){
      const statusSex = {
        1:'男',
        2:'女'
      }
      return statusSex[sex]
    }
  }
};
</script>
<style lang="less" scoped>
.saveBtn {
  display: flex;
  justify-content: flex-end;
}
.position-and-level-title {
  border-style: solid;
  border-width: 5px;
  border-top: none;
  border-right: none;
  border-bottom: none;
  color: @title-color;
  font-weight: 500;
  font-size: 16px;
  text-indent: 10px;
  margin-bottom: 24px;
}
.baseMess {
  & > .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
.othoderMess {
  .tableTitle {
    font-size: 14px;
    font-weight: 600;
  }
  & > .importSwrap {
    display: flex;
    justify-content: flex-end;
  }
  .studyHis,
  .workHis,
  .familyHis {
    margin-top: 40px;
    .title {
      // display: flex;
      // justify-content: space-between;
      margin-bottom: 20px;
    }
  }
}
</style>