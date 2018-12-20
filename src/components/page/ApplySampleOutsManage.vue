<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 样品管理</el-breadcrumb-item>
                <el-breadcrumb-item>申请借样</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <div class="fnsku_filter">
                    开发人员:
                    <el-input style="width:150px" placeholder="请输入开发人员" v-model.trim="search_shopname"></el-input>
                    产品名称:
                    <el-input style="width:150px" placeholder="请输入产品名称" v-model.trim="search_fnsku"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div> -->
            </div>
            <br><br>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column fixed prop="name" label="样品名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="图片"show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pictures.length === 0">无</span>
                        <img class="img" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.url"/>
                        <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="样品标题" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column prop="supplier_name" label="供应商" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="category_name" label="分类" width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="库存">
                </el-table-column>
                <el-table-column prop="loan_sum" label="借出">
                </el-table-column>
                <el-table-column prop="lock_sum" label="锁定数量">
                </el-table-column>
                <el-table-column prop="price" label="申报价值">
                </el-table-column>
                <el-table-column prop="desc" label="描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="desc_url" label="描述URL" width="80">
                    <template slot-scope="scope">
                        <a v-if="scope.row.desc_url != null && scope.row.desc_url != '' && scope.row.desc_url != 'null'":href="scope.row.desc_url" target="_blank">查看描述</a>
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
                                    <el-button @click="handleApply(scope.$index, scope.row)" type="text">借出</el-button>
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
        <!-- 申请借样提示框 -->
        <el-dialog title="编辑" :visible.sync="applyVisible" width="50%" center>
            <el-form label-width="100px">
                <el-form-item label="数量">
                    <el-input placeholder="请输入数量" v-model.trim="apply_stocksum"></el-input>
                </el-form-item>
                <el-form-item label="出库方式">
                    <el-radio v-model="out_type" label="1" border>借出</el-radio>
                    <el-radio v-model="out_type" label="2" border>赠品</el-radio>
                    <el-radio v-model="out_type" label="3" border>销售</el-radio>
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
                stockVisible: false,
                stock_sum: '',
                stock_remark: undefined,
                apply_stocksum: '',
                apply_stockremark: undefined,
                applyVisible: false,
                in_type: '',
                price: '',
                out_type: 0,
                products_details: [],
                detailVisible: false
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
                    if (!is_del) {
                        if ((d.name.indexOf(this.select_word) > -1 ||
                                d.fnsku.indexOf(this.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
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
                this.$axios.get( '/samples?page='+this.cur_page, {
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
                this.$axios.get( '/samples?page='+this.cur_page + '&shopname=' + this.search_shopname + '&fnsku=' + this.search_fnsku, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                        data.size = data.length + '*' + data.width + '*' + data.height
                    })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                    }
                    this.paginationShow = true
                }).catch((res) => {
                    console.log('error')
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.search_fnsku = ''
                this.search_shopname = ''
                this.getData()
            },
            getCategories() {
                if (process.env.NODE_ENV === 'development') {
                };
                this.$axios.get( '/categories?page='+this.cur_page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                    }
                    console.log(this.options)
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
                    remark: item.remark
                }
                this.category_id = this.category_id.concat(item.category_id)
                this.getCategories()
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
                console.log(this.category_id)
                this.submitDisabled = true
                let params = {
                    remark: this.form.remark,
                }
                let formData = new FormData()
                formData.append('sample[name]', this.form.name)
                formData.append('sample[title]', this.form.title)
                formData.append('sample[category_id]', this.category_id[this.category_id.length - 1])
                formData.append('sample[desc]', this.form.desc)
                formData.append('sample[desc_url]', this.form.desc_url)
                formData.append('sample[sku]', this.form.sku)
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
                this.$axios.patch('/samples/' + this.form.id, formData, config).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.options = []
                        this.category_id = []
                        this.getData()
                        this.editVisible = false
                    }
                    this.submitDisabled = false
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
                })
            },
            closeEdit() {
                this.options = []
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
            	this.$axios.delete('/samples/'+this.form.id, 
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
            handleStock(index, row) {
                this.stock_sum = ''
                this.stock_remark = undefined
                this.idx = row.id
                this.stockVisible = true
            },
            saveStock() {
                this.submitDisabled = true
                let params = {
                    id: this.idx,
                    sum: this.stock_sum,
                    in_type: this.in_type,
                    price: this.price,
                    remark: this.stock_remark
                }
                this.$axios.post('/sample_ins', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
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
            handleApply(index, row) {
                this.idx = row.id
                this.apply_stocksum = ''
                this.apply_stockremark = undefined
                this.out_type == 0
                this.applyVisible = true
            },
            saveApply() {
                if(this.apply_stocksum == '' || this.apply_stockremark == undefined || this.out_type == 0) {
                    this.$message.error('请输入完整信息')
                    return
                }
                this.submitDisabled = true
                let params = {
                    id: this.idx,
                    sum: this.apply_stocksum,
                    out_type: this.out_type,
                    remark: this.apply_stockremark
                }
                this.$axios.post('/sample_outs', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('提交成功')
                        this.getData()
                        this.applyVisible = false
                        this.submitDisabled = false
                    }
                }).catch((res) => {
                    this.submitDisabled = false
                    console.log('err')
                })
            },
            handleDetails(index, row) {
                this.products_details = [row]
                this.detailVisible = true
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

    .img {
        width:3rem;
        height:3rem;
    }
</style>
