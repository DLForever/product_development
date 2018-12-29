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
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="图片" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.pictures.length === 0">无</span>
                        <img  v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"/>
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
                                    <el-button @click="showProduct(scope.$index, scope.row)" type="text">&nbsp主体图片</el-button>
                                </el-dropdown-item>
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
        <el-dialog title="产品图片" :visible.sync="productVisible" width="20%">
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

        <!-- 删除产品图片提示 -->
        <el-dialog title="删除产品图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteProductImg">确 定</el-button>
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
                confirmDelProVis: false
            }
        },
        created() {
            this.getData();
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
                this.$axios.get( '/product_subjects/?page='+this.cur_page + '&sku=' + this.sku_filter + '&img=true', {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
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
                this.$axios.get( '/products?page='+this.cur_page + '&shopname=' + this.search_shopname + '&fnsku=' + this.search_fnsku, {
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
            handleDeletePro(index, row) {
                this.picture_id = row.id
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
                        this.productVisible = false
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
        width:6rem;
        height:6rem;
    }
</style>
