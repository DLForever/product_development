<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-pic"></i> 制图管理</el-breadcrumb-item>
                <el-breadcrumb-item>制图任务管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="confirmDistribute">分配</el-button>
                <div style="float: right;">
                    <el-select v-model="search_selects" multiple placeholder="展示其他搜索栏目" @change="showSearch">
                        <el-option v-for="item in search_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
                <div class="fnsku_filter">
                    <!-- 开发人员:
                    <el-input style="width:150px" placeholder="请输入开发人员" v-model.trim="search_shopname"></el-input> -->
                    <template v-if="search_show[1].dateDis">
                        <!-- 日期: -->
                        <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    </template>
                    <template v-if="search_show[0].nameDis">
                        产品名:
                        <el-input style="width:130px;" v-model.trim="filter_productname" placeholder="请输入店铺名称"></el-input>
                    </template>
                    SKU:
                    <el-input style="width:150px" v-model="filter_sku" placeholder="请输入SKU"></el-input>
                    制图人:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    申请人:
                    <el-select v-model="apply_user_id" filterable remote :loading="loading2" @visible-change="selectVisble2" :remote-method="remoteMethod2" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user2" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    状态:
                    <el-select v-model="statusSelect" placeholder="请选择" class="handle-select mr10">
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="product_name" label="产品名称" width="150" fixed show-overflow-tooltip>
                </el-table-column>
                <el-table-column fixed prop="sku" label="SKU" width="130" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="showChangeProduct(scope.$index, scope.row)">{{scope.row.sku}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="制图人" width="70">
                </el-table-column>
                <el-table-column prop="apply_username" label="申请人" width="70">
                </el-table-column>
                <el-table-column prop="samplestemp" label="样品名" width="70" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type" @click="handleApply(scope.$index, scope.row)">{{scope.row.samplestemp}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="origin_url" label="来源URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.origin_url != null && scope.row.origin_url != '' && scope.row.origin_url != 'null'" :href="scope.row.origin_url" target="_blank">查看来源</a>
                    </template>
                </el-table-column>
                <el-table-column prop="ref_url" label="参考url" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.ref_url != null && scope.row.ref_url != '' && scope.row.ref_url != 'null'" :href="scope.row.ref_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column label="参考图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row, 'ref')"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="制作的图" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count2" class="item" v-if="scope.row.img_count2 != 0">
                            <span v-if="scope.row.done_pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.done_pictures[0] != undefined && scope.row.done_pictures[0].url.thumb.url != null && !(scope.row.done_pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.done_pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row, 'done_pic')"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="130">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="制图要求" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remove_remark" label="删除备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sample_remark" label="样品备注" width="70">
                </el-table-column>
                <el-table-column prop="plan_date" label="计划时间" :formatter="formatter_plan" width="140">
                </el-table-column>
                <el-table-column prop="done_date" label="完成时间" :formatter="formatter_done" width="140">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp详情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="showapplyDetails(scope.$index, scope.row)" type="text">借样详情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp编辑</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="handlePlan(scope.$index, scope.row)" type="text">预计完成</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button @click="handleDone(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp完成</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleapplyDelete(scope.$index, scope.row)" type="text">申请删除</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp删除</el-button>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="制图要求">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10}" placeholder="请输入制图要求" v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="样品">
                    <el-select v-model="form.sample_id" filterable multiple remote :loading="loading4" @visible-change="selectVisble4" :remote-method="remoteMethod4" clearable placeholder="选择样品" class="handle-select mr10">
                        <el-option v-for="item in sample_Options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_sample" ref="infiniteLoading4"></infinite-loading>
                    </el-select>
                </el-form-item>
                <el-form-item label="样品备注">
                    <el-input v-model="form.sample_remark"></el-input>
                </el-form-item>
                <el-form-item label="参考url">
                    <el-input v-model="form.ref_url"></el-input>
                </el-form-item>
                <el-form-item label="图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 预计完成日期 -->
        <el-dialog title="预计完成日期" :visible.sync="planVisible" width="50%">
            <el-form label-width="130px">
                <el-form-item label="预计完成时间" prop="plan_date">
                    <el-date-picker style="margin-right: 10px; margin-bottom: 5px;" v-model="plan_date" type="datetime" placeholder="选择日期" ></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="planVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePlan" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="50%">
            <el-form label-width="130px">
                <el-form-item label="删除备注" prop="plan_date">
                    <el-input placeholder="删除备注" v-model.trim="del_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="detailOptions" border style="width: 100%">
                <el-table-column prop="product_name" label="产品名称" width="150" fixed show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sku" label="SKU" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="制图人" width="70">
                </el-table-column>
                <el-table-column prop="apply_username" label="申请人" width="70">
                </el-table-column>
                <el-table-column prop="sample_remark" label="样品备注" width="70">
                </el-table-column>
                <el-table-column prop="origin_url" label="来源URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.origin_url != null && scope.row.origin_url != '' && scope.row.origin_url != 'null'" :href="scope.row.origin_url" target="_blank">查看来源</a>
                    </template>
                </el-table-column>
                <el-table-column prop="ref_url" label="参考url" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.ref_url != null && scope.row.ref_url != '' && scope.row.ref_url != 'null'" :href="scope.row.ref_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row, 'ref')"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="130">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="制图要求" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remove_remark" label="删除备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="plan_date" label="计划时间" :formatter="formatter_plan" width="140">
                </el-table-column>
                <el-table-column prop="done_date" label="完成时间" :formatter="formatter_done" width="140">
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 查看产品图片 -->
        <el-dialog title="图片" :visible.sync="productVisible" width="70%">
