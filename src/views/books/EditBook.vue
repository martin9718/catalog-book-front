<template>
  <div>
    <h2 class="mb-8">Editar libro</h2>
    <v-row class="d-none d-md-flex">
      <v-col cols="3" class="pa-0 pl-5">Título</v-col>
      <v-col cols="3" class="pa-0 pl-5">No. Páginas</v-col>
      <v-col cols="3" class="pa-0 pl-5">Fecha de publicación</v-col>
      <v-col cols="3" class="pa-0 pl-13">Imagen</v-col>
    </v-row>
    <v-row>
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
      </v-col>
    </v-row>
      <span class="alert-error ml-4">{{ error }}</span>
    <div class="d-flex justify-space-between align-center mt-5">
      <v-btn
          outlined
          color="primary"
          @click="saveBook"
      >
        Guardar
      </v-btn>
    </div>
  </div>
</template>

<script>
import {DateTime} from 'luxon';

import BookInput from '@/components/books/BookInput';
import {mapActions, mapGetters} from "vuex";

export default {
  name: "EditBook",
  components: {
    BookInput
  },
  data() {
    return {
      book: {},
      error: null
    }
  },
  async created() {
    this.book = await this.getBook(this.$route.params.bookId);
    this.book.publicationDate = this.book.publicationDate.split('T')[0];
    this.book.image = null;
  },
  methods: {
    ...mapActions('book', ['updateBook', 'getBook']),
    validateBook() {
     this.error = null;

      if (!this.book.title.trim()) {
        this.error = 'El título es requerido';
        return false;
      }

      if (!this.book.numberPages || isNaN(this.book.numberPages)) {
        this.error = 'Ingrese un número válido de páginas';
         return false;
      }

      if (this.book.numberPages < 50 || this.book.numberPages > 500) {
        this.error = 'El número de páginas debe estar entre 50 y 500 páginas';
         return false;
      }

      if (!this.book.publicationDate) {
        this.error = 'La fecha de publicación es requerida';
         return false;
      }

      if (!this.isDateBeforeToday(this.book.publicationDate)) {
        this.error = 'La fecha de publicación debe ser anterior a hoy';
         return false;
      }

      if (!this.book.image) {
        this.error = 'La imagen es requerida';
         return false;
      }

      if (this.book.image.type !== 'image/png' && this.book.image.type !== 'image/jpeg') {
        this.error = 'La imagen tiene que estar en formato png o jpeg';
         return false;
      }

      return true;

    },
    async saveBook() {
      const validBook = this.validateBook();

      if(!validBook) return;

      const response = await this.updateBook(this.book)

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
    ...mapGetters('auth', ['getUser'])
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

