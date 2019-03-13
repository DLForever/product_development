<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-global"></i> 知识产权管理</el-breadcrumb-item>
				<el-breadcrumb-item>新建知识产权</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="message">
				<el-tab-pane label="新建知识产权" name="first">
					<div class="form-box">
						<el-form ref="form" :rules="rules" :model="form" label-width="110px">
							<el-form-item label="知识产权名称" prop="brand_name">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-input v-model.trim="form.brand_name"></el-input>
									</el-col>
									<el-col :span="1">
										<el-tooltip class="item" effect="dark" content="品牌名称、专利名称、所属公司名称等" placement="right-start">
											<i class="el-icon-question" style="margin-left: 10px;"></i>
										</el-tooltip>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="知识产权类目" prop="product_category">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-input v-model.trim="form.product_category"></el-input>
									</el-col>
									<el-col :span="1">
										<el-tooltip class="item" effect="dark" content="属于哪种形式的知识产权，例如图片，LOGO，外观专利，设计专利等" placement="right-start">
											<i class="el-icon-question" style="margin-left: 10px;"></i>
										</el-tooltip>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="知识产权类型" prop="brand_type">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-input v-model.trim="form.brand_type"></el-input>
									</el-col>
									<el-col :span="1">
										<el-tooltip class="item" effect="dark" content="知识产权名称类型" placement="right-start">
											<i class="el-icon-question" style="margin-left: 10px;"></i>
										</el-tooltip>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="官网链接" prop="name">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-input v-model.trim="form.website" placeholder="需加入https://或http://前缀"></el-input>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="备注">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-input v-model.trim="form.remark"></el-input>
									</el-col>
									<el-col :span="1">
										<el-tooltip class="item" effect="dark" content="该知识产权涉及的产品品类、相关信息等" placement="right-start">
											<i class="el-icon-question" style="margin-left: 10px;"></i>
										</el-tooltip>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="知识产权LOGO">
								<template slot-scope="scope">
									<el-col :span="23">
										<el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
											<i class="el-icon-upload"></i>
											<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
										</el-upload>
									</el-col>
									<el-col :span="1">
										<el-tooltip class="item" effect="dark" content="LOGO图片、侵权产品图片、同属产品图片、商标图片等于知识产权相关图片" placement="right-start">
											<i class="el-icon-question" style="margin-left: 10px;"></i>
										</el-tooltip>
									</el-col>
								</template>
							</el-form-item>
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
						<el-form ref="form" :model="form" label-width="100px">
							<el-form-item label="批量上传图片">
								<el-upload class="upload-demo" drag action="" :on-exceed="exceed" :file-list="batchImg" :on-remove="handleRemoveImgs" :auto-upload="false" :on-change="changeImgs" :before-upload="beforeAvatarUpload" :limit="1">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
								</el-upload>
								<a :href="$axios.defaults.baseURL +'/batch_product.xlsx'">模板下载</a>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="uploadproduct">上传文件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</el-tab-pane> -->
			</el-tabs>
		</div>
	</div>
</template>

<script>
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
					brand_name: '',
					product_category: '',
					brand_type: '',
					website: '',
					remark: ''
				},
				rules: {
					brand_name: [{
						required: true,
						message: '请输入知识产权名称',
						trigger: 'blur'
					}],
					product_category: [{
						required: true,
						message: '请输入知识产权类目',
						trigger: 'blur'
					}],
					brand_type: [{
						required: true,
						message: '请输入知识产权类型',
						trigger: 'blur'
					}],
				},
				radio: undefined,
				category_id: [],
				options: [],
				cur_page: 1,
			}
		},
		beforeRouteEnter: (to, from, next) => {
			console.log('Hi,i am comming')
			next()
		},
		created() {
            // this.getData();
        },
		methods: {
			getData() {
                if (process.env.NODE_ENV === 'development') {
                };
                this.$axios.get( '/categories?page='+this.cur_page, {
                	headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {

                    }
                }).catch((res) => {
                	console.log('error')
                })
            },
			submitUpload(content) {
				this.formData = new FormData();
				formData.append('file', content.file)
			},
			onSubmit(formName) {
				// if(this.form.password == '' || this.form.name == '' || this.form.username == '') {
				// 	this.$message.error('请填写必填信息')
				// 	return
				// }
				// let arr = []
				// arr.push(this.form.length, this.form.width, this.form.height, this.form.weight, this.form.price, this.form.package_length, this.form.package_width, this.form.package_height, this.form.package_weight)
				// if(this.judge_addproduct(arr)){
				// }else{
				// 	return
				// }
				let formData = new FormData()
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.submitDisabled = true
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
						this.$axios.post('/intellectual_properties', formData, config).then((res) => {
							if(res.data.code == 200) {
								this.$message.success('提交成功！')
								this.$refs['form'].resetFields()
								this.$router.push('/brandsmanage')
							}
						}).catch((res) => {
							console.log('err')
						}).finally((res) => {
		                    this.submitDisabled = false
		                })
					} else {
						this.$message.error("请填写完整信息")
						return false
					}
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
				let config = {
					headers: {
						'Authorization': localStorage.getItem('token')
					}
				}
				console.log(this.batchProduct)
				this.batchProduct.forEach((item) => {
					formData.append('file', item.raw)
				})
				this.$axios.post('/products/batch', formData, config).then((res) => {
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
			}
		}
	}
</script>