<!--             <el-carousel height="600px" arrow="always" :autoplay="false" v-if="picturestList.length != 0">
                <span>产品广告位图片</span>
                <el-carousel-item v-for="(item, index) in picturestList" :key="index">
                    <img class="img_carousel" @click="handleDeletePic(item.remark, item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <br> -->
            <el-carousel height="600px" arrow="always" :autoplay="false" v-if="picturestList2.length != 0">
                <el-carousel-item v-for="(item, index) in picturestList2" :key="index">
                    <img class="img_carousel" @click="handleDeletePic(item.remark, item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
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

        <!-- 分配提示 -->
        <el-dialog title="确认分配" :visible.sync="distributeVisible" width="35%">
            <el-form label-width="110px">
                <el-form-item label="选择开发人员">
                    <el-select v-model="distributeUser" placeholder="选择用户" filterable remote :loading="loading3" @visible-change="selectVisble3" :remote-method="remoteMethod3" class="handle-select mr10">
                        <el-option v-for="item in distributeUserOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_dis_user" ref="infiniteLoading3"></infinite-loading>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="distributeVisible = false">取 消</el-button>
            <el-button type="primary" @click="distributenProduct" :disabled="submitDisabled">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 完成弹出框 -->
        <el-dialog title="编辑" :visible.sync="doneVisible" width="50%">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList2" :on-remove="handleRemove2" :auto-upload="false" :on-change="changeFile2" :limit="10" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="doneVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDone" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 申请借样提示框 -->
        <el-dialog title="借样" :visible.sync="applyVisible" width="50%" center>
            <el-form label-width="100px">
                <el-form-item label="样品">
                    <el-select v-model="sample_id" clearable placeholder="请选择样品" @change="showSearch">
                        <el-option v-for="item in sample_options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input-number placeholder="请输入数量" :min="0" v-model.trim="apply_stocksum"></el-input-number>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="apply_stockremark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="applyVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveApply" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 变体详情提示 -->
        <el-dialog title="详情" :visible.sync="change_detailsVisible" width="90%">
            <!-- <div v-if="products_change_details.length != 0"> -->
            <el-button type="primary">
                <a style="color:#fff;" :href="$axios.defaults.baseURL + '/product_subjects/' + subject_id + '?token=' + export_token">导出图片</a>
            </el-button>
            <br><br>
            <el-table :data="products_change_details" border style="width: 100%">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="sku" label="SKU" width="90" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="title" label="产品标题"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_name" label="供应商" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="采购价">
                </el-table-column>
                <el-table-column prop="size" label="尺寸(长*宽*高cm)" width="120">
                </el-table-column>
                <el-table-column prop="weight" label="重量(g)">
                </el-table-column>
                <el-table-column prop="package_size" label="包装尺寸(长*宽*高cm)" width="140">
                </el-table-column>
                <el-table-column prop="package_weight" label="包装重量(g)" width="90">
                </el-table-column>
                <el-table-column prop="model_number" label="型号"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="texture" label="材质" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="feature" label="产品特性" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <!-- <span>{{getFeatureName(scope.row.feature)}}</span> -->
                        <el-tag :type="scope.row.feature | statusFilter">{{getFeatureName(scope.row.feature)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="box_size" label="外箱尺寸(长*宽*高cm)" width="160">
                </el-table-column>
                <el-table-column prop="box_weight" label="单箱实重(g)" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="box_sum" label="单箱数量(g)" width="100">
                </el-table-column>
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at_format" label="创建时间" width="140">
                </el-table-column>
                <!-- <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column> -->
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="paginationShow2" @current-change="handleCurrentChange2" :page-size="pagesize" layout="prev, pager, next" :total="totals2">
                </el-pagination>
            </div>
            <!-- </div> -->
        </el-dialog>

        <!-- 借样详情提示 -->
        <el-dialog title="详情" :visible.sync="applyDetailVisible" width="90%">
            <el-table :data="apply_details" border style="width: 100%">
                <el-table-column prop="name" label="样品名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="数量">
                </el-table-column>
                <el-table-column prop="apply_username" label="申请人">
                </el-table-column>
                <el-table-column prop="check_username" label="审核人">
                </el-table-column>
                <el-table-column prop="user_remark" label="申请备注">
                </el-table-column>
                <el-table-column prop="back_remark" label="归还备注">
                </el-table-column>
                <el-table-column prop="manager_remark" label="管理员备注">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusApply(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
                <el-table-column fixed="right" label="操作"width="100">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-refresh" @click="returnSamples(scope.$index, scope.row)">归还</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 归还提示框 -->
        <el-dialog title="提示" :visible.sync="returnVisible" width="50%" center>
            <el-form label-width="50px">
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="return_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="returnVisible = false">取 消</el-button>
                <el-button type="primary" @click="returndone">确认归还</el-button>
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
                },
                idx: -1,
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
                suppliers_details: [],
                detailVisible: false,
                fileList: [],
                picturestList: [],
                productVisible: false,
                search_keyword: '',
                addreviewerVisible: false,
                status: '',
                user_id_filter: '',
                query: undefined,
                user_page: 1,
                user_total: 0,
                loading: false,
                user_options: [],
                apply_user_id: '',
                query2: undefined,
                user_page2: 1,
                user_total2: 0,
                loading2: false,
                user_options2: [],
                fileList2: [],
                statusSelect: '',
                statusOptions: [{value: 1, label: '正在申请'}, {value: 2, label: '已分配任务'}, {value: 3, label: '已计划'}, {value: 4, label: '已完成'}, {value: 5, label: '申请者删除审核'}, {value: 6, label: '执行者删除审核'}],
                picturestList2: [],
                detailOptions: [],
                detailOptions2: [],
                date_time: [{
                    plan_date: '',
                    plan_sum: 0
                }],
                add_date_time: {
                    plan_date: '',
                    plan_sum: 0
                },
                task_id: '',
                distributeUserOptions: [],
                distributeUser: '',
                dis_user_page: 1,
                dis_user_total: 0,
                query3: undefined,
                loading3: false,
                distributeVisible: false,
                updateplanVisible: false,
                plan_sum: 0,
                task_period_id: '',
                detailOptions3: [],
                keywordsArr: [{
                    keywords: '',
                    keyword_index: ''
                }],
                add_keywords: {
                    keywords: '',
                    keyword_index: ''
                },
                sumPrice: 0,
                plan_sum: 0,
                plan_date: '',
                planVisible: false,
                del_remark: '',
                doneVisible: false,
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
                search_options: [{value: 'nameDis', label: '产品名'}, {value: 'dateDis', label: '日期'}],
                search_selects: [],
                search_show: [{'nameDis' : false}, {'dateDis' : false}],
                search_show2: ['nameDis', 'dateDis'],
                filter_productname: '',
                filter_sku: '',
                product_id: undefined,
                applyVisible: false,
                apply_stockremark: '',
                apply_stocksum: 0,
                sample_Options: [],
                loading4: false,
                query4: false,
                sample_page: 1,
                sample_total: 0,
                sample_id: '',
                paginationShow2: false,
                export_token: '',
                subject_name: '',
                subject_id: '',
                cur_page2: 1,
                change_detailsVisible: false,
                products_change_details: [],
                sample_options2: [],
                applyDetailVisible: false,
                apply_details: [],
                picture_task_id: '',
                returnVisible: false,
                return_remark: '',
                apply_index: undefined,
                table_loading: true,
                product_subject_id: ''
            }
        },
        created() {
            this.getData();
        },
        watch: {
        	"$route": "getData"
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    return d
                })
            },
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'danger',
                    2: 'warning',
                    3: 'primary',
                    4: 'success',
                    5: 'danger',
                    6: 'warning',
                    10: 'success',
                }
                return statusMap[status]
            },
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
            handleCurrentChange2(val) {
                this.cur_page2 = val;
                this.showChangeDetails();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
//                  this.url = '/ms/table/list';
                };
                this.table_loading = true
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/picture_tasks?page='+this.cur_page + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp + '&status=' + this.status + '&user_id=' + this.user_id_filter + '&apply_user_id=' + this.apply_user_id + '&product_name=' + this.filter_productname + '&sku=' + this.filter_sku
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length
                            data.img_count2 = data.done_pictures.length
                            if(data.samples != undefined) {
                                data.samples.forEach((data2, index) => {
                                    if (index == 0) {
                                        data.samplestemp = data2.name
                                    }else {
                                        data.samplestemp += '、' + data2.name
                                    }
                                }) 
                            }
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                	console.log(res)
                }).finally(() => {
                    this.table_loading = false
                })
            },
            filter_product() {
                this.table_loading = true
                this.cur_page = 1
                this.paginationShow = false
                let date_begin_temp = this.date_filter[0]
                let date_end_temp = this.date_filter[1]
                if(this.date_filter.length == 0) {
                    date_begin_temp = ''
                    date_end_temp = ''
                }
                this.$axios.get( '/picture_tasks?page='+this.cur_page + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp + '&status=' + this.statusSelect + '&user_id=' + this.user_id_filter + '&apply_user_id=' + this.apply_user_id + '&product_name=' + this.filter_productname + '&sku=' + this.filter_sku
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length
                            data.img_count2 = data.done_pictures.length
                            if(data.samples != undefined) {
                                data.samples.forEach((data2, index) => {
                                    if (index == 0) {
                                        data.samplestemp = data2.name
                                    }else {
                                        data.samplestemp += '、' + data2.name
                                    }
                                }) 
                            }
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally(() => {
                    this.table_loading = false
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.user_id_filter = ''
                this.apply_user_id = ''
                this.statusSelect = ''
                this.date_filter = []
                this.filter_productname = ''
                this.filter_sku = ''
                this.getData()
            },
            formatter_created_at(row, column) {
				return row.created_at.substr(0, 19);
			},
			formatter_updated_at(row, column) {
				return row.updated_at.substr(0, 19);
			},
            formatter_done(row, column) {
                if (row.done_date != null) {
                    return row.done_date.substr(0, 19)
                }
            },
            formatter_plan(row, column) {
                if (row.plan_date != null) {
                    return row.plan_date.substr(0, 19)
                }
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
            handleEdit(index, row) {
                this.sample_Options = []
                this.keywordsArr = []
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    sample_id: [],
                    ref_url: item.ref_url,
                    sample_remark: item.sample_remark,
                    remark: item.remark
                }
                // this.sample_Options = row.samples
                if(row.samples != undefined) {
                    row.samples.forEach((data) => {
                        this.sample_Options.push({id: data.id, name: data.name})
                        this.form.sample_id.push(data.id)
                    })
                }
                // console.log(this.form.sample_id)
                // this.sample_Options.push({id: item.sample_id, name: item.sample_name})
                this.fileList = []
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    // let params = {
                    //     task_period_id: row.id
                    // }
                    this.$axios.post('/picture_tasks/' + row.id + '/done_destroy',''
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.getData()
                            this.$message.success("删除成功")
                        }
                    }).catch(() => {
                        
                    })
                }).catch(() => {
                    this.$message.info('已取消删除')
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
                this.submitDisabled = true
                let formData = new FormData()
                if (this.form.sample_id == '' || this.form.sample_id == undefined) {
                    formData.append('sample_id', 0)
                } else {
                    this.form.sample_id.forEach((data) => {
                        formData.append('sample_ids[]', data)
                    })
                }
                formData.append('ref_url', this.form.ref_url)
                formData.append('sample_remark', this.form.sample_remark)
                formData.append('remark', this.form.remark)
                this.fileList.forEach((item) => {
                    formData.append('pictures[]', item.raw)
                })
                this.$axios.patch('/picture_tasks/' + this.form.id, formData).then((res) => {
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
            // 确定删除
            deleteRow(){
                if(this.del_remark.trim() == '') {
                    this.$message.info('请输入删除备注')
                    return
                }
            	let index = this.idx
            	const item = this.tableData[index]
                let params = {
                    remark: this.del_remark
                }
            	this.$axios.delete('/picture_tasks/'+item.id,
            	{
            		headers: {'Authorization': localStorage.getItem('token')},
                    params
            	},
                // params,
            ).then((res) => {
            	if(res.data.code == 200){
            		this.getData()
            		this.$message.success("已提交申请")
                    this.delVisible = false;
            	}
            }).catch((res) => {
            	this.$message.error("提交失败")
            })
            },
            handleDetails(index, row) {
                this.detailOptions = [row]
                this.detailVisible = true
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
            showPictures(index, row, remark) {
                this.product_id = row.id
                const item = this.tableData[index]
                // if (item.pictures.length == 0 && item.done_pictures.length == 0) {
                //     this.$message.info('暂未上传图片!')
                //     return
                // }
                this.picturestList = []
                this.picturestList2 = []
                this.product_id = row.id
                if (remark == 'ref') {
                    item.pictures.forEach((data) => {
                        this.picturestList2.push(data)
                        // if(data.remark == 'required') {
                        //     this.picturestList2.push(data)
                        // }else {
                        //     this.picturestList.push(data)
                        // }
                    })
                }else if(remark == 'done_pic') {
                    this.product_subject_id = item.product_subject_id
                    item.done_pictures.forEach((data) => {
                        this.picturestList2.push(data)
                    })
                }else{

                }
                this.productVisible = true
            },
            handleDeletePic(remark, id, index) {
                this.remark = remark
                this.idx = index;
                this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    let params = {
                        img_id: id
                    }
                    if(remark == 'required') {
                        this.$axios.post('/picture_tasks/' + this.product_id + '/delete_img', params
                        ).then((res) => {
                            if(res.data.code == 200) {
                                this.picturestList2.splice(index, 1)
                                this.getData()
                                this.$message.success("删除成功")
                            }
                        }).catch((res) => {
                            console.log(res)
                        })
                    }else {
                        this.$axios.post('/product_subjects/' + this.product_subject_id + '/delete_img', params
                        ).then((res) => {
                            if(res.data.code == 200) {
                                this.picturestList2.splice(index, 1)
                                this.getData()
                                this.$message.success("删除成功")
                            }
                        }).catch((res) => {
                            console.log(res)
                        })
                    }
                }).catch((res) => {
                    console.log(res)
                    this.$message.info('已取消删除')
                })
            },
            deleteImg() {
                let params = {
                    // id: this.product_id,
                    img_id: this.picture_id
                }
                this.$axios.post('/tasks/' + this.product_id + '/delete_img', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        if (this.remark == 'adv') {
                            this.picturestList.splice(this.idx, 1);
                        } else {
                            this.picturestList2.splice(this.idx, 1);
                        }
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDelProVis = false
                    }
                }).catch((res) => {

                })
            },
            handleCreate(index, row) {
                this.addReviewerForm.task_id = row.task_id
                this.addReviewerForm.task_period_id = row.id
                this.addreviewerVisible = true
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
                    this.$axios.get("/users/?page=" + this.user_page + '&name=' + query.trim()
                    ).then((res) => {
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
            onInfinite_user2(obj) {
                if((this.user_page2 * 20) < this.user_total2) {
                    this.user_page2 += 1
                    // this.getUsers(obj.loaded)
                    this.remoteMethod2(this.query2,obj.loaded)
                } else {
                    obj.complete()
                }
            },
            selectVisble2(visible) {
                if(visible) {
                    this.query2 = undefined
                    this.remoteMethod2("")
                }
            },
            remoteMethod2(query, callback = undefined) {
                if(query != "" || this.query2 != "" || callback) {
                    let reload = false
                    if(this.query2 != query) {
                        this.loading2 = true
                        this.user_page2 = 1
                        this.query2 = query
                        reload = true
                        if(this.$refs.infiniteLoading2.isComplete) {
                            this.$refs.infiniteLoading2.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.user_page2 + '&name=' + query.trim()
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.loading2 = false
                            //                          this.options = res.data.data
                            if(reload) {
                                let tempOptions = []
                                this.user_options2 = tempOptions.concat(res.data.data)
                            } else {
                                this.user_options2 = this.user_options2.concat(res.data.data)
                            }
                            this.user_total2 = res.data.count
                            if(callback) {
                                callback()
                            }
                        }
                    }).catch((res) => {
                        console.log('失败')
                    })
                }
            },
            orderAdd() {
                this.date_time.push(this.add_date_time)
                this.add_date_time = {
                    plan_date: '',
                    plan_sum: 0
                }
            },
            orderDel(index) {
                this.date_time.pop()
            },
            checkSelf() {
                this.$axios.post('/tasks/' + this.task_id + '/check',''
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.getData()
                        this.$message.success("通过自审")
                        this.detailVisible = false
                    }
                }).catch((res) => {

                })
            },
            confirmDistribute() {
                if(this.multipleSelection.length == 0) {
                    this.$message.error('请选择至少一个任务')
                    return
                }
                this.distributeUser = ''
                this.distributeVisible = true
            },
            distributenProduct() {
                if(this.distributeUser == '') {
                    this.$message.error('请选择分配人员')
                    return
                }
                let id = []
                this.multipleSelection.forEach((data) => {
                    id.push(data.id)
                })
                let params = {
                    task_ids: id,
                    user_id: this.distributeUser,
                }
                this.$axios.post('/picture_tasks/allocate_task', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('分配成功!')
                        this.distributeVisible = false
                        this.distributeUser = ''
                        this.getData()
                    }
                }).catch((res) => {

                })
            },
            remoteMethod3(query, callback = undefined) {
                if(query != "" || this.query3 != "" || callback) {
                    let reload = false
                    if(this.query3 != query) {
                        this.loading3 = true
                        this.dis_user_page = 1
                        this.query3 = query
                        reload = true
                        if(this.$refs.infiniteLoading3.isComplete) {
                            this.$refs.infiniteLoading3.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.dis_user_page + '&name=' + query.trim()
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.loading3 = false
                            //                          this.options = res.data.data
                            if(reload) {
                                let tempOptions = []
                                // this.distributeUserOptions = res.data.data
                                this.distributeUserOptions = tempOptions.concat(res.data.data)
                            } else {
                                this.distributeUserOptions = this.distributeUserOptions.concat(res.data.data)
                            }
                            console.log(this.distributeUserOptions)
                            this.dis_user_total = res.data.count
                            if(callback) {
                                callback()
                            }
                        }
                    }).catch((res) => {
                        console.log('失败')
                    })
                }
            },
            onInfinite_dis_user(obj) {
                if((this.dis_user_page * 20) < this.dis_user_total) {
                    this.dis_user_page += 1
                    this.remoteMethod3(this.query3, obj.loaded)
                    //                  this.getUser(obj.loaded)
                } else {
                    obj.complete()
                }
            },
            selectVisble3(visible) {
                if(visible) {
                    this.query3 = undefined
                    this.remoteMethod3("")
                }
            },
            handleUpdatePlan(index, row) {
                this.plan_sum = row.plan_sum
                this.task_period_id = row.id
                // this.date_time = []
                // this.date_time = JSON.parse(JSON.stringify([row]))
                this.updateplanVisible = true;
            },
            saveupdateplan(row) {
                this.submitDisabled = true
                let params = {
                    task_period_id: row.id,
                    plan_sum: row.plan_sum
                }
                this.$axios.post('/tasks/' + this.task_id + '/update_period', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.getData()
                        row.originalSum = row.plan_sum
                        this.$message.success("更新成功")
                        row.edit = false
                        // this.updateplanVisible = false
                        // this.detailVisible = false
                    }
                }).catch((res) => {

                }).finally(() => {
                    this.submitDisabled = false
                })
            },
            handleDeletePlan(index, row) {
                this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    let params = {
                        task_period_id: row.id
                    }
                    this.$axios.post('/tasks/' + this.task_id + '/delete_period', params
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.detailOptions2.splice(index, 1);
                            this.getData()
                            this.$message.success("删除成功")
                        }
                    }).catch(() => {
                        
                    })
                }).catch(() => {
                    this.$message.info('已取消删除')
                })
            },
            keywordsAdd() {
                this.keywordsArr.push(this.add_keywords)
                this.add_keywords = {
                    keywords: '',
                    keyword_index: ''
                }
            },
            keywordsDel(index) {
                this.keywordsArr.pop()
            },
            totalPrice() {
                // this.sumPrice = this.addReviewerForm.pay_price + this.addReviewerForm.commission + this.addReviewerForm.poundage
            },
            cancelEdit(row) {
                row.plan_sum = row.originalSum
                row.edit = false
            },
            handlePlan(index, row) {
                this.product_id = row.id
                this.plan_date = ''
                this.planVisible = true
            },
            savePlan() {
                this.submitDisabled = true
                let params = {
                    plan_date: this.plan_date,
                }
                this.$axios.post('/picture_tasks/' + this.product_id + '/update_plan_date', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.getData()
                        this.$message.success("更新成功")
                        this.planVisible = false
                    }
                }).catch((res) => {

                }).finally(() => {
                    this.submitDisabled = false
                })
            },
            handleapplyDelete(index, row) {
                this.idx = index
                this.del_remark = ''
                this.delVisible = true
            },
            handleDone(index, row) {
                this.form.id = row.id
                this.fileList2 = []
                this.doneVisible = true
            },
            saveDone() {
                this.submitDisabled = true
                let formData = new FormData()
                this.fileList2.forEach((item) => {
                    formData.append('pictures[]', item.raw)
                })
                this.$axios.post('/picture_tasks/' + this.form.id + '/done_task', formData).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('完成！')
                        this.getData()
                        this.doneVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            showSearch() {
                this.search_selects.forEach((data) => {
                    let tempIndex = this.search_show2.findIndex(x => x == data)
                    if (tempIndex != -1) {
                        this.search_show[tempIndex][data] = true
                    }
                })
                let tempSelects = this.search_show2.filter(x => !this.search_selects.includes(x))
                tempSelects.forEach((data) => {
                    let tempIndex2 = this.search_show2.findIndex(x => x == data)
                    if (tempIndex2 != -1) {
                        this.search_show[tempIndex2][data] = false
                    }
                })
            },
            handleApply(index, row) {
                this.sample_options2 = row.samples
                this.apply_stocksum = ''
                this.apply_stockremark = ''
                this.sample_id = ''
                this.out_type = 0
                this.picture_task_id = row.id
                this.applyVisible = true
            },
            saveApply() {
                if(this.apply_stocksum == 0 || this.apply_stockremark == '') {
                    this.$message.error('请输入完整信息')
                    return
                }
                this.submitDisabled = true
                let params = {
                    id: this.sample_id,
                    sum: this.apply_stocksum,
                    out_type: 1,
                    picture_task_id: this.picture_task_id,
                    remark: this.apply_stockremark
                }
                this.$axios.post('/sample_outs', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('提交成功')
                        this.getData()
                        this.applyVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            onInfinite_sample(obj) {
                if((this.sample_page * 20) < this.sample_total) {
                    this.sample_page += 1
                    // this.getUsers(obj.loaded)
                    this.remoteMethod4(this.query4,obj.loaded)
                } else {
                    obj.complete()
                }
            },
            selectVisble4(visible) {
                if(visible) {
                    this.query4 = undefined
                    this.remoteMethod4("")
                }
            },
            remoteMethod4(query, callback = undefined) {
                if(query != "" || this.query4 != "" || callback) {
                    let reload = false
                    if(this.query4 != query) {
                        this.loading4 = true
                        this.sample_page = 1
                        this.query4 = query
                        reload = true
                        if(this.$refs.infiniteLoading4.isComplete) {
                            this.$refs.infiniteLoading4.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/samples/?page=" + this.sample_page + '&name=' + query.trim()
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.loading4 = false
                            let temp_options = []
                            if(reload) {
                                this.sample_Options = temp_options.concat(res.data.data)
                            } else {
                                this.sample_Options = this.sample_Options.concat(res.data.data)
                            }
                            this.sample_total = res.data.count
                            if(callback) {
                                callback()
                            }
                        }
                    }).catch((res) => {
                        console.log('失败')
                    })
                }
            },
            showChangeProduct(index, row) {
                this.export_token = localStorage.getItem('token')
                this.subject_name = row.sku.substring(0, row.sku.length-2)
                this.subject_id = row.product_subject_id
                this.cur_page2 = 1
                this.paginationShow2 = false
                this.showChangeDetails()
            },
            showChangeDetails() {
                this.$axios.get('/products?product_subject_id=' + this.subject_id + '&page=' + this.cur_page2
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.size = data.length + '*' + data.width + '*' + data.height
                            data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
                        })
                        this.products_change_details = res.data.data
                        this.totals2 = res.data.count
                        this.change_detailsVisible = true
                    }
                }).catch((res) => {

                }).finally(() => {
                    this.paginationShow2 = true
                })
            },
            showapplyDetails(index, row) {
                this.$axios.get('/sample_outs?picture_task_id=' + row.id
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.apply_details = res.data.data
                        this.applyDetailVisible = true
                    }
                }).catch((res) => {

                })
            },
            returnSamples(index, row) {
                this.idx = row.id
                this.return_remark = ''
                this.apply_index = index
                this.returnVisible = true
            },
            returndone() {
                if(this.return_remark == '') {
                    this.$message.error('请输入备注')
                    return
                } 
                let params = {
                    remark: this.return_remark
                }
                this.$axios.delete('/sample_outs/' + this.idx, {
                    params
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('归还申请已提交')
                        this.apply_details[this.apply_index].status = 3
                        this.apply_details[this.apply_index].back_remark = this.return_remark
                        this.getData()
                        this.returnVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                })
            },
            getStatusName(status) {
                if(status == 1) {
                    return "正在申请"
                } else if(status == 2) {
                    return "已分配任务"
                } else if(status == 3) {
                    return "已计划"
                }else if(status == 4) {
                    return "已完成"
                }else if(status == 5) {
                    return "申请者删除审核"
                }else if(status == 6) {
                    return "执行者删除审核"
                }else if(status == 7) {
                    return "已删除"
                }else {
                    return '其他'
                }
            },
            getFeatureName(feature) {
                if(Number(feature) == 0) {
                    return '无'
                }else if(Number(feature) == 1) {
                    return '含电'
                }else if(Number(feature) == 2) {
                    return '液体'
                }else if(Number(feature) == 3) {
                    return '粉末'
                }else {
                    return '其他'
                }
            },
            getStatusApply(status) {
                if(status == 1) {
                    return "待审核"
                }else if (status == 2) {
                    return "已借出"
                }else if (status == 3) {
                    return "申请归还"
                } else if(status ==4) {
                    return '已完成'
                } else{
                    return "其他"
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
        clear: both;
        float: right;
        margin: 10px 0px 20px;
    }

    .img_fnsku {
        width:40rem;
        height:40rem;
    }
    .img {
        width:3rem;
        height:3rem;
    }

    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
    .el-carousel__item.is-animating{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .img_carousel {
        max-width: 40rem;
    }
    .link-type,
    .link-type:focus {
      color: #337ab7;
      cursor: pointer;
    }
    .link-type:hover {
        color: rgb(32, 160, 255);
    }
</style>
