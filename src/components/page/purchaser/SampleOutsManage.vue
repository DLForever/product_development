<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 借样管理</el-breadcrumb-item>
                <el-breadcrumb-item>借样管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="fnsku_filter">
                    申请人员:
                    <el-select v-model="user_id_filter" filterable remote :loading="loading" @visible-change="selectVisble" :remote-method="remoteMethod" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user" ref="infiniteLoading"></infinite-loading>
                    </el-select>
                    审核人员:
                    <el-select v-model="user_check_id_filter" filterable remote :loading="loading2" @visible-change="selectVisble2" :remote-method="remoteMethod2" placeholder="选择用户" class="handle-select mr10">
                        <el-option v-for="item in user_options2" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        <infinite-loading :on-infinite="onInfinite_user2" ref="infiniteLoading2"></infinite-loading>
                    </el-select>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="apply_username" label="申请人" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="申请数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="type" label="申请方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="user_remark" label="申请备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="back_remark" label="归还备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="check_username" label="审核人">
                </el-table-column>
                <el-table-column prop="manager_remark" label="审核人备注">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable width="140">
                </el-table-column>
                <!-- <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable width="140">
                </el-table-column> -->
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
                                    <el-button @click="check(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp审&nbsp&nbsp核</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="returnSamples(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp归&nbsp&nbsp还</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleCheckReturnSamples(scope.$index, scope.row)" type="text">审核归还</el-button>
                                </el-dropdown-item>
<!--                                 <el-dropdown-item>
                                    <el-button @click="returnSamples(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp归&nbsp&nbsp还</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp编&nbsp&nbsp辑</el-button>
                                </el-dropdown-item> -->
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
        <!-- 添加库存提示框 -->
        <el-dialog title="编辑" :visible.sync="stockVisible" width="50%" center>
            <el-form label-width="50px">
                <el-form-item label="数量">
                    <el-input placeholder="请输入数量" v-model.trim="stock_sum"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="stock_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="stockVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveStock">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 审核提示框 -->
        <el-dialog title="提示" :visible.sync="checkVisible" width="50%" center>
            <el-form label-width="50px">
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="check_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkdone">审核通过</el-button>
            </span>
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
        <!-- 审核归还提示框 -->
        <el-dialog title="提示" :visible.sync="checkreturnVisible" width="50%" center>
            <el-form label-width="50px">
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="check_return_remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="checkreturnVisible = false">取 消</el-button>
                <el-button type="primary" @click="checkReturnSamples">确认归还</el-button>
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
                stockVisible: false,
                stock_sum: '',
                stock_remark: undefined,
                checkVisible: false,
                check_remark: undefined,
                return_remark: undefined,
                returnVisible: false,
                detailVisible: false,
                products_details: [],
                user_id_filter: '',
                user_options: [],
                user_options2: [],
                user_check_id_filter: '',
                user_page: 1,
                user_total: 0,
                query: undefined,
                loading: false,
                user_page2: 1,
                user_total2: 0,
                query2: undefined,
                loading2: false,
                check_return_remark: '',
                checkreturnVisible: false,
                table_loading: true
            }
        },
        created() {
            this.getData()
            // this.getUsers()
        },
        watch: {
        	"$route": "getData"
        },
        computed: {
            data() {
                return this.tableData.filter((d) => {
                    let is_del = false;
                    return d
                    // if (!is_del) {
                    //     if ((d.name.indexOf(this.select_word) > -1 ||
                    //             d.fnsku.indexOf(this.select_word) > -1)
                    //     ) {
                    //         return d;
                    //     }
                    // }
                })
            }
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'danger',
                    2: 'primary',
                    3: 'warning',
                    4: 'success'
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
            // 获取 easy-mock 的模拟数据
            getData() {
                // 开发环境使用 easy-mock 数据，正式环境使用 json 文件
                if (process.env.NODE_ENV === 'development') {
//                  this.url = '/ms/table/list';
                };
                this.table_loading = true
                this.$axios.get( '/sample_outs?page='+this.cur_page + '&apply_user_id=' + this.user_id_filter + '&check_user_id=' + this.user_check_id_filter
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if(data.out_type == 1) {
                                data.type = '借出'
                            }else if(data.out_type ==2) {
                                data.type = '赠品'
                            }else if(data.out_type == 3){
                                data.type = '销售'
                            }else {

                            }
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
                this.$axios.get( '/sample_outs?page='+this.cur_page + '&apply_user_id=' + this.user_id_filter + '&check_user_id=' + this.user_check_id_filter
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
                            if(data.out_type == 1) {
                                data.type = '借出'
                            }else if(data.out_type ==2) {
                                data.type = '赠品'
                            }else if(data.out_type == 3){
                                data.type = '销售'
                            }else {

                            }
                        })
                        this.tableData = res.data.data
                        this.totals = res.data.count
                    }
                    this.paginationShow = true
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
                this.user_check_id_filter = ''
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
                this.$axios.patch('/samples/' + this.form.id, formData).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
                        this.options = []
                        this.category_id = []
                        this.getData()
                        this.editVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
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
                this.stockVisible = true
            },
            saveStock() {
                let params = {
                    id: this.idx,
                    sum: this.stock_sum,
                    remark: this.stock_remark
                }
                this.$axios.post('/sample_ins', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('提交成功')
                        this.getData()
                        this.stockVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                })
            },
            check(index, row) {
                this.check_remark = undefined
                this.idx = row.id
                this.checkVisible = true
            },
            checkdone() {
                let params = {
                    remark: this.check_remark
                }
                this.$axios.patch('/sample_outs/' + this.idx, params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('审核成功')
                        this.getData()
                        this.checkVisible = false
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            returnSamples(index, row) {
                this.idx = row.id
                this.return_remark = undefined
                this.returnVisible = true
            },
            returndone() {
                if(this.return_remark == undefined) {
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
                        this.getData()
                        this.returnVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                })
            },
            handleDetails(index, row) {
                this.$axios.get('/samples/' + row.sample_id
                ).then((res) => {
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
                                let tempoptions = []
                                this.user_options2 = tempoptions.concat(res.data.data)
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
            handleCheckReturnSamples(index, row) {
                this.check_return_remark = ''
                this.idx = row.id
                this.checkreturnVisible = true
            },
            checkReturnSamples() {
                if(this.check_return_remark == '') {
                    this.$message.error('请输入备注')
                    return
                } 
                let params = {
                    remark: this.check_return_remark
                }
                this.$axios.post('/sample_outs/' + this.idx + '/check_done', params
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('归还申请已提交')
                        this.getData()
                        this.checkreturnVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                })
            },
            getStatusName(status) {
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
        float: right;
    }

    .img_fnsku {
        width:6rem;
        height:6rem;
    }
</style>
