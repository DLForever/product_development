<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-global"></i> 测评管理</el-breadcrumb-item>
                <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" @click="exportFans">导出粉丝</el-button>
                <div class="fnsku_filter">
                    粉丝号:
                    <el-input style="width:150px" placeholder="请输入粉丝号" v-model.trim="search_fan"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="paypal_account" label="粉丝名称" show-overflow-tooltip>
                </el-table-column>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at">
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
                                <!-- <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
                                </el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
            </el-table>
            <div class="pagination" v-if="paginationShow && totals != 0">
                <el-pagination  @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pagesize" layout="prev, pager, next" :total="totals">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="知识产权名称">
                    <el-input v-model="form.brand_name"></el-input>
                </el-form-item>
                <el-form-item label="知识产权类目">
                    <el-input v-model="form.product_category"></el-input>
                </el-form-item>
                <el-form-item label="知识产权类型">
                    <el-input v-model="form.brand_type"></el-input>
                </el-form-item>
                <el-form-item label="官网链接">
                    <el-input v-model="form.website"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="知识产权图片">
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
            <el-table :data="suppliers_details" border style="width: 100%">
                <el-table-column prop="paypal_account" label="粉丝名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" :formatter="formatter_created_at" label="创建时间">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at">
                </el-table-column>
            </el-table>
            <br>
            <el-table :data="task_records" border style="width: 100%">
                <el-table-column fixed prop="asin" label="ASIN" width="130" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="keyword" label="关键词" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="order_number" label="订单号" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="pay_type" label="支付类型" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="currency" label="币种" >
                </el-table-column>
                <el-table-column prop="pay_time" label="支付时间" :formatter="formatter_pay_time" width="150">
                </el-table-column>
                <el-table-column prop="pay_price" label="支付价格" >
                </el-table-column>
                <el-table-column prop="commission" label="佣金">
                </el-table-column>
                <el-table-column prop="need_refund2" label="是否需要返款" width="95">
                </el-table-column>
                <el-table-column prop="email" label="截图" width="120">
                    <template slot-scope="scope">
                        <el-badge :value="scope.row.img_count" class="item" v-if="scope.row.img_count != 0">
                            <span v-if="scope.row.pictures.length === 0">无</span>
                            <img v-else-if="scope.row.pictures[0] != undefined && scope.row.pictures[0].url.thumb.url != null && !(scope.row.pictures[0].url.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.pictures[0].url.thumb.url"/>
                            <span v-else>无</span>
                        </el-badge>
                        <span v-else>无</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paypal_account" label="paypal账号" width="85">
                </el-table-column>
                <el-table-column prop="profile_url" label="亚马逊profile url" width="113">
                    <template slot-scope="scope">
                        <a v-if="scope.row.profile_url != null && scope.row.profile_url != '' && scope.row.profile_url != 'null'" :href="scope.row.profile_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="facebook_url" label="fackbook url" width="95">
                    <template slot-scope="scope">
                        <a v-if="scope.row.facebook_url != null && scope.row.facebook_url != '' && scope.row.facebook_url != 'null'" :href="scope.row.facebook_url" target="_blank">查看链接</a>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{getStatusName(scope.row.status)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="feedback" label="反馈" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" width="140">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" width="140">
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 查看产品图片 -->
        <el-dialog title="知识产权图片" :visible.sync="productVisible" width="20%" @close="closeProduct">
            <el-table :data="picturestList" border style="width: 100%">
                <el-table-column prop="sum" label="图片">
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
                        <el-button type="danger" @click="handleDeletePic(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 删除产品图片提示 -->
        <el-dialog title="删除图片" :visible.sync="confirmDelProVis" width="35%">
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="confirmDelProVis = false">取 消</el-button>
            <el-button type="danger" @click="deleteImg">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 下载提示 -->
        <el-dialog title="下载" :visible.sync="exportVisible" width="35%" @close="closeExport">
            <el-button type="primary"><a style="color:#fff;" :href="$axios.defaults.baseURL + '/fans/export_url?ids=' + exportIds + '&token=' + export_token">下载excel文件</a></el-button>
        </span>
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
                supplier_id: undefined,
                confirmDelProVis: false,
                confirmDElPacVis: false,
                picture_id: undefined,
                submitDisabled: false,
                checkVisible: false,
                suppliers_details: [],
                detailVisible: false,
                fileList: [],
                picturestList: [],
                productVisible: false,
                search_fan: '',
                task_records: [],
                export_token: '',
                exportIds: [],
                exportVisible: false
            }
        },
        created() {
            this.getData();
        },
        watch: {
        	"$route": "getData"
        },
        filters: {
            //类型转换
            statusFilter(status) {
                const statusMap = {
                    1: 'warning',
                    2: 'primary',
                    3: 'success',
                    4: 'danger',
                    5: 'danger',
                    6: 'success',
                    10: 'success',
                }
                return statusMap[status]
            },
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
                this.export_token = localStorage.getItem('token')
                this.$axios.get( '/fans?page='+this.cur_page + '&query=' + this.search_fan, {
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
                this.$axios.get( '/fans?page='+this.cur_page + '&query=' + this.search_fan, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.tableData = res.data.data
                        this.totals = res.data.count
                    }
                    this.paginationShow = true
                }).catch((res) => {
                    console.log('error')
                }).finally(() => {
                    
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.search_fan = ''
                this.getData()
            },
            formatter_created_at(row, column) {
				return row.created_at.substr(0, 19);
			},
			formatter_updated_at(row, column) {
				return row.updated_at.substr(0, 19);
			},
            formatter_pay_time(row, column) {
                return row.pay_time.substr(0, 19);
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
                    brand_name: item.brand_name,
                    product_category: item.product_category,
                    brand_type: item.brand_type,
                    website: item.website,
                    remark: item.remark
                }
                this.fileList = []
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
                formData.append('brand_name', this.form.brand_name)
                formData.append('product_category', this.form.product_category)
                formData.append('website', this.form.website)
                formData.append('brand_type', this.form.brand_type)
                formData.append('remark', this.form.remark)
                this.fileList.forEach((item) => {
                    formData.append('logo[]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.patch('/intellectual_properties/' + this.form.id, formData, config).then((res) => {
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
            // 确定删除
            deleteRow(){
            	let index = this.idx
            	const item = this.tableData[index];
            	this.form = {
            		id: item.id
            	}
            	this.$axios.delete('/intellectual_properties/'+this.form.id, 
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
                this.$axios.get('/fans/' + row.id, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.suppliers_details = [res.data.data]
                        this.task_records = res.data.data.task_records
                        this.task_records.forEach((data) => {
                            data.img_count = data.pictures.length
                            if (String(data.need_refund) == 'true') {
                                data.need_refund2 = '是'
                            } else if(String(data.need_refund) == 'false'){
                                data.need_refund2 = '否'
                            }
                        })
                        this.detailVisible = true
                    }
                }).catch((res) => {

                })
            },
            changeFile(file) {
                this.fileList.push(file)
            },
            handleRemove(a, b) {
                this.fileList = b
            },
            showPictures(index, row) {
                this.product_id = row.id
                const item = this.tableData[index]
                item.pictures.forEach((data) => {
                    this.picturestList.push(data)
                })
                this.productVisible = true;
            },
            closeProduct() {
                this.productVisible = false
                this.picturestList = []
            },
            handleDeletePic(index, row) {
                this.picture_id = row.id
                this.idx = index;
                this.confirmDelProVis = true;
            },
            deleteImg() {
                let params = {
                    id: this.product_id,
                    img_id: this.picture_id
                }
                this.$axios.post('/intellectual_properties/delete_img', params, {
                     headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.picturestList.splice(this.idx, 1);
                        this.getData()
                        this.$message.success("删除成功")
                        this.confirmDelProVis = false
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
            exportFans() {
                if(this.multipleSelection.length == 0) {
                    this.$message.error('请至少选择一条数据')
                    return
                }
                this.multipleSelection.forEach((data) => {
                    this.exportIds.push(data.id)
                })
                this.export_token = localStorage.getItem('token')
                this.exportVisible = true
            },
            closeExport() {
                this.exportVisible = false
                this.exportIds = []
                this.$refs.multipleTable.clearSelection()
            },
            getStatusName(status) {
                if(status == 1) {
                    return "正在进行中"
                } else if(status == 2) {
                    return "已评论"
                } else if(status == 3) {
                    return "已完成"
                }else if(status == 4) {
                    return "已删除"
                }else if(status == 5) {
                    return "失败"
                }else {
                    return '其他'
                }
            },
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
