<template>
  <div v-if="!readOnly">
    <div class="ant-collapse">
      <div
        v-for="(item, i) in items"
        :key="i"
        role="tablist"
        class="ant-collapse-item"
        :class="{ 'ant-collapse-item-active': openTabs[i] }"
        :header="item.title"
      >
        <div
          role="button"
          tabindex="0"
          aria-expanded="true"
          class="ant-collapse-header ant-collapse-header-multi-names"
          @click.prevent="$set(openTabs, i, !openTabs[i])"
        >
          <i class="arrow anticon anticon-right"
            ><svg
              viewBox="64 64 896 896"
              data-icon="right"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              class=""
            >
              <path
                d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"
              /></svg
          ></i>

          <span v-for="(title, j) in item.title.split(' :: ')" :key="j">
            {{ title || 'Untitled' }}
          </span>
        </div>

        <div
          v-if="openTabs[i]"
          class="ant-collapse-content ant-collapse-content-active"
        >
          <div class="ant-collapse-content-box">
            <div v-if="item.isGoal" style="margin-bottom: 10px;">
              This inspection is reflects the <strong>Goal</strong> itself, it's
              <strong>Journey</strong> and it's <strong>User Stories</strong>.
            </div>

            <a-row v-for="(criterion, j) in item.criteria" :key="j">
              <a-col :span="12">
                <a-switch
                  :default-checked="criterion.status"
                  @change="status => (criterion.status = status)"
                />

                <span
                  v-for="(part, k) in criterion.title.split(' :: ')"
                  :key="k"
                >
                  {{ part }}
                </span>
              </a-col>

              <a-col v-if="!criterion.status" :span="12">
                Description
                <a-input v-model="criterion.description" />

                Solution
                <a-input v-model="criterion.solution" />

                Assignee
                <a-input disabled placeholder="TODO" />

                Status
                <a-select v-model="criterion.progress" style="width: 100%">
                  <a-select-option :value="0">
                    To Do
                  </a-select-option>
                  <a-select-option :value="1">
                    Doing
                  </a-select-option>
                  <a-select-option :value="2">
                    Done
                  </a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <a-row>
      <a-col :span="8">
        <h2>To Do</h2>
        <VInspectionBacklogItems
          :items="
            readOnlyItems.filter(({ criterion }) => criterion.progress === 0)
          "
        />
      </a-col>

      <a-col :span="8">
        <h2>Doing</h2>
        <VInspectionBacklogItems
          :items="
            readOnlyItems.filter(({ criterion }) => criterion.progress === 1)
          "
        />
      </a-col>

      <a-col :span="8">
        <h2>Done</h2>
        <VInspectionBacklogItems
          :items="
            readOnlyItems.filter(({ criterion }) => criterion.progress === 2)
          "
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import { mapGetters, mapMutations } from 'vuex'
import VInspectionBacklogItems from '@/components/VInspectionBacklogItems'

