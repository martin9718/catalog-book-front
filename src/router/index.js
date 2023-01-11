import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/book-list',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("../views/auth/Login"),
        meta: {
            layout: 'MainLayout'
        }
    },
    {
        path: '/book-list',
        name: 'BookList',
        component: () => import("../views/books/BookList"),
        meta: {
            layout: 'MainLayout'
        }
    },
    {
        path: '/add-books',
        name: 'AddBooks',
        component: () => import("../views/books/AddBooks"),
        meta: {
            layout: 'MainLayout'
        }
    },
    {
        path: '/edt-book/:bookId',
        name: 'EditBook',
        component: () => import("../views/books/EditBook"),
        meta: {
            layout: 'MainLayout'}
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(async (to, from, next) => {
    if (to.path === '/login' && store.getters["auth/getToken"] !== '') {
        next("/");
    } else {
        next();
    }

    if (to.path === '/book-list' && store.getters["auth/getToken"] === '') {
        next("/login");
    } else {
        next();
    }

});


export default router
