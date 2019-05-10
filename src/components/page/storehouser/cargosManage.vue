<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-apps"></i> 库存管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-button type="primary" @click="handleCheck">审核</el-button> -->
                <div class="fnsku_filter">
                    <!-- 日期:
                    <el-date-picker v-model="date_filter" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2" unlink-panels value-format="yyyy-MM-dd"></el-date-picker>
                    开发人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select> -->
                    产品名称:
                    <el-select v-model="product_id_filter" filterable remote clearable placeholder="选择产品" :loading="loadingProducts" :remote-method="remoteMethodProducts" @visible-change="productselectVisble" class="handle-select mr10">
                        <el-option v-for="item in product_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_products" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    SKU:
                    <el-input style="width:150px" v-model="search_sku" placeholder="请输入SKU"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="stock_sum" label="库存" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="virtual_sum" label="virtual_sum" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="block_sum" label="损坏的数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable width="140">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp详&nbsp情</el-button>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleStock(scope.$index, scope.row)" type="text">添加库存</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleApply(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp借&nbsp出</el-button>
                                </el-dropdown-item> -->
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="数量">
                    <el-input-number v-model="form.sum" :min="0" :step="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="损坏的数量">
                    <el-input-number v-model="form.block_sum" :min="0" :step="2"></el-input-number>
                </el-form-item>
                <el-form-item label="到达时间">
                    <el-date-picker v-model="form.delivery_date" type="datetime" placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit" :disabled="submitDisabled">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 详情提示 -->
        <el-dialog title="详情" :visible.sync="detailVisible" width="90%">
            <el-table :data="products_details" border style="width: 100%">
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
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="180" show-overflow-tooltip></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 查看产品图片 -->
        <el-dialog title="样品图片" :visible.sync="productVisible" width="70%">
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
        <el-dialog title="提示" :visible.sync="checkVisible" width="300px" center>
            <div class="del-dialog-cnt">审核通过？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkdone">确 定</el-button>
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
                    sum: '',
                    block_sum: '',
                    delivery_date: '',
                    id: ''
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
                product_id_filter: '',
                user_options: [],
                user_options2: [],
                category_options: [],
                product_options: [],
                product_page: 1,
                product_total: 0,
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
              search_sku: '',
              queryProducts: false,
              loadingProducts: false
            }
        },
        created() {
            this.getData();
            // this.getUsers()
            // this.getSuppliers()
            // this.getSuppliersEdit()
        },
        watch: {
        	"$route": "getData"
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'warning',
                    2: 'success',
                    3: 'danger',
                    4: 'default',
                    5: 'default'
                }
                return statusMap[status]
            },
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
                this.$axios.get( '/cargos?page='+this.cur_page + '&sku=' + this.search_sku + '&product_id=' + this.product_id_filter
                // this.$axios.get( '/store_ins?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
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
                this.$axios.get( '/cargos?page='+this.cur_page + '&sku=' + this.search_sku + '&product_id=' + this.product_id_filter
                // this.$axios.get( '/samples?page='+this.cur_page + '&user_id=' +this.user_id_filter + '&category_id=' + category_id_temp + '&supplier_id=' + this.supplier_id_filter + '&date_begin=' + date_begin_temp +'&date_end=' + date_end_temp
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
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
                this.product_id_filter = ''
                this.date_filter = []
                this.search_sku = ''
                this.getData()
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
                // const item = this.tableData[index];
                this.form = {
                    id: row.id,
                    sum: row.sum,
                    block_sum: row.block_sum,
                    delivery_date: row.delivery_date
                }
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
                this.$confirm('此操作将永久删除该入库单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    this.$axios.delete('/store_ins/' + row.id
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
                let params = {
                    sum: this.form.sum,
                    block_sum: this.form.block_sum,
                    delivery_date: this.form.delivery_date
                }
                // let formData = new FormData()
                // formData.append('sample[name]', this.form.name)
                this.$axios.patch('/store_ins/' + this.form.id, params).then((res) => {
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
                this.$axios.get('/store_ins/' + row.id
                ).then((res) => {
                    if(res.data.code == 200) {
                        if (res.data.data.length != 0) {
                            // this.products_details = res.data.data.purchase_order.purchase_order_products
                        }
                        this.detailVisible = true
                    }
                }).catch((res) => {
                    console.log(res)
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
                this.$axios.get('/suppliers?page=' + this.supplier_page_edit
                ).then((res) => {
                    if(res.data.code==200) {
                        this.supplier_options_edit = this.supplier_options_edit.concat(res.data.data)
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
            onInfinite_user(obj) {
                if((this.user_page * 20) < this.user_total) {
                    this.user_page += 1
                    // this.getUsers(obj.loaded)
                    this.remoteMethod(this.query,obj.loaded)
                } else {
                    obj.complete()
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
            productselectVisble(visible) {
                // this.product_options = []
                // this.product_page = 1
                // this.$refs.infiniteLoading2.stateChanger.reset()
                // if(visible) {
                //     this.getProducts()
                // }
                if(visible) {
                    this.queryProducts = undefined
                    this.remoteMethodProducts("")
                }
            },
            onInfinite_products(obj) {
                if((this.product_page * 20) < this.product_total) {
                    this.product_page += 1
                    // this.getProducts(obj.loaded)
                    this.remoteMethodProducts(this.queryProducts,obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
                }
            },
            getProducts() {
                this.$axios.get('/products?page=' + this.product_page
                ).then((res) => {
                    if(res.data.code==200) {
                        this.product_options = this.product_options.concat(res.data.data)
                        this.product_total = res.data.count
                    }
                }).catch((res) => {

                })
            },
            remoteMethodProducts(query, callback = undefined) {
                if(query != "" || this.queryProducts != "" || callback) {
                    let reload = false
                    if(this.queryProducts != query) {
                        this.loadingProducts = true
                        this.product_page = 1
                        this.queryProducts = query
                        reload = true
                        if(this.$refs.infiniteLoading2.isComplete) {
                            this.$refs.infiniteLoading2.stateChanger.reset()
                        }
                    }
                    this.$axios.get("/products/?page=" + this.product_page + '&name=' + query.trim()
                    ).then((res) => {
                        if(res.data.code == 200) {
                            this.loadingProducts = false
                            let tempoptions = []
                            //                          this.options = res.data.data
                            if(reload) {
                                this.product_options = tempoptions.concat(res.data.data)
                            } else {
                                this.product_options = this.product_options.concat(res.data.data)
                            }
                            this.product_total = res.data.count
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
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    if(data.remark == 'main') {
                        this.picturesProductList.push(data)
                    }
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
            
            handleCheck() {
                if(this.multipleSelection.length == 0){
                    this.$message.info('请至少选择一个入库单')
                    return
                }
                this.checkVisible = true
            },
            checkdone() {
                // let temp_ids = ''
                // let temp_id = 0
                // this.multipleSelection.forEach((data) => {
                //     if(temp_id == 0) {
                //         temp_ids = 'ids[]=' + data.id
                //     }else{
                //         temp_ids += '&ids[]=' + data.id
                //     }
                //     temp_id++
                // })
                this.submitDisabled = true
                let formData = new FormData()
                this.multipleSelection.forEach((data) => {
                    formData.append('ids[]', data.id)
                })
                
                this.$axios.post('/store_ins/check', formData
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('审核成功')
                        this.getData()
                        this.submitDisabled = false
                        this.checkVisible = false
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally(() => {
                    this.submitDisabled = false
                })
            },
            getStatusName(status) {
                if(status == 1) {
                    return "待审核"
                }else if (status == 2) {
                    return "已审核"
                }else if (status == 3) {
                    return "已删除"
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
