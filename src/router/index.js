import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/common/Home.vue'
import Dashboard from '@/components/page/Dashboard.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
            index: 'dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/addProduct',
                    component: resolve => require(['../components/page/developer/AddProduct.vue'], resolve),
                    meta: { title: '添加产品' }
                },
                {
                    path: '/productmanage',
                    component: resolve => require(['../components/page/developer/ProductManage.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                {
                    path: '/productmanageOper',
                    component: resolve => require(['../components/page/developer/ProductManage.vue'], resolve),
                    meta: { title: '产品管理(运营)' }
                },
                {
                    path: '/productmanageeBay',
                    component: resolve => require(['../components/page/developer/ProductManageEBAY.vue'], resolve),
                    meta: { title: 'eBay产品' }
                },
                {
                    path: '/checkebaymanage',
                    component: resolve => require(['../components/page/operationaler/ProductCheckEBAY.vue'], resolve),
                    meta: { title: 'eBay待审核' }
                },
                {
                    path: '/productmanageeBayOper',
                    component: resolve => require(['../components/page/developer/ProductManageEBAY.vue'], resolve),
                    meta: { title: 'eBay产品(运营)' }
                },
                {
                    path: '/productmanagewish',
                    component: resolve => require(['../components/page/developer/ProductManageWISH.vue'], resolve),
                    meta: { title: 'wish产品' }
                },
                {
                    path: '/checkwishmanage',
                    component: resolve => require(['../components/page/operationaler/ProductCheckWISH.vue'], resolve),
                    meta: { title: 'wish待审核' }
                },
                {
                    path: '/productmanagewishOper',
                    component: resolve => require(['../components/page/developer/ProductManageWISH.vue'], resolve),
                    meta: { title: 'wish产品(运营)' }
                },
                {
                    path: '/checkproductmanage',
                    component: resolve => require(['../components/page/developer/CheckProductManage.vue'], resolve),
                    meta: { title: '审核新建产品' }
                },
                {
                    path: '/applyproductmanage',
                    component: resolve => require(['../components/page/developer/ApplyProductManage.vue'], resolve),
                    meta: { title: '审核申请查看' }
                },
                {
                    path: '/subjectsmanage',
                    component: resolve => require(['../components/page/developer/SubjectsManage.vue'], resolve),
                    meta: { title: '主体管理' }
                },
                {
                    path: '/addSamples',
                    component: resolve => require(['../components/page/purchaser/AddSamples.vue'], resolve),
                    meta: { title: '添加样品' }
                },
                {
                    path: '/samplesManage',
                    component: resolve => require(['../components/page/purchaser/SamplesManage.vue'], resolve),
                    meta: { title: '样品管理' }
                },
                {
                    path: '/samplesinManage',
                    component: resolve => require(['../components/page/purchaser/SamplesInManage.vue'], resolve),
                    meta: { title: '入库管理' }
                },
                {
                    path: '/returnsamplesManage',
                    component: resolve => require(['../components/page/purchaser/ReturnSamplesManage.vue'], resolve),
                    meta: { title: '归还样品' }
                },
                {
                    path: '/sampleoutsManage',
                    component: resolve => require(['../components/page/purchaser/SampleOutsManage.vue'], resolve),
                    meta: { title: '审核借样' }
                },
                {
                    path: '/applysampleoutsManage',
                    component: resolve => require(['../components/page/purchaser/ApplySampleOutsManage.vue'], resolve),
                    meta: { title: '申请借样' }
                },
                {
                    path: '/addClassify',
                    component: resolve => require(['../components/page/developer/AddClassify.vue'], resolve),
                    meta: { title: '添加分类' }
                },
                {
                    path: '/classifylistManage',
                    component: resolve => require(['../components/page/developer/ClassifyListManage.vue'], resolve),
                    meta: { title: '分类列表' }
                },
                {
                    path: '/classifyManage',
                    component: resolve => require(['../components/page/developer/ClassifyManage.vue'], resolve),
                    meta: { title: '分类管理' }
                },
                {
                    path: '/addSuppliers',
                    component: resolve => require(['../components/page/purchaser/AddSuppliers.vue'], resolve),
                    meta: { title: '添加供应商' }
                },
                {
                    path: '/suppliersManage',
                    component: resolve => require(['../components/page/purchaser/SuppliersManage.vue'], resolve),
                    meta: { title: '供应商管理' }
                },
                {
                    path: '/addusers',
                    component: resolve => require(['../components/page/admin/AddUsers.vue'], resolve),
                    meta: { title: '创建用户' }
                },
                {
                    path: '/usersmanage',
                    component: resolve => require(['../components/page/admin/UsersManage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/addroles',
                    component: resolve => require(['../components/page/admin/AddRoles.vue'], resolve),
                    meta: { title: '创建角色' }
                },
                {
                    path: '/rolesmanage',
                    component: resolve => require(['../components/page/admin/RolesManage.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/addbrands',
                    component: resolve => require(['../components/page/purchaser/AddBrands.vue'], resolve),
                    meta: { title: '新建知识产权' }
                },
                {
                    path: '/brandsmanage',
                    component: resolve => require(['../components/page/purchaser/BrandsManage.vue'], resolve),
                    meta: { title: '知识产权管理' }
                },
                {
                    path: '/addreviewers',
                    component: resolve => require(['../components/page/outsider/AddReviewers.vue'], resolve),
                    meta: { title: '新建测评任务' }
                },
                {
                    path: '/reviewersmanage',
                    component: resolve => require(['../components/page/outsider/ReviewersManage.vue'], resolve),
                    meta: { title: '测评任务管理' }
                },
                {
                    path: '/reviewersinfomanage',
                    component: resolve => require(['../components/page/outsider/ReviewersInfoManage.vue'], resolve),
                    name: 'Reviewersinfomanage',
                    meta: { title: '测评记录管理' }
                },
                {
                    path: '/reviewersinfomanagefina',
                    component: resolve => require(['../components/page/outsider/ReviewersInfoManage.vue'], resolve),
                    name: 'Reviewersinfomanage',
                    meta: { title: '测评报表' }
                },
                {
                    path: '/fansmanage',
                    component: resolve => require(['../components/page/outsider/FansManage.vue'], resolve),
                    meta: { title: '粉丝管理' }
                },
                {
                    path: '/designmanage',
                    component: resolve => require(['../components/page/designer/DesignManage.vue'], resolve),
                    meta: { title: '制图管理' }
                },
                {
                    path: '/addPurchase',
                    component: resolve => require(['../components/page/purchaser/AddPurchase.vue'], resolve),
                    meta: { title: '新建采购计划' }
                },
                {
                    path: '/purchaseManage',
                    component: resolve => require(['../components/page/purchaser/purchaseManage.vue'], resolve),
                    meta: { title: '采购计划管理' }
                },
                {
                    path: '/purchaseManageOp',
                    component: resolve => require(['../components/page/purchaser/purchaseManage.vue'], resolve),
                    meta: { title: '采购计划管理' }
                },
                {
                    path: '/purchaseOrdersManage',
                    component: resolve => require(['../components/page/purchaser/purchaseOrdersManage.vue'], resolve),
                    meta: { title: '采购订单管理' }
                },
                {
                    path: '/purchasePayManage',
                    component: resolve => require(['../components/page/purchaser/PurchasePayManage.vue'], resolve),
                    meta: { title: '采购付款管理' }
                },
                {
                    path: '/purchasePayManageFina',
                    component: resolve => require(['../components/page/purchaser/PurchasePayManage.vue'], resolve),
                    meta: { title: '采购单付款管理' }
                },
                {
                    path: '/addStoreIns',
                    component: resolve => require(['../components/page/storehouser/AddStoresIns.vue'], resolve),
                    meta: { title: '新建入库单' }
                },
                {
                    path: '/inboundManage',
                    component: resolve => require(['../components/page/storehouser/inboundManage.vue'], resolve),
                    meta: { title: '入库订单管理' }
                },
                {
                    path: '/cargosManage',
                    component: resolve => require(['../components/page/storehouser/cargosManage.vue'], resolve),
                    meta: { title: '库存管理' }
                },
                {
                    path: '/addDelivery',
                    component: resolve => require(['../components/page/operationaler/addDelivery.vue'], resolve),
                    meta: { title: '新建发货计划' }
                },
                {
                    path: '/outboundManage',
                    component: resolve => require(['../components/page/storehouser/outboundManage.vue'], resolve),
                    meta: { title: '发货计划管理' }
                },
                {
                    path: '/notifications',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: '未读消息' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/',
            type: 'home',
            name: 'home',
            redirect: '/dashboard',
            index: 'dashboard',
            component: Dashboard,
            children: [
                {
                    path: '/dashboard',
                    index: 'dashboard',
                    name: '首页',
                    leaf: true, // 只有一个节点
                    menuShow: true,
                    icon: 'el-icon-lx-home',
                    // children: [
                    //     {
                    //         path: '/designmanage',
                    //         component: resolve => require(['../components/page/DesignManage.vue'], resolve),
                    //         name: '制图任务管理',
                    //         menuShow: true,
                    //     }
                    // ]
                }
            ]
        },
        {
            path: '/developDepartment',
            type: 'develop',
            name: 'develop',
            // component: Home,
            redirect: '/addClassify',
            index: 'addClassify',
            children: [
                {
                    path: '/addClassify',
                    index: 'addClassify',
                    name: '分类管理',
                    menuShow: true,
                    icon: 'el-icon-lx-qrcode',
                    children: [
                        {
                            path: '/addClassify',
                            name: '添加分类',
                            index: 'addClassify',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/classifylistManage',
                            index: 'classifylistManage',
                            name: '分类列表',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/classifyManage',
                            index: 'classifyManage',
                            name: '分类管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
                {
                    path: '/addProduct',
                    index: 'addProduct',
                    name: '产品管理',
                    menuShow: true,
                    icon: 'el-icon-lx-cascades',
                    children: [
                        {
                            path: '/addProduct',
                            index: 'addProduct',
                            name: '添加产品',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/productmanage',
                            index: 'productmanage',
                            name: '产品管理',
                            menuShow: true,
                            children: [
                                {
                                    path: '/productmanage',
                                    index: 'productmanage',
                                    name: '产品管理',
                                    menuShow: true,
                                    leaf: true,
                                },
                                {
                                    path: '/productmanageeBay',
                                    index: 'productmanageeBay',
                                    name: 'eBay产品管理',
                                    menuShow: true,
                                    leaf: true,
                                },
                                {
                                    path: '/productmanagewish',
                                    index: 'productmanagewish',
                                    name: 'wish产品管理',
                                    menuShow: true,
                                    leaf: true,
                                },
                            ]
                        },
                        {
                            path: '/checkproductmanage',
                            index: 'checkproductmanage',
                            name: '审核新建产品',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/applyproductmanage',
                            index: 'applyproductmanage',
                            name: '审核申请查看',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
                {
                    path: '/subjectsmanage',
                    index: 'subjectsmanage',
                    name: '主体管理',
                    menuShow: true,
                    icon: 'el-icon-lx-read',
                    children: [
                        {
                            path: '/subjectsmanage',
                            index: 'subjectsmanage',
                            name: '主体管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
            ]
        },
        {
            path: '/designDepartment',
            index: 'designmanage',
            type: 'design',
            name: 'design',
            component: Home,
            redirect: 'designmanage',
            children: [
                {
                    path: '/designmanage',
                    index: 'designmanage',
                    name: '制图管理',
                    meta: { title: '制图任务管理' },
                    menuShow: true,
                    icon: 'el-icon-lx-pic',
                    children: [
                        {
                            path: '/designmanage',
                            // component: Design,
                            index: 'designmanage',
                            name: '制图任务管理',
                            meta: { title: '制图任务管理' },
                            menuShow: true,
                            leaf: true,
                        }
                    ]
                }
            ]
        },
        {
            path: '/outsideDepartment',
            index: 'addreviewers',
            type: 'outside',
            name: 'outside',
            // component: Home,
            redirect: 'addreviewers',
            children: [
                {
                    path: '/addreviewers',
                    index: 'addreviewers',
                    name: '测评管理',
                    menuShow: true,
                    icon: 'el-icon-lx-goods',
                    children: [
                        {
                            path: '/addreviewers',
                            // component: Design,
                            index: 'addreviewers',
                            name: '新建测评任务',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/reviewersmanage',
                            // component: Design,
                            index: 'reviewersmanage',
                            name: '测评任务管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/reviewersinfomanage',
                            // component: Design,
                            index: 'reviewersinfomanage',
                            name: '测评记录管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/fansmanage',
                            // component: Design,
                            index: 'fansmanage',
                            name: '粉丝管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                }
            ]
        },
        {
            path: '/operationalDepartment',
            index: 'productmanage',
            type: 'operational',
            name: 'operational',
            // component: Home,
            redirect: 'productmanageOper',
            children: [
                {
                    path: '/productmanageOper',
                    index: 'productmanageOper',
                    name: '产品管理',
                    menuShow: true,
                    icon: 'el-icon-lx-goods',
                    children: [
                        {
                            path: '/productmanageOper',
                            // component: Design,
                            index: 'productmanageOper',
                            name: '所有产品',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/checkebaymanage',
                            index: 'checkebaymanage',
                            name: 'ebay产品',
                            menuShow: true,
                            children: [
                                {
                                    path: '/checkebaymanage',
                                    index: 'checkebaymanage',
                                    name: 'ebay待审核',
                                    menuShow: true,
                                    leaf: true,
                                },
                                {
                                    path: '/productmanageeBayOper',
                                    index: 'productmanageeBayOper',
                                    name: 'ebay产品',
                                    menuShow: true,
                                    leaf: true,
                                },
                            ]
                        },
                        {
                            path: '/checkwishmanage',
                            index: 'checkwishmanage',
                            name: 'wish产品',
                            menuShow: true,
                            children: [
                                {
                                    path: '/checkwishmanage',
                                    index: 'checkwishmanage',
                                    name: 'wish待审核',
                                    menuShow: true,
                                    leaf: true,
                                },
                                {
                                    path: '/productmanagewishOper',
                                    index: 'productmanagewishOper',
                                    name: 'wish产品',
                                    menuShow: true,
                                    leaf: true,
                                },
                            ]
                        },
                    ]
                },
                {
                    path: '/purchaseManageOp',
                    index: 'purchaseManageOp',
                    name: '采购计划管理',
                    menuShow: true,
                    icon: 'el-icon-lx-cart',
                    children: [
                        {
                            path: '/purchaseManageOp',
                            // component: Design,
                            index: 'purchaseManageOp',
                            name: '采购计划',
                            menuShow: true,
                            leaf: true,
                        },
                        // {
                        //     path: '/purchaseManageOp',
                        //     // component: Design,
                        //     index: 'purchaseManageOp',
                        //     name: '出库计划',
                        //     menuShow: true,
                        //     leaf: true,
                        // },
                    ]
                },
                {
                    path: '/addDelivery',
                    index: 'addDelivery',
                    name: '发货计划管理',
                    menuShow: true,
                    icon: 'el-icon-lx-forward',
                    children: [
                        {
                            path: '/addDelivery',
                            // component: Design,
                            index: 'addDelivery',
                            name: '新建发货计划',
                            menuShow: true,
                            leaf: true,
                        },
                        // {
                        //     path: '/outboundManage',
                        //     // component: Design,
                        //     index: 'outboundManage',
                        //     name: '发货计划管理',
                        //     menuShow: true,
                        //     leaf: true,
                        // },
                    ]
                },
            ]
        },
        {
            path: '/purchaseDepartment',
            index: 'addSuppliers',
            type: 'purchase',
            name: 'purchase',
            // component: Home,
            redirect: 'addSuppliers',
            children: [
                {
                    path: '/addSuppliers',
                    index: 'addSuppliers',
                    name: '供应商管理',
                    menuShow: true,
                    icon: 'el-icon-lx-global',
                    children: [
                        {
                            path: '/addSuppliers',
                            // component: Design,
                            index: 'addSuppliers',
                            name: '新建供应商',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/suppliersManage',
                            // component: Design,
                            index: 'suppliersManage',
                            name: '供应商管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
                {
                    path: '/addSamples',
                    index: 'addSamples',
                    name: '样品管理',
                    menuShow: true,
                    icon: 'el-icon-date',
                    children: [
                        {
                            path: '/addSamples',
                            // component: Design,
                            index: 'addSamples',
                            name: '新建样品',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/samplesManage',
                            // component: Design,
                            index: 'samplesManage',
                            name: '样品管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/samplesinManage',
                            // component: Design,
                            index: 'samplesinManage',
                            name: '入库管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/sampleoutsManage',
                            // component: Design,
                            index: 'sampleoutsManage',
                            name: '借样管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
                {
                    path: '/addPurchase',
                    index: 'addPurchase',
                    name: '采购管理',
                    menuShow: true,
                    icon: 'el-icon-lx-cart',
                    children: [
                        // {
                        //     path: '/addPurchase',
                        //     index: 'addPurchase',
                        //     name: '新建采购计划',
                        //     menuShow: true,
                        //     leaf: true,
                        // },
                        {
                            path: '/purchaseManage',
                            index: 'purchaseManage',
                            name: '采购计划管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/purchaseOrdersManage',
                            index: 'purchaseOrdersManage',
                            name: '采购订单管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/purchasePayManage',
                            index: 'purchasePayManage',
                            name: '采购付款管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                }
            ],
        },
        {
            path: '/finacialDepartment',
            index: 'reviewersinfomanagefina',
            type: 'finacial',
            name: 'finacial',
            // component: Home,
            redirect: 'reviewersinfomanagefina',
            children: [
                {
                    path: '/reviewersinfomanagefina',
                    index: 'reviewersinfomanagefina',
                    name: '财务管理',
                    menuShow: true,
                    icon: 'el-icon-lx-recharge',
                    children: [
                        {
                            path: '/reviewersinfomanagefina',
                            index: 'reviewersinfomanagefina',
                            name: '测评报表管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/purchasePayManageFina',
                            index: 'purchasePayManageFina',
                            name: '采购单付款管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                }
            ]
        },
        {
            path: '/adminDepartment',
            index: 'usersmanage',
            type: 'admin',
            name: 'admin',
            // component: Home,
            redirect: 'usersmanage',
            children: [
                {
                    path: '/addusers',
                    index: 'addusers',
                    name: '用户管理',
                    menuShow: true,
                    icon: 'el-icon-lx-group',
                    children: [
                        {
                            path: '/addusers',
                            // component: Design,
                            index: 'addusers',
                            name: '创建用户',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/addroles',
                            // component: Design,
                            index: 'addroles',
                            name: '创建角色',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/usersmanage',
                            // component: Design,
                            index: 'usersmanage',
                            name: '用户管理',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/rolesmanage',
                            // component: Design,
                            index: 'rolesmanage',
                            name: '角色管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                }
            ]
        },
        {
            path: '/storehouseDepartment',
            index: 'inboundManage',
            type: 'storehouse',
            name: 'storehouse',
            // component: Home,
            redirect: 'inboundManage',
            children: [
                {
                    path: '/inboundManage',
                    index: 'inboundManage',
                    name: '入库管理',
                    menuShow: true,
                    icon: 'el-icon-lx-down',
                    children: [
                        {
                            path: '/addStoreIns',
                            // component: Design,
                            index: 'addStoreIns',
                            name: '新建入库单',
                            menuShow: true,
                            leaf: true,
                        },
                        {
                            path: '/inboundManage',
                            // component: Design,
                            index: 'inboundManage',
                            name: '入库管理',
                            menuShow: true,
                            leaf: true,
                        },
                        // {
                        //     path: '/inboundManage',
                        //     // component: Design,
                        //     index: 'inboundManage',
                        //     name: '库存管理',
                        //     menuShow: true,
                        //     leaf: true,
                        // },
                    ]
                },
                {
                    path: '/cargosManage',
                    index: 'cargosManage',
                    name: '库存管理',
                    menuShow: true,
                    icon: 'el-icon-lx-apps',
                    children: [
                        {
                            path: '/cargosManage',
                            // component: Design,
                            index: 'cargosManage',
                            name: '库存管理',
                            menuShow: true,
                            leaf: true,
                        },
                    ]
                },
                {
                    path: '/outboundManage',
                    index: 'outboundManage',
                    name: '出库管理',
                    menuShow: true,
                    icon: 'el-icon-lx-forward',
                    children: [
                        {
                            path: '/outboundManage',
                            index: 'outboundManage',
                            name: '出库计划管理',
                            menuShow: true,
                            leaf: true,
                        },
                        // {
                        //     path: '/inboundManage',
                        //     // component: Design,
                        //     index: 'inboundManage',
                        //     name: '库存管理',
                        //     menuShow: true,
                        //     leaf: true,
                        // },
                    ]
                },
            ]
        },
        // {
        //     path: '/logisticsDepartment',
        //     index: 'reviewersinfomanagefina',
        //     type: 'logistics',
        //     name: 'logistics',
        //     redirect: 'reviewersinfomanagefina',
        //     children: [
        //         {
        //             path: '/reviewersinfomanagefina',
        //             index: 'reviewersinfomanagefina',
        //             name: '物流管理',
        //             menuShow: true,
        //             icon: 'el-icon-lx-forward',
        //             children: [
        //                 {
        //                     path: '/reviewersinfomanagefina',
        //                     index: 'reviewersinfomanagefina',
        //                     name: '发货计划管理',
        //                     menuShow: true,
        //                     leaf: true,
        //                 },
        //             ]
        //         }
        //     ]
        // },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            index: '404',
            leaf: true,
            redirect: '/404'
        }
    ]
})
