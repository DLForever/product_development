<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-date"></i> 产品管理</el-breadcrumb-item>
				<el-breadcrumb-item>新建产品</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="message">
				<el-tab-pane label="新建产品" name="first">
					<div class="form-box">
						<el-form ref="form" :rules="rules" :model="form" label-width="110px">
							<el-form-item label="产品名称" prop="name">
								<el-input v-model.trim="form.name"></el-input>
							</el-form-item>
							<el-form-item label="产品分类" required>
                        		<el-cascader :options="options" v-model="category_id" expand-trigger="hover" change-on-select></el-cascader>
                    		</el-form-item>
                    		<el-form-item label="供应商">
								<el-select v-model="form.supplier_id" placeholder="请选择">
									<el-option v-for="item in supplierOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
									<infinite-loading :on-infinite="onInfinite_suppliers" ref="infiniteLoading"></infinite-loading>
								</el-select>
							</el-form-item>
							<el-form-item label="平台">
								<!-- <el-checkbox-group v-model="form.platform"> -->
								<el-checkbox label="wish" v-model="isWish" border></el-checkbox>
								<el-checkbox label="eBay" v-model="iseBay" border></el-checkbox>
								<!-- </el-checkbox-group> -->
							</el-form-item>
							<!-- <span>{{attrs}}</span> -->
							<el-form-item label="属性">
								<table class="table text-center">
									<tbody v-for="(p,index) in attrs">
										<td>
											<el-input v-model.trim="p.group" placeholder="属性"></el-input>
										</td>
										<td>
											<el-select v-model="p.vals" multiple filterable="" allow-create="" default-first-option placeholder="请输入属性值"></el-select>
										</td>
										<div v-if="index == 0">
											<i class="el-icon-circle-plus" @click="orderAdd(index)" :disabled="false"></i>
											<span>&nbsp</span>
											<i class="el-icon-remove" @click="orderDel(index)"></i>
										</div>
									</tbody>
								</table>
							</el-form-item>
							<el-form-item label="产品标题">
								<el-input v-model.trim="form.title"></el-input>
							</el-form-item>
							<el-form-item label="采购价">
								<el-input v-model.trim="form.price"></el-input>
							</el-form-item>
							<el-form-item label="产品尺寸">
								<template slot-scope="scope">
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.length" placeholder="长(英寸)"></el-input>
										</el-form-item>
									</el-col>
									<el-col class="line" :span="1">-</el-col>
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.width" placeholder="宽(英寸)"></el-input>
										</el-form-item>
									</el-col>
									<el-col class="line" :span="1">-</el-col>
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.height" placeholder="高(英寸)"></el-input>
										</el-form-item>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="产品重量">
								<el-input v-model.trim="form.weight"></el-input>
							</el-form-item>
							<el-form-item label="包装尺寸">
								<template slot-scope="scope">
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.package_length" placeholder="长(英寸)"></el-input>
										</el-form-item>
									</el-col>
									<el-col class="line" :span="1">-</el-col>
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.package_width" placeholder="宽(英寸)"></el-input>
										</el-form-item>
									</el-col>
									<el-col class="line" :span="1">-</el-col>
									<el-col :span="7">
										<el-form-item>
											<el-input v-model.trim="form.package_height" placeholder="高(英寸)"></el-input>
										</el-form-item>
									</el-col>
								</template>
							</el-form-item>
							<el-form-item label="包装重量">
								<el-input v-model.trim="form.package_weight"></el-input>
							</el-form-item>
							<el-form-item label="产品描述">
								<el-input v-model.trim="form.desc"></el-input>
							</el-form-item>
							<el-form-item label="产品描述URL">
								<el-input v-model.trim="form.desc_url" placeholder="需加入https://或http://前缀"></el-input>
							</el-form-item>
							<el-form-item label="来源URL">
								<el-input v-model.trim="form.origin_url" placeholder="需加入https://或http://前缀"></el-input>
							</el-form-item>
							<el-form-item label="图片URL">
								<el-input v-model.trim="form.picture_url" placeholder="需加入https://或http://前缀"></el-input>
							</el-form-item>
							<el-form-item label="备注">
								<el-input v-model.trim="form.remark"></el-input>
							</el-form-item>
							<el-form-item label="产品图片">
								<el-upload class="upload-demo" drag action="" :file-list="fileList" :on-remove="handleRemove" :auto-upload="false" :on-change="changeFile" :limit="5" multiple>
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
				<el-tab-pane label="批量上传" name="second">
					<template v-if="message === 'second'">
						<el-form ref="form" :model="form" label-width="100px">
							<el-form-item label="批量上传产品">
								<el-upload class="upload-demo" drag action="" :on-exceed="exceed" :file-list="batchProduct" :on-remove="handleRemoveBatch" :auto-upload="false" :on-change="changeBatch" :before-upload="beforeAvatarUpload" :limit="1">
									<i class="el-icon-upload"></i>
									<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
									<div class="el-upload__tip" slot="tip">只能上传xls/xlsx格式文件</div>
								</el-upload>
								<a :href="$axios.defaults.baseURL +'/batch_template.xls'">模板下载</a>
							</el-form-item>
						</el-form>
						<el-form ref="form" :model="form" label-width="100px">
							<el-form-item>
								<el-button type="primary" @click="uploadproduct">上传文件</el-button>
							</el-form-item>
						</el-form>
					</template>
				</el-tab-pane>
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
					title: '',
					desc: '',
					desc_url: '',
					price: '',
					user: '',
					length: '',
					width: '',
					height: '',
					weight: '',
					package_length: '',
					package_width: '',
					package_height: '',
					package_weight: '',
					origin_url: '',
					picture_url: '',
					remark: '',
					supplier_id: '',
					platform: []
				},
				rules: {
					sourceurl: [{
						required: true,
						message: '请输入来源url',
						trigger: 'blur'
					}],
					user: [{
						required: true,
						message: '请输入开发人员',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '请输入标题',
						trigger: 'blur'
					}],
					sku: [{
						required: true,
						message: '请输入sku',
						trigger: 'blur'
					}],
					price: [{
						required: true,
						message: '请输入申报价格',
						trigger: 'blur'
					}],
					length: [{
						required: true,
						message: '请输入长度',
						trigger: 'blur'
					}],
					width: [{
						required: true,
						message: '请输入宽度',
						trigger: 'blur'
					}],
					height: [{
						required: true,
						message: '请输入高度',
						trigger: 'blur'
					}],
					weight: [{
						required: true,
						message: '请输入重量',
						trigger: 'blur'
					}],
				},
				radio: undefined,
				category_id: [],
				options: [],
				cur_page: 1,
				supplierOptions: [],
				supplier_page: 1,
				supplier_total: 0,
				platform: [],
				attrs: [{
					group: '',
					vals: []
				}],
				attrsAdd: {
					group: '',
					vals: []
				},
				isWish: false,
				iseBay: false
			}
		},
		beforeRouteEnter: (to, from, next) => {
			console.log('Hi,i am comming')
			next()
		},
		created() {
            this.getData();
            this.getSuppliers()
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
                    	for(let i=0; i < Math.ceil(res.data.count / 20); i++) {
                    		this.getCatetoryLoop(i+1)
                    	}
                    }
                    console.log(this.options)
                }).catch((res) => {
                	console.log('error')
                })
            },
            getCatetoryLoop(page) {
                this.$axios.get( '/categories?page='+page, {
                    headers: {'Authorization': localStorage.getItem('token')}
                },
                ).then((res) => {
                    if(res.data.code == 200) {
                        this.options = this.options.concat(this.getCategoryTree(res.data.data,0))
                        // this.total = res.data.count
                    }
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
			getSuppliers() {
				this.$axios.get('/suppliers?page=' + this.supplier_page, {
					headers: {'Authorization': localStorage.getItem('token')}
				}).then((res) => {
					if(res.data.code==200) {
						this.supplierOptions = this.supplierOptions.concat(res.data.data)
						this.supplier_total = res.data.count
					}
				}).catch((res) => {

				})
			},
			submitUpload(content) {
				this.formData = new FormData();
				formData.append('file', content.file)
			},
			onSubmit(formName) {
				if(this.category_id.length == 0 || this.form.name == '') {
					this.$message.error('请填写必填信息')
					return
				}
				// let arr = []
				// arr.push(this.form.length, this.form.width, this.form.height, this.form.weight, this.form.price, this.form.package_length, this.form.package_width, this.form.package_height, this.form.package_weight)
				// if(this.judge_addproduct(arr)){
				// }else{
				// 	return
				// }
				
				let formData = new FormData()
				console.log(this.$refs[formName].validate())
				this.$refs[formName].validate((valid) => {
					if(valid) {
						// this.submitDisabled = true
						// setTimeout(() => {
						// 	this.submitDisabled = false
						// }, 10000)
						// if (this.fileList.length == 0){
						// 	this.$message.error('请上传产品图片')
						// 	return false
						// }
						let attr_group = []
						let attr_vals = []
						this.attrs.forEach((data) => {
							attr_group.push(data.group)
							attr_vals.push(data.vals)
						})
						// let i = 0
						attr_vals.forEach((data) => {
							formData.append('product[attr_vals][]', String(data))
						})
						attr_group.forEach((data) => {
							formData.append('product[attr_group][]', data)
						})
						// formData.append('product[attr_vals][]', ['黑色','白色'])
						// formData.append('product[attr_group][]', '颜色')
						// formData.append('product[attr_vals][]', ['1','2','3'])
						// formData.append('product[attr_group][]', '尺寸')
						formData.append('product[name]', this.form.name)
						formData.append('product[title]', this.form.title)
						formData.append('product[category_id]', this.category_id[this.category_id.length - 1])
						formData.append('product[desc]', this.form.desc)
						formData.append('product[desc_url]', this.form.desc_url)
						formData.append('product[package_length]', this.form.package_length)
						formData.append('product[package_width]', this.form.package_width)
						formData.append('product[package_height]', this.form.package_height)
						formData.append('product[package_weight]', this.form.package_weight)
						formData.append('product[length]', this.form.length)
						formData.append('product[width]', this.form.width)
						formData.append('product[height]', this.form.height)
						formData.append('product[weight]', this.form.weight)
						formData.append('product[price]', this.form.price)
						formData.append('product[origin_url]', this.form.origin_url)
						formData.append('product[picture_url]', this.form.picture_url)
						formData.append('product[supplier_id]', this.form.supplier_id)
						formData.append('product[remark]', this.form.remark)
						formData.append('product[wish]', this.isWish)
						formData.append('product[ebay]', this.iseBay)
						this.fileList.forEach((item) => {
							formData.append('product[pictures][]', item.raw)
						})
						// console.log(this.fileList)
						// formData.append('name', this.form.name)
						// formData.append('title', this.form.title)
						// formData.append('category_id', this.category_id.pop())
						// formData.append('desc', this.form.desc)
						// formData.append('desc_url', this.form.desc_url)
						// formData.append('sku', this.form.sku)
						// formData.append('package_length', this.form.package_length)
						// formData.append('package_width', this.form.package_width)
						// formData.append('package_height', this.form.package_height)
						// formData.append('package_weight', this.form.package_weight)
						// formData.append('length', this.form.length)
						// formData.append('width', this.form.width)
						// formData.append('height', this.form.height)
						// formData.append('weight', this.form.weight)
						// formData.append('price', this.form.price)
						// formData.append('origin_url', this.form.origin_url)
						// formData.append('picture_url', this.form.picture_url)
						// formData.append('remark', this.form.remark)
						let config = {
							headers: {
								'Authorization': localStorage.getItem('token')
							}
						}
						this.$axios.post('/products', formData, config).then((res) => {
							if(res.data.code == 200) {
								this.$message.success('提交成功，等待管理员审核！');
								this.$refs['form'].resetFields()
								this.form.length = ''
								this.form.width = ''
								this.form.height = ''
								this.fileList = []
								this.category_id = []
								this.options = []
								this.$router.push('/productmanage')
							}
							this.submitDisabled = false
						}).catch((res) => {
							console.log('err')
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
			},
			onInfinite_suppliers(obj) {
				if((this.supplier_page * 20) < this.supplier_total) {
					this.supplier_page += 1
					this.getSuppliers(obj.loaded)
				} else {
					obj.complete()
					console.log(obj.complete())
				}
			},
			orderAdd() {
				this.attrs.push(this.attrsAdd)
				this.attrsAdd= {
					group: '',
					vals: []
				}
			},
			orderDel() {
				if(this.attrs.length == 1) {
					this.$message.error('至少保留一项哦！')
					return
				}
				this.attrs.pop()
			}
		},
		components: {
			"infinite-loading": VueInfiniteLoading
		}
	}
</script>