<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 入库管理</el-breadcrumb-item>
                <el-breadcrumb-item>入库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="fnsku_filter">
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
                <el-table-column prop="username" label="姓名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">详情</el-button>
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
                <el-table-column prop="name" label="产品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="title" label="产品标题"  show-overflow-tooltip>
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
                detailVisible: false,
                products_details: [],
                user_id_filter: '',
                user_options: [],
                user_total: 0,
                user_page: 1,
                query: undefined,
                loading: false,
                table_loading: true
            }
        },
        created() {
            this.getData();
            this.getUsers()
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
                this.$axios.get( '/sample_ins/?page='+this.cur_page + '&user_id=' + this.user_id_filter, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if(data.in_type == 1) {
                                data.type = "购买"
                            }else if(data.in_type == 2) {
                                data.type = "赠送"
                            }else{

                            }
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
                this.$axios.get( '/sample_ins/?page='+this.cur_page + '&user_id=' + this.user_id_filter, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if(data.in_type == 1) {
                                data.type = "购买"
                            }else if(data.in_type == 2) {
                                data.type = "赠送"
                            }else{

                            }
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
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
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
                this.idx = row.id
                this.checkVisible = true
            },
            
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    id: item.id,
                    name: item.name,
                    fnsku: item.fnsku,
                    sku: item.sku,
                    price: item.price,
                    length: item.length,
                    width: item.width,
                    height: item.height,
                    weight: item.weight,
                    shopname: item.shopname,
                    erp_number: item.erp_number,
                    remark: item.remark
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
                this.submitDisabled = true
                let params = {
                    remark: this.form.remark,
                }
                let formData = new FormData()
                formData.append('product[shopname]', this.form.shopname)
                formData.append('product[erp_number]', this.form.erp_number)
                // formData.append('product[fnsku]', this.form.fnsku)
                formData.append('product[name]', this.form.name)
                formData.append('product[sku]', this.form.sku)
                formData.append('product[length]', this.form.length)
                formData.append('product[width]', this.form.width)
                formData.append('product[height]', this.form.height)
                formData.append('product[weight]', this.form.weight)
                formData.append('product[price]', this.form.price)
                formData.append('product[remark]', this.form.remark)
                this.fileList.forEach((item) => {
                    formData.append('product_pictures[]', item.raw)
                })
                this.fileList2.forEach((item) => {
                    formData.append('package_pictures[]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.patch('/products/' + this.form.id, formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.fileList = []
                        this.fileList2 = []
                        this.getData()
                        this.editVisible = false
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
                this.$axios.get('/samples/' + row.sample_id, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.products_details = [res.data.data]
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
                                let tempoptions = []
                                this.user_options = tempoptions.concat(res.data.data)
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
