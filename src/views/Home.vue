<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <v-container>
      <v-btn align="center" color="primary" v-on:click="scanBluetoothDevices">Scanner</v-btn>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { scanBluetoothDevices } from "@/services/bluetooth";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  methods: {
    scanBluetoothDevices() {
      scanBluetoothDevices((error) => {
        this.$store.dispatch('alertPopping/setAlert', {
          open: true,
          title: "Erreur connection bluetooth",
          message: error,
          type: "error"
        })
      });
    },
  },
};
</script>
