<template>
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="logo"
      height="200px"
    ></v-img>

    <v-card-title>
      Temperature : 
    </v-card-title>

    <v-card-title>
      Humidity : 
    </v-card-title>

    <v-card-title>
      Battery : 
    </v-card-title>

  </v-card>
</template>

<script>
export default {
  name: "HelloWorld",
  data: function() {
    return {
      logo: require('../assets/weather.jpg')
    }
  }
};
</script>
