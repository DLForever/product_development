<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>

        <!-- <el-menu class="sidebar-el-menu" router :collapse="collapse" ref="leftNavigation">
            <template v-for="(issue,index) in $router.options.routes">
                <template v-if="issue.name === $store.getters.leftNavState">
                    <template v-for="(item,index) in issue.children">
                        <el-submenu v-if="!item.leaf" :index="index+''" v-show="item.menuShow">
                            <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
                            <template v-for="(secondterm, index2) in item.children">
                                <el-submenu v-if="!secondterm.leaf" :index="index2+1+''" v-show="secondterm.menuShow">
                                    <template slot="title"><span slot="title">{{secondterm.name}}</span></template>
                                    <el-menu-item v-for="threeterm in secondterm.children" :key="threeterm.path" :index="threeterm.path" v-if="threeterm.menuShow"
                                        :class="$route.path==threeterm.path?'is-active':''">
                                        <span slot="title">{{threeterm.name}}</span>
                                    </el-menu-item>
                                </el-submenu>
                                <el-menu-item v-else-if="secondterm.leaf" :index="secondterm.path" :class="$route.path==secondterm.path?'is-active':''" v-show="secondterm.menuShow">
                                    <span slot="title">{{secondterm.name}}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                        <el-menu-item v-else-if="item.leaf" :index="item.path" :class="$route.path==item.path?'is-active':''" v-show="item.menuShow">
                            <i :class="item.icon"></i><span slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu> -->

        <!-- <el-menu class="sidebar-el-menu" router :collapse="collapse" ref="leftNavigation">
            <template v-for="(issue,index) in $router.options.routes">
                <template v-if="issue.name === $store.getters.leftNavState">
                    <template v-for="(item,index) in issue.children">
                        <el-submenu v-if="!item.leaf" :index="index+''" v-show="item.menuShow">
                            <template slot="title"><i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
                            <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow"
                                :class="$route.path==term.path?'is-active':''">
                                <i :class="term.icon"></i><span slot="title">{{term.name}}</span>
                            </el-menu-item>

                        </el-submenu>
                        <el-menu-item v-else-if="item.leaf" :index="item.path" :class="$route.path==item.path?'is-active':''" v-show="item.menuShow">
                            <i :class="item.icon"></i><span slot="title">{{item.name}}</span>
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu> -->

        <!-- <el-menu class="sidebar-el-menu" :collapse="collapse" ref="leftNavigation" unique-opened router>
            <template v-for="(item, index) in $router.options.routes">
                <template v-if="item.name">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu> -->
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                collapsed: this.$store.state.collapsed,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '3',
                        title: '分类管理',
                        subs: [{
                            index: 'addClassify',
                            title: '新建分类'
                        },
                        {
                            index: 'classifylistManage',
                            title: '分类列表'
                        },
                        {
                            index: 'classifyManage',
                            title: '分类管理'
                        }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '5',
                        title: '供应商管理',
                        subs: [{
                            index: 'addSuppliers',
                            title: '新建供应商'
                        },
                        {
                            index: 'suppliersManage',
                            title: '供应商管理'
                        }
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '1',
                        title: '产品管理',
                        subs: [{
                            index: 'addProduct',
                            title: '新建产品/变体'
                        },
                        {
                            index: '6',
                            title: '产品管理',
                            subs:[{
                                index: 'productmanage',
                                title: '所有产品'
                            },{
                                index: 'productmanageeBay',
                                title: 'eBay产品'
                            },{
                                index: 'productmanagewish',
                                title: 'wish产品'
                            }]
                        },
                        {
                            index: 'checkproductmanage',
                            title: '审核新建产品'
                        },
                        {
                            index: 'applyproductmanage',
                            title: '审核申请查看'
                        },
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '7',
                        title: '主体管理',
                        subs: [{
                            index: 'subjectsmanage',
                            title: '主体管理'
                        },
                        ]
                    },
                    {
                        icon: 'el-icon-news',
                        index: '2',
                        title: '样品管理',
                        subs: [{
                            index: 'addSamples',
                            title: '新建样品'
                        },
                        {
                            index: 'samplesManage',
                            title: '样品管理'
                        },
                        {
                            index: 'samplesinManage',
                            title: '入库管理'
                        },
                        // {
                        //     index: 'applysampleoutsManage',
                        //     title: '申请借样'
                        // },
                        {
                            index: 'sampleoutsManage',
                            title: '借样管理'
                        },
                        // {
                        //     index: 'returnsamplesManage',
                        //     title: '归还样品'
                        // },
                        ]
                    },
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'table',
                    //     title: '基础表格'
                    // },
                    {
                        icon: 'el-icon-lx-group',
                        index: '4',
                        title: '用户管理',
                        subs: [{
                            index: 'addusers',
                            title: '创建用户'
                        },
                        {
                            index: 'addroles',
                            title: '创建角色'
                        },
                        {
                            index: 'usersmanage',
                            title: '用户管理'
                        },{
                            index: 'rolesmanage',
                            title: '角色管理'
                        }]
                    },
                    {
                        icon: 'el-icon-lx-global',
                        index: '8',
                        title: '知识产权管理',
                        subs: [{
                            index: 'addbrands',
                            title: '新建知识产权'
                        },
                        {
                            index: 'brandsmanage',
                            title: '知识产权管理'
                        }]
                    },
                    {
                        icon: 'el-icon-lx-goods',
                        index: '9',
                        title: '测评管理',
                        subs: [{
                            index: 'addreviewers',
                            title: '新建测评任务'
                        },
                        {
                            index: 'reviewersmanage',
                            title: '测评任务管理'
                        },
                        {
                            index: 'reviewersinfomanage',
                            title: '测评记录管理'
                        },
                        {
                            index: 'fansmanage',
                            title: '粉丝管理'
                        }]
                    },
                    {
                        icon: 'el-icon-lx-pic',
                        index: '10',
                        title: '制图管理',
                        subs: [
                        {
                            index: 'designmanage',
                            title: '制图任务管理'
                        },]
                    },
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: '3',
                    //     title: '表单相关',
                    //     subs: [
                    //         {
                    //             index: 'form',
                    //             title: '基本表单'
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-emoji',
                    //     index: 'icon',
                    //     title: '自定义图标'
                    // },
                    // {
                    //     icon: 'el-icon-lx-warn',
                    //     index: '6',
                    //     title: '错误处理',
                    //     subs: [
                    //         {
                    //             index: 'permission',
                    //             title: '权限测试'
                    //         },
                    //         {
                    //             index: '404',
                    //             title: '404页面'
                    //         }
                    //     ]
                    // }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        methods: {
            defaultLeftNavOpened() {
                let cur_path = this.$route.path
                let routers = this.$router.options.routes
                let subMenuIndex = '', needOpenSubmenu = false
                for (let i = 0; i < routers.length; i++) {
                    let children = routers[i].children
                    if (children) {
                        for (let j = 0; j < children.length; j++) {
                            // console.log(111)
                            // console.log(children[j].path)
                            // console.log(222)
                            // console.log(cur_path)
                            if(children[j].path === cur_path) {
                                break
                            }
                            // 如果还有子菜单
                            if (children[j].children && !children[j].leaf) {
                                // console.log('children')
                                // console.log(children)
                                // console.log('leaf')
                                let grandChildren = children[j].children
                                for (let z = 0; z < grandChildren.length; z++) {
                                    subMenuIndex = j
                                    needOpenSubmenu = true
                                    // break
                                    if (grandChildren[z].children && !grandChildren[z].leaf) {
                                        subMenuIndex = z
                                        needOpenSubmenu = true
                                        console.log(grandChildren[z].children)
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.$refs['leftNavigation'] && needOpenSubmenu) {
                    this.$refs['leftNavigation'].open(subMenuIndex) //打开子菜单
                }
            }
        },
        mounted() {
            this.defaultLeftNavOpened()
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
