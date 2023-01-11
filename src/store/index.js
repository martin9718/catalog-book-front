import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
import store from "../store";
import auth from "./auth";
import book from "./book";
import router from "@/router";

const ls = new SecureLS({
    isCompression: false
});

Vue.use(Vuex);

const URL_API = 'http://localhost:3000/api';
const status_unauthorized = [401, 403];

export default new Vuex.Store({
    plugins: [createPersistedState({
        storage: {
            getItem: (key) => ls.get(key),
            setItem: (key, value) => ls.set(key, value),
            removeItem: (key) => ls.remove(key)
        }
    })],
    mutations: {},
    actions: {
        async requestFetch({commit}, {path, method, data, authentication = true}) {
            try {
                const myHeaders = new Headers();

                if (authentication) {
                    myHeaders.append("Authorization", store.getters["auth/getToken"]);
                }

                myHeaders.append("Content-Type", "application/json");

                const requestOptions = {
                    method: method,
                    headers: myHeaders,
                    body: JSON.stringify(data),
                    redirect: 'follow'
                };

                const response = await fetch(`${URL_API}/${path}`, requestOptions);

                if(status_unauthorized.includes(response.status)){
                    await store.dispatch('auth/setToken', '');
                    await store.dispatch('auth/setUser', null);
                    return router.push({name: 'Login'})
                }

                return await response.json();
            } catch (error) {
                return {code: 'UNEXPECTED_ERROR'}
            }
        }
    },

    modules: {
        auth,
        book
    }
    ,
    getters: {}
})
