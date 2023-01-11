<template>
  <v-app class="main-layout">
    <v-app-bar
        app
        class="main-layout__bar px-4 px-md-6"
        color="white"
        dark
        elevation="0"
        :height="height_bar"
    >
      <div class="main-layout__bar__desk d-flex justify-space-between align-center">
        <div>
          <v-img
              alt="Vuetify Name"
              class="shrink mt-1 hidden-sm-and-down mx-auto fadeIn"
              contain
              max-width="60"
              src="../assets/images/logo-lib.png"
          />
        </div>
        <div class="main-layout__bar__desk__right d-flex" v-if="getToken !== ''">
          <router-link class="mr-2" style="text-decoration: none" to="/book-list">Mis libros: {{getNumberBooks}}</router-link>
          <div class="mr-3">Martin Cervantes</div>
          <v-icon color="primary" @click="signOut">fas fa-sign-out-alt</v-icon>
        </div>
      </div>
    </v-app-bar>
    <v-main>
      <v-row class="ma-0" v-if="$route.name === 'Login'">
        <v-col md="4" class="hidden-sm-and-down pa-0">
          <v-img
              src="../assets/images/library.jpeg"
              style="height: 100vh"
          >

          </v-img>
        </v-col>
        <v-col cols="12" md="8" class="main pa-0">
          <slot/>
        </v-col>
      </v-row>
      <v-row v-else class="pa-16">
        <slot />
      </v-row>
    </v-main>
  </v-app>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "MainLayout",
  data() {
    return {
      drawer: false,
      height_bar: 72
    }
  },
  created() {
    this.heightBar();
    window.addEventListener('resize', this.heightBar);

  },
  methods:{
    ...mapActions('auth', ['loginOut']),
    heightBar(){
      this.height_bar = window.screen.width > 959 ? 72 : 48;
    },
    async signOut(){
      const response = await this.loginOut();

      if (response){
        await this.$router.push({name: 'Login'});
      }
    }
  },
  computed:{
    ...mapGetters('auth', ["getToken"]),
    ...mapGetters('book', ["getNumberBooks"]),
  }
}
</script>

<style scoped>

.main-layout__bar {
  box-shadow: inset 0 -1px 0 0 #eaeaea !important;
}

.main-layout__bar__desk{
  width: 100%;
}

.main-layout__bar__desk__right {
  font-size: 16px;
  font-weight: bold;
  height: 48px;
  letter-spacing: normal;
  padding: 10px 32px;
  text-transform: none;
  color: #ff5a60;
}

.main{
  width: calc(100% - 34px);
  margin: 0 auto;
  padding: 0 17px;
}

@media (max-width: 959px) {
  .main-layout__bar {
    height: 48px !important;
    width: 100% !important;
  }
}


</style>
