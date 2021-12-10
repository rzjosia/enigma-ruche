<template>
  <div class="home">
    <Datas msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Datas from "@/components/Datas.vue";

export default {
  name: "Home",
  components: {
    Datas,
  },
};
</script>
