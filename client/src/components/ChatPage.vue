<template>
<v-layout column fill-height>
  <v-layout align-start fill-height>
    <v-flex xs10 fill-height ref="boxChatMess">
      <v-toolbar flat dense class="cyan" dark>
        <v-toolbar-title>Чат ВСГУТУ</v-toolbar-title>
      </v-toolbar>
      <messages-panel/>
    </v-flex>
    <v-flex xs2 ml-2 class="elevation-10">
      <v-toolbar flat dense class="cyan" dark>
        <v-toolbar-title>Онлайн</v-toolbar-title>
      </v-toolbar>
      <v-flex>
        <v-text-field v-model="curentUser.name"
          @keyup.enter="setName">
        </v-text-field>
        <v-list two-line>
          <template v-for="(user) in users">
            <v-list-tile
              :key="user.title"
              avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{user.name}}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-avatar>
                <img :src="'https://ui-avatars.com/api/?name='+user.name+'&background=0D8ABC&color=fff&rounded=true'">
              </v-list-tile-avatar>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-flex>
  </v-layout>

  <v-layout rows>
    <v-flex>
      <v-text-field
            v-model="newMessage"
            @keyup.enter="sendMassage"
            label="Сообщение..."
            single-line
            outline></v-text-field>
    </v-flex>
    <uploder/>
    <v-btn @click="sendMassage" color="primary">Отправить</v-btn>
  </v-layout>

  </v-layout>
</template>

<script>
import MessagesPanel from '@/components/Messages'
import Uploder from '@/components/Uploder'

export default {
  components: {
    MessagesPanel,
    Uploder
  },
  mounted () {
    this.$root.$emit('setMm', this.$refs.boxChatMess.clientHeight)

    this.$root.$on('sendMessage', (data) => {
      this.$socket.emit('newMessage', {
        message: data.message,
        name: this.curentUser.name,
        cat: data.cat
      })
      this.$root.$emit('newMessage', {text: data.message, name: this.curentUser.name, type: 1, cat: data.cat})
    })

    this.$socket.on('newMessage', (data) => {
      this.$root.$emit('newMessage', {text: data.message, name: data.name, type: 0, cat: (data.cat | 0)})
    })

    this.$socket.on('upUsers', (data) => {
      this.users = data
    })
  },

  data () {
    return {
      curentUser: {name: Math.random()},
      users: {},
      newMessage: null
    }
  },
  methods: {
    sendMassage () {
      if (!this.newMessage) return
      this.$root.$emit('newMessage', {text: this.newMessage, name: this.curentUser.name, type: 1})

      this.$socket.emit('newMessage', {
        message: this.newMessage,
        name: this.curentUser.name
      })

      this.newMessage = null
    },
    setName () {
      this.$socket.emit('setName', this.curentUser.name)
    }
  }
}
</script>

<style scoped>
</style>
