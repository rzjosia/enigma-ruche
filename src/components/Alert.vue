<template>
  <div class="text-center">
    <v-snackbar v-model="alertData.open" :multi-line="true">
      {{ alertData.message }}
      <template v-slot:action="{ attrs }">
        <v-btn :color="btnColor" text v-bind="attrs" @click="resetAlert"
          >Close</v-btn
        >
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      alertData: (state) => state.alertPopping,
      btnColor: (state) => {
        switch (state.alertPopping.type) {
          case "error":
            return "red";
          case "warning":
            return "orange";
          case "info":
            return "blue";
          case "success":
            return "green";
          default:
            return "white";
        }
      },
    }),
  },
  methods: {
    resetAlert() {
      this.$store.dispatch("alertPopping/resetAlert", null, { root: true });
    },
  },
};
</script>
