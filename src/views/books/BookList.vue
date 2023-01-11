<template>
  <div style="width: 100%">
    <v-row class="d-flex justify-end mb-3">
      <v-btn
          class="mx-2"
          fab
          dark
          small
          color="primary"
          @click="$router.push({name: 'AddBooks'})"
      >
        <v-icon dark>
          fas fa-plus
        </v-icon>
      </v-btn>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6" md="3" v-for="book in books" :key="book.id">
        <ImageCard :book="book" :findBooks="getBooks"/>
      </v-col>
    </v-row>
    <div class="text-center mt-5">
      <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="getBooks"
      ></v-pagination>
    </div>
  </div>
</template>

<script>

import ImageCard from '@/components/common/ImageCard';
import BookInput from '@/components/books/BookInput';
import {mapActions, mapGetters} from "vuex";

export default {
  name: "BookList",
  components: {
    ImageCard,
    BookInput
  },
  data() {
    return {
      books: 0,
      limit: 4,
      currentPage: 1,
      totalPages: 1
    }
  },
  async created() {
    await this.getBooks();
  },
  methods: {
    ...mapActions('book', ['findBooks', 'setNumberBooks']),
    async getBooks(){
      const response = await this.findBooks({
        userId: this.getUser.id,
        limit: this.limit,
        page: this.currentPage
      });

      this.books = response.books;
      this.currentPage = Number(response.currentPage);
      this.totalPages = Number(response.totalPages);
      this.setNumberBooks(Number(response.totalBooks));
    }
  },
  computed: {
    ...mapGetters('auth', ['getUser'])
  }
}
</script>

<style scoped>


</style>
