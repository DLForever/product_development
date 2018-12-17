<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 样品管理</el-breadcrumb-item>
                <el-breadcrumb-item>归还样品</el-breadcrumb-item>
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
                <el-table-column prop="apply_username" label="申请人" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sum" label="申请数量" show-overflow-tooltip>
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
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable width="140">
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <el-button @click="returnSamples(scope.$index, scope.row)" type="text">&nbsp&nbsp&nbsp&nbsp归&nbsp&nbsp还</el-button>
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
                checkVisible: false,
                check_remark: undefined,
                return_remark: undefined,
                returnVisible: false
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
                    2: 'warning',
                    3: 'success',
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
                this.$axios.get( '/sample_outs?page='+this.cur_page, {
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
                let params = {
                    id: this.idx,
                    sum: this.stock_sum,
                    remark: this.stock_remark
                }
                this.$axios.post('/sample_ins', params, {
                    headers: {'Authorization': localStorage.getItem('token')}
                }).then((res) => {
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
                this.$axios.patch('/sample_outs/' + this.idx, params, {
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
                    headers: {'Authorization': localStorage.getItem('token')},
                    params
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('归还成功')
                        this.getData()
                        this.returnVisible = false
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
                    return "已归还"
                } else {
                    return "其他"
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
</style>
