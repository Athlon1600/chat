<template>
  <div id="page">

    <h1>Here go settings</h1>

    <h3>Join a room</h3>

    <p>New UID of a room you want to join</p>

    <h2>Host a room</h2>

    <p>New room will be generated to which you can invite people to join</p>

    <button @click="createNewRoomClicked">Create a new room</button>

    <pre>{{ output }}</pre>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      output: ''
    }
  },
  methods: {
    createNewRoomClicked() {

      this.$rest.random().then((res) => {
        this.output = res;
      })
    }
  }

});

</script>

<style scoped>
p {
  margin-bottom: 1rem;
}

#page {
  background-color: #222c3c;
  padding: 1rem;
}
</style>