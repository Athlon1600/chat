<template>
  <div class="messages p-2 h-0">

    <div v-if="messages.length === 0">

      <h2>No messages yet</h2>

    </div>

    <div v-for="(message, index) in messages" :key="index">

      <div class="message-row flex justify-between p-1">

        <div class="flex items-center">

          <span v-if="message.user" class="pr-1 select-none">

            <img :src="`https://avatars.dicebear.com/api/personas/${message.user.uid}.svg`"
                 width="20" height="20" alt="">

            </span>

          <a v-if="message.user" class="hover:underline font-bold cursor-pointer text-green-500"
             @click="usernameClicked(message)">
            {{ message.user.displayName }}
          </a>

          <span v-else>***</span>

          <span>{{ JSON.stringify(message.user.roles) }}</span>

          <span class="text-white mr-2">:</span>

          <span v-if="!message.deleted" class="text-primary">{{ message.message }}</span>
          <span v-if="message.deleted" class="italic opacity-80">[message deleted]</span>

        </div>

        <div class="message-options" @click="deleteMessageClicked(message.id)">
          <!--            &#10060;-->
          X
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, PropType} from "vue";
import {ChatMessageInterface} from "@athlon1600/chat-typings";

function scrollToBottom() {

  setTimeout(function () {
    let messages = document.querySelector('.messages');

    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }

  }, 100);
}

export default defineComponent({
  props: {
    messages: {
      type: Array as PropType<ChatMessageInterface[]>,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    usernameClicked(msg: ChatMessageInterface) {
      alert(JSON.stringify(msg, null, 2));
    },
    deleteMessageClicked(id: number) {

      // will listen for emit and delete automatically
      if (id && confirm('Delete this message?')) {

        this.$rest.deleteMessage(id + "").catch(() => {
          alert('Failed to delete a message. You might not have the right permissions');
        });

      }
    }
  },
  mounted() {

    this.$watch(() => this.messages, () => {
      scrollToBottom();
    }, {
      deep: true,
      immediate: true
    });

  }
});
</script>

<style scoped>

.messages {
  overflow-x: hidden;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

.message-row:hover {
  background: rgba(75, 85, 99);
}

.message-row:hover .message-options {
  display: block;
}

.message-options {
  display: none;
  margin-left: 0.2rem;
  cursor: pointer;
}

</style>