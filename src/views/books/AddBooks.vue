<template>
  <div>
    <h2 class="mb-8">Agregar libros</h2>
    <v-row class="d-none d-md-flex">
      <v-col cols="3" class="pa-0 pl-5">Título</v-col>
      <v-col cols="3" class="pa-0 pl-5">No. Páginas</v-col>
      <v-col cols="3" class="pa-0 pl-5">Fecha de publicación</v-col>
      <v-col cols="3" class="pa-0 pl-13">Imagen</v-col>
    </v-row>
    <v-row v-for="(book, id) in books" :key="id">
      <v-col cols="12" sm="6" md="3" class="form__field">
        <input type="text" placeholder="Título" v-model="book.title" :disabled="book.isValid">
      </v-col>
      <v-col cols="12" sm="6" md="3" class="form__field">
        <input type="text" placeholder="No. Páginas" v-model="book.numberPages" :disabled="book.isValid">
      </v-col>
      <v-col cols="12" sm="6" md="3" class="form__field">
        <input type="date" v-model="book.publicationDate" :max="beforeToday()" :disabled="book.isValid">
      </v-col>
      <v-col cols="12" sm="6" md="3" class="d-flex align-center">
        <v-file-input
            accept="image/png, image/jpeg"
            outlined
            dense
            label="Imagen"
            color="#77c1ff"
            hide-details
            style="min-width: 200px"
            v-model="book.image"
            :disabled="book.isValid"
        ></v-file-input>
        <v-icon
            v-if="!book.isValid"
            class="ml-2 cursor-pointer"
            color="#1867c0"
            @click="validateBook(id)"
        >
          far fa-save
        </v-icon>
        <v-icon
            class="ml-2 cursor-pointer"
            color="primary"
            @click="deleteBookLine(id)"
        >
          far fa-times-circle
        </v-icon>
      </v-col>
      <span class="alert-error ml-4">{{ errors[id] }}</span>
    </v-row>
    <div class="d-flex justify-space-between align-center mt-5">
      <v-btn
          outlined
          color="primary"
          :disabled="booksNotValid"
          @click="saveBooks"
      >
        Guardar
      </v-btn>
      <v-btn
          class="mx-2"
          fab
          dark
          small
          color="primary"
          @click="addBookLine"
          :disabled="books.length > 4"
      >
        <v-icon dark>
          fas fa-plus
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import {DateTime} from 'luxon';

import BookInput from '@/components/books/BookInput';
import {mapActions, mapGetters} from "vuex";

export default {
  name: "AddBooks",
  components: {
    BookInput
  },
  data() {
    return {
      books: [
        {
          title: null,
          numberPages: null,
          publicationDate: null,
          image: null,
          isValid: false
        }
      ],
      errors: []
    }
  },
  methods: {
    ...mapActions('book', ['createBooks']),
    addBookLine() {
      this.books.push({
            title: null,
            numberPages: null,
            publicationDate: null,
            image: null,
            isValid: false
          }
      )
    },
    deleteBookLine(id) {
      this.books.splice(id, 1);
    },
    validateBook(id) {
      this.errors.splice(id, 1);

      if (!this.books[id].title?.trim()) {
        return this.errors[id] = 'El título es requerido';
      }

      if (!this.books[id].numberPages?.trim() || isNaN(this.books[id].numberPages)) {
        return this.errors[id] = 'Ingrese un número válido de páginas';
      }

      if (this.books[id].numberPages < 50 || this.books[id].numberPages > 500) {
        return this.errors[id] = 'El número de páginas debe estar entre 50 y 500 páginas';
      }

      if (!this.books[id].publicationDate) {
        return this.errors[id] = 'La fecha de publicación es requerida';
      }

      if (!this.isDateBeforeToday(this.books[id].publicationDate)) {
        return this.errors[id] = 'La fecha de publicación debe ser anterior a hoy';
      }

      if (!this.books[id].image) {
        return this.errors[id] = 'La imagen es requerida';
      }

      if (this.books[id].image.type !== 'image/png' && this.books[id].image.type !== 'image/jpeg') {
        return this.errors[id] = 'La imagen tiene que estar en formato png o jpeg';
      }

      this.books[id].userId = this.getUser.id;
      this.books[id].isValid = true;

    },
    async saveBooks() {
      const response = await this.createBooks(this.books)

      if(response){
        await this.$router.push({name: 'BookList'});
      }
    },
    isDateBeforeToday(date){
      const today = DateTime.now();
      const beforeDay = DateTime.fromISO(date);

      return beforeDay < today;
    },
    beforeToday(){
      return DateTime.now().plus({day: -1}).toFormat('yyyy-MM-dd');
    },
  },
  computed:{
    ...mapGetters('auth', ['getUser']),
    booksNotValid() {
      if(this.books.length === 0) return true;
      for (let i in this.books) {
        if (!this.books[i].isValid) return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
.form__field {
  margin-top: 0;
}

input {
  width: auto;
  min-width: 150px;
}

.alert-error {
  display: block;
  color: red;
  font-weight: 600;
  font-size: 12px;
}

@media (max-width: 959px) {
  >>> .v-input__prepend-outer {
    display: none;
  }
}
</style>
