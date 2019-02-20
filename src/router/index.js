import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
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
                    component: resolve => require(['../components/page/AddProduct.vue'], resolve),
                    meta: { title: '添加产品' }
                },
                {
                    path: '/productmanage',
                    component: resolve => require(['../components/page/ProductManage.vue'], resolve),
                    meta: { title: '产品管理' }
                },
                {
                    path: '/productmanageeBay',
                    component: resolve => require(['../components/page/ProductManageEBAY.vue'], resolve),
                    meta: { title: 'eBay产品' }
                },
                {
                    path: '/productmanagewish',
                    component: resolve => require(['../components/page/ProductManageWISH.vue'], resolve),
                    meta: { title: 'wish产品' }
                },
                {
                    path: '/checkproductmanage',
                    component: resolve => require(['../components/page/CheckProductManage.vue'], resolve),
                    meta: { title: '审核新建产品' }
                },
                {
                    path: '/applyproductmanage',
                    component: resolve => require(['../components/page/ApplyProductManage.vue'], resolve),
                    meta: { title: '审核申请查看' }
                },
                {
                    path: '/subjectsmanage',
                    component: resolve => require(['../components/page/SubjectsManage.vue'], resolve),
                    meta: { title: '主体管理' }
                },
                {
                    path: '/addSamples',
                    component: resolve => require(['../components/page/AddSamples.vue'], resolve),
                    meta: { title: '添加样品' }
                },
                {
                    path: '/samplesManage',
                    component: resolve => require(['../components/page/SamplesManage.vue'], resolve),
                    meta: { title: '样品管理' }
                },
                {
                    path: '/samplesinManage',
                    component: resolve => require(['../components/page/SamplesInManage.vue'], resolve),
                    meta: { title: '入库管理' }
                },
                {
                    path: '/returnsamplesManage',
                    component: resolve => require(['../components/page/ReturnSamplesManage.vue'], resolve),
                    meta: { title: '归还样品' }
                },
                {
                    path: '/sampleoutsManage',
                    component: resolve => require(['../components/page/SampleOutsManage.vue'], resolve),
                    meta: { title: '审核借样' }
                },
                {
                    path: '/applysampleoutsManage',
                    component: resolve => require(['../components/page/ApplySampleOutsManage.vue'], resolve),
                    meta: { title: '申请借样' }
                },
                {
                    path: '/addClassify',
                    component: resolve => require(['../components/page/AddClassify.vue'], resolve),
                    meta: { title: '添加分类' }
                },
                {
                    path: '/classifylistManage',
                    component: resolve => require(['../components/page/ClassifyListManage.vue'], resolve),
                    meta: { title: '分类列表' }
                },
                {
                    path: '/classifyManage',
                    component: resolve => require(['../components/page/ClassifyManage.vue'], resolve),
                    meta: { title: '分类管理' }
                },
                {
                    path: '/addSuppliers',
                    component: resolve => require(['../components/page/AddSuppliers.vue'], resolve),
                    meta: { title: '添加供应商' }
                },
                {
                    path: '/suppliersManage',
                    component: resolve => require(['../components/page/SuppliersManage.vue'], resolve),
                    meta: { title: '供应商管理' }
                },
                {
                    path: '/addusers',
                    component: resolve => require(['../components/page/AddUsers.vue'], resolve),
                    meta: { title: '创建用户' }
                },
                {
                    path: '/usersmanage',
                    component: resolve => require(['../components/page/UsersManage.vue'], resolve),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/addroles',
                    component: resolve => require(['../components/page/AddRoles.vue'], resolve),
                    meta: { title: '创建角色' }
                },
                {
                    path: '/rolesmanage',
                    component: resolve => require(['../components/page/RolesManage.vue'], resolve),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/addbrands',
                    component: resolve => require(['../components/page/AddBrands.vue'], resolve),
                    meta: { title: '新建知识产权' }
                },
                {
                    path: '/brandsmanage',
                    component: resolve => require(['../components/page/BrandsManage.vue'], resolve),
                    meta: { title: '知识产权管理' }
                },
                {
                    path: '/addreviewers',
                    component: resolve => require(['../components/page/AddReviewers.vue'], resolve),
                    meta: { title: '新建测评任务' }
                },
                {
                    path: '/reviewersmanage',
                    component: resolve => require(['../components/page/ReviewersManage.vue'], resolve),
                    meta: { title: '测评任务管理' }
                },
                {
                    path: '/reviewersinfomanage',
                    component: resolve => require(['../components/page/ReviewersInfoManage.vue'], resolve),
                    name: 'Reviewersinfomanage',
                    meta: { title: '测评记录管理' }
                },
                {
                    path: '/fansmanage',
                    component: resolve => require(['../components/page/FansManage.vue'], resolve),
                    meta: { title: '粉丝管理' }
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
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
