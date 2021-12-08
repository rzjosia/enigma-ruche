<template>
  <div class="text-center">
    <v-snackbar v-model="alertData.open" :multi-line="true">
      {{ alertData.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="resetAlert">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState({
      alertData: (state) => state.alertPopping,
    }),
  },
  methods: {
    ...mapActions(["resetAlert"]),
  },
};
</script>