<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>审核产品</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" refs="test">
            <div class="handle-box">
                <el-button type="primary" @click="handleCheck">审核</el-button>
                <div class="fnsku_filter">
                    分类:
                    <el-cascader :options="options" v-model="category_id_filter" expand-trigger="hover" @change="getCatetory" change-on-select class="handle-select mr10"></el-cascader>
                    开发人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="开发人员" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="图片" width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pictures.length === 0 && scope.row.subject_pictures.length === 0">无</span>
                        <img v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"/>
                        <img  v-else-if="scope.row.subject_pictures[0] != undefined && scope.row.subject_pictures[0].url.thumb.url != null && !(scope.row.subject_pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.subject_pictures[0].url.thumb.url"/>
                        <span v-else>无</span>
                        <!-- <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a> -->
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" width="280" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" show-overflow-tooltip>
                </el-table-column>
<!--                 <el-table-column prop="platform" label="平台" width="100" show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column prop="price" label="申报价值" width="80">
                </el-table-column>
                
                <el-table-column prop="desc_url" label="描述URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.desc_url != null && scope.row.desc_url != ''" :href="scope.row.desc_url" target="_blank">查看描述</a>
                    </template>
                </el-table-column>
                <el-table-column prop="origin_url" label="来源URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.origin_url != null && scope.row.origin_url != ''" :href="scope.row.origin_url" target="_blank">查看来源</a>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="system_remark" label="系统备注" width="180" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="img_count" label="图片数量" width="80">
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
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
                                </el-dropdown-item> -->
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
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

        <!-- 审核提示框 -->
        <el-dialog title="提示" :visible.sync="checkVisible" width="300px" center>
            <div class="del-dialog-cnt">审核通过？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkdone">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="products_details" border style="width: 100%">
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="english_name" label="英文名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pictures.length === 0 && scope.row.subject_pictures.length === 0">无</span>
                        <img v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"/>
                        <img  v-else-if="scope.row.subject_pictures[0] != undefined && !(scope.row.subject_pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.subject_pictures[0].url.thumb.url"/>
                        <span v-else>无</span>
                        <!-- <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a> -->
                    </template>
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
                <el-table-column prop="package_size" label="包装尺寸(长*宽*高cm)" width="150">
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
                checkVisible: false,
                products_details: [],
                detailVisible: false,
                user_id_filter: '',
                category_id_filter: [],
                user_options: [],
                user_options2: [],
                category_options: [],
                user_page: 1,
                user_total: 0,
                category_page: 1,
                options: [],
                query: undefined,
                loading: false,
                products_change_details: [],
                options_len1: [],
                options_len2: [],
                options_len3: [],
                options_len4: [],
                options3: [],
                supplier_options_edit: [],
                supplier_page_edit: 1,
                supplier_total_edit: 0,
                supplier_id: [],
                suppliers_temp: [],
                table_loading: true
            }
        },
        created() {
            this.getData();
            // this.getUsers()
            this.getCategories()
            // this.getSuppliersEdit()
        },
        watch: {
        	"$route": "getData"
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
                console.log(this.$refs)
                // this.$refs.test..scrollTop = 0
        		this.pagesize = val;
                this.getData()
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
                this.$axios.get( '/products/wait_to_check?page='+this.cur_page + '&user_id=' + this.user_id_filter + '&category_id=' + category_id_temp + '&page_size=' +this.pagesize, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length + data.subject_pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            // data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
                            // if(data.wish && data.ebay){
                            //     data.platform = 'wish+ebay'
                            // }else if(data.wish){
                            //     data.platform = 'wish'
                            // }else if(data.ebay){
                            //     data.platform = 'ebay'
                            // }else{
                            //     data.platform = ''
                            // }
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
                this.$axios.get( '/products/wait_to_check?page='+this.cur_page + '&user_id=' + this.user_id_filter + '&category_id=' + category_id_temp + '&page_size=' +this.pagesize, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            data.img_count = data.pictures.length + data.subject_pictures.length
                            // data.size = data.length + '*' + data.width + '*' + data.height
                            // data.package_size = data.package_length + '*' + data.package_width + '*' + data.package_height
                            // data.box_size = data.box_length + '*' + data.box_width + '*' + data.box_height
                            // if(data.wish && data.ebay){
                            //     data.platform = 'wish+ebay'
                            // }else if(data.wish){
                            //     data.platform = 'wish'
                            // }else if(data.ebay){
                            //     data.platform = 'ebay'
                            // }else{
                            //     data.platform = ''
                            // }
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
            getCatetoryLoop(page) {
                this.$axios.get( '/categories?page='+page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
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
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.category_id_filter = []
                this.user_id_filter = ''
                this.getData()
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
                this.idx = [row.id]
                this.checkVisible = true
            },
            checkdone() {
                let temp_ids = ''
                let temp_id = 0
                this.multipleSelection.forEach((data) => {
                    if(temp_id == 0) {
                        temp_ids = 'ids[]=' + data.id
                    }else{
                        temp_ids += '&ids[]=' + data.id
                    }
                    temp_id++
                })
                this.submitDisabled = true
                this.$axios.get('/products/check?' + temp_ids, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('审核成功')
                        this.getData()
                        this.submitDisabled = false
                        this.checkVisible = false
                    }
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('error')
                })
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
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    // let params = {
                    //     id: row.id
                    // }
                    this.$axios.delete('/products/' + row.id, {
                         headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then((res) => {
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
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.patch('/products/' + this.form.id, formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.fileList = []
                        this.getData()
                        this.editVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
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
            handleDetails(index, row) {
                // this.product_id = row.id
                // this.products_details = [row]
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
            handleCheck() {
                if(this.multipleSelection.length == 0){
                    this.$message.error('请至少选择一个申请')
                    return
                }
                this.checkVisible = true
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

    .img {
        width:3rem;
        height:3rem;
    }
</style>
