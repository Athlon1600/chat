import {reactive, readonly, watch} from 'vue';
import {ChatMessageInterface, UserInterface} from "@athlon1600/chat-typings";

let timestampInterval: NodeJS.Timer;

const state = reactive({
    currentTimeMillis: (new Date()).getTime(),
    error: "",

    connected: false,

    room: null as any,
    currentUser: null as any as UserInterface,

    users: [],
    messages: [] as ChatMessageInterface[]
});

timestampInterval = setInterval(function () {
    state.currentTimeMillis = (new Date()).getTime();
}, 100);

watch(() => state.currentUser, () => {
    actions.updateUser(state.currentUser);
})

const actions = {
    clearLastError() {
        state.error = "";
    },
    setMessages(messages: Array<any>) {
        //@ts-ignore
        state.messages = messages
    },
    removeMessageById(id: number) {

        const found = state.messages.findIndex((msg) => {
            return (msg as any).id === id;
        });

        if (found !== -1) {

            const existing: any = state.messages[found];
            existing.deleted = 1;

            // @ts-ignore
            state.messages.splice(found, 1, existing);
        }
    },
    markAllMessagesAsDeleted() {

        state.messages.forEach((msg: any) => {
            msg.deleted = true;
        })
    },
    updateUser(user: UserInterface) {
        if (user) {

            state.messages.forEach((msg: ChatMessageInterface) => {

                if (msg.user && msg.user.uid === user.uid) {
                    msg.user.displayName = user.displayName;
                }

            });
        }
    },
    removeUser(user: any) {

        const index = state.users.findIndex((value: any) => {
            return value.uid === user.uid;
        });

        if (index !== -1) {
            state.users.splice(index, 1);
        }
    }
};

const ra = readonly(state);

export default {
    state,
    actions
}