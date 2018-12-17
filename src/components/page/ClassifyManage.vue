<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item><i class="el-icon-date"></i> 分类管理</el-breadcrumb-item>
				<el-breadcrumb-item>删除分类</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<el-tabs v-model="message">
				<el-tab-pane label="删除分类" name="first">
					<div class="form-box">
						<el-form :rules="rules" label-width="95px">
							<el-form-item label="选择分类">
                        		<el-cascader :options="options" v-model="category_id" expand-trigger="hover" change-on-select></el-cascader>
                    		</el-form-item>
							<el-form-item>
								<el-button type="danger" @click="deleteCategory" :disabled="submitDisabled">删除</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
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
				batchList: [],
				cur_page: 1,
				options: [],
				category_id: [],
				classifyName: '',
				rules: {
					name: [{
						required: true,
						message: '请输入分类名称',
						trigger: 'blur'
					}],
				},
			}
		},
		beforeRouteEnter: (to, from, next) => {
			console.log('Hi,i am comming')
			next()
		},
		created() {
            this.getData();
        },
		methods: {
			getData() {
                this.options = []
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
                    console.log(res.data.data)
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
			   	let tmp = categories.filter((s) => {
			    	return s.parent_id == id
			   		})
			    return tmp.map((s) => {
			    	return {value:s.id,label:s.name,children:this.getTree(categories,s.id)}
			   })
			},
            deleteCategory() {
                if(this.category_id.length == 0) {
                    this.$message.error('请选择分类')
                    return
                }
                this.$axios.delete('/categories/' + this.category_id.pop(), {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.$message.success('删除成功！')
                        this.category_id = []
                        this.getData()
                    }
                }).catch((res) => {

                })
            },
			submitUpload(content) {
				this.formData = new FormData();
				formData.append('file', content.file)
			},
			onSubmit(formName) {
				if(this.classifyName == '') {
					this.$message.error('请输入分类名称')
					return
				}
				this.submitDisabled = true
				// setTimeout(() => {
				// 	this.submitDisabled = false
				// }, 10000)
				let params= {
					category_id: this.category_id.pop(),
					name: this.classifyName
				}
				let config = {
					headers: {
						'Authorization': localStorage.getItem('token')
					}
				}
				this.$axios.post('/categories', params, config).then((res) => {
					if(res.data.code == 200) {
						this.category_id = []
						this.classifyName = ''
						this.$message.success('提交成功！')
						this.options = []
						this.getData()
						// this.$router.push('/productmanage')
					}
					this.submitDisabled = false
				}).catch((res) => {
					this.submitDisabled = false
					console.log('err')
				})
			},
			uploadproduct() {
				if(this.batchList.length == 0) {
					this.$message.error("请选择xlsx文件")
					return
				}
				const extension = this.batchList[0].name.split('.')[1] === 'xls'
				const extension2 = this.batchList[0].name.split('.')[1] === 'xlsx'
				const isLt2M = this.batchList[0].size / 1024 / 1024 < 10
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
				this.batchList.forEach((item) => {
					formData.append('file', item.raw)
				})
				this.$axios.post('/products/batch', formData, config).then((res) => {
					if(res.data.code == 200) {
						this.$message.success("提交成功")
						this.batchList = []
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
			changeBatch(file) {
				this.batchList.push(file)
			},
			handleRemoveBatch(a, b) {
				this.batchList = b
			},
			exceed() {
				this.$message.error("对不起，超过个数限制")
			}
		}
	}
</script>