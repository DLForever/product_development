<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 采购管理</el-breadcrumb-item>
                <el-breadcrumb-item>采购付款管理</el-breadcrumb-item>
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
                <el-table-column prop="supplier_name" label="公司" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="total_price" label="价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="username" label="申请人" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="check_username" label="审核人">
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
                <el-table-column prop="status" label="支付类型">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.p_type | statusFilter">{{getStatusType(scope.row.p_type)}}</el-tag>
                    </template>
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
                                    <el-button @click="handleDonePay(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp支&nbsp&nbsp付</el-button>
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
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="applyPurchase" :model="applyPurchase" label-width="100px">
                <el-form-item label="价格">
                    <el-input-number v-model="applyPurchase.price" :min="0" :step="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="支付类型">
                    <template slot-scope="scope">
                        <el-select v-model="applyPurchase.p_type">
                            <el-option v-for="item in pay_type_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="applyPurchase.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
                <el-form-item label="付款截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
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
            <el-table :data="products_details" border style="width: 100%">
                <el-table-column prop="sku" label="SKU" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="数量"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="put_card_sum" label="好评卡数量" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="process_peroid" label="做货周期">
                </el-table-column>
                <el-table-column prop="arrive_date" label="到达时间">
                </el-table-column>
                <el-table-column prop="delivery_date" label="交货时间">
                </el-table-column>
                <el-table-column label="好评卡图片" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img style="cursor: pointer;" class="img" v-else-if="scope.row.pictures[0] != undefined && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url" @click="showProduct(scope.$index, scope.row)"/>
                            <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
            </el-table>
            <br>
            <el-table :data="supplier_account_detail" border style="width: 100%">
                <el-table-column prop="collection_account" label="收款账号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="account_name" label="收款账号姓名"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="us_collection_account" label="外币收款账号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="english_name" label="外币收款账号姓名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="payment_day" label="账期天数">
                </el-table-column>
                <el-table-column prop="clearing_form" label="结算方式">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.clearing_form | statusFilter">{{getStatusClearing_Form(scope.row.clearing_form)}}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-table :data="supplier_term_detail" border style="width: 100%">
                <el-table-column prop="supplier_term.currency" label="货币" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.contract_term" label="合同条款"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.quality_request" label="合同要求" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.shipping_type" label="运输方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.shipping_bear_fee" label="费用承担">
                </el-table-column>
                <el-table-column prop="supplier_term.package_standard" label="包装标准">
                </el-table-column>
                <el-table-column prop="supplier_term.acceptance_method" label="验收方式" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.liability_for_breach" label="违约责任"  show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.dissolution_method" label="解决合同纠纷的方式" width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.covenant" label="其他约定事项" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="supplier_term.tax" label="开票税点">
                </el-table-column>
                <el-table-column prop="supplier_term.exit_tax" label="出口退税点">
                </el-table-column>
                <el-table-column prop="supplier_term.reject_ratio" label="不良率">
                </el-table-column>
                <el-table-column prop="supplier_term.term_remark" label="备注">
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 查看产品图片 -->
        <el-dialog title="图片" :visible.sync="productVisible" width="70%">
            <el-carousel height="600px" type="card" v-if="picturesProductList.length != 0">
                <el-carousel-item v-for="(item, index) in picturesProductList" :key="index">
                    <img :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </span>
        </el-dialog>
        <!-- 付款弹出框 -->
        <el-dialog title="付款" :visible.sync="donePayVisible" width="50%">
            <el-form label-width="100px">
                <el-form-item label="备注">
                    <el-input placeholder="请输入备注" v-model.trim="remark"></el-input>
                </el-form-item>
                <el-form-item label="付款截图">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="donePayVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDonePay" :disabled="submitDisabled">确 定</el-button>
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
                checkVisible: false,
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
                table_loading: true,
                supplier_account_detail: [],
                supplier_term_detail: [],
                applyPurchase: {
                    id: '',
                    price: 0,
                    p_type: '',
                    remark: ''
                },
                pay_type_options: [{value: 1, label: '定金'}, {value: 2, label: '全款'}, {value: 3, label: '尾款'}, {value: 4, label: '月结'}, {value: 5, label: '尾款'}],
                donePayVisible: false,
                remark: ''
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
                    4: 'success',
                    5: 'default'
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
                this.$axios.get( '/purchase_pays?page='+this.cur_page + '&apply_user_id=' + this.user_id_filter + '&check_user_id=' + this.user_check_id_filter
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
                this.$axios.get( '/purchase_pays?page='+this.cur_page + '&apply_user_id=' + this.user_id_filter + '&check_user_id=' + this.user_check_id_filter
                ).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data) => {
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
                this.applyPurchase = {
                    id: row.id,
                    price: row.total_price,
                    p_type: row.p_type,
                    remark: row.remark
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
                    remark: this.applyPurchase.remark,
                    price: this.applyPurchase.price,
                    p_type: this.applyPurchase.p_type
                }
                // let formData = new FormData()
                // formData.append('sample[name]', this.form.name)
                // formData.append('sample[title]', this.form.title)
                // this.fileList.forEach((item) => {
                //     formData.append('product_pictures[]', item.raw)
                // })
                this.$axios.patch('/purchase_pays/' + this.applyPurchase.id, params).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('更新成功！')
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
            handleDetails(index, row) {
                this.$axios.get('/purchase_pays/' + row.id
                ).then((res) => {
                    if(res.data.code == 200) {
                        if (res.data.data.length != 0) {
                            this.supplier_account_detail = [res.data.data.purchase_order.supplier_account]
                            this.supplier_term_detail = res.data.data.purchase_order.purchase_order_products
                            this.products_details = res.data.data.purchase_order.purchase_order_products
                            this.products_details.forEach((data) => {
                                data.img_count = data.pictures.length
                            })
                        }
                        this.detailVisible = true
                    }
                }).catch((res) => {
                    console.log(res)
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
            showProduct(index, row) {
                this.picturesProductList = []
                this.product_id = row.id
                // const item = this.tableData[index]
                row.pictures.forEach((data) => {
                    this.picturesProductList.push(data)
                    // if(data.remark == 'main') {
                    //     this.picturesProductList.push(data)
                    // }
                })
                this.productVisible = true;
            },
            handleDonePay(index, row) {
                this.applyPurchase.id = row.id
                this.remark = ''
                this.fileList = []
                this.donePayVisible = true
            },
            saveDonePay() {
                this.submitDisabled = true
                let formData = new FormData()
                formData.append('remark', this.remark)
                this.fileList.forEach((item) => {
                    formData.append('pictures[]', item.raw)
                })
                this.$axios.post('/purchase_pays/' + this.applyPurchase.id + '/done_pay', formData).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('付款成功！')
                        this.getData()
                        this.donePayVisible = false
                    }
                }).catch((res) => {
                    console.log('err')
                }).finally((res) => {
                    this.submitDisabled = false
                })
            },
            getStatusName(status) {
                if(status == 1) {
                    return "待付款"
                }else if (status == 2) {
                    return "已付款"
                }else if (status == 3) {
                    return "已删除"
                } else if(status ==4) {
                    return '已完成'
                } else{
                    return "其他"
                }
            },
            getStatusType(status) {
                if(status == 1) {
                    return "定金"
                }else if (status == 2) {
                    return "全款"
                }else if (status == 3) {
                    return "尾款"
                } else if(status ==4) {
                    return '月结'
                } else if(status ==5) {
                    return '账期'
                } else{
                    return "其他"
                }
            },
            getStatusClearing_Form(status) {
                if(status == 1) {
                    return "先定金后尾款"
                } else if(status == 2) {
                    return "全款"
                } else if(status == 3) {
                    return "月结"
                }else if(status == 4) {
                    return "日结"
                }else {
                    return '其他'
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
    .img {
        width:3rem;
        height:3rem;
    }
    .item {
      margin-top: 10px;
      margin-right: 40px;
    }
</style>
