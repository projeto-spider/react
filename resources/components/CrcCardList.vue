<template>
  <div>
    <p>
      <a-button v-if="!readOnly" type="primary" block @click="createCrcCard">
        Create CRC Card
      </a-button>
    </p>

    <a-card style="max-width: 640px; margin: 0 auto;" class="ant-card-no-padding">
      <a-list
        itemLayout="horizontal"
        :dataSource="crcCards"
      >
        <a-list-item
          slot="renderItem"
          slot-scope="crcCard"
          class="module-item"
          :class="{ 'module-item-selected': crcCard.id === openCrcCardId }"
        >
          <a-popconfirm
            v-if="!readOnly"
            slot="actions"
            title="Are you sure delete this card?"
            @confirm="deleteCrcCard(crcCard)"
            okText="Yes"
            cancelText="No"
          >
            <a href="#">Delete</a>
          </a-popconfirm>

          <a slot="actions" @click="openCrcCard(crcCard)">Open</a>

          <a-list-item-meta>
            <template slot="title">
              <form
                v-if="editing === crcCard"
                @submit.prevent="openCrcCard"
              >
                <a-input
                  size="small"
                  placeholder="Title"
                  v-model="crcCard.title"
                  @blur="closeEditing()"
                  autofocus
                />
              </form>

              <span v-else style="mouse: pointer" @click="openNameInput(crcCard)">
                {{ crcCard.title }}
              </span>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CrcCardList',

  props: {
    openCrcCardId: {
      type: [Number, Boolean],
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    crcCards: [],
    editing: false
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ])
  },

  created () {
    this.loadCrcCards()
  },

  methods: {
    loadCrcCards () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/`

      this.$axios.$get(url)
        .then(crcCards => {
          this.crcCards = crcCards
          this.$emit('updateCrcCards', crcCards)
        })
        .catch(() => {
          this.$message.error('Failed to load Classes')
        })
    },

    openNameInput (mod) {
      this.closeEditing()
      this.editing = mod
    },

    createCrcCard () {
      const defaultName = 'Class'
      const defaultLike = this.crcCards
        .map(card => card.title)
        .filter(title => title.indexOf(defaultName) === 0)
        .map(title => title.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike
        ? defaultLike.pop() + 1
        : 1

      const title = `${defaultName} ${nextNumber}`

      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/`
      this.$axios.$post(url, { title })
        .then(mod => {
          this.crcCards.push(mod)
          this.$emit('updateCrcCards', this.crcCards)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    openCrcCard () {
      const { title } = this.editing
      const payload = { title }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/${this.editing.id}`
      this.$axios.$put(url, payload)
        .then(data => {
          this.$message.success(`Class ${data.title} updated`)
        })
        .catch(() => {
          this.$message.error('Failed to update module')
        })
      this.editing = false
    },

    deleteCrcCard (mod) {
      if (this.editing === mod) {
        this.editing = false
      }

      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/${mod.id}`
      this.$axios.$delete(url)
        .then(() => {
          this.$emit('crcCardDeleted', mod)
          this.$message.warn(`Deleted ${mod.title}`)
          const index = this.crcCards.indexOf(mod)
          this.crcCards.splice(index, 1)
          this.$emit('updateCrcCards', this.crcCards)
        })
        .catch(() => {
          this.$message.error('Failed to delete module')
        })
    },

    closeEditing () {
      if (this.editing) {
        this.openCrcCard()
      }

      this.editing = false
    },

    openCrcCard (mod) {
      this.$emit('crcCardOpen', mod)
    }
  }
}
</script>

<style>
.ant-card-no-padding .ant-card-body {
  padding: 0;
}

.module-item {
  padding: 15px;
  background-color: white;
}

.module-item.module-item-selected {
  /* background-color: #dedede; */
  border: solid 1px #d6c5ff !important;
  color: white !important;
  /* margin: 15px 0; */
  position: relative;
  left: -5px;
  width: calc(100% + 10px);
}
</style>