export default {
  name: 'Inspection',

  components: { VInspectionBacklogItems },

  props: {
    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    activeKey: [],
    openTabs: {},

    modules: [],
    crcCards: [],
    interfaces: [],
    goals: {},

    inspection: []
  }),

  computed: {
    ...mapGetters('project', ['currentProject']),

    items() {
      const canvasTitles = [
        'Canvas :: Problem',
        'Canvas :: Solution',
        'Canvas :: Constraints',
        'Canvas :: It is',
        'Canvas :: It isn\'t', // eslint-disable-line
        'Canvas :: Personas'
      ]
      const criteria = this.currentProject.criteria || [
        'Independent',
        'Negotiable',
        'Valuable',
        'Estimable',
        'Small',
        'Testable'
      ]

      const canvasItems = canvasTitles.map(title => ({
        title,
        criteria: criteria.map(criterion =>
          this.inspectionFor(`${title}:${criterion}`, criterion)
        )
      }))
      // const moduleItems = this.modules.map(mod => ({
      //   title: `Module :: ${mod.title}`,
      //   criteria: criteria.map(criterion =>
      //     this.inspectionFor(`${mod.id}:${criterion}`, criterion)
      //   ),
      //   subItems: (console.log(this.goals[mod.id]) || this.goals[mod.id] || []).map(goal => ({
      //     title: `Goal :: ${goal.title}`,
      //     criteria: criteria.map(criterion =>
      //       this.inspectionFor(`${goal.id}:${criterion}`, criterion)
      //     )
      //   }))
      // }))
      const moduleItems = this.modules
        .map(mod => [
          {
            title: `Module :: ${mod.title}`,
            criteria: criteria.map(criterion =>
              this.inspectionFor(`mod:${mod.id}:${criterion}`, criterion)
            )
          },
          ...this.goals[mod.id].map(goal => ({
            title: `Module :: ${mod.title} :: Goal :: ${goal.title}`,
            isGoal: true,
            criteria: criteria.map(criterion =>
              this.inspectionFor(`goal:${goal.id}:${criterion}`, criterion)
            )
          }))
        ])
        .reduce((acc, x) => acc.concat(x), [])
      const backlogItems = []
      const overallModelItems = this.crcCards.map(crcCard => ({
        title: `Class :: ${crcCard.title}`,
        criteria: criteria.map(criterion =>
          this.inspectionFor(`class:${crcCard.id}:${criterion}`, criterion)
        )
      }))
      const interfaceItems = this.interfaces.map(interfac => ({
        title: `Interface :: ${interfac.title}`,
        criteria: criteria.map(criterion =>
          this.inspectionFor(`interface:${interfac.id}:${criterion}`, criterion)
        )
      }))

      return canvasItems
        .concat(moduleItems)
        .concat(backlogItems)
        .concat(overallModelItems)
        .concat(interfaceItems)
    },

    readOnlyItems() {
      if (!this.readOnly) {
        return []
      }

      return this.items
        .map(item =>
          item.criteria
            .filter(criterion => criterion.status === false)
            .map(criterion => ({
              item,
              criterion
            }))
        )
        .reduce((acc, x) => acc.concat(x), [])
    }
  },

  watch: {
    inspection: {
      deep: true,
      handler() {
        this.inspectionChanged()
      }
    }
  },

  created() {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    try {
      const parsed = JSON.parse(JSON.stringify(this.currentProject.inspection))
      this.inspection = Array.isArray(parsed) ? parsed : []
    } catch (err) {
      this.inspection = []
    }

    this.loadModules()
      .then(modules =>
        Promise.all(
          modules.map(mod =>
            this.refreshGoals(mod).then(goals => ({
              module: mod,
              goals
            }))
          )
        )
      )
      .then(modulesWithGoals => {
        this.goals = modulesWithGoals.reduce((acc, item) => {
          acc[item.module.id] = item.goals
          return acc
        }, {})
      })

    this.loadInterfaces()
    this.loadCrcCards()
  },

  methods: {
    ...mapMutations('project', ['selectProject']),

    loadModules() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`

      return this.$axios
        .$get(url)
        .then(modules => {
          for (let mod of modules) {
            this.goals[mod.id] = []
          }

          this.modules = modules
          return modules
        })
        .catch(() => {
          this.$message.error('Failed to load modules')
        })
    },

    refreshGoals(mod) {
      const baseUrl = `/api/projects/${this.currentProject.id}/modules/${mod.id}`
      const order = mod.goals

      return this.$axios
        .$get(`${baseUrl}/goals`)
        .then(goals => {
          return order
            .map(id => goals.find(goal => goal.id === id))
            .filter(x => x)
        })
        .catch(() => {
          this.$message.error('Failed to load goals')
          throw new Error('Failed')
        })
    },

    loadInterfaces() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/`

      this.$axios
        .$get(url)
        .then(interfaces => {
          this.interfaces = interfaces
        })
        .catch(() => {
          this.$message.error('Failed to load interfaces')
        })
    },

    loadCrcCards() {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/`

      this.$axios
        .$get(url)
        .then(crcCards => {
          this.crcCards = crcCards
        })
        .catch(() => {
          this.$message.error('Failed to load Classes')
        })
    },

    inspectionFor(key, criterion) {
      if (!this.inspection) {
        this.inspection = []
      }

      const item = this.inspection.find(item => key === item.key)

      if (item) {
        return item
      }

      const newItem = {
        key,
        title: criterion,
        status: true,
        description: '',
        solution: '',
        progress: 0
      }

      this.inspection.push(newItem)

      return newItem
    },

    inspectionChanged: pDebounce(function emitChangeNetwork() {
      const url = `/api/projects/${this.currentProject.id}`
      this.$axios
        .$put(url, { inspection: this.inspection })
        .then(() => {
          // this.selectProject(this.currentProject)
          Object.assign(this.currentProject.inspection, this.inspection)
        })
        .catch(() => {
          this.$message.error('Failed to update project')
        })
    }, 500)
  }
}
</script>

<style scoped>
.ant-collapse-header-multi-names > span {
}

.ant-collapse-header-multi-names span:not(:last-child):after {
  content: ' :: ';
  display: inline;
}

.ant-collapse-header-multi-names span:last-child {
  font-weight: bold;
}
</style>
