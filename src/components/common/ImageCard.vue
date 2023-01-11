<template>
  <v-card
      v-if="book && book.id"
      class="mx-auto"
      max-width="400"
  >
    <div>
      <v-img
          class="white--text align-end"
          height="200px"
          :src="book.image"
      >
        <v-card-title>{{book.title}}</v-card-title>
      </v-img>
    </div>

    <v-card-subtitle class="pb-0">
      No. Páginas: {{book.numberPages}}
    </v-card-subtitle>

    <v-card-text class="text--primary mt-3">
      <div>Fecha de publicación: {{book.publicationDate.split('T')[0]}}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          color="danger"
          text
          @click="$router.push({name: 'EditBook', params:{bookId: book.id}})"
      >
        Editar
      </v-btn>

      <v-btn
          color="primary"
          text
          @click="removeBook"
      >
        Eliminar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "ImageCard",
  props:{
    book: Object,
    findBooks: Function
  },
  created() {
  },
  methods:{
    ...mapActions('book', ['deleteBook']),
    async removeBook(){
      const response = await this.deleteBook(this.book.id);

      if(response){
        await this.findBooks();
      }
    }
  }
}
</script>

<style scoped>

</style>
