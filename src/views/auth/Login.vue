<template>
  <div class="login d-flex justify-center fadeIn">
    <div class="login__content">
      <div class="login__content__head">
        <h3 class="head__title">Iniciar sesión</h3>
      </div>
      <div class="login__content__form">
        <div class="form__field">
          <label>Email</label>
          <input type="email" v-model="user.email" @input="checkForm" placeholder="tu@correo.com">
          <span>{{ errors.email[0] }}</span>
        </div>
        <div class="form__field">
          <label>Contraseña</label>
          <div class="form__field__pass d-flex align-center">
            <input :type="show ? 'text' : 'password'" v-model="user.password" @input="checkForm" placeholder="Contraseña">
            <v-icon @click="showPass" size="small">{{ show ? 'fas fa-eye-slash' : 'fas fa-eye' }}</v-icon>
          </div>
          <span>{{ errors.password[0] }}</span>
        </div>
          <v-btn
              :class="errorsExists ? 'btn-no-active' : 'btn-active' "
              :disabled="errorsExists"
              class="mt-6" @click="signIn"
          >
            Iniciar sesión
          </v-btn>
        </div>
      </div>

    </div>
</template>

<script>

import {mapActions} from 'vuex';

export default {
  name: 'SignUp',
  data() {
    return {
      user: {},
      errors: {
        email: [],
        password: [],
      },
      show: false
    }
  },
  created() {
  },
  methods: {
    ...mapActions('auth', ['login', 'setToken']),
    async signIn() {
      const check = this.checkForm();
      if(!check){
        return;
      }

      const response = await this.login(this.user);

      if(response){
        await this.$router.push({name: 'BookList'});
      }

    },
    checkForm() {
      this.errors.email = [];
      this.errors.password = [];
      if (!this.user.email) this.errors.email.push('El correo electrónico es requerido');
      if (!this.user.email?.includes('@')) this.errors.email.push('El correo electrónico debe ser válido');
      if (!this.user.password) this.errors.password.push('La contraseña es requerida');


      for (let i in this.errors) {
        if (this.errors[i].length > 0) return false;
      }

      return true;

    },
    showPass() {
      this.show = !this.show;
    }
  },
  computed:{
    errorsExists() {
      for (let i in this.errors) {
        if (this.errors[i].length > 0) return true;
      }
      return false;
    }
  }
}
</script>
<style scoped>
.login__content {
  color: #3e3e3e;
  margin: 77px 0;
  max-width: 449px;
}

.login__content__head {
  max-width: 320px;
}

.login__content__head p {
  font-size: 14px;
  margin-top: 24px;
}

.login__content__head a {
  color: #3ca4fc;
  text-decoration: none;
}

.login__content__form {
  margin: 0 auto;
}


@media (max-width: 499px) {
  .login__content {
    margin: 24px 0;
    max-width: 288px;
  }
}


</style>
