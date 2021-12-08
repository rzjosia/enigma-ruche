<template>
  <div class="hello">
      <v-main>
        <v-container>
          <v-row>
            <v-col v-for="n in 24" :key="n" cols="4">
              <v-card height="200"></v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>
