<template>
    <div class="wrapper">
        <v-head :message_count="message_count" :notifications="notifications" :clearInte="clearInte"></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view :getMessageCount="getMessageCount" :changeMessageCount="changeMessageCount" ></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    import vTags from './Tags.vue';
    import bus from './bus';
    import notificatinImg from "@/assets/close.png"
    export default {
        data(){
            return {
                tagsList: [],
                collapse: false,
                notifications:[],
                message_count: 0,
                myVal: undefined
            }
        },
        components:{
            vHead, vSidebar, vTags
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
            this.getMessageTimer()
        },
        methods:{
            changeMessageCount(count){
                this.message_count = count
            },
            getMessageTimer() {
                this.getMessageCount()
                this.myVal = setInterval(this.getMessageCount, 1000*30)
            },
            clearInte() {
                clearInterval(this.myVal)
            },
            popMes(index,id) {
                this.notifications[index].close()
                this.notifications[index] = undefined
                this.message_count -= 1
                let temp_id = []
                temp_id.push(id)
                this.$axios.get('/users/read_notification?id[]=' + temp_id,{
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    },
                }).then((res) => {
                    if(res.data.code = 200) {

                    }
                }).catch((res) => {
                    console.log('error')
                })
            },
            getMessageCount() {
                let mesId =  JSON.parse(localStorage.getItem('notifyid')) || []
                this.$axios.get('/users/notifications', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    },
                }).then((res) => {
                    if(res.data.code == 200) {
                        this.message_count = res.data.data.length
                        res.data.data.forEach((data, index) => {
                            let offsettemp = 100 + 70 * index
                            if(mesId.indexOf(data.id) == -1) {
                               this.notifications.push(this.$notify({
                                    title: '您有新的消息',
                                    dangerouslyUseHTMLString: true,
                                    offset: offsettemp,
                                    message: data.message,
                                    onClick: this.popMes.bind(null,this.notifications.length,data.id),
                                    customClass: "testlzh",
                                    duration: 3000,
                                    showClose: false
                                    // onClose: this.popMes.bind(data.id)
                                })) 
                                mesId.push(data.id)
                                localStorage.removeItem('notifyid')
                                localStorage.setItem('notifyid', JSON.stringify(mesId))  
                            }
                        })
                    }
                })
            }
        }
    }
</script>
<style>
    .move-enter{
        opacity: 0;
    }
    .move-enter-active{
        transition: opacity .5s;
    }
    .move-leave{
        opacity: 1
    }
    .move-leave-active{
        opacity: 0;
        transition: opacity .5s
    }
</style>
