<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Enigma ruche</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
      <p>{{ open }}</p>
      <Alert v-model="open" />
    </v-main>
  </v-app>
</template>

<script>
import Alert from "./components/Alert";

export default {
  components: {
    Alert,
  },
  computed: {
      open() {
        return this.$store.state.alertPopping.open
      }
  },
};
</script>
