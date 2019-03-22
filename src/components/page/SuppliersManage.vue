<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 产品管理</el-breadcrumb-item>
                <el-breadcrumb-item>产品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="fnsku_filter">
                    <!-- 开发人员:
                    <el-input style="width:150px" placeholder="请输入开发人员" v-model.trim="search_shopname"></el-input> -->
                    供应商:
                    <el-input style="width:150px" placeholder="请输入供应商" v-model.trim="search_supplier"></el-input>
                    <el-button @click="clear_filter" type="default">重置</el-button>
                    <el-button @click="filter_product" type="primary">查询</el-button>
                </div>
            </div>
            <br><br>
            <el-table v-loading="table_loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="供应商ID" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="供应商名称" show-overflow-tooltip>
                </el-table-column>
                <!-- <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="地址" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="website" label="网址" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.website != null && scope.row.website != '' && scope.row.website != 'null'" :href="scope.row.website" target="_blank">查看网站</a>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="created_at" label="创建时间" :formatter="formatter_created_at" sortable>
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable>
                </el-table-column> -->
                <!-- <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                        <el-dropdown>
                            <el-button type="primary">
                                操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <!-- <el-dropdown-item>
                                    <el-button @click="showProduct(scope.$index, scope.row)" type="text">&nbsp产品图片</el-button>
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item>
                                    <el-button @click="check(scope.$index, scope.row)" type="text">审核</el-button>
                                </el-dropdown-item> -->
                                <el-dropdown-item>
                                    <el-button @click="handleDetails(scope.$index, scope.row)" type="text">详情</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleEdit(scope.$index, scope.row)" type="text">编辑</el-button>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <el-button @click="handleDelete(scope.$index, scope.row)" type="text">删除</el-button>
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
                <el-form-item label="供应商名称">
                    <el-input v-model.trim="form.name"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model.trim="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model.trim="form.email"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model.trim="form.address"></el-input>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model.trim="form.website"></el-input>
                </el-form-item>
                 <el-form-item label="备注">
                    <el-input v-model.trim="form.remark"></el-input>
                </el-form-item>
                <el-form-item label="营业执照">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="证书">
                    <el-upload class="upload-demo" drag action="" :file-list="fileList2" :on-remove="handleRemove2" :auto-upload="false" :on-change="changeFile2" :limit="5" multiple>
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
                <el-table-column prop="name" label="供应商名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="营业执照">
                    <template slot-scope="scope">
                        <span v-if="scope.row.business_pic.length === 0">无</span>
                        <img style="cursor: pointer;" v-else-if="scope.row.business_pic[0] != undefined && !(scope.row.business_pic[0].url.thumb.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.business_pic[0].url.thumb.url" @click="showPictures(scope.$index, scope.row, 'business')"/>
                        <span v-else>无</span>
                        <!-- <a v-else :href="$axios.defaults.baseURL+scope.row.pictures[0].url.url" target="_blank">{{scope.row.pictures[0].url.url.split('/').pop()}}</a> -->
                    </template>
                </el-table-column>
                <!-- <el-table-column label="证书">
                    <template slot-scope="scope">
                        <span v-if="scope.row.cert_pic.length === 0">无</span>
                        <img style="cursor: pointer;" v-else-if="scope.row.cert_pic[0] != undefined && !(scope.row.cert_pic[0].url.thumb.url.match(/.pdf/))" :src="$axios.defaults.baseURL+scope.row.cert_pic[0].url.thumb.url" @click="showPictures(scope.$index, scope.row, 'cert')"/>
                        <span v-else>无</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="phone" label="电话" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="address" label="地址" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="website" label="网址" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a v-if="scope.row.website != null && scope.row.website != '' && scope.row.website != 'null'" :href="scope.row.website" target="_blank">查看网站</a>
                    </template>
                </el-table-column>
                <el-table-column prop="created_at_format" label="创建时间">
                </el-table-column>
                <el-table-column prop="updated_at" label="更新时间" :formatter="formatter_updated_at" sortable>
                </el-table-column>
                <el-table-column prop="remark" label="备注" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <br><br>
            <el-table v-if="info_files.length != 0" :data="info_files" border style="width: 100%">
                <el-table-column prop="name" label="证书" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <a :href="$axios.defaults.baseURL+scope.row.url.url" target="_blank">{{scope.row.url.url.split('/').pop()}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="预览" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <img v-if="scope.row.url.url.endsWith('.jpg') || scope.row.url.url.endsWith('.png')" style="max-width: 10rem" :src="$axios.defaults.baseURL+scope.row.url.url"/>
                        <pdf v-else-if="scope.row.url.url.endsWith('.pdf')" style="max-width: 10rem" :src="$axios.defaults.baseURL+scope.row.url.url"></pdf>
                        <span v-else></span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" class="red" icon="el-icon-delete" @click="handleDeleteInfo(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <!-- 查看营业执照 -->
        <el-dialog title="图片" :visible.sync="picturesVisible" width="70%">
            <el-carousel height="600px" arrow="always" :autoplay="false" v-if="picturestList.length != 0">
                <el-carousel-item v-for="(item, index) in picturestList" :key="index">
                    <img class="img_carousel" @click="handleDeletePic(item.remark, item.id, index)" :src="$axios.defaults.baseURL+item.url.url" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
    import pdf from 'vue-pdf'
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
                    website: '',
                    email: '',
                    remark: '',
                    phone: ''
                },
                idx: -1,
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
                picturesVisible: false,
                picturestList: [],
                search_supplier: '',
                fileList: [],
                fileList2: [],
                info_files: [],
                table_loading: true
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
                this.$axios.get( '/suppliers/?page='+this.cur_page + '&name=' + this.search_supplier, {
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
                }).finally(() => {
                    this.table_loading = false
                })
            },
            filter_product() {
                this.table_loading = true
                this.cur_page = 1
                this.paginationShow = false
                this.$axios.get( '/suppliers/?page='+this.cur_page + '&name=' + this.search_supplier, {
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
                }).finally(() => {
                    this.table_loading = false
                })
            },
            clear_filter() {
                this.paginationShow = false
                this.cur_page = 1
                this.search_supplier = ''
                this.getData()
            },
            formatter_created_at(row, column) {
				return row.created_at.substr(0, 19)
			},
			formatter_updated_at(row, column) {
				return row.updated_at.substr(0, 19)
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
                this.fileList = []
                this.fileList2 = []
                this.idx = index
                const item = this.tableData[index]
                this.form = {
                    id: item.id,
                    name: item.name || '',
                    phone: item.phone || '',
                    email: item.email || '',
                    address: item.address || '',
                    website: item.website || '',
                    remark: item.remark || ''
                }
                this.editVisible = true;
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
                    this.$axios.delete('/suppliers/' + row.id, {
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
            handleDeleteInfo(index, row) {
                this.$confirm('此操作将永久删除该证书, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    let params = {
                        img_id: row.id,
                        t_type: 2
                    }
                    this.$axios.post('/suppliers/' + this.product_id + '/delete_img', params, {
                         headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.info_files.splice(index, 1)
                            this.getData()
                            this.$message.success("删除成功")
                        }
                    }).catch((res) => {
                        console.log(res)
                    })
                }).catch((res) => {
                    console.log(res)
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
                    remark: this.form.remark,
                }
                let formData = new FormData()
                formData.append('supplier[name]', this.form.name)
                formData.append('supplier[phone]', this.form.phone)
                formData.append('supplier[email]', this.form.email)
                formData.append('supplier[address]', this.form.address)
                formData.append('supplier[website]', this.form.website)
                formData.append('supplier[remark]', this.form.remark)
                this.fileList.forEach((item) => {
                    formData.append('supplier[pictures][]', item.raw)
                })
                this.fileList2.forEach((item) => {
                    formData.append('supplier[cert_pictures][]', item.raw)
                })
                let config = {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }
                this.$axios.patch('/suppliers/' + this.form.id, formData, config).then((res) => {
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
                this.product_id = row.id
                this.$axios.get('/suppliers/' + row.id, {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.business_pic = []
                        res.data.data.cert_pic = []
                        res.data.data.pictures.forEach((data) => {
                            if(data.remark == 'business') {
                                res.data.data.business_pic.push(data)
                            } else {
                                res.data.data.cert_pic.push(data)
                            }
                        })
                        // res.data.data.info_files.forEach((data) => {
                        //     console.log(data.url.url)
                        //     data.url.url2 =  pdf.createLoadingTask(data.url.url)
                        //     console.log(data.url.url2)
                        // })
                        this.info_files = res.data.data.info_files
                        this.suppliers_details = [res.data.data]
                        this.detailVisible = true
                    }
                }).catch((res) => {

                })
            },
            showPictures(index, row, remark) {
                this.picturestList = []
                this.product_id = row.id
                const item = row
                if (remark == 'business') {
                    this.picturestList = row.business_pic
                } else {
                    this.picturestList = row.cert_pic
                }
                this.picturesVisible = true;
            },
            handleDeletePic(remark, id, index) {
                this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'danger'
                }).then(() => {
                    let params = {
                        img_id: id,
                        t_type: 1
                    }
                    this.$axios.post('/suppliers/' + this.product_id + '/delete_img', params, {
                         headers: {
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then((res) => {
                        if(res.data.code == 200) {
                            this.picturestList.splice(index, 1)
                            this.getData()
                            this.$message.success("删除成功")
                        }
                    }).catch((res) => {
                        console.log(res)
                    })
                }).catch((res) => {
                    console.log(res)
                    this.$message.info('已取消删除')
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
        },
        components: {
            "pdf": pdf
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
    .el-carousel__item.is-animating{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .img_carousel {
        max-width: 40rem;
    }
    .red{
        color: #ff0000;
    }
</style>
