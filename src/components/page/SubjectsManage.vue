<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 主体管理</el-breadcrumb-item>
                <el-breadcrumb-item>主体管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="confirmDistribute">分配</el-button>
                <div class="fnsku_filter">
                    日期:
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    开发人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    分类:
                    <el-cascader :options="options" v-model="category_id_filter" expand-trigger="hover" change-on-select @change="getCatetory" class="handle-select mr10"></el-cascader>
                    SKU:
                    <el-input style="width:150px" placeholder="请输入SKU" v-model.trim="sku_filter"></el-input>
                    名称:
                    <el-input style="width:150px" placeholder="请输入主体名称" v-model.trim="name_filter"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showProduct(scope.$index, scope.row)"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                        <!-- <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a> -->
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable>
                </el-table-column>
                <!-- <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="showSubjects(scope.$index, scope.row)" type="text">查看详情</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="showProduct(scope.$index, scope.row)" type="text">主体图片</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="showProduct(scope.$index, scope.row)" type="text">&nbsp产品图片</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="check(scope.$index, scope.row)" type="text">审核</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">详情</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">修改图片</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEditName(scope.$index, scope.row)" type="text">修改主体</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEditSuppliers(scope.$index, scope.row)" type="text">修改供应商</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="添加图片">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="图片URL">
                    <el-input v-model="form.picture_url"></el-input>
                </el-form-item>
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

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="subject_details" border style="width: 100%">
                <el-table-column prop="name" label="供应商名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="地址" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at_format" label="创建时间">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 修改供应商弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisibleSuppliers" width="50%" @close="closeEditSuppliers">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="供应商">
                    <el-select v-model="supplier_ids" multiple placeholder="请选择">
                        <el-option v-for="item in supplier_options_edit" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_suppliers_edit" ref="infiniteLoading3"></infinite-loading>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisibleSuppliers = false">取 消</el-button>
                <el-button type="primary" @click="saveEditSuppliers" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看产品图片 -->
        <el-dialog title="主体图片" :visible.sync="productVisible" width="80%">
            <el-carousel height="700px" arrow="always" :autoplay="false" v-if="picturesProductList.length != 0">
                <el-carousel-item v-for="(item, index) in picturesProductList" :key="index">
                    <img class="img_carousel" @click="handleDeletePro(item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <!-- 删除产品图片提示 -->
        <el-dialog title="删除主体图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteProductImg">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 变体详情提示 -->
        <el-dialog title="详情" :visible.sync="subjectsVisible" width="90%">
            <el-button type="primary">
                <a style="color:#fff;" :href="$axios.defaults.baseURL + '/product_subjects/' + subject_id + '?token=' + export_token">导出图片</a>
            </el-button>
            <br><br>
            <el-table :data="subjectsOptions" border style="width: 100%">
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
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- </div> -->
        </el-dialog>
        <!-- 分配提示 -->
        <el-dialog title="确认分配" :visible.sync="distributeVisible" width="35%">
            <el-form label-width="110px">
                <el-form-item label="选择开发人员">
                    <el-select v-model="distributeUser" placeholder="选择用户" filterable remote :loading="loading2" @visible-change="selectVisble2" :remote-method="remoteMethod2" class="handle-select mr10">
                        <el-option v-for="item in distributeUserOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_dis_user" ref="infiniteLoading5"></infinite-loading>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="distributenWish" :disabled="submitDisabled">分配到WISH</el-button>
            <el-button type="primary" @click="distributenEbay" :disabled="submitDisabled">分配到EBAY</el-button>
        </span>
        </el-dialog>
        <!-- 修改名称 -->
        <el-dialog title="编辑" :visible.sync="editNameVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="主体名称">
                    <el-input v-model.trim="subject_name" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model.trim="subject_price" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model.trim="desc" placeholder="请输入描述内容"></el-input>
                </el-form-item>
                <el-form-item>
                    <div class="el-upload__tip">温馨提示:   修改名称和价格将应用于主体下的所有变体</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editNameVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEditSubjectName" :disabled="submitDisabled">确 定</el-button>
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
                
                confirmDelProVis: false,
                confirmDElPacVis: false,
                picture_id: undefined,
                submitDisabled: false,
                checkVisible: false,
                subject_details: [],
                detailVisible: false,
                sku_filter: '',
                fileList: [],
                supplier_page_edit: 1,
                supplier_total_edit: 0,
                editVisibleSuppliers: false,
                supplier_options_edit: [],
                supplier_ids: [],
                subject_id: undefined,
                suppliers_temp: [],
                productVisible: false,
                confirmDelProVis: false,
                subjectsVisible: false,
                subjectsOptions: [],
                export_token: '',
                distributeUserOptions: [],
                distributeUser: '',
                dis_user_page: 1,
                dis_user_total: 0,
                query2: undefined,
                loading2: false,
                distributeVisible: false,
                subject_name: '',
                subject_price: '',
                editNameVisible: false,
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
              options: [],
              options_len1: [],
              options_len2: [],
              options_len3: [],
              options_len4: [],
              options3: [],
              category_id_filter: [],
              user_page: 1,
              user_total: 0,
              user_options: [],
              query: undefined,
              loading: false,
              user_id_filter: '',
              name_filter: '',
              desc: '',
              table_loading: true
            }
        },
        created() {
            this.getData();
            this.getCatetoryLoop()
            // this.getSuppliersEdit()
        },
        watch: {
        	"$route": "getData"
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'danger',
                    2: 'warning',
                    3: 'success',
                    4: 'success',
                    5: 'primary',
                    6: 'success',
                    10: 'success',
                }
                return statusMap[status]
            },
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
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
                this.$axios.get( '/product_subjects/?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&name=' + this.name_filter + '&sku=' + this.sku_filter + '&img=true' + '&date_begin=' + date_begin_temp + '&date_end=' + date_end_temp + '&category_id=' + category_id_temp, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.paginationShow = true
                        this.table_loading = false
                    }
                }).catch((res) => {
                	console.log('error')
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
                this.$axios.get( '/product_subjects/?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&name=' + this.name_filter + '&sku=' + this.sku_filter + '&img=true' + '&date_begin=' + date_begin_temp + '&date_end=' + date_end_temp + '&category_id=' + category_id_temp, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                        this.table_loading = false
                    }
                    this.paginationShow = true
                }).catch((res) => {
                    console.log('error')
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.sku_filter = ''
                this.search_shopname = ''
                this.category_id_filter = []
                this.date_filter = []
                this.user_id_filter = ''
                this.name_filter = ''
                this.getData()
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
                        this.options3 = res.data.data
                        this.getCatetoryLoop(1)
                        // for(let i=0; i < Math.ceil(res.data.count / 20); i++) {
                        //     this.getCatetoryLoop(i+1)
                        // }
                        // this.total = res.data.count
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            getCatetoryLoop() {
                this.$axios.get( '/categories?page=1', {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options3 = res.data.data
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        // this.categories_options = this.categories_options.concat(res.data.data)
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
            check(index, row) {
                this.idx = row.id
                this.checkVisible = true
            },
            
            handleEdit(index, row) {
                this.submitDisabled = false
                this.fileList = []
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    picture_url: item.picture_url,
                }
                this.editVisible = true;
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
                this.fileList.forEach((item) => {
                    formData.append('pictures[]', item.raw)
                })
                formData.append('picture_url', this.form.picture_url)
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.post('/product_subjects/' + this.form.id + '/update_picture', formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.getData()
                        this.editVisible = false
                    }
                    this.submitDisabled = false
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
                })
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
            handleDetails(index, row) {
                this.subject_details = [row]
                this.detailVisible = true 
            },
            changeFile(file) {
                this.fileList.push(file)
            },
            handleRemove(a, b) {
                this.fileList = b
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
            handleEditSuppliers(index, row) {
                this.getSuppliersEdit()
                this.supplier_ids = []
                this.$axios.get('/product_subjects/' + row.id + '/get_suppliers', {
                    headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.suppliers_temp = res.data.data
                        res.data.data.forEach((data2) => {
                            this.supplier_ids.push(data2.id)
                            if(!this.supplier_options_edit.find((option) => option.id == data2.id)) {
                                this.supplier_options_edit.unshift({id: data2.id, name: data2.name})
                            }
                        })
                    }
                })
                this.subject_id = row.id
                this.editVisibleSuppliers = true
            },
            saveEditSuppliers() {
                let formData = new FormData()
                this.supplier_ids.forEach((data) => {
                    formData.append('supplier_id[]', data)
                })
                this.$axios.patch('/product_subjects/' + this.subject_id, formData, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code==200) {
                        this.$message.success('更新成功')
                        this.editVisibleSuppliers = false
                    }
                }).catch((res) => {

                })
            },
            showProduct(index, row) {
                this.picturesProductList = []
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    this.picturesProductList.push(data)
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
                this.$axios.post('/product_subjects/' + this.product_id+ '/delete_img', params, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.picturesProductList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                        // this.productVisible = false
                        this.confirmDelProVis = false
                    }
                }).catch((res) => {

                })
            },
            closeEditSuppliers() {
                this.supplier_options_edit = []
                this.supplier_page_edit = 1
                this.$refs.infiniteLoading3.stateChanger.reset()
                this.editVisibleSuppliers = false
            },
            showSubjects(index, row) {
                this.export_token = localStorage.getItem('token')
                this.subject_id = row.id
                this.$axios.get('/products?product_subject_id=' + row.id, {
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
                        this.subjectsOptions = res.data.data
                        this.subjectsVisible = true
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
            distributenEbay() {
                if(this.distributeUser == '') {
                    this.$message.error('请选择分配人员')
                    return
                }
                let id = []
                this.multipleSelection.forEach((data) => {
                    id.push(data.id)
                })
                let params = {
                    product_subject_id: id,
                    user_id: this.distributeUser,
                    platform: 'Ebay'
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
            distributenWish() {
                if(this.distributeUser == '') {
                    this.$message.error('请选择分配人员')
                    return
                }
                let id = []
                this.multipleSelection.forEach((data) => {
                    id.push(data.id)
                })
                let params = {
                    product_subject_id: id,
                    user_id: this.distributeUser,
                    platform: 'Wish'
                }
                this.$axios.post('/products/allocate_product', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        console.log(6666)
                        console.log(res)
                        this.$message.success('分配成功!')
                        this.distributeVisible = false
                        this.distributeUser = ''
                        this.getData()
                    }
                }).catch((res) => {

                })
            },
            remoteMethod2(query, callback = undefined) {
                if(query != "" || this.query2 != "" || callback) {
                    let reload = false
                    if(this.query2 != query) {
                        this.loading2 = true
                        this.dis_user_page = 1
                        this.query2 = query
                        reload = true
                        if(this.$refs.infiniteLoading5.isComplete) {
                            this.$refs.infiniteLoading5.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/users/?page=" + this.dis_user_page + '&name=' + query.trim(), {
                        headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.loading2 = false
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
                    this.remoteMethod2(this.query2, obj.loaded)
                    //                  this.getUser(obj.loaded)
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
            handleEditName(index, row) {
                this.subject_id = row.id
                this.subject_name = ''
                this.subject_price = ''
                this.desc = row.desc
                this.editNameVisible = true
            },
            saveEditSubjectName() {
                if(this.subject_name == '' && this.subject_price == '' && this.desc == '') {
                    this.$message.error('请至少修改一项')
                    return false
                }
                this.submitDisabled = true
                let params = {
                    name: this.subject_name,
                    price: this.subject_price,
                    desc: this.desc
                }
                this.$axios.post('/product_subjects/' + this.subject_id + '/update_info', params, {
                    headers: {
                            'Authorization': localStorage.getItem('token')
                        },
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.$message.success('更改成功!')
                            this.getData()
                            this.editNameVisible = false
                        }
                    }).catch((res) => {

                    }).finally((res) => {
                        this.submitDisabled = false
                    })
            },
            onInfinite_user(obj) {
                if((this.user_page * 20) < this.user_total) {
                    this.user_page += 1
                    // this.getUsers(obj.loaded)
                    this.remoteMethod(this.query,obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
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
        width:45rem;
        height:45rem;
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
</style>
