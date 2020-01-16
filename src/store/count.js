export default {
    // state: {
    //     counter: 0
    // },
    // mutations: {
    //     ADD: (state) => {
    //         state.counter += 1;
    //     },
    //     ADD2: (state) => {
    //         state.counter += 1;
    //     },
    // },
    // actions: {
    //     update({ commit }) {
    //         setTimeout(() => {
    //             commit('ADD');
    //         }, 1000);
    //     }
    // },
    modules: {
        'counter': {
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
        },
    },
    getters: {
        dobuleCounter: state => state.counter * 2
    }
}