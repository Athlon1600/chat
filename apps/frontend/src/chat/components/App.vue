<template>
  <div id="tabs" class="flex flex-col">

    <nav id="tab_menu" class="flex p-2 border-b border-gray-800 bg-gray-950">

      <a href="#" @click.prevent="clickedTab('messages')">Messages</a>
      <a href="#" @click.prevent="clickedTab('users')">Users</a>
      <a href="#" @click.prevent="clickedTab('settings')">Settings</a>

      |

      <a href="#" @click.prevent="connect">Connect</a>
      <a href="#" @click.prevent="disconnect">Disconnect</a>

    </nav>

    <div v-if="error" class="p-2 bg-red-500 text-white">
      {{ error }}
    </div>

    <div v-if="!isConnected" style="padding: 1em; color: orangered;">
      <h3>Connection lost... refresh page and try again maybe?</h3>
    </div>

    <div v-else class="flex-grow h-full" style="height: 100%">
      <chat-window v-if="activeTab === 'messages'"></chat-window>
      <settings v-if="activeTab === 'settings'"></settings>
    </div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ChatWindow from "./ChatWindow.vue";
import Settings from "./Settings.vue";

type TabName = "messages" | "users" | "settings" | string;

export default defineComponent({
  components: {Settings, ChatWindow},
  data() {
    return {
      activeTab: 'messages' as TabName
    }
  },
  computed: {
    isConnected(): boolean {
      return this.$store.state.connected;
    },
    error(): string {
      return this.$store.state.error;
    },
    store(): any {
      return this.$store;
    }
  },
  methods: {
    clickedTab(name: TabName) {
      this.activeTab = name;
    },
    connect() {
      this.$socket.connect();
    },
    disconnect() {
      this.$socket.disconnect();
    }
  },
  mounted() {

    // console.log('App.vue mounted');

    this.$watch(() => this.$store.state.error, (newValue: any) => {

      setTimeout(() => {
        this.$store.actions.clearLastError();
      }, 3000);

    }, {
      immediate: true
    })

    // this.$store.socketApi.connect();

  }
});
</script>

<style>

#tabs {
  background-color: rgba(31, 41, 55);
  color: white;

  min-height: 100%;
  height: 100%;
}

#tab_menu {
  /*border-bottom: 1px solid #323d4d;*/
  /*border-color: #313d4f;*/
  /*background-color: #1f242b;*/
  /*box-shadow: 0 1px 5px 0 #18191a;*/
}

#tab_menu > a {
  padding: 0.4em 1.5em;
  font-family: Inter, serif;
  font-size: 0.7em;
  color: white !important;
  text-decoration: none;
}

#tab_menu > a:hover {
  opacity: 0.5;
}

</style>