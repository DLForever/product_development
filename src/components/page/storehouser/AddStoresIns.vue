<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-friendadd"></i> 仓储管理</el-breadcrumb-item>
				<el-breadcrumb-item>新建入库单</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">

			<el-tabs v-model="message">
				<el-tab-pane label="新建入库单" name="first">
					<div class="form-box">
						<el-form ref="form" :model="form" label-width="110px">
							<el-form-item label="采购单合同号">
								<el-select v-model="order_number" @change="evalOrder(order_number)" placeholder="选择合同号" @visible-change="orderNumberVisble" class="handle-select mr10">
					                <el-option v-for="item in order_number_options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					                <infinite-loading :on-infinite="onInfinite_order_number" ref="infiniteLoading"></infinite-loading>
					            </el-select>
							</el-form-item>
							<el-form-item label="产品名称">
		                        <el-select v-model="purchase_order_product_id">
		                            <el-option v-for="item in products_options" :key="item.value" :label="item.label" :value="item.value"></el-option>
		                        </el-select>
			                </el-form-item>
			                <el-form-item label="数量">
								<el-input v-model.trim="sum"></el-input>
							</el-form-item>
							<el-form-item label="损坏的数量">
								<el-input v-model.trim="block_sum"></el-input>
							</el-form-item>
							<!-- <el-form-item label="备注">
								<el-input v-model.trim="form.remark"></el-input>
							</el-form-item> -->
							<el-form-item>
								<el-button type="primary" @click="onSubmit('form')" :disabled="submitDisabled">新建</el-button>
							</el-form-item>
						</el-form>
					</div>

				</el-tab-pane>
				<!-- <el-tab-pane label="批量上传" name="second">
					<template v-if="message === 'second'">
						<el-form ref="form" :model="form" label-width="100px">
							<el-form-item label="批量上传产品">
								<el-upload class="upload-demo" drag action="" :on-exceed="exceed" :file-list="batchProduct" :on-remove="handleRemoveBatch" :auto-upload="false" :on-change="changeBatch" :before-upload="beforeAvatarUpload" :limit="1">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
									<div class="el-upload__tip" slot="tip">只能上传xls/xlsx格式文件</div>
								</el-upload>
								<a :href="$axios.defaults.baseURL +'/batch_product.xlsx'">模板下载</a>
							</el-form-item>
						</el-form>
					</template>
				</el-tab-pane> -->
			</el-tabs>
		</div>
	</div>
</template>

<script>
	import VueInfiniteLoading from "vue-infinite-loading"
	export default {
		// name: 'addProduct',
		data: function() {
			return {
				message: 'first',
				submitDisabled: false,
				product_pictures: [],
				fileList: [],
				fileList2: [],
				batchProduct: [],
				batchImg: [],
				form: {
					name: '',
				},
				order_number_total: 0,
				order_number_page: 1,
				order_number: '',
				order_number_options: [],
				products_options: [],
				purchase_order_product_id: '',
				sum: 0,
				block_sum: 0
			}
		},
		beforeRouteEnter: (to, from, next) => {
			console.log('Hi,i am comming')
			next()
		},
		created() {
        },
		methods: {
			submitUpload(content) {
				this.formData = new FormData();
				formData.append('file', content.file)
			},
			onSubmit(formName) {
				// this.submitDisabled = true
                let params = {
                    purchase_order_product_id: this.purchase_order_product_id,
                    sum: this.sum,
                    block_sum: this.block_sum
                }
                // let formData = new FormData()
                // formData.append('sample[name]', this.form.name)
                // formData.append('sample[title]', this.form.title)
                // this.fileList.forEach((item) => {
                //     formData.append('product_pictures[]', item.raw)
                // })
                this.$axios.post('/store_ins/', params).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('创建成功！')
                    }
                }).catch((res) => {
                    console.log(res)
                }).finally((res) => {
                    // this.submitDisabled = false
                })
			},
			uploadproduct() {
				if(this.batchProduct.length == 0) {
					this.$message.error("请选择xlsx文件")
					return
				}
				const extension = this.batchProduct[0].name.split('.')[1] === 'xls'
				const extension2 = this.batchProduct[0].name.split('.')[1] === 'xlsx'
				const isLt2M = this.batchProduct[0].size / 1024 / 1024 < 10
				if(!extension & !extension2) {
					console.log('上传模板只能是 xls、xlsx格式！')
					this.$message.error('请上传 xls、xlsx格式的文件')
					return
				}
				if(!isLt2M) {
					console.log('上传模板大小不能超过10MB！')
					return
				}
				let formData = new FormData()
				console.log(this.batchProduct)
				this.batchProduct.forEach((item) => {
					formData.append('file', item.raw)
				})
				this.$axios.post('/products/batch', formData).then((res) => {
					if(res.data.code == 200) {
						this.$message.success("提交成功")
						this.batchProduct = []
					}
				}).catch((res) => {
					this.$message.error("失败，请核对无误后联系管理员")
				})
			},			
			//上传前对文件的大小进行判断
			beforeAvatarUpload(file) {
				const extension = file.name.split('.')[1] === 'xls'
				const extension2 = file.name.split('.')[1] === 'xlsx'
				const isLt2M = file.size / 1024 / 1024 < 10
				if(!extension & !extension2) {
					console.log('上传模板只能是 xls、xlsx格式！')
					this.$message.error('请上传 xls、xlsx格式的文件')
				}
				if(!isLt2M) {
					console.log('上传模板大小不能超过10MB！')
				}
			},
			uploadError(res, file, FileList) {
				console.log('上传失败，请重试！')
			},
			changeFile(file) {
				this.fileList.push(file)
			},
			handleRemove(a, b) {
				this.fileList = b
			},
			changeImgs(file) {
				this.batchImg.push(file)
			},
			handleRemoveImgs(a, b) {
				this.batchImg = b
			},
			changeBatch(file) {
				this.batchProduct.push(file)
			},
			handleRemoveBatch(a, b) {
				this.batchProduct = b
			},
			exceed() {
				this.$message.error("对不起，超过个数限制")
			},
			orderNumberVisble(visible) {
                this.order_number_options = []
                this.order_number_page = 1
                this.$refs.infiniteLoading.stateChanger.reset()
                if(visible) {
                    this.getOrderNumber()
                }
            },
            onInfinite_order_number(obj) {
                if((this.order_number_page * 20) < this.order_number_total) {
                    this.order_number_page += 1
                    this.getOrderNumber(obj.loaded)
                } else {
                    obj.complete()
                    console.log(obj.complete())
                }
            },
            getOrderNumber() {
                this.$axios.get('/purchase_orders?page=' + this.supplier_page
                ).then((res) => {
                    if(res.data.code==200) {
                        this.order_number_options = this.order_number_options.concat(res.data.data)
                        this.order_number_total = res.data.count
                    }
                }).catch((res) => {

                })
            },
            evalOrder(id,index) {
            	console.log(111)
                let temp_data = ''
                this.order_number_options.some((data) => {
                    if (data.id === id) {
                        temp_data = data
                        return true
                    }
                })
                temp_data.purchase_order_products.forEach((data) => {
                	this.products_options.push({label: data.product_name, value: data.id})
                })
                console.log(this.products_options)
            },
		},
		components: {
            "infinite-loading": VueInfiniteLoading
        }
	}
</script>