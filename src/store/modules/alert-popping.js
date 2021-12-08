export const namespaced = true;

const initialState = {
  open: false,
  title: "",
  message: "",
  type: "",
};

/*eslint-disable no-unused-vars*/
export const state = initialState;

export const mutations = {
  SET_ALERT(state, alertData) {
    console.log(`[alert-popping] mutation`, alertData);
    state = alertData;
  },
  RESET_ALERT(state) {
    state = initialState;
  },
};

export const actions = {
  setAlert({ commit }, payload) {
    console.log(`[alert-popping] state`, payload);

    commit("SET_ALERT", {
      open: payload.open,
      title: payload.title,
      message: payload.message,
      type: payload.type,
    });
  },
  resetAlert({ commit }) {
    commit("RESET_ALERT");
  },
};

export const getters = {
  isOpened: (state) => {
    return state.open;
  },
  getData: (state) => {
    return state;
  },
};
