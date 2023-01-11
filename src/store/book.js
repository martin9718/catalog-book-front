import store from '../store';

import {handleErrorsAuth, handleErrorsBook} from '@/helpers/handle-errors';
import router from "@/router";

const URL_API = 'http://localhost:3000/api';
const status_unauthorized = [401, 403];

export default {
    namespaced: true,
    state: {
        numberBooks: 0
    },
    mutations: {
        setNumberBooks(state, numberBooks) {
            state.numberBooks = numberBooks;
        }
    },
    actions: {
        setNumberBooks({commit}, numberBooks) {
            commit('setNumberBooks', numberBooks)
        },
        async createBooks({commit}, books) {
            try {
                const formData = new FormData();

                books.forEach((book, id) => {
                    formData.append("book-file-" + id, book.image, book.image.name);
                });

                formData.append("books", JSON.stringify(books));

                const myHeaders = new Headers();

                myHeaders.append("Authorization", store.getters["auth/getToken"]);

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData,
                    redirect: 'follow'
                };

                const response = await fetch(`${URL_API}/books/`, requestOptions);

                if (status_unauthorized.includes(response.status)) {
                    await store.dispatch('auth/setToken', '');
                    await store.dispatch('auth/setUser', null);
                    return router.push({name: 'Login'})
                }

                const responseJSON = await response.json();

                if (responseJSON.code) {
                    handleErrorsBook(responseJSON.code)
                    return false;
                }

                return true;
            } catch (error) {
                handleErrorsBook('UNEXPECTED_ERROR');
                return false;
            }
        },
        async findBooks({commit}, {userId, limit, page}) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: `/books/${userId}?limit=${limit}&page=${page}`,
                    method: 'GET',
                    authentication: true
                }
            );

            if (response.code) {
                handleErrorsAuth(response.code)
                return false;
            }

            return response;
        },
        async getBook({commit}, bookId) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: `/books/book/${bookId}`,
                    method: 'GET',
                    authentication: true
                }
            );

            if (response.code) {
                handleErrorsAuth(response.code)
                return false;
            }

            return response;
        },
        async updateBook({commit}, book) {
            try {
                const formData = new FormData();

                const data = {
                    title: book.title,
                    numberPages: book.numberPages,
                    publicationDate: book.publicationDate
                }

                formData.append("book", book.image, book.image.name);

                formData.append("book", JSON.stringify(data));

                const myHeaders = new Headers();

                myHeaders.append("Authorization", store.getters["auth/getToken"]);

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData,
                    redirect: 'follow'
                };

                const response = await fetch(`${URL_API}/books/book/${book.id}`, requestOptions);

                if (status_unauthorized.includes(response.status)) {
                    await store.dispatch('auth/setToken', '');
                    await store.dispatch('auth/setUser', null);
                    return router.push({name: 'Login'})
                }

                const responseJSON = await response.json();

                if (responseJSON.code) {
                    handleErrorsBook(responseJSON.code)
                    return false;
                }

                return true;
            } catch (error) {
                handleErrorsBook('UNEXPECTED_ERROR');
                return false;
            }
        },
        async deleteBook({commit}, bookId) {

            const response = await store.dispatch(
                'requestFetch',
                {
                    path: `/books/delete/${bookId}`,
                    method: 'POST',
                    authentication: true
                }
            );

            if (response.code) {
                handleErrorsAuth(response.code)
                return false;
            }

            return true;
        },

    },
    getters: {
        getNumberBooks(state) {
            return state.numberBooks;
        }
    }

}
