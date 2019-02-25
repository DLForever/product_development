<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-global"></i> 测评管理</el-breadcrumb-item>
                <el-breadcrumb-item>测评任务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" @click="exportReviewers">导出记录</el-button>
            <br><br>
            <div class="handle-box">
                <div class="fnsku_filter">
                    日期:
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    粉丝号:
                    <el-input style="width:150px" placeholder="请输入粉丝号" v-model.trim="search_fan"></el-input>
                    ASIN:
                    <el-input style="width:150px" placeholder="请输入ASIN" v-model.trim="search_asin"></el-input>
                    订单号:
                    <el-input style="width:150px" placeholder="请输入订单号" v-model.trim="search_number"></el-input>
                    送测人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择送测人" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    状态:
                    <el-select v-model="statusSelect" placeholder="请选择" class="handle-select mr10">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="asin" label="ASIN" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="keyword" label="关键词" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="order_number" label="订单号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="pay_type" label="支付类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="currency" label="币种" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="pay_price" label="支付价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="commission" label="佣金" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="charge" label="手续费" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sumPrice" label="总费用" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="need_refund2" label="是否需要返款" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.need_refund2 == '是'">是</el-tag>
                        <el-tag type="success" v-else-if="scope.row.need_refund2 == '否'">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="截图" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row)"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paypal_account" label="paypal账号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="profile_url" label="亚马逊profile url" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.profile_url != null && scope.row.profile_url != '' && scope.row.profile_url != 'null'" :href="scope.row.profile_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="facebook_url" label="fackbook url" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.facebook_url != null && scope.row.facebook_url != '' && scope.row.facebook_url != 'null'" :href="scope.row.facebook_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="feedback" label="反馈" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="150">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="150">
                </el-table-column> -->
                <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">详情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDone(scope.$index, scope.row)" type="text">完成评论</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDoneRefund(scope.$index, scope.row)" type="text">完成返款</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleAddRefund(scope.$index, scope.row)" type="text">添加返款</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleFeedback(scope.$index, scope.row)" type="text">问题反馈</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="showPictures(scope.$index, scope.row)" type="text">图片</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            </el-table>
            <div class="pagination" v-if="paginationShow && totals != 0">
                <el-pagination  @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pagesize" layout="prev, pager, next" :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 完成弹出框 -->
        <el-dialog title="完成测评" :visible.sync="doneVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="评论截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否需要返款" prop="isPay">
                    <el-radio v-model="form.need_refund" label="true">是</el-radio>
                    <el-radio v-model="form.need_refund" label="false">否</el-radio>
                </el-form-item>
                <el-form-item label="返款时间" prop="pay_time">
                    <el-date-picker style="margin-right: 10px; margin-bottom: 5px;" v-model="form.refund_time" type="datetime" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doneVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDone" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 更新送测记录 -->
        <el-dialog title="添加送测信息" :visible.sync="updatereviewerVisible" width="50%">
            <el-form ref="addReviewerForm" :rules="rules" :model="addReviewerForm" label-width="130px">
                <el-form-item label="ASIN" prop="asin">
                    <span>{{addReviewerForm.asin}}</span>
                </el-form-item>
                <el-form-item label="关键词" prop="keyword">
                    <el-input v-model="addReviewerForm.keyword"></el-input>
                </el-form-item>
                <el-form-item label="订单号" prop="order_number">
                    <el-input v-model="addReviewerForm.order_number"></el-input>
                </el-form-item>
                <el-form-item label="支付类型" prop="pay_type">
                    <el-input v-model="addReviewerForm.pay_type"></el-input>
                </el-form-item>
                <el-form-item label="币种" prop="currency">
                    <el-input v-model="addReviewerForm.currency"></el-input>
                </el-form-item>
                <el-form-item label="支付时间" prop="pay_time">
                    <el-date-picker style="margin-right: 10px; margin-bottom: 5px;" v-model="addReviewerForm.pay_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="支付价格" prop="pay_price">
                    <el-input-number style="margin-bottom: 5px;" v-model="addReviewerForm.pay_price" :min="0" :step="10" @change="totalPrice"></el-input-number>
                </el-form-item>
                <el-form-item label="佣金" prop="commission">
                    <el-input-number style="margin-bottom: 5px;" v-model="addReviewerForm.commission" :min="0" @change="totalPrice"></el-input-number>
                </el-form-item>
                <el-form-item label="手续费" prop="poundage">
                    <el-input-number style="margin-bottom: 5px;" v-model="addReviewerForm.poundage" :min="0" @change="totalPrice"></el-input-number>
                </el-form-item>
                <el-form-item label="paypal账号" prop="paypal_account">
                    <el-input v-model="addReviewerForm.paypal_account"></el-input>
                </el-form-item>
                <el-form-item label="facebook url" prop="facebook_url">
                    <el-input v-model="addReviewerForm.facebook_url"></el-input>
                </el-form-item>
                <el-form-item label="是否需要返款" prop="isPay">
                    <el-radio v-model="addReviewerForm.isPay" label="true">是</el-radio>
                    <el-radio v-model="addReviewerForm.isPay" label="false">否</el-radio>
                </el-form-item>
                <el-form-item label="亚马逊profile url">
                    <el-input v-model="addReviewerForm.profile_url"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model="addReviewerForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="评论截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="退款截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList2" :on-remove="handleRemove2" :auto-upload="false" :on-change="changeFile2" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="总费用">
                    <el-button type="warning">{{sumPrice}}</el-button>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updatereviewerVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveReviewer('addReviewerForm')" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加失败反馈信息 -->
        <el-dialog title="失败反馈信息" :visible.sync="feedbackVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="反馈截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList3" :on-remove="handleRemove3" :auto-upload="false" :on-change="changeFile3" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="问题反馈" required>
                    <el-input v-model="form.feedback"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="feedbackVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveFeedback" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="95%">
            <el-table :data="review_details" border style="width: 100%">
                <el-table-column fixed prop="asin" label="ASIN" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="keyword" label="关键词" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="order_number" label="订单号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="pay_type" label="支付类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="currency" label="币种" >
                </el-table-column>
                <el-table-column prop="pay_time" label="支付时间" :formatter="formatter_pay_time" width="150">
                </el-table-column>
                <el-table-column prop="pay_price" label="支付价格" >
                </el-table-column>
                <el-table-column prop="commission" label="佣金">
                </el-table-column>
                <el-table-column prop="charge" label="手续费" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sumPrice" label="总费用" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="warning">{{scope.row.sumPrice}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="need_refund2" label="是否需要返款" width="95">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.need_refund2 == '是'">是</el-tag>
                        <el-tag type="success" v-else-if="scope.row.need_refund2 == '否'">否</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="截图" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paypal_account" label="paypal账号" width="85">
                </el-table-column>
                <el-table-column prop="profile_url" label="亚马逊profile url" width="113">
                    <template slot-scope="scope">
                        <a v-if="scope.row.profile_url != null && scope.row.profile_url != '' && scope.row.profile_url != 'null'" :href="scope.row.profile_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="facebook_url" label="fackbook url" width="95">
                    <template slot-scope="scope">
                        <a v-if="scope.row.facebook_url != null && scope.row.facebook_url != '' && scope.row.facebook_url != 'null'" :href="scope.row.facebook_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="feedback" label="反馈" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 查看产品图片 -->
        <el-dialog title="测评截图" :visible.sync="productVisible" width="40%">
            <el-carousel height="300px" type="card" v-if="picturestList.length != 0">
                <span>评论截图</span>
                <el-carousel-item v-for="(item, index) in picturestList" :key="index">
                    <img @click="handleDeletePic(item.remark, item.id, index)" class="img_fnsku" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <br>
            <el-carousel height="300px" type="card" v-if="picturestList2.length != 0">
                <span class="demonstration">退款截图</span>
                <el-carousel-item v-for="(item, index) in picturestList2" :key="index">
                    <img @click="handleDeletePic(item.remark, item.id, index)" class="img_fnsku" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <el-carousel height="300px" type="card" v-if="picturestList3.length != 0">
                <span class="demonstration">反馈截图</span>
                <el-carousel-item v-for="(item, index) in picturestList3" :key="index">
                    <img @click="handleDeletePic(item.remark, item.id, index)" class="img_fnsku" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!-- 删除产品图片提示 -->
        <el-dialog title="删除图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteImg">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 返款弹出框 -->
        <el-dialog title="返款" :visible.sync="refundVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="退款截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList2" :on-remove="handleRemove2" :auto-upload="false" :on-change="changeFile2" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refundVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRefund" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加返款弹出框 -->
        <el-dialog title="添加返款" :visible.sync="addrefundVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="退款截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList4" :on-remove="handleRemove4" :auto-upload="false" :on-change="changeFile4" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addrefundVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveaddRefund" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 下载提示 -->
        <el-dialog title="下载" :visible.sync="exportVisible" width="35%" @close="closeExport">
            <el-button type="primary"><a style="color:#fff;" :href="$axios.defaults.baseURL + '/task_records/export_url?ids=' + exportIds + '&token=' + export_token">下载excel文件</a></el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueInfiniteLoading from "vue-infinite-loading"
    export default {
//      name: 'product_manage',
        data() {
            return {
                url: './static/vuetable.json',
//              url: 'package.json',
                tableData: [],
                cur_page: 1,
                pagesize: 20,
//              pagesizes:'',
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                is_search: false,
                editVisible: false,
                delVisible: false,
                paginationShow: true,
                totals: 0,
                form: {
                    name: '',
                    date: '',
                    address: '',
                    remark: '',
                    feedback: '',
                    id: '',
                    need_refund: '',
                    refund_time: ''
                },
                idx: -1,
                productVisible: false,
                packageVisible: false,
                img_product: 1,
                pdf_product: 0,
                img_package: 1,
                pdf_package: 0,
                picturesProductList: [],
                picturesPackageList: [],
                supplier_id: undefined,
                confirmDelProVis: false,
                confirmDElPacVis: false,
                picture_id: undefined,
                submitDisabled: false,
                checkVisible: false,
                review_details: [],
                detailVisible: false,
                fileList: [],
                picturestList: [],
                productVisible: false,
                search_keyword: '',
                feedbackVisible: false,
                status: '',
                statusOptions: [{value: 1, label: '正在进行中'}, {value: 2, label: '已评论'}, {value: 3, label: '已完成'}, {value: 5, label: '失败'}],
                statusSelect: '',
                user_id_filter: '',
                query: undefined,
                user_page: 1,
                user_total: 0,
                loading: false,
                user_options: [],
                task_id: '',
                fileList2: [],
                fan_id: '',
                picturestList2: [],
                addReviewerForm: {
                    task_period_id: '',
                    task_id: '',
                    asin: '',
                    keyword: '',
                    order_number: '',
                    pay_type: '',
                    currency: '',
                    pay_time: '',
                    pay_price: 0,
                    commission: 0,
                    paypal_account: '',
                    profile_url: '',
                    facebook_url: '',
                    isPay: '',
                    remark: '',
                    poundage: 0
                },
                rules: {
                    keyword: [{
                        required: true,
                        message: '请输入关键词',
                        trigger: 'blur'
                    }],
                    pay_price: [{
                        required: true,
                        message: '请输入支付价格',
                        trigger: 'blur'
                    }],
                    asin: [{
                        required: true,
                        message: '请输入asin',
                        trigger: 'blur'
                    }],
                    order_number: [{
                        required: true,
                        message: '请输入订单号',
                        trigger: 'blur'
                    }],
                    pay_type: [{
                        required: true,
                        message: '请输入支付类型',
                        trigger: 'blur'
                    }],
                    currency: [{
                        required: true,
                        message: '请输入币种',
                        trigger: 'blur'
                    }],
                    pay_time: [{
                        required: true,
                        message: '请输入支付时间',
                        trigger: 'blur'
                    }],
                    commission: [{
                        required: true,
                        message: '请输入佣金',
                        trigger: 'blur'
                    }],
                    paypal_account: [{
                        required: true,
                        message: '请输入paypal账号',
                        trigger: 'blur'
                    }],
                    poundage: [{
                        required: true,
                        message: '请输入手续费',
                        trigger: 'blur'
                    }],
                    facebook_url: [{
                        required: true,
                        message: '请输入facebook url',
                        trigger: 'blur'
                    }],
                    isPay: [{
                        required: true,
                        message: '请选择是否需要返款',
                        trigger: 'blur'
                    }],
                },
                doneVisible: false,
                updatereviewerVisible: false,
                refundVisible: false,
                fileList3: [],
                picturestList3: [],
                search_fan: '',
                search_number: '',
                search_asin: '',
                addrefundVisible: false,
                fileList4: [],
                sumPrice: 0,
                pickerOptions2: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
              },
              date_filter: [],
              export_token: '',
              exportIds: [],
              exportVisible: false,
            }
        },
        created() {
            this.getData();
        },
        watch: {
        	"$route": "getData"
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'warning',
                    2: 'primary',
                    3: 'success',
                    4: 'danger',
                    5: 'danger',
                    6: 'success',
                    10: 'success',
                }
                return statusMap[status]
            },
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    return d
                })
            }
        },
        methods: {
        	handleSizeChange(val) {
        		this.pagesize = val;
        	},
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
//                  this.url = '/ms/table/list';
                };
                this.export_token = localStorage.getItem('token')
                if (!this.$route.params.task_id) {
                    this.$route.params.task_id = ''
                }
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/task_records?page='+this.cur_page + '&status=' + this.statusSelect + '&fan_id=' + this.fan_id + '&user_id=' + this.user_id_filter + '&task_id=' + this.$route.params.task_id + '&asin=' + this.search_asin + '&number=' + this.search_number + '&p_account=' + this.search_fan + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if (String(data.need_refund) == 'true') {
                                data.need_refund2 = '是'
                            } else if(String(data.need_refund) == 'false'){
                                data.need_refund2 = '否'
                            }
                            data.sumPrice = parseFloat((Number(data.charge) + Number(data.commission) + Number(data.pay_price)).toPrecision(12))
                            data.img_count = data.pictures.length
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                	console.log('error')
                })
            },
            filter_product() {
                this.cur_page = 1
                this.paginationShow = false
                if (!this.$route.params.task_id) {
                    this.$route.params.task_id = ''
                }
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/task_records?page='+this.cur_page + '&status=' + this.statusSelect + '&fan_id=' + this.fan_id + '&user_id=' + this.user_id_filter + '&task_id=' + this.$route.params.task_id + '&asin=' + this.search_asin + '&number=' + this.search_number + '&p_account=' + this.search_fan + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if (String(data.need_refund) == 'true') {
                                data.need_refund2 = '是'
                            } else if(String(data.need_refund) == 'false'){
                                data.need_refund2 = '否'
                            }
                            data.sumPrice = parseFloat((Number(data.charge) + Number(data.commission) + Number(data.pay_price)).toPrecision(12))
                            data.img_count = data.pictures.length
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                    }
                    this.paginationShow = true
                }).catch((res) => {
                    console.log('error')
                }).finally(() => {
                    
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.statusSelect = ''
                this.user_id_filter = ''
                this.search_number = ''
                this.search_asin = ''
                this.search_fan = ''
                this.date_filter = []
                this.getData()
            },
            formatter_created_at(row, column) {
				return row.created_at.substr(0, 19);
			},
			formatter_updated_at(row, column) {
				return row.updated_at.substr(0, 19);
			},
            formatter_pay_time(row, column) {
                return row.pay_time.substr(0, 19);
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            check(index, row) {
                this.idx = row.id
                this.checkVisible = true
            },
            handleDone(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                }
                this.form.remark = ''
                this.fileList = []
                // this.fileList2 = []
                this.doneVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            delAll() {
                const length = this.multipleSelection.length;
                let str = '';
                this.del_list = this.del_list.concat(this.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                this.$message.error('删除了' + str);
                this.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 保存编辑
            saveDone() {
                if (this.form.need_refund == '' || this.form.need_refund == undefined) {
                    this.$message.error('请选择是否需要返款')
                    return
                }
                this.submitDisabled = true
                let formData = new FormData()
                formData.append('remark', this.form.remark)
                formData.append('need_refund', this.form.need_refund)
                formData.append('refund_time', this.form.refund_time)
                this.fileList.forEach((item) => {
                    formData.append('picture_review[]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.post('/task_records/' + this.form.id + '/done_review', formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('完成评论！')
                        this.getData()
                        this.doneVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            // 确定删除
            deleteRow(){
            	let index = this.idx
            	const item = this.tableData[index];
            	this.form = {
            		id: item.id
            	}
            	this.$axios.delete('/task_records/'+this.form.id, 
            	{
            		headers: {'Authorization': localStorage.getItem('token')}
            	}
            ).then((res) => {
            	if(res.data.code == 200){
            		this.tableData.splice(this.idx, 1)
            		this.getData()
            		this.$message.success("删除成功")           		
            	}
            }).catch((res) => {
            	this.$message.error("删除失败")
            })
                this.delVisible = false;
            },
            handleDetails(index, row) {
                this.detailVisible = true
                this.review_details = [row]
                // this.$axios.get('/suppliers/' + row.id, {
                //     headers: {
                //         'Authorization': localStorage.getItem('token')
                //     }
                // }).then((res) => {
                //     if(res.data.code == 200) {
                //         this.suppliers_details = [res.data.data]
                //         this.detailVisible = true
                //     }
                // }).catch((res) => {

                // })
            },
            changeFile(file) {
                this.fileList.push(file)
            },
            handleRemove(a, b) {
                this.fileList = b
            },
            changeFile2(file) {
                this.fileList2.push(file)
            },
            handleRemove2(a, b) {
                this.fileList2 = b
            },
            changeFile3(file) {
                this.fileList3.push(file)
            },
            handleRemove3(a, b) {
                this.fileList3 = b
            },
            changeFile4(file) {
                this.fileList4.push(file)
            },
            handleRemove4(a, b) {
                this.fileList4 = b
            },
            showPictures(index, row) {
                this.picturestList = []
                this.picturestList2 = []
                this.picturestList3 = []
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    if (data.remark == 'review') {
                        this.picturestList.push(data)
                    } else if (data.remark == 'refund'){
                        this.picturestList2.push(data)
                    } else {
                        this.picturestList3.push(data)
                    }
                })
                this.productVisible = true;
            },
            handleDeletePic(remark, id, index) {
                this.remark = remark
                this.picture_id = id
                this.idx = index;
                this.confirmDelProVis = true;
            },
            deleteImg() {
                let params = {
                    // id: this.product_id,
                    img_id: this.picture_id
                }
                this.$axios.post('/task_records/' + this.product_id + '/delete_img', params, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        if (this.remark == 'review') {
                            this.picturestList.splice(this.idx, 1)
                        } else if (this.remark == 'refund') {
                            this.picturestList2.splice(this.idx, 1)
                        } else{
                            this.picturestList3.splice(this.idx, 1)
                        }
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDelProVis = false
                    }
                }).catch((res) => {

                })
            },
            formatter_created_at(row, column) {
                return row.created_at.substr(0, 19);
            },
            formatter_updated_at(row, column) {
                return row.updated_at.substr(0, 19);
            },
            handleFeedback(index, row) {
                this.form.id = row.id
                this.form.feedback = ''
                this.feedbackVisible = true
            },
            saveFeedback() {
                if(this.form.feedback.trim() == '') {
                    this.$message.error('请输入反馈内容')
                    return
                }
                let formData = new FormData()
                formData.append('feedback', this.form.feedback)
                this.fileList3.forEach((item) => {
                    formData.append('picture_feedback[]', item.raw)
                })
                this.$axios.post('/task_records/' + this.form.id + '/done_failure', formData, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.getData()
                        this.$message.success("反馈成功!")
                        this.feedbackVisible = false
                    }
                }).catch((res) => {

                })
            },
            onInfinite_user(obj) {
                if((this.user_page * 20) < this.user_total) {
                    this.user_page += 1
                    // this.getUsers(obj.loaded)
                    this.remoteMethod(this.query,obj.loaded)
                } else {
                    obj.complete()
                }
            },
            selectVisble(visible) {
                if(visible) {
                    this.query = undefined
                    this.remoteMethod("")
                }
            },
            remoteMethod(query, callback = undefined) {
                if(query != "" || this.query != "" || callback) {
                    let reload = false
                    if(this.query != query) {
                        this.loading = true
                        this.user_page = 1
                        this.query = query
                        reload = true
                        if(this.$refs.infiniteLoading.isComplete) {
                            this.$refs.infiniteLoading.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.user_page + '&name=' + query.trim(), {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.loading = false
                            //                          this.options = res.data.data
                            if(reload) {
                                let tempOptions = []
                                this.user_options = tempOptions.concat(res.data.data)
                            } else {
                                this.user_options = this.user_options.concat(res.data.data)
                            }
                            this.user_total = res.data.count
                            if(callback) {
                                callback()
                            }
                        }
                    }).catch((res) => {
                        console.log('失败')
                    })
                }
            },
            handleEdit(index, row) {
                this.idx = row.id
                const item = this.tableData[index]
                this.addReviewerForm = {
                    task_period_id: item.task_period_id,
                    task_id: item.task_id,
                    asin: item.asin,
                    keyword: item.keyword,
                    order_number: item.order_number,
                    pay_type: item.pay_type,
                    currency: item.currency,
                    pay_time: item.pay_time,
                    pay_price: item.pay_price,
                    commission: item.commission,
                    paypal_account: item.paypal_account,
                    profile_url: item.profile_url,
                    facebook_url: item.facebook_url,
                    isPay: String(item.need_refund),
                    remark: item.remark,
                    poundage: item.charge
                },
                this.sumPrice = Number(this.addReviewerForm.pay_price) + Number(this.addReviewerForm.commission) + Number(this.addReviewerForm.poundage)
                this.fileList = []
                this.fileList2 = []
                this.updatereviewerVisible = true
            },
            saveReviewer(formName) {
                if (this.addReviewerForm.isPay == 'null') {
                    this.$message.error('请选择是否需要返款')
                    return
                }
                let formData = new FormData()
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.submitDisabled = true
                        formData.append('task_record[asin]', this.addReviewerForm.asin)
                        formData.append('task_record[keyword]', this.addReviewerForm.keyword)
                        formData.append('task_record[order_number]', this.addReviewerForm.order_number)
                        formData.append('task_record[pay_type]', this.addReviewerForm.pay_type)
                        formData.append('task_record[currency]', this.addReviewerForm.currency)
                        formData.append('task_record[pay_time]', this.addReviewerForm.pay_time)
                        formData.append('task_record[pay_price]', this.addReviewerForm.pay_price)
                        formData.append('task_record[commission]', this.addReviewerForm.commission)
                        formData.append('task_record[charge]', this.addReviewerForm.poundage)
                        formData.append('task_record[need_refund]', this.addReviewerForm.isPay)
                        formData.append('task_record[paypal_account]', this.addReviewerForm.paypal_account)
                        formData.append('task_record[profile_url]', this.addReviewerForm.profile_url)
                        formData.append('task_record[facebook_url]', this.addReviewerForm.facebook_url)
                        formData.append('task_record[remark]', this.addReviewerForm.remark)
                        formData.append('task_record[task_id]', this.addReviewerForm.task_id)
                        formData.append('task_record[task_period_id]', this.addReviewerForm.task_period_id)
                        this.fileList.forEach((item) => {
                            formData.append('picture_review[]', item.raw)
                        })
                        this.fileList2.forEach((item) => {
                            formData.append('picture_refund[]', item.raw)
                        })
                        let config = {
                            headers: {
                                'Authorization': localStorage.getItem('token')
                            }
                        }
                        this.$axios.patch('/task_records/' + this.idx, formData, config).then((res) => {
                            if(res.data.code == 200) {
                                this.$message.success('提交成功！')
                                this.$refs[formName].resetFields()
                                this.updatereviewerVisible = false
                                this.getData()
                                // this.$router.push('/reviewersmanage')
                            }
                        }).catch((res) => {
                            console.log('err')
                        }).finally((res) => {
                            this.submitDisabled = false
                        })
                    } else {
                        this.$message.error("请填写完整信息")
                        // return false
                    }
                })
            },
            handleDoneRefund(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                }
                this.form.remark = ''
                this.fileList2 = []
                this.refundVisible = true;
            },
            saveRefund() {
                this.submitDisabled = true
                let formData = new FormData()
                formData.append('remark', this.form.remark)
                this.fileList2.forEach((item) => {
                    formData.append('picture_refund[]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.post('/task_records/' + this.form.id + '/done_refund', formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('完成返款！')
                        this.getData()
                        this.refundVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            handleAddRefund(index, row) {
                this.form = {
                    id: row.id,
                }
                this.fileList4 = []
                this.addrefundVisible = true;
            },
            saveaddRefund() {
                this.submitDisabled = true
                let formData = new FormData()
                this.fileList4.forEach((item) => {
                    formData.append('picture_refund[]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.post('/task_records/' + this.form.id + '/update_picture', formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('完成添加返款！')
                        this.getData()
                        this.addrefundVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            totalPrice() {
                this.sumPrice = this.addReviewerForm.pay_price + this.addReviewerForm.commission + this.addReviewerForm.poundage
            },
            exportReviewers() {
                if(this.multipleSelection.length == 0) {
                    this.$message.error('请至少选择一条数据')
                    return
                }
                this.multipleSelection.forEach((data) => {
                    this.exportIds.push(data.id)
                })
                this.export_token = localStorage.getItem('token')
                this.exportVisible = true
            },
            closeExport() {
                this.exportVisible = false
                this.exportIds = []
                this.$refs.multipleTable.clearSelection()
            },
            getStatusName(status) {
                if(status == 1) {
                    return "正在进行中"
                } else if(status == 2) {
                    return "已评论"
                } else if(status == 3) {
                    return "已完成"
                }else if(status == 4) {
                    return "已删除"
                }else if(status == 5) {
                    return "失败"
                }else {
                    return '其他'
                }
            },
        },
        components: {
            "infinite-loading": VueInfiniteLoading
        }
    }

</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .fnsku_filter {
        float: right;
    }

    .img_fnsku {
        width:15rem;
        height:15rem;
    }
    .img {
        width:3rem;
        height:3rem;
    }

    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
</style>
