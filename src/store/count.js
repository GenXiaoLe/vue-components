export default {
    state: {
        counter: 0
    },
    mutations: {
        ADD: (state) => {
            state.counter += 1;
        },
    },
    actions: {
        update({ commit }) {
            setTimeout(() => {
                commit('ADD');
            }, 1000);
        }
    }
}