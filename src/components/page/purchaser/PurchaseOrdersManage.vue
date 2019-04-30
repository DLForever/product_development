<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item>采购订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="fnsku_filter">
                    <!-- 日期:
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                     分类:
                    <el-cascader :options="options" v-model="category_id_filter" expand-trigger="hover" @change="getCatetory" change-on-select class="handle-select mr10"></el-cascader>
                    开发人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    供应商:
                    <el-select v-model="supplier_id_filter" placeholder="选择供应商" @visible-change="supplierselectVisble" class="handle-select mr10">
                        <el-option v-for="item in supplier_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    SKU:
                    <el-input style="width:150px" placeholder="请输入SKU"></el-input> -->
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="apply_username" label="申请人" show-overflow-tooltip>
                </el-table-column>
                <el-table-column  prop="username" label="审核人" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column label="图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" class="img" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"@click="showProduct(scope.$index, scope.row)"/>
                            <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="supplier_name" label="公司名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="order_number" label="订单号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status, scope.row.done_direct)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable width="140">
                </el-table-column>
                <!-- <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable width="140">
                </el-table-column> -->
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
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
                                    <el-button @click="handleCheck(scope.$index, scope.row)" type="text">审核</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleApply(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp借&nbsp出</el-button>
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
            <div class="pagination">
                <el-pagination v-if="paginationShow" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pagesize" layout="prev, pager, next" :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="98%">
            <el-table :data="purchase_details" border style="width: 100%">
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="dist_type" label="入库方式"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.dist_type === 1">入国内仓</el-tag>
                        <el-tag type="primary" v-else-if="scope.row.dist_type === 2">不入仓</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.dist_type === 3">中转</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="put_card_sum" label="好评卡数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="中转地址">
                </el-table-column>
                <el-table-column prop="scheduled_card_sum" label="已计划好评卡数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="scheduled_sum" label="已计划采购数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="好评卡图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" class="img" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"@click="showProduct(scope.$index, scope.row)"/>
                            <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <el-select style="margin-bottom:10px;margin-top:20px;" v-model="supplier_id" placeholder="请选择供应商" @visible-change="supplierselectVisbleEdit">
                <el-option v-for="item in supplier_options_edit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <infinite-loading :on-infinite="onInfinite_suppliers_edit" ref="infiniteLoading3"></infinite-loading>
            </el-select>
            供应商账户：
            <el-button v-if="account_id === ''" type="warning" v-model.trim="account_id" @click="update_account(supplier_id)" :disabled="supplier_id === ''">未选择</el-button>
            <el-button v-if="account_id != ''" type="success" v-model.trim="account_id" @click="update_account(supplier_id)">已选择</el-button>
            <el-table :data="purchaseOrders" border style="width: 100%">
                <!-- <el-table-column prop="supplier" label="供应商" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.supplier" placeholder="供应商" @visible-change="supplierselectVisble">
                            <el-option v-for="item in supplier_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            <infinite-loading :on-infinite="onInfinite_suppliers" ref="infiniteLoading2"></infinite-loading>
                        </el-select>
                    </template>
                </el-table-column> -->
                <el-table-column prop="sku" label="SKU" width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.product_id">
                            <el-option v-for="item in purchase_skus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="入库方式">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.dist_type">
                            <el-option v-for="item in dist_type_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="好评卡数" width="120">
                    <template slot-scope="scope">
                        <el-input-number style="width:100px" size="mini" controls-position="right" v-model="scope.row.put_card_sum" :step="5" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="sku" label="需要发票?" width="80">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.is_need_invoice">是</el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="数量" width="120">
                    <template slot-scope="scope">
                        <el-input-number style="width:100px" size="mini" controls-position="right" v-model="scope.row.sum" :step="100" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="价格" width="120">
                    <template slot-scope="scope">
                        <el-input-number style="width:100px" size="mini" controls-position="right" v-model="scope.row.price" :step="10" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="process_peroid" label="做货周期" width="120">
                    <template slot-scope="scope">
                        <el-input-number style="width:100px" size="mini" controls-position="right" v-model="scope.row.process_peroid" :step="2" :min="0"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column prop="process_peroid" label="交货时间" width="150">
                    <template slot-scope="scope">
                        <el-date-picker v-model.trim="scope.row.delivery_date" placeholder="选择日期" size="mini" type="date" style="width:125px"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="process_peroid" label="到达时间" width="150">
                    <template slot-scope="scope">
                        <el-date-picker v-model.trim="scope.row.arrive_date" placeholder="选择日期" size="mini" type="date" style="width:125px"></el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="中转地址">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.address" placeholder="中转地址" :disabled="!(scope.row.dist_type === 3)"></el-input>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="sum" label="供应商账户" width="90">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.account_id === ''" type="warning" v-model.trim="scope.row.account_id" @click="update_account(supplier_id, scope.$index)" :disabled="supplier_id === ''">未选择</el-button>
                        <el-button v-if="scope.row.account_id != ''" type="success" v-model.trim="scope.row.account_id" @click="update_account(supplier_id, scope.$index)">已选择</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column prop="sum" label="供应商条款" width="90">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.term_id === ''" type="warning" v-model.trim="scope.row.term_id" @click="update_term(supplier_id, scope.row.term_id, scope.$index)" :disabled="scope.row.sku === '' || supplier_id === ''">未选择</el-button>
                        <el-button v-if="scope.row.term_id != ''" type="success" v-model.trim="scope.row.term_id" @click="update_term(supplier_id, scope.row.term_id, scope.$index)">已选择</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" placeholder="请输入备注"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="好评卡图片" width="200">
                    <template slot-scope="scope">
                        <el-upload id="upload-pur" action="" :file-list="scope.row.pictures" :on-remove="(res, file)=>{return handleRemovePurchaseOrder(res, file, scope.$index)}" :auto-upload="false" :on-change="(res, file)=>{return changePurchaseOrder(res, file, scope.$index)}" multiple>
                            <el-button slot="trigger" size="small" type="primary">选取好评卡图片</el-button>
                        </el-upload>
                    </template>
                </el-table-column>
            </el-table>
            <div class="add_purchadse_sku">
                <el-button type="primary" icon="el-icon-plus" @click="addPurchaseSku">新增</el-button>
                <el-button type="danger" icon="el-icon-delete" :disabled="purchaseOrders.length === 1" @click="deletePurchaseSku">撤销</el-button>
            </div>
            
            <el-input v-model.trim="remark" placeholder="请输入备注"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePurchaseOrder" :disabled="submitDisabled">更新采购单</el-button>
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
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="products_details" border style="width: 100%">
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="dist_type" label="入库方式"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.dist_type === 1">入国内仓</el-tag>
                        <el-tag type="primary" v-else-if="scope.row.dist_type === 2">不入仓</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.dist_type === 3">中转</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sum" label="数量"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="put_card_sum" label="好评卡数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="process_peroid" label="做货周期">
                </el-table-column>
                <el-table-column prop="arrive_date" label="到达时间">
                </el-table-column>
                <el-table-column prop="delivery_date" label="交货时间">
                </el-table-column>
                <el-table-column label="好评卡图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" class="img" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"@click="showProduct(scope.$index, scope.row)"/>
                            <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            </el-table>
            <br>
            <el-table :data="supplier_account_detail" border style="width: 100%">
                <el-table-column prop="collection_account" label="收款账号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="account_name" label="收款账号姓名"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="us_collection_account" label="外币收款账号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="english_name" label="外币收款账号姓名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="payment_day" label="账期天数">
                </el-table-column>
                <el-table-column prop="clearing_form" label="结算方式">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.clearing_form | statusFilter">{{getStatusClearing_Form(scope.row.clearing_form)}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-table :data="supplier_term_detail" border style="width: 100%">
                <el-table-column prop="supplier_term.currency" label="货币" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.contract_term" label="合同条款"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.quality_request" label="合同要求" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.shipping_type" label="运输方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.shipping_bear_fee" label="费用承担">
                </el-table-column>
                <el-table-column prop="supplier_term.package_standard" label="包装标准">
                </el-table-column>
                <el-table-column prop="supplier_term.acceptance_method" label="验收方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.liability_for_breach" label="违约责任"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.dissolution_method" label="解决合同纠纷的方式" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.covenant" label="其他约定事项" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.tax" label="开票税点">
                </el-table-column>
                <el-table-column prop="supplier_term.exit_tax" label="出口退税点">
                </el-table-column>
                <el-table-column prop="supplier_term.reject_ratio" label="不良率">
                </el-table-column>
                <el-table-column prop="supplier_term.term_remark" label="备注">
                </el-table-column>
            </el-table>
            <br>
            <el-button type="primary" @click="showApplyPurchase">创建付款申请单</el-button>
        </el-dialog>
        <!-- 查看产品图片 -->
        <el-dialog title="图片" :visible.sync="productVisible" width="70%">
            <el-carousel height="600px" type="card" v-if="picturesProductList.length != 0">
                <el-carousel-item v-for="(item, index) in picturesProductList" :key="index">
                    <img @click="handleDeletePro(item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </span>
        </el-dialog>
        <!-- 删除产品图片提示 -->
        <el-dialog title="删除产品图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteProductImg">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 审核提示框 -->
        <el-dialog title="审核" :visible.sync="checkVisible" width="50%">
            <el-form label-width="50px">
                <el-form-item label="备注">
                    <el-input v-model="remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible = false">取 消</el-button>
                <el-button type="warning" @click="saveCheck(0)">拒 绝</el-button>
                <el-button type="primary" @click="saveCheck(1)">通 过</el-button>
            </span>
        </el-dialog>
        <!-- 编辑供应商账户 -->
        <el-dialog title="编辑供应商账户" :visible.sync="updateAccountVisible" width="50%">
            <el-form ref="update_accountForm" :model="update_accountForm" label-width="150px">
                <el-form-item label="收款账号">
                    <el-input v-model="update_accountForm.collection_account"></el-input>
                </el-form-item>
                <el-form-item label="收款账号姓名">
                    <el-input v-model="update_accountForm.account_name"></el-input>
                </el-form-item>
                <el-form-item label="外币收款账号">
                    <el-input v-model="update_accountForm.us_collection_account"></el-input>
                </el-form-item>
                <el-form-item label="外币收款账号姓名">
                    <el-input v-model="update_accountForm.english_name"></el-input>
                </el-form-item>
                <el-form-item label="账期天数">
                    <el-input-number v-model="update_accountForm.payment_day" :min="0" :step="2"></el-input-number>
                </el-form-item>
                <el-form-item label="结算方式">
                    <el-select v-model="update_accountForm.clearing_form">
                        <el-option v-for="item in clearing_form_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateAccountVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveupdateAccount" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑供应商条款 -->
        <el-dialog title="编辑供应商条款" :visible.sync="updateTermVisible" width="50%">
            <el-form ref="update_termForm" :model="update_termForm" label-width="150px">
                <el-form-item label="货币">
                    <el-input v-model="update_termForm.currency"></el-input>
                </el-form-item>
                <el-form-item label="合同条款">
                    <el-input v-model="update_termForm.contract_term"></el-input>
                </el-form-item>
                <el-form-item label="质量要求">
                    <el-input v-model="update_termForm.quality_request"></el-input>
                </el-form-item>
                <el-form-item label="运输方式">
                    <el-input v-model="update_termForm.shipping_type"></el-input>
                </el-form-item>
                <el-form-item label="费用承担">
                    <el-input v-model="update_termForm.shipping_bear_fee"></el-input>
                </el-form-item>
                <el-form-item label="包装标准">
                    <el-input v-model="update_termForm.package_standard"></el-input>
                </el-form-item>
                <el-form-item label="验收方式">
                    <el-input v-model="update_termForm.acceptance_method"></el-input>
                </el-form-item>
                <el-form-item label="违约责任">
                    <el-input v-model="update_termForm.liability_for_breach"></el-input>
                </el-form-item>
                <el-form-item label="解决合同纠纷的方式">
                    <el-input v-model="update_termForm.dissolution_method"></el-input>
                </el-form-item>
                <el-form-item label="其他约定事项">
                    <el-input v-model="update_termForm.covenant"></el-input>
                </el-form-item>
                <el-form-item label="开票税点">
                    <el-input-number v-model="update_termForm.tax" :precision="2" :step="0.01" :max="1"></el-input-number>
                </el-form-item>
                <el-form-item label="出口退税点">
                    <el-input-number v-model="update_termForm.exit_tax" :precision="2" :step="0.01" :max="1"></el-input-number>
                </el-form-item>
                <el-form-item label="不良率">
                    <el-input-number v-model="update_termForm.reject_ratio" :precision="2" :step="0.01" :max="1"></el-input-number>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="update_termForm.term_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateTermVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveupdateTerm" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑供应商账户 -->
        <el-dialog title="付款申请" :visible.sync="applyPayVisible" width="50%">
            <el-form ref="applyPurchase" label-width="100px" :label-position="labelPosition">
                <el-form-item label="价格">
                    <el-input-number v-model="applyPurchase.price" :min="0" :step="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="支付类型">
                    <template slot-scope="scope">
                        <el-select v-model="applyPurchase.p_type">
                            <el-option v-for="item in pay_type_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="applyPurchase.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="applyPayVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitApplyPurchase">创建付款申请单</el-button>
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
                del_list: [],
                fileList: [],
                fileList2: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                paginationShow: true,
                search_fnsku: '',
                search_shopname: '',
                totals: 0,
                form: {
                    name: '',
                    date: '',
                    address: '',
                },
                idx: -1,
                productVisible: false,
                picturesProductList: [],
                product_id: undefined,
                confirmDelProVis: false,
                confirmDElPacVis: false,
                picture_id: undefined,
                submitDisabled: false,
                options: [],
                category_id: [],
                stockVisible: false,
                stock_sum: '',
                stock_remark: undefined,
                apply_stocksum: '',
                apply_stockremark: undefined,
                applyVisible: false,
                in_type: '',
                price: '',
                products_details: [],
                detailVisible: false,
                user_id_filter: '',
                category_id_filter: [],
                supplier_id_filter: '',
                user_options: [],
                user_options2: [],
                category_options: [],
                supplier_options: [],
                supplier_page: 1,
                supplier_total: 0,
                user_page: 1,
                user_total: 0,
                category_page: 1,
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
              supplier_options_edit: [],
              supplier_page_edit: 1,
              supplier_total_edit: 0,
              categories_options: [],
              query: undefined,
              loading: false,
              options_len1: [],
              options_len2: [],
              options_len3: [],
              options_len4: [],
              options3: [],
              options4: [],
              edit_category_options: [],
              options5: [],
              out_type: 0,
              returnVisible: false,
              return_remark: '',
              table_loading: true,
              checkVisible: false,
              remark: '',
              purchase_details: [],
              purchaseOrders: [],
              dist_type_options: [{value: 1, label: '入国内仓'}, {value: 2, label: '不入仓'}, {value: 3, label: '中转'}],
              purchase_skus: [],
              supplier_id: '',
              update_accountForm: {
                collection_account: '',
                account_name: '',
                us_collection_account: '',
                english_name: '',
                payment_day: '',
                clearing_form: ''
              },
              update_termForm: {
                currency: '',
                currency_term: '',
                quality_request: '',
                shipping_type: '',
                shipping_bear_fee: '',
                package_standard: '',
                acceptance_method: '',
                liability_for_breach: '',
                dissolution_method: '',
                term_remark: '',
                covenant: '',
                tax: '',
                exit_tax: '',
                reject_ratio: ''
              },
              updateAccountVisible: false,
              updateTermVisible: false,
              update_index: '',
              clearing_form_options: [{value: 1, label: '先定金后尾款'}, {value: 2, label: '全款'}, {value: 3, label: '月结'}, {value: 4, label: '日结'}],
              supplier_account_detail: [],
              supplier_term_detail: [],
              account_id: '',
              labelPosition: 'left',
              applyPurchase: {
                price: 0,
                p_type: '',
                remark: ''
              },
              pay_type_options: [{value: 1, label: '定金'}, {value: 2, label: '全款'}, {value: 3, label: '尾款'}, {value: 4, label: '月结'}, {value: 5, label: '尾款'}],
              applyPayVisible: false,
              order_id: '',
            }
        },
        created() {
            this.getData();
            // this.getUsers()
            // this.getSuppliers()
            this.getCategories()
            // this.getSuppliersEdit()
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'warning',
                    2: 'primary',
                    3: 'danger',
                    4: 'danger',
                    5: 'primary',
                    6: 'success',
                }
                return statusMap[status]
            },
        },
        watch: {
        	"$route": "getData"
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    return d
                    // let is_del = false;
                    // if (!is_del) {
                    //     if ((d.name.indexOf(this.select_word) > -1 ||
                    //             d.fnsku.indexOf(this.select_word) > -1)
                    //     ) {
                    //         return d;
                    //     }
                    // }
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
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
//                  this.url = '/ms/table/list';
                };
                this.table_loading = true
                let category_id_temp = this.category_id_filter[this.category_id_filter.length-1]
                if(category_id_temp == undefined) {
                    category_id_temp = ''
                }
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/purchase_orders?page='+this.cur_page
                // this.$axios.get( '/samples?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            // data.img_count = data.pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                    console.log('error')
                }).finally(() => {
                    this.table_loading = false
                })
            },
            filter_product() {
                this.table_loading = true
                this.cur_page = 1
                this.paginationShow = false
                let category_id_temp = this.category_id_filter[this.category_id_filter.length-1]
                if(category_id_temp == undefined) {
                    category_id_temp = ''
                }
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/purchase_orders?page='+this.cur_page
                // this.$axios.get( '/samples?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            // data.img_count = data.pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                    console.log('error')
                }).finally(() => {
                    this.table_loading = false
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.user_id_filter = ''
                this.category_id_filter = []
                this.supplier_id_filter = ''
                this.date_filter = []
                this.getData()
            },
            getSuppliers() {
                this.$axios.get('/suppliers?page=' + this.supplier_page
                ).then((res) => {
                    if(res.data.code==200) {
                        this.supplier_options = this.supplier_options.concat(res.data.data)
                        this.supplier_total = res.data.count
                    }
                }).catch((res) => {

                })
            },
            getUsers() {
                this.$axios.get('/users?page=' + this.user_page
                ).then((res) => {
                    if(res.data.code==200) {
                        this.user_options = this.user_options.concat(res.data.data)
                        this.user_total = res.data.count
                    }
                }).catch((res) => {

                })
            },
            getCategories() {
                if (process.env.NODE_ENV === 'development') {
                };
                this.$axios.get( '/categories?page='+this.category_page
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options3 = res.data.data
                        this.options5 = this.options3
                        this.getCatetoryLoop(1)
                        // this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        // for(let i=0; i < Math.ceil(res.data.count / 20); i++) {
                        //     this.getCatetoryLoop(i+1)
                        // }
                        // this.total = res.data.count
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            getCatetoryLoop(page) {
                this.$axios.get( '/categories?page='+page
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        this.options4 = this.options
                        this.categories_options = this.categories_options.concat(res.data.data)
                        // this.total = res.data.count
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            getCategoryTree(categories,id){
                let result = []
                for (var i = 0; i < categories.length; i++){
                    if(categories[i].parent_id == id || categories[i].parent_id == null){
                        result.push({value:categories[i].id,label:categories[i].name,children:this.getTree(categories,categories[i].id)})
                    }
                }
                return result
            },
            getTree(categories,id){
                let tmp =  categories.filter((s) => {
                    return s.parent_id == id
                    })
                return tmp.map((s) => {
                    return {value:s.id,label:s.name,children:this.getTree(categories,s.id)}
               })
            },
            formatter_created_at(row, column) {
				return row.created_at.substr(0, 19);
			},
			formatter_updated_at(row, column) {
				return row.updated_at.substr(0, 19);
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
            categories_loop(c) {
                this.categories_options.forEach((data) => {
                    if(c==data.id) {
                        if(data.parent_id) {
                            this.category_id.unshift(data.parent_id)
                            this.categories_loop(data.parent_id)
                        }
                    }
                })
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
            saveEdit() {
                let temp = 0
                this.fileList.forEach((item) => {
                    if(!(item.raw.type.match(/image/))){
                        temp = 1
                    }
                })
                if(temp) {
                    this.$message.error('请上传正确的图片格式!')
                    return
                }
                this.submitDisabled = true
                let params = {
                    remark: this.form.remark,
                }
                let formData = new FormData()
                formData.append('sample[name]', this.form.name)
                formData.append('sample[title]', this.form.title)
                formData.append('sample[category_id]', this.category_id[this.category_id.length - 1])
                formData.append('sample[supplier_id]', this.form.supplier_id)
                formData.append('sample[desc]', this.form.desc)
                formData.append('sample[desc_url]', this.form.desc_url)
                formData.append('sample[package_length]', this.form.package_length)
                formData.append('sample[package_width]', this.form.package_width)
                formData.append('sample[package_height]', this.form.package_height)
                formData.append('sample[package_weight]', this.form.package_weight)
                formData.append('sample[length]', this.form.length)
                formData.append('sample[width]', this.form.width)
                formData.append('sample[height]', this.form.height)
                formData.append('sample[weight]', this.form.weight)
                formData.append('sample[price]', this.form.price)
                formData.append('sample[origin_url]', this.form.origin_url)
                formData.append('sample[picture_url]', this.form.picture_url)
                formData.append('sample[remark]', this.form.remark)
                this.fileList.forEach((item) => {
                    formData.append('sample[pictures][]', item.raw)
                })
                // this.fileList2.forEach((item) => {
                //     formData.append('package_pictures[]', item.raw)
                // })
                this.$axios.patch('/samples/' + this.form.id, formData).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        // this.options = []
                        this.fileList = []
                        this.category_id = []
                        this.getData()
                        this.editVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            closeEdit() {
                // this.options5 = this.options3
                // this.options = this.options4
                this.category_id = []
                this.fileList = []
                this.editVisible = false
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
            changeBatch(file) {
                this.batchList.push(file)
            },
            // 确定删除
            deleteRow(){
            	let index = this.idx
            	const item = this.tableData[index];
            	this.form = {
            		id: item.id
            	}
            	this.$axios.delete('/samples/'+this.form.id
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
            handleStock(index, row) {
                this.stock_sum = ''
                this.stock_remark = undefined
                this.idx = row.id
                this.in_type = 0
                this.stockVisible = true
            },
            saveStock() {
                if(this.stock_sum == '' || this.stock_remark == undefined || this.in_type == 0) {
                    this.$message.error('请输入完整信息')
                    return
                }
                this.submitDisabled = true
                let params = {
                    id: this.idx,
                    sum: this.stock_sum,
                    in_type: this.in_type,
                    price: this.price,
                    remark: this.stock_remark
                }
                this.$axios.post('/sample_ins', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('提交成功')
                        this.getData()
                        this.stockVisible = false
                        this.submitDisabled = false
                    }
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
                })
            },
            handleDetails(index, row) {
                this.order_id = row.id
                this.$axios.get('/purchase_orders/' + row.id
                ).then((res) => {
                    if(res.data.code==200) {
                        // this.purchase_details = res.data.data[0].purchase_order_products
                        if (res.data.data.length != 0) {
                            this.supplier_account_detail = [res.data.data[0].supplier_account]
                            this.supplier_term_detail = res.data.data[0].purchase_order_products
                            this.products_details = res.data.data[0].purchase_order_products
                            this.products_details.forEach((data) => {
                                data.img_count = data.pictures.length
                            })
                        }
                        this.detailVisible = true
                    }
                }).catch((res) => {
                    console.log(res)
                })
                
                
            },
            onInfinite_suppliers(obj) {
                if((this.supplier_page * 20) < this.supplier_total) {
                    this.supplier_page += 1
                    this.getSuppliers(obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
                }
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
            onInfinite_suppliers_edit(obj) {
                if((this.supplier_page_edit * 20) < this.supplier_total_edit) {
                    this.supplier_page_edit += 1
                    this.getSuppliersEdit(obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
                }
            },
            getSuppliersEdit() {
                this.$axios.get('/suppliers?page=' + this.supplier_page_edit
                ).then((res) => {
                    if(res.data.code==200) {
                        res.data.data.forEach((data) => {
                            if(!(this.supplier_options_edit.find(data2 => data2.id === data.id))){
                                this.supplier_options_edit.push(data)
                            }
                        })
                        // this.supplier_options_edit = this.supplier_options_edit.concat(res.data.data)
                        this.supplier_total_edit = res.data.count
                    }
                }).catch((res) => {

                })
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
                    this.$axios.get("/users/?page=" + this.user_page + '&name=' + query.trim()
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.loading = false
                            //                          this.options = res.data.data
                            if(reload) {
                                this.user_options = this.user_options2.concat(res.data.data)
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
            showProduct(index, row) {
                this.picturesProductList = []
                this.product_id = row.id
                // const item = this.tableData[index]
                row.pictures.forEach((data) => {
                    this.picturesProductList.push(data)
                    // if(data.remark == 'main') {
                    //     this.picturesProductList.push(data)
                    // }
                })
                this.productVisible = true;
            },
            handleDeletePro(id, index) {
                this.picture_id = id
                this.idx = index;
                this.confirmDelProVis = true;
            },
            deleteProductImg() {
                let params = {
                    img_id: this.picture_id
                }
                this.$axios.post('/samples/' + this.product_id+ '/delete_img', params
                ).then((res) => {
                    if(res.data.code == 204) {
                        this.picturesProductList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDelProVis = false
                    }
                }).catch((res) => {

                })
            },
            getCatetory() {
                this.$axios.get( '/categories?parent_id=' + this.category_id_filter[this.category_id_filter.length -1]
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = []
                        let temp_options = []
                        if(this.category_id_filter.length == 1) {
                            this.options_len1 = this.options3
                            this.options_len1 = this.options_len1.concat(res.data.data)
                            temp_options = this.options_len1
                        }else if(this.category_id_filter.length == 2) {
                            this.options_len2 = this.options_len1
                            this.options_len2 = this.options_len2.concat(res.data.data)
                            temp_options = this.options_len2
                        }else if(this.category_id_filter.length == 3) {
                            this.options_len3 = this.options_len2
                            this.options_len3 = this.options_len3.concat(res.data.data)
                            temp_options = this.options_len3
                        }else if(this.category_id_filter.length == 4) {
                            this.options_len4 = this.options_len3
                            this.options_len4 = this.options_len4.concat(res.data.data)
                            temp_options = this.options_len4
                        }
                        this.options = this.options.concat(this.getCategoryTree(temp_options,0))
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            supplierselectVisble(visible) {
                this.supplier_options = []
                this.supplier_page = 1
                this.$refs.infiniteLoading2.stateChanger.reset()
                if(visible) {
                    this.getSuppliers()
                }
            },
            supplierselectVisbleEdit(visible) {
                this.supplier_options_edit = []
                this.supplier_page_edit = 1
                this.$refs.infiniteLoading3.stateChanger.reset()
                if(visible) {
                    this.getSuppliersEdit()
                }
            },
            handleCheck(index, row) {
                this.form.id = row.id
                this.remark = ''
                this.checkVisible = true
            },
            saveCheck(pass) {
                this.submitDisabled = true
                let params = {
                    remark: this.remark,
                    pass: pass
                }
                this.$axios.post('/purchase_orders/' + this.form.id + '/check', params).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('处理成功！')
                        this.getData()
                        this.checkVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            handleDelete(index, row) {
                this.$prompt('请输入删除备注', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(( {value} ) => {
                    let params = {
                        remark: value
                    }
                    this.$axios.delete('/purchase_orders/' + row.id, {data: params}
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.getData()
                            this.$message.success("删除成功")
                        }
                    }).catch(() => {
                        
                    })
                }).catch(() => {
                    // this.$message.info('已取消拒绝')
                })
            },
            addPurchaseSku() {
                let tempArr = JSON.parse(JSON.stringify(this.purchaseOrders[this.purchaseOrders.length-1]))
                tempArr.pictures = []
                tempArr.is_add = true
                this.purchaseOrders[this.purchaseOrders.length-1].pictures.forEach((data) => {
                    tempArr.pictures.push(data)
                })
                this.purchaseOrders.push(tempArr)
            },
            deletePurchaseSku() {
                this.purchaseOrders.pop()
            },
            savePurchaseOrder() {
                this.submitDisabled = true
                let formData = new FormData()
                formData.append('purchase_plan_id', this.purchase_plan_id)
                formData.append('supplier_id', this.supplier_id)
                formData.append('account_id', this.account_id)
                this.purchaseOrders.forEach((data) => {
                    if (data.is_add != true) {
                        formData.append('purchase_order[][sub_id]', data.sub_id)
                    }
                    formData.append('purchase_order[][product_id]', data.product_id)
                    formData.append('purchase_order[][dist_type]', data.dist_type)
                    formData.append('purchase_order[][put_card_sum]', data.put_card_sum)
                    if (data.is_need_invoice === true) {
                        formData.append('purchase_order[][is_need_invoice]', 1)
                    }else {
                        formData.append('purchase_order[][is_need_invoice]', 0)
                    }
                    formData.append('purchase_order[][sum]', data.sum)
                    formData.append('purchase_order[][address]', data.address)
                    formData.append('purchase_order[][price]', data.price)
                    formData.append('purchase_order[][process_peroid]', data.process_peroid)
                    formData.append('purchase_order[][delivery_date]', data.delivery_date)
                    formData.append('purchase_order[][arrive_date]', data.arrive_date)
                    formData.append('purchase_order[][remark]', data.remark)
                    
                    formData.append('purchase_order[][term_id]', data.term_id)
                    data.pictures.forEach((data2, index) => {
                        let temp = 'purchase_order[][pictures['+ index + ']]'
                        // let temp = 'purchase_order[][pictures]'+ '[' + index + ']'
                        // let temp = 'purchase_order[]pictures[][]'
                        formData.append(temp, data2.raw)
                    })
                })
                formData.append('supplier_remark', this.remark)
                this.$axios.patch('/purchase_orders/' + this.form.id, formData).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.getData()
                        this.editVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            handleEdit(index, row) {
                // this.getSuppliersEdit()
                this.supplier_options_edit = []
                this.supplier_options_edit.push({id: row.supplier_id, name: row.supplier_name})
                this.form.id = row.id
                this.supplier_id = row.supplier_id
                this.purchase_plan_id = row.id
                this.account_id = row.supplier_account_id
                this.purchase_skus = []
                this.purchaseOrders = []
                row.purchase_order_products.forEach((data) => {
                    this.purchaseOrders.push({product_id: data.product_id, dist_type: data.dist_type, put_card_sum: data.put_card_sum, is_need_invoice: data.is_need_invoice, sum: data.sum, price: data.price, address: data.address, process_peroid: data.process_peroid, delivery_date: data.delivery_date, arrive_date: data.arrive_date, remark: data.remark, supplier_remark: data.supplier_remark, account_id: data.supplier_account_id, term_id: data.supplier_term_id, sku: data.sku, pictures: [], sub_id: data.id})
                })
                // this.purchaseOrders = [{
                //     supplier_id: '',
                //     product_id: '',
                //     dist_type: '',
                //     put_card_sum: '',
                //     is_need_invoice: '',
                //     sum: 0,
                //     price: 0,
                //     address: '',
                //     pictures: [],
                //     process_peroid: 0,
                //     delivery_date: '',
                //     arrive_date: '',
                //     remark: '',
                //     supplier_remark: '',
                //     account_id: '',
                //     term_id: '',
                //     sku: ''
                // }]
                this.$axios.get('/purchase_plans/' + row.purchase_plan_id
                ).then((res) => {
                    if(res.data.code==200) {
                        this.purchase_details = res.data.data[0].purchase_plan_products
                        this.purchase_details.forEach((data) => {
                            data.img_count = data.pictures.length
                            if (!(this.purchase_skus.find(data2 => data2.label === data.sku))) {
                                this.purchase_skus.push({label: data.sku, value: data.product_id})
                            }
                        })
                        this.editVisible = true;
                    }
                }).catch((res) => {
                    console.log(res)
                })
            },
            update_account(supplier_id) {
                // this.update_index = index
                this.supplier_id = supplier_id
                this.$axios.get('/suppliers/' + supplier_id + '/search_account'
                ).then((res) => {
                    if(res.data.code == 200) {
                        if (res.data.data.length != 0) {
                            let item = res.data.data[0]
                            this.update_accountForm.collection_account = item.collection_account
                            this.update_accountForm.account_name = item.account_name
                            this.update_accountForm.us_collection_account = item.us_collection_account
                            this.update_accountForm.english_name = item.english_name
                            this.update_accountForm.payment_day = item.payment_day
                            this.update_accountForm.clearing_form = item.clearing_form
                        } else {
                            this.update_accountForm.collection_account = ''
                            this.update_accountForm.account_name = ''
                            this.update_accountForm.us_collection_account = ''
                            this.update_accountForm.english_name = ''
                            this.update_accountForm.payment_day = ''
                            this.update_accountForm.clearing_form = ''
                        }
                        this.updateAccountVisible = true
                    }
                }).catch((res) => {
                    console.log(res)
                })
            },
            update_term(supplier_id, term_id, index) {
                this.update_index = index
                this.supplier_id = supplier_id
                // this.product_id = product_id
                let params = {
                    term_id: term_id
                }
                this.$axios.get('/suppliers/' + supplier_id + '/search_term',{params: params}
                ).then((res) => {
                    if(res.data.code == 200) {
                        if (res.data.data.length != 0) {
                            let item = res.data.data[0]
                            this.update_termForm.currency = item.currency
                            this.update_termForm.contract_term = item.contract_term
                            this.update_termForm.quality_request = item.quality_request
                            this.update_termForm.shipping_type = item.shipping_type
                            this.update_termForm.shipping_bear_fee = item.shipping_bear_fee
                            this.update_termForm.package_standard = item.package_standard
                            this.update_termForm.acceptance_method = item.acceptance_method
                            this.update_termForm.liability_for_breach = item.liability_for_breach
                            this.update_termForm.dissolution_method = item.dissolution_method
                            this.update_termForm.term_remark = item.term_remark
                            this.update_termForm.covenant = item.covenant
                            this.update_termForm.tax = item.tax
                            this.update_termForm.exit_tax = item.exit_tax
                            this.update_termForm.reject_ratio = item.reject_ratio
                        } else {
                            this.update_termForm.currency = ''
                            this.update_termForm.contract_term = ''
                            this.update_termForm.quality_request = ''
                            this.update_termForm.shipping_type = ''
                            this.update_termForm.shipping_bear_fee = ''
                            this.update_termForm.package_standard = ''
                            this.update_termForm.acceptance_method = ''
                            this.update_termForm.liability_for_breach = ''
                            this.update_termForm.dissolution_method = ''
                            this.update_termForm.term_remark = ''
                            this.update_termForm.covenant = ''
                            this.update_termForm.tax = ''
                            this.update_termForm.exit_tax = ''
                            this.update_termForm.reject_ratio = ''
                        }
                        this.updateTermVisible = true
                    }
                }).catch((res) => {
                    console.log(res)
                })
            },
            saveupdateAccount() {
                this.submitDisabled = true
                let params = {
                    collection_account: this.update_accountForm.collection_account,
                    account_name: this.update_accountForm.account_name,
                    us_collection_account   : this.update_accountForm.us_collection_account ,
                    english_name: this.update_accountForm.english_name,
                    payment_day: this.update_accountForm.payment_day,
                    clearing_form: this.update_accountForm.clearing_form,
                }
                this.$axios.post('/suppliers/' + this.supplier_id + '/update_account', params).then((res) => {
                    if(res.data.code == 200) {
                        // this.purchaseOrders[this.update_index].account_id = res.data.data
                        this.account_id = res.data.data
                        this.$message.success('更新成功！')
                        this.updateAccountVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            saveupdateTerm() {
                this.submitDisabled = true
                let params = {
                    product_id: this.product_id,
                    currency: this.update_termForm.currency,
                    contract_term: this.update_termForm.contract_term,
                    quality_request: this.update_termForm.quality_request,
                    shipping_type: this.update_termForm.shipping_type,
                    shipping_bear_fee: this.update_termForm.shipping_bear_fee,
                    package_standard: this.update_termForm.package_standard,
                    acceptance_method: this.update_termForm.acceptance_method,
                    liability_for_breach: this.update_termForm.liability_for_breach,
                    dissolution_method: this.update_termForm.dissolution_method,
                    term_remark: this.update_termForm.term_remark,
                    covenant: this.update_termForm.covenant,
                    tax: this.update_termForm.tax,
                    exit_tax: this.update_termForm.exit_tax,
                    reject_ratio: this.update_termForm.reject_ratio,
                }
                this.$axios.post('/suppliers/' + this.supplier_id + '/update_term', params).then((res) => {
                    if(res.data.code == 200) {
                        this.purchaseOrders[this.update_index].term_id = res.data.data
                        this.$message.success('更新成功！')
                        this.updateTermVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            handleRemovePurchaseOrder(res, file, index) {
                this.purchaseOrders[index].pictures = file
            },
            changePurchaseOrder(res, file, index) {
                this.purchaseOrders[index].pictures.push(res)
            },
            showApplyPurchase() {
                this.applyPurchase.price = 0, this.applyPurchase.p_type = '', this.applyPurchase.remark = ''
                this.applyPayVisible = true
            },
            submitApplyPurchase() {
                this.submitDisabled = true
                let params = {
                    price: this.applyPurchase.price,
                    p_type: this.applyPurchase.p_type,
                    remark: this.applyPurchase.remark,
                }
                this.$axios.post('/purchase_orders/' + this.order_id + '/apply_pay', params).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('申请成功')
                        this.getData()
                        this.applyPayVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            getStatusName(status, done_direct) {
                if(status == 1) {
                    return "待审核"
                } else if(status == 2) {
                    return "已审核"
                } else if(status == 3) {
                    return "已拒绝"
                }else if(status == 4) {
                    return "已删除"
                }else if(status == 5) {
                    return "正在计划"
                }else if(status == 6) {
                    return "已完成"
                }else {
                    return '其他'
                }
            },
            getStatusClearing_Form(status) {
                if(status == 1) {
                    return "先定金后尾款"
                } else if(status == 2) {
                    return "全款"
                } else if(status == 3) {
                    return "月结"
                }else if(status == 4) {
                    return "日结"
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

<style>
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
    #upload-pur .el-upload--text{
        background-color: #fff;
        border: 0px;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 120px;
        height: 32px;
        text-align: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .add_purchadse_sku {
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
    }
</style>
