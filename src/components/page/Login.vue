<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">WZS管理系统</div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-checkbox v-model="checked">记住密码</el-checkbox>
                <br><br>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                checked: true
            }
        },
        mounted() {
            this.getCookie()
        },
        methods: {
            submitForm2(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',this.ruleForm.name);
                        this.$router.push('/');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            submitForm(formName) {
                if(this.checked == true) {
                    this.setCookie(this.ruleForm.username, this.ruleForm.password, 7)
                }else {
                    this.clearCookie()
                }
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$axios.post('/authentication', {
                                username: this.ruleForm.username,
                                password: this.ruleForm.password
                        },
                        ).then((res) => {
                            if (res.data.code === 200) {
                                localStorage.setItem('ms_username', res.data.data.name)
                                localStorage.setItem('token', res.data.data.token)
                                localStorage.setItem('notifyid', JSON.stringify([])) //保存消息id到本地
                                if (res.data.data.roles.length != 0) {
                                    localStorage.setItem('roles', res.data.data.roles[0].name)
                                } else {
                                    localStorage.setItem('roles', '')
                                }
                                this.$router.push('/');
                            }
                        }).catch((res) => {
                            console.log(res)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //设置cookie
            setCookie(c_name, c_pwd, exdays) {
                let exdate = new Date()
                exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 100 * exdays)
                window.document.cookie = "username" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString()
                window.document.cookie = "userPwd" + "=" + c_pwd + ";path/;expires=" + exdate.toGMTString()
            },
            //读取cookie
            getCookie: function() {
                if (document.cookie.length > 0) {
                    let arr = document.cookie.split(';')
                    for(let i=0; i < arr.length; i++) {
                        let arr2 = arr[i].split('=')
                        if(arr2[0] == 'username') {
                            this.ruleForm.username = arr2[1]
                        }else if(arr2[0] == ' userPwd') {
                            this.ruleForm.password = arr2[1]
                        }
                    }
                }
            },
            //清除cookie
            clearCookie: function() {
                this.setCookie('', '', -1)
            },
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
        background-image: url(../../../static/img/login-bg.jpg);
        background-size: 100%;
    }
    .ms-title{
        width:100%;
        line-height: 50px;
        text-align: center;
        font-size:20px;
        color: #fff;
        border-bottom: 1px solid #ddd;
    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:350px;
        margin:-190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255,255,255, 0.3);
        overflow: hidden;
    }
    .ms-content{
        padding: 30px 30px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
        margin-bottom: 10px;
    }
    .login-tips{
        font-size:12px;
        line-height:30px;
        color:#fff;
    }
</style>