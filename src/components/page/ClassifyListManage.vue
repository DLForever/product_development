<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 分类管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="fnsku_filter">
                    分类名称:
                    <el-input style="width:150px" placeholder="请输入分类名称" v-model.trim="category_name"></el-input>
                    别名:
                    <el-input style="width:150px" placeholder="请输入别名" v-model.trim="remark"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="分类ID" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="分类名称" width="350" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="relation" label="层级关系" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="别名" width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" width="200" :formatter="formatter_created_at" sortable>
                </el-table-column>
                <!-- <el-table-column prop="updated_at" label="更新时间" width="200" :formatter="formatter_updated_at" sortable>
                </el-table-column> -->
                <!-- <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp详&nbsp&nbsp情</el-button>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column> -->
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
                category_relation: '',
                category_name: '',
                category_total: [],
                isFilter: false,
                remark: '',
                table_loading: true
            }
        },
        created() {
            this.getTotalCategory()
            this.getData();
        },
        watch: {
        	"$route": "getData",
            "category_name": "clear_remark",
            "remark": "clear_category"
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
                this.table_loading = true
                this.$axios.get( '/categories?page='+this.cur_page + '&name=' + this.category_name + '&remark=' + this.remark + '&list=true', {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.tableData = res.data.data
                        this.tableData.forEach((data) => {
                            this.categories_loop(data.id)
                            data.relation = this.category_relation
                            this.category_relation = ''
                        })
                        this.totals = res.data.count
                        this.paginationShow = true
                    }
                }).catch((res) => {
                	console.log('error')
                }).finally(() => {
                    this.table_loading = false
                })
            },
            getTotalCategory() {
                this.$axios.get( '/categories?page='+this.cur_page + '&list=true', {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        for(let i=0; i < Math.ceil(res.data.count / 20); i++) {
                            this.getTotalCategory2(i+1)
                        }
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            getTotalCategory2(page) {
                this.$axios.get( '/categories?page='+page + '&list=true', {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.category_total = this.category_total.concat(res.data.data)
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            categories_loop(c) {
                if(this.cur_page == 1 && this.isFilter == false) {
                    this.tableData.forEach((data) => {
                        if(c==data.id) {
                            if(data.parent_id) {
                                if(this.category_relation == '') {
                                    this.category_relation = data.name
                                }else {
                                    this.category_relation = data.name + '>' + this.category_relation
                                }
                                // this.category_id.unshift(data.parent_id)
                                this.categories_loop(data.parent_id)
                            }else{
                                if(this.category_relation == '') {
                                    this.category_relation = data.name
                                }else {
                                    this.category_relation = data.name + '>' + this.category_relation
                                }
                            }
                        }
                    })
                }else {
                    this.category_total.forEach((data) => {
                        if(c==data.id) {
                            if(data.parent_id) {
                                if(this.category_relation == '') {
                                    this.category_relation = data.name
                                }else {
                                    this.category_relation = data.name + '>' + this.category_relation
                                }
                                // this.category_id.unshift(data.parent_id)
                                this.categories_loop(data.parent_id)
                            }else{
                                if(this.category_relation == '') {
                                    this.category_relation = data.name
                                }else {
                                    this.category_relation = data.name + '>' + this.category_relation
                                }
                            }
                        }
                    })
                }
            },
            filter_product() {
                this.isFilter = true
                this.cur_page = 1
                this.paginationShow = false
                this.$axios.get( '/categories?page='+this.cur_page + '&name=' + this.category_name + '&remark=' + this.remark + '&list=true', {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.tableData = res.data.data
                        this.tableData.forEach((data) => {
                            this.categories_loop(data.id)
                            data.relation = this.category_relation
                            this.category_relation = ''
                        })
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
                this.category_name = ''
                this.remark = ''
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
            handleCheck() {
                if(this.multipleSelection.length == 0){
                    this.$message.error('请至少选择一个申请')
                    return
                }
                this.checkVisible = true
            },
            checkdone() {
                let ids = []
                this.multipleSelection.forEach((data) => {
                    ids.push(data.id)
                })
                let params = {
                    ids: ids
                }
                this.$axios.patch('/product_applies/0',params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('审核成功')
                        this.getData()
                        this.checkVisible = false
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            handleDetails(index, row) {
                this.$axios.get('/products/' + row.product_id, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.products_details = [res.data.data]
                        this.detailVisible = true
                    }
                }).catch((res) => {

                })
            },
            clear_remark() {
                this.remark = ''
            },
            clear_category() {
                this.category_name = ''
            }
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
