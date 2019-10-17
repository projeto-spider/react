<template>
  <a-layout>
    <a-layout-sider style="background-color: unset" :width="360">
      <VSiderListCrud
        v-if="currentProject"
        item-label="CRC Card"
        :items="crcCards"
        :open-item-id="openCrcCard && openCrcCard.id"
        :disable-edit="true"
        @open="onOpenCrcCard"
        @create="onCreateCrcCard"
        @delete="onDeleteCrcCard"
      />
    </a-layout-sider>

    <a-layout>
      <a-layout-content>
        <a-row>
          <a-col :span="24">
            <div v-if="!openCrcCard" style="text-align: center">
              <h3>Open a Class</h3>
            </div>

            <div v-else>
              <VCrcCardForm
                :crc-card="openCrcCard"
                :crc-cards="crcCards"
                :modules="modules"
                @update="onUpdateCrcCard"
              />
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import VSiderListCrud from '@/components/VSiderListCrud'
import VCrcCardForm from '@/components/VCrcCardForm'

const defaultModel = () => ({
  properties: '',
  actions: '',
  relations: [],
  modules: []
})

const fakeModule = rest => ({
  id: 1,
  projectId: 1,
  title: 'Module 1',
  goals: [2, 1],
  created_at: '2019-10-10 00:11:36',
  updated_at: '2019-10-10 02:31:06',
  ...rest
})

const fakeCrcCard = rest => ({
  id: 1,
  projectId: 1,
  title: 'Class 1',
  properties: [],
  actions: [],
  relations: [],
  modules: [],
  created_at: '2019-10-10 06:11:37',
  updated_at: '2019-10-10 06:11:37',
  ...rest
})

export default {
  name: 'OverallModel',

  components: { VSiderListCrud, VCrcCardForm },

  data: () => ({
    modules: [],
    crcCards: [],
    goals: [],
    openCrcCard: false,
    openGoal: false,
    journeyGoal: false,
    model: defaultModel(),
    currentProject: {}
  }),

  computed: {
    // ...mapGetters('project', [
    //   'currentProject'
    // ]),

    baseUrl() {
      if (!this.currentProject || !this.openCrcCard) {
        return false
      }

      return `/api/projects/${this.currentProject.id}`
    }
  },

  created() {
    // if (!this.currentProject) {
    //   return this.$router.push('/projects')
    // }

    this.loadModules()
    this.loadCrcCards()
  },

  methods: {
    loadModules() {
      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/modules/`

      // this.$axios.$get(url)
      Promise.resolve([
        fakeModule({ id: 1, title: 'Module A' }),
        fakeModule({ id: 2, title: 'Module B' })
      ])
        .then(modules => {
          this.modules = modules
        })
        .catch(() => {
          this.$message.error('Failed to load modules')
        })
    },

    loadCrcCards() {
      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/crc-cards/`

      // this.$axios.$get(url)
      Promise.resolve([fakeCrcCard()])
        .then(crcCards => {
          this.crcCards = crcCards
        })
        .catch(() => {
          this.$message.error('Failed to load Classes')
        })
    },

    onCreateCrcCard() {
      const defaultName = 'Class'
      const defaultLike = this.crcCards
        .map(card => card.title)
        .filter(title => title.indexOf(defaultName) === 0)
        .map(title => title.split(' ').pop())
        .map(numberString => Number(numberString))
        .filter(x => x)
        .sort()

      const countDefaultLike = defaultLike.length
      const nextNumber = countDefaultLike ? defaultLike.pop() + 1 : 1

      const title = `${defaultName} ${nextNumber}`

      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/crc-cards/`
      // this.$axios.$post(url, { title })
      Promise.resolve(
        fakeCrcCard({
          id: Math.random(),
          title
        })
      )
        .then(mod => {
          this.crcCards.push(mod)
        })
        .catch(() => {
          this.$message.error('Failed to create module')
        })
    },

    onOpenCrcCard(crcCard) {
      this.openCrcCard = false

      setTimeout(() => {
        this.openCrcCard = crcCard
      }, 100)
    },

    onUpdateCrcCard() {
      // const payload = {
      //   properties: crcCard.properties.split('\n'),
      //   actions: crcCard.actions.split('\n'),
      //   relations: crcCard.relations,
      //   modules: crcCard.modules,
      //   title: crcCard.title
      // }
      // this.$axios.$put(`${this.baseUrl}/crc-cards/${this.openCrcCard.id}`, payload)
      //   .then(updated => {
      //     Object.assign(this.openCrcCard, updated)
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to update Class')
      //   })
    },

    onDeleteCrcCard() {
      // const { id } = this.currentProject
      // const url = `/api/projects/${id}/crc-cards/${crcCard.id}`
      // this.$axios.$delete(url)
      //   .then(() => {
      //     this.$message.warn(`Deleted ${crcCard.title}`)
      //     const index = this.crcCards.indexOf(crcCard)
      //     this.crcCards.splice(index, 1)
      //   })
      //   .catch(() => {
      //     this.$message.error('Failed to delete CRC Card')
      //   })
    }
  }
}
</script>

<style></style>
