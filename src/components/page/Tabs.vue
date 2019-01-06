<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 未读消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- <div class="handle-box">
                <el-button type="primary" @click="handleRead">标记已读</el-button>
            </div>
            <br><br>
            <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="username" label="用户名" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="姓名" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            </el-table>
            <div class="pagination">
                <el-pagination v-if="paginationShow" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pagesize" layout="prev, pager, next" :total="totals">
                </el-pagination>
            </div>
 -->
            <el-tabs v-model="message">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="date" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.$index,  scope.row)">标为已读</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- <div class="handle-row">
                        <el-button type="primary">全部标为已读</el-button>
                    </div> -->
                </el-tab-pane>
                <!-- <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane> -->
            </el-tabs>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'tabs',
        data() {
            return {
                message: 'first',
                showHeader: false,
                multipleSelection: [],
                tableData: [],
                paginationShow: true,
                cur_page: 1,
                pagesize: 20,
                totals: 0,
                unread:[],
                unread2:[{
                    date: '',
                    title: '',
                    id: ''
                }],
                // unread: [{
                //     date: '2018-04-19 20:00:00',
                //     title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护',
                // },{
                //     date: '2018-04-19 21:00:00',
                //     title: '今晚12点整发大红包，先到先得',
                // }],
                read: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }],
                recycle: [{
                    date: '2018-04-19 20:00:00',
                    title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
                }]
            }
        },
        props:{
            changeMessageCount:Function
        },
        created() {
            this.getMessage();
        },
        methods: {
            // handleRead(index) {
            //     const item = this.unread.splice(index, 1);
            //     console.log(item);
            //     this.read = item.concat(this.read);
            // },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$axios.get( '/users/notifications?page='+this.cur_page, {
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
            handleDel(index) {
                const item = this.read.splice(index, 1);
                this.recycle = item.concat(this.recycle);
            },
            handleRestore(index) {
                const item = this.recycle.splice(index, 1);
                this.read = item.concat(this.read);
            },
            getMessage() {
                this.$axios.get('/users/notifications', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    },
                }).then((res) => {
                    if(res.data.code == 200) {
                        res.data.data.forEach((data, index) => {
                            this.unread.push(this.unread2)
                            this.unread[index].date = data.created_at.substr(0, 19)
                            this.unread[index].title = data.message
                            this.unread[index].id = data.id
                            this.unread2 = {
                                date: '',
                                title: '',
                                id: ''
                            }
                        })
                    }
                })
            },
            handleRead(index, row) {
                let id = []
                id.push(row.id)
                this.$axios.get('/users/read_notification?id[]=' + id,{
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    },
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.unread.splice(index, 1);
                        this.changeMessageCount(this.unread.length)
                        this.$message.success('已读消息')
                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            },
            data() {
                return this.tableData.filter((d) => {
                    return d;
                    let is_del = false;
                })
            }
        }
    }

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
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
</style>

