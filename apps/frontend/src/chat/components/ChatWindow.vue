<template>
  <div class="flex flex-col h-full">

    <div class="header">

      <div class="text-left p-2">
        <h1>{{ roomName.length ? roomName : "..." }} <small>{{ roomData ? `(${roomData.uid})` : '' }}</small></h1>

        <div v-if="roomDescription" class="mt-3">{{ roomDescription }}</div>

      </div>
    </div>

    <div v-if="notInRoom" class="flex-grow p-5">
      <h3 class="interim">You are not in any room at this moment</h3>
    </div>

    <messages v-else :messages="messages" class="flex-grow overscroll-contain"></messages>

    <div class="bottom">

      <textarea v-model="message"
                @keydown.enter="messageEnterClicked"
                :placeholder="messageDefaultPlaceholder" class="ta"></textarea>

      <div style="margin-top: 0.5rem; display: flex; justify-content: space-between; 	align-items: center;">
        <button @click="sendMessageClicked">Send</button>

        <div class="error">{{ error }}</div>

        <p>Users online: {{ usersOnline }}</p>

      </div>

    </div>

  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";
import Messages from "./Messages.vue";
import {RoomInterface, UserInterface} from "@athlon1600/chat-typings";

type Nullable<T> = T | null;

export default defineComponent({
  components: {Messages},
  data() {
    return {
      error: '',
      lastMessageSentAt: 0 as number,
      message: ''
    }
  },
  computed: {
    roomData(): RoomInterface | null {
      return this.$store.state.room;
    },
    notInRoom(): boolean {
      return !this.roomData;
    },
    currentUser(): UserInterface | null {
      return this.$store.state.currentUser;
    },
    roomName(): string {
      return this.roomData ? this.roomData.name : "";
    },
    roomDescription(): string {
      return this.roomData?.description || "";
    },
    usersOnline(): string {
      return "N/A";
    },
    messages(): any[] {
      return this.$store.state.messages;
    },
    messageDefaultPlaceholder(): string {

      if (this.currentUser) {
        return `Send a message (as ${this.currentUser.displayName})... 3 second slow mode enabled`;
      }

      return 'You MUST be logged in to send messages';
    },
    delayBetweenMessages(): number {

      if (this.roomData && this.roomData.slowMode) {
        return this.roomData.slowMode * 1000;
      }

      return 1;
    },
    canSendMessage(): boolean {
      return this.$store.state.currentTimeMillis >= (this.lastMessageSentAt + this.delayBetweenMessages);
    }
  },
  methods: {
    messageEnterClicked: function (e: Event) {

      // no new lines in textarea allowed
      e.preventDefault();

      this.sendMessageClicked();
    },
    sendMessageClicked() {

      if (!this.canSendMessage || this.message.length === 0) {
        return;
      }

      this.$socket.sendMessage(this.message);

      this.lastMessageSentAt = (new Date()).getTime();
      this.message = '';
    }
  },
  beforeMount() {

  },
  created() {
    // console.log('ChatWindow.vue created');
  },
  mounted() {
    // console.log('ChatWindow.vue mounted');
  },
  beforeUnmount() {
    // disconnect
  }
})
</script>

<style>

.header {
  border-bottom: 1px solid #323d4d;
  padding: 0.5rem;
  border-color: #313d4f;
  background-color: #222c3c;
  box-shadow: 0 1px 5px 0 #18191a;
}

.bottom {
  display: flex;
  flex-direction: column;
  padding: 1em;
  color: white;

  border-top: 1px solid #323d4d;
}

.ta {
  font-family: 'Inter', sans-serif;
  background-color: #262523;
  color: white;

  border-color: #323d4d;

  padding: 1rem;

  resize: none;
  border-radius: 0.375rem;
}

.ta:focus {
  outline: 2px solid #323d4d !important;
  outline-offset: 2px;
}

</style>