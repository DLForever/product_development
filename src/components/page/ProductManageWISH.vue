<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>wish产品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="handleApply">申请查看详情</el-button>
                <el-button type="default" @click="exportProduct">导出</el-button>
                <div class="fnsku_filter">
                    日期:
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    分类:
                    <el-cascader :options="options" v-model="category_id_filter" expand-trigger="hover" change-on-select class="handle-select mr10"></el-cascader>
                    开发人员:
                    <el-select v-model="user_id_filter" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    供应商:
                    <el-select v-model="supplier_id_filter" placeholder="选择供应商" class="handle-select mr10">
                        <el-option v-for="item in supplier_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    产品名称:
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="number" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="number" label="图片" show-overflow-tooltip>
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
                <!-- <el-table-column prop="user" label="开发人员" show-overflow-tooltip>
                </el-table-column> -->
                <!-- <el-table-column prop="size" label="尺寸(长*宽*高)" width="100">
                </el-table-column>
                <el-table-column prop="weight" label="重量" width="60">
                </el-table-column>
                <el-table-column prop="package_size" label="包装尺寸(长*宽*高)" width="130">
                </el-table-column>
                <el-table-column prop="package_weight" label="包装重量" width="70">
                </el-table-column> -->
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="desc_url" label="描述URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.desc_url != null && scope.row.desc_url != '' && scope.row.desc_url != 'null'" :href="scope.row.desc_url" target="_blank">查看描述</a>
                    </template>
                </el-table-column>
                <el-table-column prop="origin_url" label="来源URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.origin_url != null && scope.row.origin_url != '' && scope.row.origin_url != 'null'" :href="scope.row.origin_url" target="_blank">查看来源</a>
                    </template>
                </el-table-column>
                <el-table-column prop="picture_url" label="图片URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.picture_url != null && scope.row.picture_url != '' && scope.row.picture_url != 'null'" :href="scope.row.picture_url" target="_blank">查看图片</a>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp详&nbsp&nbsp情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp编&nbsp&nbsp辑</el-button>
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
                <el-pagination v-if="paginationShow" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pagesize" layout="prev, pager, next" :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%" @close="closeEdit">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="产品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="产品标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="产品分类">
                    <el-cascader :options="options" v-model="category_id" expand-trigger="hover" change-on-select></el-cascader>
                </el-form-item>
                <el-form-item label="供应商">
                    <el-select v-model="form.supplier_id" placeholder="请选择">
                        <el-option v-for="item in supplier_options_edit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers_edit" ref="infiniteLoading3"></infinite-loading>
                    </el-select>
                </el-form-item>
                <el-form-item label="sku">
                    <el-input v-model="form.sku"></el-input>
                </el-form-item>
                <el-form-item label="采购价">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="产品尺寸">
                    <template slot-scope="scope">
                        <el-col :span="7">
                            <el-form-item prop="length">
                                <el-input v-model.trim="form.length" placeholder="长(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="width">
                                <el-input v-model.trim="form.width" placeholder="宽(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="height">
                                <el-input v-model.trim="form.height" placeholder="高(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-form-item>
                <el-form-item label="产品重量">
                    <el-input v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="包装尺寸">
                    <template slot-scope="scope">
                        <el-col :span="7">
                            <el-form-item prop="length">
                                <el-input v-model.trim="form.package_length" placeholder="长(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="width">
                                <el-input v-model.trim="form.package_width" placeholder="宽(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">-</el-col>
                        <el-col :span="7">
                            <el-form-item prop="height">
                                <el-input v-model.trim="form.package_height" placeholder="高(英寸)"></el-input>
                            </el-form-item>
                        </el-col>
                    </template>
                </el-form-item>
                <el-form-item label="包装重量">
                    <el-input v-model="form.package_weight"></el-input>
                </el-form-item>
                <el-form-item label="产品描述">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <el-form-item label="产品描述URL">
                    <el-input v-model="form.desc_url"></el-input>
                </el-form-item>
                <el-form-item label="来源URL">
                    <el-input v-model="form.origin_url"></el-input>
                </el-form-item>
                <el-form-item label="图片URL">
                    <el-input v-model="form.picture_url"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <!-- <el-form-item label="产品图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="外包装图片">
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
        <el-dialog title="产品图片" :visible.sync="productVisible" width="20%" @close="closeProduct">
            <el-table :data="picturesProductList" border style="width: 100%">
                <el-table-column prop="sum" label="产品图片">
                    <template slot-scope="scope">
                        <!-- <span>{{scope.row.url}}</span> -->
                        <img class="img_fnsku" v-if="scope.row.url.url != undefined && !(scope.row.url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.url.url"/>
                        <a v-else :href="$axios.defaults.baseURL+scope.row.url.url" target="_blank">{{scope.row.url.url.split('/').pop()}}</a>
                        <!-- <span v-else>无</span> -->
                    </template>
                    <!-- <template slot-scope="scope">
                        <img class="img_fnsku" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.url" />                  
                    </template> -->
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="handleDeletePro(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <!-- <el-carousel :interval="4000" type="card" height="200px" v-if="img_product">
                <el-carousel-item v-for="item in form.pictures">
                    <img :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <div v-if="pdf_product" v-for="item in form.pictures">
                <a target="_blank" :href="$axios.defaults.baseURL + ':3000' +item.url.url">{{'查看' + item.id + '.pdf'}}</a>
            </div> -->
            <!-- <span slot="footer" class="dialog-footer"> -->
            <!--<el-button @click="showImg = false">取 消</el-button>-->
            <!-- <el-button type="primary" @click="productVisible = false">确 定</el-button> -->
        </span>
        </el-dialog>
        <!-- 查看包装图片 -->
        <el-dialog title="产品图片" :visible.sync="packageVisible" width="20%" @close="closePackage">
            <el-table :data="picturesPackageList" border style="width: 100%">
                <el-table-column prop="sum" label="包装图片">
                    <template slot-scope="scope">
                        <!-- <span>{{scope.row.url}}</span> -->
                        <img class="img_fnsku" v-if="scope.row.url.url != undefined && !(scope.row.url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.url.url"/>
                        <a v-else :href="$axios.defaults.baseURL+scope.row.url.url" target="_blank">{{scope.row.url.url.split('/').pop()}}</a>
                        <!-- <span v-else>无</span> -->
                    </template>
                    <!-- <template slot-scope="scope">
                        <img class="img_fnsku" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.url" />                  
                    </template> -->
                </el-table-column>
                
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="handleDeletePac(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <el-carousel :interval="4000" type="card" height="200px" v-if="img_package">
                <el-carousel-item v-for="item in form.pictures">
                    <img :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
            <div v-if="pdf_package" v-for="item in form.pictures">
                <a target="_blank" :href="$axios.defaults.baseURL + ':3000' +item.url.url">{{'查看' + item.id + '.pdf'}}</a>
            </div> -->
            <!-- <span slot="footer" class="dialog-footer"> -->
            <!--<el-button @click="showImg = false">取 消</el-button>-->
            <!-- <el-button type="primary" @click="packageVisible = false">确 定</el-button> -->
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
        <!-- 删除包装图片提示 -->
        <el-dialog title="删除产品图片" :visible.sync="confirmDElPacVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDElPacVis = false">取 消</el-button>
            <el-button type="danger" @click="deletePackageImg">确 定</el-button>
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
        <el-dialog title="导出产品" :visible.sync="exportVisible" width="35%">
            <el-form label-width="100px">
                <el-form-item label="导出平台" required>
                    <a :href="$axios.defaults.baseURL + '/products/export_url?ids[]=' + exportIds + '&platform=eBay'+ '&token=' + export_token">导出到eBay</a>
                    &nbsp&nbsp&nbsp&nbsp
                    <a :href="$axios.defaults.baseURL + '/products/export_url?ids[]=' + exportIds + '&platform=Amazon'+ '&token=' + export_token">导出到Amazon</a>
                </el-form-item>
            </el-form>
        </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="products_details" border style="width: 100%">
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="title" label="产品标题"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="number" label="产品编码" width="110" show-overflow-tooltip>
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
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
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
              categories_options: []
            }
        },
        created() {
            this.getData();
            this.getUsers()
            this.getSuppliers()
            this.getCategories()
            this.getSuppliersEdit()
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
                this.$axios.get( '/products?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.size = data.length + '*' + data.width + '*' + data.height
                            data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
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
                this.$axios.get( '/products?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.size = data.length + '*' + data.width + '*' + data.height
                            data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
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
                        // this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        for(let i=0; i < Math.ceil(res.data.count / 20); i++) {
                            this.getCatetoryLoop(i+1)
                        }
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
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    name: item.name,
                    title: item.title,
                    sku: item.sku,
                    price: item.price,
                    length: item.length,
                    width: item.width,
                    height: item.height,
                    weight: item.weight,
                    package_length: item.package_length,
                    package_width: item.package_width,
                    package_height: item.package_height,
                    package_weight: item.package_weight,
                    desc: item.desc,
                    desc_url: item.desc_url,
                    origin_url: item.origin_url,
                    picture_url: item.picture_url,
                    remark: item.remark,
                    supplier_id: item.supplier_id
                }
                this.category_id = this.category_id.concat(item.category_id)
                // this.getCategories()
                // this.getSuppliers()
                this.categories_loop(item.category_id)
                this.editVisible = true;
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
                console.log(this.category_id)
                this.submitDisabled = true
                let params = {
                    remark: this.form.remark,
                }
                let formData = new FormData()
                formData.append('product[name]', this.form.name)
                formData.append('product[title]', this.form.title)
                formData.append('product[category_id]', this.category_id[this.category_id.length - 1])
                formData.append('product[supplier_id]', this.form.supplier_id)
                formData.append('product[desc]', this.form.desc)
                formData.append('product[desc_url]', this.form.desc_url)
                formData.append('product[sku]', this.form.sku)
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
                // this.fileList.forEach((item) => {
                //     formData.append('product_pictures[]', item.raw)
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
                    this.submitDisabled = false
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
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
            showProduct(index, row) {
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    if(data.remark == 'product') {
                        this.picturesProductList.push(data)
                    }
                })
                this.productVisible = true;
            },
            showPackage(index, row) {
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    if(data.remark == 'package') {
                        this.picturesPackageList.push(data)
                    }
                })
                this.packageVisible = true;
            },
            closeProduct() {
                this.productVisible = false
                this.picturesProductList = []
            },
            closePackage() {
                this.packageVisible = false
                this.picturesPackageList = []
            },
            deleteProductImg() {
                this.$axios.get('/products/' + this.product_id+ '/delete_picture?picture_id=' + this.picture_id ,{
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
            deletePackageImg() {
                this.$axios.get('/products/' + this.product_id+ '/delete_picture?picture_id=' + this.picture_id ,{
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.picturesPackageList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDElPacVis = false
                    }
                }).catch((res) => {

                })
            },
            handleDeletePro(index, row) {
                this.picture_id = row.id
                this.idx = index;
                this.confirmDelProVis = true;
            },
            handleDeletePac(index, row) {
                this.picture_id = row.id
                this.idx = index;
                this.confirmDElPacVis = true;
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
                this.products_details = [row]
                this.detailVisible = true
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
                        this.supplier_options_edit = this.supplier_options_edit.concat(res.data.data)
                        this.supplier_total_edit = res.data.count
                    }
                }).catch((res) => {

                })
            },
            onInfinite_user(obj) {
                if((this.user_page * 20) < this.user_total) {
                    this.user_page += 1
                    this.getUsers(obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
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
        width:6rem;
        height:6rem;
    }
</style>
