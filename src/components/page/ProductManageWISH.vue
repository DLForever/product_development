<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>wish产品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-button type="primary" @click="handleApply">申请查看详情</el-button>
            <el-button type="primary" @click="confirmDistribute">分配</el-button>
            <el-button type="default" @click="exportProduct">导出</el-button>
            <br><br>
            <div class="handle-box">
                <div class="fnsku_filter">
                    <!-- 日期: -->
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    <!-- <el-radio v-model="selfdata" label="true" border>被分配的</el-radio> -->
                    被分配:
                    <el-select v-model="operate_user_id" filterable remote :loading="loading3" @visible-change="selectVisble3" :remote-method="remoteMethod3" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options3" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_dis_user2" ref="infiniteLoading6"></infinite-loading>
                    </el-select>
                    分类:
                    <el-cascader :options="options" v-model="category_id_filter" expand-trigger="hover" @change="getCatetory" change-on-select class="handle-select mr10"></el-cascader>
                    开发人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading2" @visible-change="selectVisble2" :remote-method="remoteMethod2" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    供应商:
                    <el-select v-model="supplier_id_filter" placeholder="选择供应商" @visible-change="supplierselectVisble" class="handle-select mr10">
                        <el-option v-for="item in supplier_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    SKU:
                    <el-input style="width:150px" v-model="filter_sku" placeholder="请输入SKU"></el-input>
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
                <el-table-column  fixed prop="sku" label="SKU" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0 && scope.row.subject_pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row)"/>
                            <img style="cursor: pointer;" v-else-if="scope.row.subject_pictures[0] != undefined && scope.row.subject_pictures[0].url.thumb.url != null && !(scope.row.subject_pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.subject_pictures[0].url.thumb.url" @click="showPictures(scope.$index, scope.row)"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="wish_operate_username" label="分配给" width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="开发人员" width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="主体" width="120">
                    <template slot-scope="scope">
                        <span class="link-type" @click="showChangeProduct(scope.$index, scope.row)">{{scope.row.sku.substring(0, scope.row.sku.length-2)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" width="230" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at_format" label="创建时间" sortable width="135">
                </el-table-column>
                <el-table-column prop="origin_url" label="来源URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.origin_url != null && scope.row.origin_url != '' && scope.row.origin_url != 'null'" :href="scope.row.origin_url" target="_blank">查看来源</a>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="desc_url" label="描述URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.desc_url != null && scope.row.desc_url != '' && scope.row.desc_url != 'null'" :href="scope.row.desc_url" target="_blank">查看描述</a>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item>
                                    <el-button @click="showPictures(scope.$index, scope.row)" type="text">&nbsp查看图片</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="showSubjectPictures(scope.$index, scope.row)" type="text">&nbsp主体图片</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp详&nbsp&nbsp情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp编&nbsp&nbsp辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleAddPictures(scope.$index, scope.row)" type="text">&nbsp添加图片</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp删&nbsp&nbsp除</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="paginationShow" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[20,50,100,200]" :page-size="pagesize" layout="sizes,prev, pager, next" :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" @close="closeEdit">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="产品名称">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <span>{{form.name}}</span>
                </el-form-item>
                <el-form-item label="产品分类">
                    <span>{{form.category_name}}</span>
                    <!-- <el-cascader :options="options" v-model="category_id" expand-trigger="hover" change-on-select></el-cascader> -->
                </el-form-item>
                <el-form-item label="平台">
                    <el-checkbox label="wish" v-model="form.wish" border></el-checkbox>
                    <el-checkbox label="eBay" v-model="form.ebay" border></el-checkbox>
                </el-form-item>
                <!-- <el-form-item label="供应商">
                    <el-select v-model="supplier_id" multiple placeholder="请选择">
                        <el-option v-for="item in supplier_options_edit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers_edit" ref="infiniteLoading3"></infinite-loading>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="英文名">
                    <el-input v-model="form.english_name"></el-input>
                </el-form-item>
                <el-form-item label="产品标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="采购价">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="产品尺寸">
                    <template slot-scope="scope">
                        <el-col :span="7">
                            <el-form-item prop="length">
                                <el-input v-model.trim="form.length" placeholder="长(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="width">
                                <el-input v-model.trim="form.width" placeholder="宽(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="height">
                                <el-input v-model.trim="form.height" placeholder="高(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-form-item>
                <el-form-item label="产品重量(g)">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="包装尺寸">
                    <template slot-scope="scope">
                        <el-col :span="7">
                            <el-form-item prop="length">
                                <el-input v-model.trim="form.package_length" placeholder="长(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="width">
                                <el-input v-model.trim="form.package_width" placeholder="宽(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="height">
                                <el-input v-model.trim="form.package_height" placeholder="高(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-form-item>
                <el-form-item label="包装重量(g)">
                    <el-input v-model="form.package_weight"></el-input>
                </el-form-item>

                <el-form-item label="型号">
                    <el-input v-model.trim="form.model_number"></el-input>
                </el-form-item>
                <el-form-item label="材质">
                    <el-input v-model.trim="form.texture"></el-input>
                </el-form-item>
                <el-form-item label="外箱规格">
                    <template slot-scope="scope">
                        <el-col :span="7">
                            <el-form-item>
                                <el-input v-model.trim="form.box_length" placeholder="长(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-input v-model.trim="form.box_width" placeholder="宽(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item>
                                <el-input v-model.trim="form.box_height" placeholder="高(cm)"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-form-item>
                <el-form-item label="单箱实重">
                    <el-input v-model.trim="form.box_weight"></el-input>
                </el-form-item>
                <el-form-item label="单箱数量">
                    <el-input v-model.trim="form.box_sum"></el-input>
                </el-form-item>

                <el-form-item label="产品描述">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="产品描述URL">
                    <el-input v-model="form.desc_url" placeholder="需加入https://或http://前缀"></el-input>
                </el-form-item>
                <el-form-item label="来源URL">
                    <el-input v-model="form.origin_url" placeholder="需加入https://或http://前缀"></el-input>
                </el-form-item>
                <el-form-item label="图片URL">
                    <el-input v-model="form.picture_url" placeholder="需加入https://或http://前缀"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <!-- <el-form-item label="产品图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item> -->
                <!-- <el-form-item label="外包装图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList2" :on-remove="handleRemove2" :auto-upload="false" :on-change="changeFile2" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item> -->
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit" :disabled="submitDisabled">确 定</el-button>
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

        <!-- 查看产品图片 -->
        <el-dialog title="图片" :visible.sync="productVisible" width="70%">
            <el-carousel height="600px" arrow="always" :autoplay="false" v-if="picturesProductList.length != 0">
                <span>产品图片</span>
                <el-carousel-item v-for="(item, index) in picturesProductList" :key="index">
                    <img class="img_carousel" @click="handleDeletePro(item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <br>
            <el-carousel height="600px" arrow="always" :autoplay="false" v-if="picturesSubjectsList.length != 0">
                <span class="demonstration">主体图片</span>
                <el-carousel-item v-for="(item, index) in picturesSubjectsList" :key="index">
                    <img class="img_carousel" @click="handleDeleteSubjectPic(item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
        <!-- 删除产品图片提示 -->
        <el-dialog title="删除产品图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteProductImg">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 申请查看产品提示 -->
        <el-dialog title="申请查看产品详情" :visible.sync="applyVisible" width="35%">
            <el-form label-width="100px">
                <el-form-item label="备注" required>
                    <el-input v-model.trim="remark" placeholder="请输入申请备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="applyVisible = false">取 消</el-button>
            <el-button type="primary" @click="product_apply" :disabled="submitDisabled">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 导出产品提示 -->
        <el-dialog title="导出产品" :visible.sync="exportVisible" width="35%" @close="closeExport">
            <el-form label-width="100px">
                <el-form-item label="导出平台" required>
                    <!-- <a :href="$axios.defaults.baseURL + '/products/export_url?ids=' + exportIds + '&platform=Ebay'+ '&token=' + export_token">导出到Ebay</a>
                    &nbsp&nbsp&nbsp&nbsp
                    <a :href="$axios.defaults.baseURL + '/products/export_url?ids=' + exportIds + '&platform=Amazon'+ '&token=' + export_token">导出到Amazon</a>
                    &nbsp&nbsp&nbsp&nbsp -->
                    <el-button type="primary">
                        <a style="color:#fff;" :href="$axios.defaults.baseURL + '/products/export_url?ids=' + exportIds + '&platform=Wish'+ '&token=' + export_token">导出到Wish</a>
                    </el-button>
                </el-form-item>
            </el-form>
        </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="products_details" border style="width: 100%">
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="开发人员" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="english_name" label="英文名" show-overflow-tooltip>
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
                <el-table-column prop="package_weight" label="包装重量(g)" width="100">
                </el-table-column>
                <el-table-column prop="model_number" label="型号"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="texture" label="材质" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="box_size" label="外箱尺寸(长*宽*高cm)" width="180">
                </el-table-column>
                <el-table-column prop="box_weight" label="单箱实重(g)" width="90" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="box_sum" label="单箱数量(g)" width="90">
                </el-table-column>
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 分配提示 -->
        <el-dialog title="确认分配" :visible.sync="distributeVisible" width="35%">
            <el-form label-width="110px">
                <el-form-item label="选择开发人员">
                    <el-select v-model="distributeUser" placeholder="选择用户" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" class="handle-select mr10">
                        <el-option v-for="item in distributeUserOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_dis_user" ref="infiniteLoading4"></infinite-loading>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="distributeVisible = false">取 消</el-button>
            <el-button type="primary" @click="distributenProduct" :disabled="submitDisabled">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 删除变体提示 -->
        <el-dialog title="删除变体" :visible.sync="confirmDelChangePro" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelChangePro = false">取 消</el-button>
            <el-button type="danger" @click="deleteChangeProduct">确 定</el-button>
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
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="title" label="产品标题"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_name" label="供应商" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="采购价">
                </el-table-column>
                <el-table-column prop="size" label="尺寸(长*宽*高)" width="100">
                </el-table-column>
                <el-table-column prop="weight" label="重量">
                </el-table-column>
                <el-table-column prop="package_size" label="包装尺寸(长*宽*高)" width="130">
                </el-table-column>
                <el-table-column prop="package_weight" label="包装重量">
                </el-table-column>
                <el-table-column prop="model_number" label="型号"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="texture" label="材质" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="box_size" label="外箱尺寸(长*宽*高cm)" width="160">
                </el-table-column>
                <el-table-column prop="box_weight" label="单箱实重(g)" width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="box_sum" label="单箱数量(g)" width="100">
                </el-table-column>
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="paginationShow2" @current-change="handleCurrentChange2" :page-size="pagesize" layout="prev, pager, next" :total="totals2">
                </el-pagination>
            </div>
            <!-- </div> -->
        </el-dialog>
        <!-- 添加图片 -->
        <el-dialog title="添加图片" :visible.sync="addPictureVisible" width="35%">
            <el-form label-width="100px">
                <el-form-item label="添加图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addPictureVisible = false">取 消</el-button>
                <el-button type="danger" @click="submitAddPictures">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 查看主体图片 -->
        <el-dialog title="主体图片" :visible.sync="subjectPicturesVisible" width="20%">
            <el-table :data="picturesSubjectsList" border style="width: 100%">
                <el-table-column prop="sum" label="主体图片">
                    <template slot-scope="scope">
                        <img class="img_fnsku" v-if="scope.row.url.url != undefined && !(scope.row.url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.url.url"/>
                        <a v-else :href="$axios.defaults.baseURL+scope.row.url.url" target="_blank">{{scope.row.url.url.split('/').pop()}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="handleDeleteSubjectPic(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </span>
        </el-dialog>
        <!-- 删除主体图片提示 -->
        <el-dialog title="删除产品图片" :visible.sync="confirmDelSubjectPicVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelSubjectPicVis = false">取 消</el-button>
            <el-button type="danger" @click="DeleteSubjectPicture">确 定</el-button>
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
                packageVisible: false,
                img_product: 1,
                pdf_product: 0,
                img_package: 1,
                pdf_package: 0,
                picturesProductList: [],
                picturesPackageList: [],
                product_id: undefined,
                confirmDelProVis: false,
                confirmDElPacVis: false,
                picture_id: undefined,
                submitDisabled: false,
                options: [],
                category_id: [],
                applyVisible: false,
                remark: '',
                exportVisible: false,
                platform: undefined,
                exportIds: [],
                export_token: '',
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
              selfdata: false,
              products_change_details: [],
              distributeVisible: false,
              distributeUser: '',
              loading: false,
              distributeUserOptions: [],
              distributeUserOptions2: [],
              dis_user_page: 1,
              dis_user_total: 0,
              query: undefined,
              filter_sku: '',
              query2: undefined,
              loading2: false,
              multipleSelection2: [],
              confirmDelChangePro: false,
              change_detailsVisible: false,
              options_len1: [],
              options_len2: [],
              options_len3: [],
              options_len4: [],
              options3: [],
              subject_id: '',
              subject_name: '',
              addPictureVisible: false,
              supplier_id: [],
              suppliers_temp: [],
              picturesSubjectsList: [],
              subjectPicturesVisible: false,
              confirmDelSubjectPicVis: false,
              statusOptions: [{value: 2, label: '未上架'}, {value: 4, label: 'wish上架'}, {value: 5, label: 'ebay上架'}, {value: 6, label: 'W+E上架'}, {value: 7, label: 'amazon上架'}, {value: 8, label: 'W+A上架'}, {value: 9, label: 'E+A上架'}, {value: 10, label: 'W+E+A上架'}],
              statusSelect: '',
              loading3: false,
              query3: undefined,
              user_options3: [],
              dis_user_total2: 0,
              dis_user_page2: 1,
              operate_user_id: '',
              cur_page2: 1,
              totals2: 0,
              paginationShow2: true
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
                    1: 'danger',
                    2: 'warning',
                    3: 'danger',
                    4: 'success',
                    5: 'primary',
                    6: 'success',
                    10: 'success',
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
                    let is_del = false;
                    return d;
                })
            }
        },
        methods: {
        	handleSizeChange(val) {
        		this.pagesize = val;
                this.getData()
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
                this.$axios.get( '/products/wish_index?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp + '&sku=' + this.filter_sku + '&operate_user_id=' + this.operate_user_id + '&page_size=' + this.pagesize + '&status=' + this.statusSelect, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length + data.subject_pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            // data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
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
                this.$axios.get( '/products/wish_index?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp + '&sku=' + this.filter_sku + '&operate_user_id=' + this.operate_user_id + '&page_size=' + this.pagesize + '&status=' + this.statusSelect, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length + data.subject_pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            // data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.user_id_filter = ''
                this.category_id_filter = []
                this.supplier_id_filter = ''
                this.date_filter = []
                this.operate_user_id = ''
                this.filter_sku = ''
                this.statusSelect = ''
                this.getData()
            },
            getSuppliers() {
                this.$axios.get('/suppliers?page=' + this.supplier_page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code==200) {
                        this.supplier_options = this.supplier_options.concat(res.data.data)
                        this.supplier_total = res.data.count
                    }
                }).catch((res) => {

                })
            },
            getUsers() {
                this.$axios.get('/users?page=' + this.user_page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
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
                this.$axios.get( '/categories?page='+this.category_page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options3 = res.data.data
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
                this.$axios.get( '/categories?page='+page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        this.categories_options = this.categories_options.concat(res.data.data)
                        // this.options_edit = this.options
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
            handleEdit(index, row) {
                // this.supplier_id = []
                // this.$axios.get('/products/' + row.id, {
                //     headers: {
                //             'Authorization': localStorage.getItem('token')
                //         },
                // }).then((res) => {
                //     if(res.data.code == 200) {
                //         this.suppliers_temp = res.data.data.suppliers
                //         res.data.data.suppliers.forEach((data2) => {
                //             this.supplier_id.push(data2.id)
                //             if(!this.supplier_options_edit.find((option) => option.id == data2.id)) {
                //                 this.supplier_options_edit.push({id: data2.id, name: data2.name})
                //             }
                //         })
                //     }
                // })
                this.$axios.get('/products/' + row.id, {
                    headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.form = {
                            id: res.data.data.id,
                            name: res.data.data.name,
                            title: res.data.data.title,
                            price: res.data.data.price,
                            length: res.data.data.length,
                            width: res.data.data.width,
                            height: res.data.data.height,
                            weight: res.data.data.weight,
                            package_length: res.data.data.package_length,
                            package_width: res.data.data.package_width,
                            package_height: res.data.data.package_height,
                            package_weight: res.data.data.package_weight,
                            desc: res.data.data.desc,
                            desc_url: res.data.data.desc_url,
                            origin_url: res.data.data.origin_url,
                            picture_url: res.data.data.picture_url,
                            remark: res.data.data.remark,
                            wish: res.data.data.wish,
                            ebay: res.data.data.ebay,
                            category_name: res.data.data.category_name,
                            model_number: res.data.data.model_number,
                            texture: res.data.data.texture,
                            origin_url: res.data.data.origin_url,
                            box_length: res.data.data.box_length,
                            box_width: res.data.data.box_width,
                            box_height: res.data.data.box_height,
                            box_weight: res.data.data.box_weight,
                            box_sum: res.data.data.box_sum,
                            english_name: res.data.data.english_name,
                        }
                        this.idx = index;
                        this.editVisible = true;
                    }
                }).catch((res) =>{

                })
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
                formData.append('product[name]', this.form.name)
                formData.append('product[title]', this.form.title)
                // formData.append('product[category_id]', this.category_id[this.category_id.length - 1])
                // formData.append('product[supplier_id]', this.form.supplier_id)
                formData.append('product[desc]', this.form.desc)
                formData.append('product[desc_url]', this.form.desc_url)
                formData.append('product[package_length]', this.form.package_length)
                formData.append('product[package_width]', this.form.package_width)
                formData.append('product[package_height]', this.form.package_height)
                formData.append('product[package_weight]', this.form.package_weight)
                formData.append('product[length]', this.form.length)
                formData.append('product[width]', this.form.width)
                formData.append('product[height]', this.form.height)
                formData.append('product[weight]', this.form.weight)
                formData.append('product[price]', this.form.price)
                formData.append('product[origin_url]', this.form.origin_url)
                formData.append('product[picture_url]', this.form.picture_url)
                formData.append('product[remark]', this.form.remark)
                formData.append('product[model_number]', this.form.model_number)
                formData.append('product[texture]', this.form.texture)
                formData.append('product[box_length]', this.form.box_length)
                formData.append('product[box_width]', this.form.box_width)
                formData.append('product[box_height]', this.form.box_height)
                formData.append('product[box_weight]', this.form.box_weight)
                formData.append('product[box_sum]', this.form.box_sum)
                formData.append('product[english_name]', this.form.english_name)
                formData.append('product[wish]', this.form.wish)
                formData.append('product[ebay]', this.form.ebay)
                // this.supplier_id.forEach((data) => {
                //     formData.append('product[supplier_id][]', data)
                // })
                // this.fileList2.forEach((item) => {
                //     formData.append('package_pictures[]', item.raw)
                // })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.patch('/products/' + this.form.id, formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        // this.fileList = []
                        // this.fileList2 = []
                        // this.options = []
                        this.category_id = []
                        this.getData()
                        this.editVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
                // this.$axios.patch('/admin/users/' + this.form.id, params, {
                //     headers: {
                //         'Authorization': localStorage.getItem('token_admin')
                //     },
                // }).then((res) => {
                //     if(res.data.code == 200) {
                //         this.$message.success('更新成功')
                //         this.editVisible = false
                //         this.getData()
                //         this.remark = ''
                //     }
                // }).catch((res) => {
                //     console.log('error')
                // })
            },
            closeEdit() {
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
            	this.$axios.delete('/products/'+this.form.id, 
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
            showPictures(index, row) {
                this.picturesProductList = []
                this.picturesSubjectsList = []
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    this.picturesProductList.push(data)
                })
                item.subject_pictures.forEach((data) => {
                    this.picturesSubjectsList.push(data)
                })
                this.productVisible = true;
            },
            showSubjectPictures(index, row) {
                this.picturesSubjectsList = []
                this.product_id = row.product_subject_id
                const item = this.tableData[index]
                item.subject_pictures.forEach((data) => {
                    this.picturesSubjectsList.push(data)
                })
                this.subjectPicturesVisible = true;
            },
            closeProduct() {
                this.productVisible = false
                this.picturesProductList = []
            },
            deleteProductImg() {
                let params = {
                    img_id: this.picture_id
                }
                this.$axios.post('/products/' + this.product_id+ '/delete_img', params, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.picturesProductList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDelProVis = false
                    }
                }).catch((res) => {

                })
            },
            DeleteSubjectPicture() {
                let params = {
                    img_id: this.picture_id
                }
                this.$axios.post('/product_subjects/' + this.product_id+ '/delete_img', params, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.confirmDelSubjectPicVis = false
                        this.picturesSubjectsList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                    }
                }).catch((res) => {

                })
            },
            handleDeletePro(id, index) {
                this.picture_id = id
                this.idx = index;
                this.confirmDelProVis = true;
            },
            handleDeleteSubjectPic(id, index) {
                this.picture_id = id
                this.idx = index;
                this.confirmDelSubjectPicVis = true;
            },
            handleDeleteSubjectPic(index, row) {
                this.picture_id = row.id
                this.idx = index;
                this.confirmDelSubjectPicVis = true;
            },
            handleApply() {
                if(this.multipleSelection.length == 0){
                    this.$message.error('请至少选择一个产品')
                    return
                }
                this.remark = ''
                this.applyVisible = true
            },
            product_apply() {
                if(this.remark == '') {
                    this.$message.error('请输入申请备注')
                    return
                }
                this.submitDisabled = true
                setTimeout(() => {
                    this.submitDisabled = false
                }, 5000)
                let ids = []
                this.multipleSelection.forEach((data) => {
                    ids.push(data.id)
                })
                let params = {
                    ids: ids,
                    remark: this.remark
                }
                console.log(ids)
                this.$axios.post('/product_applies', params, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('已申请,等待管理员通过')
                        this.submitDisabled = false
                        this.applyVisible = false
                        this.multipleSelection = []
                    }
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('error')
                })
            },
            exportProduct() {
                if(this.multipleSelection.length == 0) {
                    this.$message.error('请至少选择一个产品')
                    return
                }
                this.multipleSelection.forEach((data) => {
                    this.exportIds.push(data.id)
                })
                this.export_token = localStorage.getItem('token')
                this.exportVisible = true
            },
            exportProductDone() {
                console.log(this.platform)
                if(this.platform == undefined) {
                    this.$message.error('请选择平台')
                    return
                }
                // this.$message.success('导出成功')
                let exportIds = []
                this.multipleSelection.forEach((data) => {
                    this.exportIds.push(data.id)
                })
                let params = {
                    ids: this.exportIds,
                    platform: this.platform
                }
                this.$axios.get('/products/export_url?ids[]=' + this.exportIds + '&platform=' + this.platform, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    console.log(res.data)
                    // if(res.data.code == 200) {
                    //     console.log(res)
                    //     this.$message.success('导出成功!')
                    // }
                }).catch((res) => {
                    console.log('errrr')
                })
            },
            handleDetails(index, row) {
                this.product_id = row.id
                this.$axios.get('/products/' + row.id, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.products_details = [res.data.data]
                        this.products_details.forEach((data) => {
                            data.size = data.length + '*' + data.width + '*' + data.height
                            data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
                        })
                        this.detailVisible = true
                    }
                }).catch((res) => {

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
                this.$axios.get('/suppliers?page=' + this.supplier_page_edit, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code==200) {
                        res.data.data.forEach((data) => {
                            if(!(this.suppliers_temp).find((option) => option.id == data.id)) {
                                this.supplier_options_edit.push(data)
                            }
                        })
                        // this.supplier_options_edit = this.supplier_options_edit.concat(res.data.data)
                        this.supplier_total_edit = res.data.count
                    }
                }).catch((res) => {

                })
            },
            
            confirmDistribute() {
                if(this.multipleSelection.length == 0) {
                    this.$message.error('请选择至少一个产品')
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
                    id: id,
                    user_id: this.distributeUser,
                    platform: 'Wish'
                }
                this.$axios.post('/products/allocate_product', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('分配成功!')
                        this.distributeVisible = false
                        this.distributeUser = ''
                        this.getData()
                    }
                }).catch((res) => {

                })
            },
            remoteMethod(query, callback = undefined) {
                if(query != "" || this.query != "" || callback) {
                    let reload = false
                    if(this.query != query) {
                        this.loading = true
                        this.dis_user_page = 1
                        this.query = query
                        reload = true
                        if(this.$refs.infiniteLoading4.isComplete) {
                            this.$refs.infiniteLoading4.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.dis_user_page + '&name=' + query.trim(), {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.loading = false
                            //                          this.options = res.data.data
                            if(reload) {
                                this.distributeUserOptions = this.distributeUserOptions2.concat(res.data.data)
                            } else {
                                this.distributeUserOptions = this.distributeUserOptions.concat(res.data.data)
                            }
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
                    this.remoteMethod(this.query, obj.loaded)
                    //                  this.getUser(obj.loaded)
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
            onInfinite_user(obj) {
                if((this.user_page * 20) < this.user_total) {
                    this.user_page += 1
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
                        this.user_page = 1
                        this.query2 = query
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
                            this.loading2 = false
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
            handleSelectionChange2(val) {
                this.multipleSelection2 = val;
                console.log(val)
            },
            confirmDelteChangePro() {
                if(this.multipleSelection2.length == 0) {
                    this.$message.error('请选择至少一个变体')
                    return
                }
                this.confirmDelChangePro = true
            },
            deleteChangeProduct() {
                let attr_id = []
                this.multipleSelection2.forEach((data) => {
                    attr_id.push(data.id)
                })
                let params ={
                    attr_id: attr_id
                }
                this.$axios.post('/products/' + this.product_id + '/delete_attr', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('删除成功')
                        this.confirmDelChangePro = false
                        this.detailVisible = false
                        this.getData()
                    }
                }).catch((res) => {

                })
            },
            closeExport() {
                this.exportVisible = false
                this.exportIds = []
                this.$refs.multipleTable.clearSelection()
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
                this.$axios.get('/products?product_subject_id=' + this.subject_id + '&page=' + this.cur_page2, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
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
            getCatetory() {
                this.$axios.get( '/categories?parent_id=' + this.category_id_filter[this.category_id_filter.length -1] , {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
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
            handleAddPictures(index, row) {
                this.fileList = []
                this.product_id = row.id
                this.addPictureVisible = true
            },
            submitAddPictures() {
                if(this.fileList.length == 0) {
                    this.$message.error('请添加图片')
                    return
                }
                let formData = new FormData()
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.fileList.forEach((item) => {
                    formData.append('pictures[]', item.raw)
                })
                this.$axios.post('/products/' + this.product_id + '/update_picture', formData, config
                    ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('添加成功！')
                        this.getData()
                        this.addPictureVisible = false
                    }
                    this.submitDisabled = false
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
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
            remoteMethod3(query, callback = undefined) {
                if(query != "" || this.query3 != "" || callback) {
                    let reload = false
                    if(this.query3 != query) {
                        this.loading3 = true
                        this.dis_user_page2 = 1
                        this.query3 = query
                        reload = true
                        if(this.$refs.infiniteLoading6.isComplete) {
                            this.$refs.infiniteLoading6.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.dis_user_page2 + '&name=' + query.trim(), {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.loading3 = false
                            //                          this.options = res.data.data
                            if(reload) {
                                let tempOptions = []
                                // this.distributeUserOptions = res.data.data
                                this.user_options3 = tempOptions.concat(res.data.data)
                            } else {
                                this.user_options3 = this.user_options3.concat(res.data.data)
                            }
                            this.dis_user_total2 = res.data.count
                            if(callback) {
                                callback()
                            }
                        }
                    }).catch((res) => {
                        console.log('失败')
                    })
                }
            },
            onInfinite_dis_user2(obj) {
                if((this.dis_user_page2 * 20) < this.dis_user_total2) {
                    this.dis_user_page2 += 1
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
            getStatusName(status) {
                if(status == 1) {
                    return "未审核"
                } else if(status == 2) {
                    return "未上架"
                } else if(status == 3) {
                    return "删除"
                }else if(status == 4) {
                    return "wish上架"
                }else if(status == 5) {
                    return "ebay上架"
                }else if(status == 6) {
                    return "W+E上架"
                }else if(status == 7) {
                    return "amazon上架"
                }else if(status == 8) {
                    return "W+A上架"
                }else if(status == 9) {
                    return "E+A上架"
                }else if(status == 10) {
                    return "W+E+A上架"
                } else {
                    return '其他'
                }
            }
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

    .link-type,
    .link-type:focus {
      color: #337ab7;
      cursor: pointer;
    }
    .link-type:hover {
        color: rgb(32, 160, 255);
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
</style>
