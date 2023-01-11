<template>
  <div class="d-flex">
    <v-row class="book-input d-flex">
      <v-col class="form__field mr-1">
        <label>Título</label>
        <input type="text" placeholder="El principito...">
      </v-col>
      <v-col class="form__field mr-1">
        <label>No. de páginas</label>
        <input type="text" placeholder="150">
      </v-col>
      <v-col class="form__field mr-1">
        <label>Fecha de publicación</label>
        <input type="date">
      </v-col>
      <v-col class="form__field">
        <label class="ml-10">Imagen</label>
        <v-file-input
            accept="image/*"
            outlined
            dense
            @change="passBookFile"
            :ref="numberBook + '-file'"
            v-model="file"
            color="#77c1ff"
        ></v-file-input>
      </v-col>
    </v-row>
    <div class="mt-8 ml-2" style="cursor: pointer">
      <v-icon @click="deleteBook(numberBook)">far fa-times-circle</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookInput",
  props: {
    deleteBook: Function,
    numberBook: String
  },
  data() {
    return {
      file: null
    }
  },
  methods: {
    passBookFile() {
      this.$emit('setBookFile',{id: this.numberBook + '-file', file: this.file})
    }
  }
}
</script>

<style scoped>
.book-input {
  color: #3e3e3e;
}

label {
  font-size: 14px;
  margin-left: 4px;
}

input {
  width: auto;
}

.form__field {
  margin-top: 0px;
}

>>> .v-input__control {
  min-width: 185px !important;
}

.book-input div {
}

</style>
