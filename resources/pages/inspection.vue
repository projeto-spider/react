<template>
  <div>
    <a-collapse>
      <a-collapse-panel
        v-for="(item, i) in items"
        :key="i"
        :header="item.title"
      >
        <a-row
          v-for="(criterion, j) in item.criteria"
          :key="j"
        >
          <a-col :span="12">
            <a-switch :defaultChecked="criterion.status" @change='status => criterion.status = status'/>
            {{ criterion.title }}
          </a-col>

          <a-col v-if="!criterion.status" :span="12">
            Description
            <a-input v-model="criterion.description" />

            Solution
            <a-input v-model="criterion.solution" />

            Assignee
            <a-input disabled placeholder="TODO" />
          </a-col>
        </a-row>

        <a-collapse v-if="item.subItems">
          <a-collapse-panel
            v-for="(subItem, k) in item.subItems"
            :key="k"
            :header="subItem.title"
          >
            <a-row
              v-for="(criterion, l) in subItem.criteria"
              :key="l"
            >
              <a-col :span="12">
                <a-switch :defaultChecked="criterion.status" @change='status => criterion.status = status'/>
                {{ criterion.title }}
              </a-col>

              <a-col v-if="!criterion.status" :span="12">
                Description
                <a-input v-model="criterion.description" />

                Solution
                <a-input v-model="criterion.solution" />

                Assignee
                <a-input disabled placeholder="TODO" />
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Inspection',

  data: () => ({
    activeKey: [],

    modules: [],
    crcCards: [],
    interfaces: [],
    goals: {},

    inspection: [
    ]
  }),

  computed: {
    ...mapGetters('project', [
      'currentProject'
    ]),

    items () {
      const canvasTitles = [
        'Canvas :: Problem',
        'Canvas :: Solution',
        'Canvas :: Constraints',
        'Canvas :: It is',
        `Canvas :: It isn't`,
        'Canvas :: Personas'
      ]
      const criteria = [
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
      const moduleItems = this.modules.map(mod => [
        {
          title: `Module :: ${mod.title}`,
          criteria: criteria.map(criterion =>
            this.inspectionFor(`mod:${mod.id}:${criterion}`, criterion)
          )
        },
        ...this.goals[mod.id].map(goal => ({
          title: `Module :: ${mod.title} :: Goal :: ${goal.title}`,
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
    }
  },

  created () {
    if (!this.currentProject) {
      return this.$router.push('/projects')
    }

    try {
      this.inspection = JSON.parse(JSON.stringify(this.currentProject.inspection))
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
    ...mapMutations('project', [
      'selectProject'
    ]),

    loadModules () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/modules/`

      return this.$axios.$get(url)
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

    refreshGoals (mod) {
      const baseUrl = `/api/projects/${this.currentProject.id}/modules/${mod.id}`
      const order = mod.goals

      return this.$axios.$get(`${baseUrl}/goals`)
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

    loadInterfaces () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/interfaces/`

      this.$axios.$get(url)
        .then(interfaces => {
          this.interfaces = interfaces
        })
        .catch(() => {
          this.$message.error('Failed to load interfaces')
        })
    },

    loadCrcCards () {
      const { id } = this.currentProject
      const url = `/api/projects/${id}/crc-cards/`

      this.$axios.$get(url)
        .then(crcCards => {
          this.crcCards = crcCards
        })
        .catch(() => {
          this.$message.error('Failed to load Classes')
        })
    },

    inspectionFor (key, criterion) {
      const item = this.inspection.find(item => key === item.key)

      if (item) {
        return item
      }

      const newItem = {
        key,
        title: criterion,
        status: true,
        description: '',
        solution: ''
      }

      this.inspection.push(newItem)

      return newItem
    },

    inspectionChanged: pDebounce(function emitChangeNetwork () {
      const url = `/api/projects/${this.currentProject.id}`
      this.$axios.$put(url, { inspection: this.inspection })
        .then(data => {
          // this.selectProject(this.currentProject)
          Object.assign(this.currentProject.inspection, this.inspection)
        })
        .catch(() => {
          this.$message.error('Failed to update project')
        })
    }, 500)
  },

  watch: {
    inspection: {
      deep: true,
      handler () {
        this.inspectionChanged()
      }
    }
  }
}
</script>
