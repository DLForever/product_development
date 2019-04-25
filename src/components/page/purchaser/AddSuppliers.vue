<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-lx-global"></i> 供应商管理</el-breadcrumb-item>
				<el-breadcrumb-item>新建供应商</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="message">
				<el-tab-pane label="新建供应商" name="first">
					<div class="form-box">
						<el-form ref="form" :rules="rules" :model="form" label-width="110px">
							<el-form-item label="公司名" prop="name">
								<el-input v-model.trim="form.name"></el-input>
							</el-form-item>
							<el-form-item label="电话" prop="phone">
								<el-input v-model.trim="form.phone"></el-input>
							</el-form-item>
							<el-form-item label="地址" prop="address">
								<el-input v-model.trim="form.address"></el-input>
							</el-form-item>
							<el-form-item label="网址">
								<el-input v-model.trim="form.website"></el-input>
							</el-form-item>
							<el-form-item label="邮箱">
								<el-input v-model.trim="form.email"></el-input>
							</el-form-item>
							<!-- <el-form-item label="收款帐号">
								<el-input v-model.trim="form.accountNumber"></el-input>
							</el-form-item>
							<el-form-item label="开户名">
								<el-input v-model.trim="form.accountName"></el-input>
							</el-form-item> -->
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
					remark: '',
					phone: '',
					address: '',
					website: '',
					email: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					phone: [{
						required: true,
						message: '请输入电话',
						trigger: 'blur'
					}],
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: 'blur'
					}],
					address: [{
						required: true,
						message: '请输入地址',
						trigger: 'blur'
					}],
					website: [{
						required: true,
						message: '请输入网址',
						trigger: 'blur'
					}],
				},
				radio: undefined,
				category_id: [],
				options: [],
				cur_page: 1,
				accountNumber: '',
				accountName: ''
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
                this.$axios.get( '/categories?page='+this.cur_page
                ).then((res) => {
                    if(res.data.code == 200) {
                    }
                    console.log(this.options)
                }).catch((res) => {
                	console.log('error')
                })
            },
			submitUpload(content) {
				this.formData = new FormData();
				formData.append('file', content.file)
			},
			onSubmit(formName) {
				let formData = new FormData()
				this.$refs[formName].validate((valid) => {
					if(valid) {
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
						this.$axios.post('/suppliers', formData).then((res) => {
							if(res.data.code == 200) {
								this.$message.success('提交成功！');
								this.$refs['form'].resetFields()
								this.fileList = []
								this.$router.push('/suppliersManage')
							}
						}).catch((res) => {
							console.log(res)
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
			changeFile2(file) {
				this.fileList2.push(file)
			},
			handleRemove2(a, b) {
				this.fileList2 = b
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