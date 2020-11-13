<template>
  <el-container direction="vertical" style="height:100%; ">
    <vHeadNav></vHeadNav>
    <el-container direction="horizontal" style="height: 400px">
      <el-scrollbar class="myMenu">
        <MenuNav style="height: 100%"></MenuNav>
      </el-scrollbar>
      <el-container direction="vertical">
        <TabNav></TabNav>
        <el-scrollbar style="height:100%">
          <div class="content4">
            <keep-alive>
              <router-view ref="baseContent" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view ref="baseContent" v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </el-scrollbar>
      </el-container>
    </el-container>
  </el-container>
</template>
<style scoped>
  .content4 {
    margin: 10px;
    position:relative;
  }
  .myMenu {
    background: -webkit-linear-gradient(90deg, rgb(11, 8, 10), rgb(16, 40, 63));
    background: linear-gradient(90deg, rgb(11, 8, 10), rgb(16, 40, 63));
  }
</style>

<script>
    import vHeadNav from '../../components/main/HeadNav.vue';
    import MenuNav from '../../components/main/MenuNav.vue';
    import TabNav from '../../components/main/TabNav.vue';

    export default {
        data() {
            return {
                path: this.$route.params.path,
                isCollapse: true
            }
        },
        components: {
            vHeadNav,
            MenuNav,
            TabNav
        },
        methods:{

        }
    };
</script>
