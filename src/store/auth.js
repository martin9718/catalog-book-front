import store from '../store';

import {handleErrorsAuth} from '@/helpers/handle-errors';

export default {
    namespaced: true,
    state: {
        user: null,
        token: ''
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
        }
    },
    actions: {
        setUser({commit}, user) {
            commit('setUser', user)
        },
        setToken({commit}, token) {
            commit('setToken', token)
        },
        async login({commit}, user) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: '/auth/signIn',
                    method: 'POST',
                    data: {email: user.email, password: user.password},
                    authentication: false
                }
            );

            if (response.code) {
                handleErrorsAuth(response.code)
                return false;
            }

            const {id, name, email, token} = response;

            await store.dispatch('auth/setToken', 'Bearer ' + token);
            await store.dispatch('auth/setUser', {id, name, email});

            return true;
        },
        async loginOut({commit}) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: '/auth/signOut',
                    method: 'POST',
                    data: {},
                    authentication: true
                }
            );
            if (response.code) {
                handleErrorsAuth(response.code)
                return false;
            }

            await store.dispatch('auth/setToken', '');
            await store.dispatch('auth/setUser', null);

            return true;
        },
        async currentUser({commit}) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: '/users/currentUser',
                    method: 'GET',
                    data: {},
                    authentication: true
                }
            );

            const {id, name, email, token} = response;

            await store.dispatch('auth/setToken', 'Bearer ' + token);
            await store.dispatch('auth/setUser', {id, name, email});

            return true;
        },

    },
    getters: {
        getUser(state) {
            return state.user;
        },
        getToken(state) {
            return state.token;
        }
    }

}
