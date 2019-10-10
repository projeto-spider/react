<template>
  <div id="app" ref="parent" @wheel="onWheel">
    <svg class="main-svg" :width="width" :height="height" :style="`transform: scale(${zoom}) translate(${camera.x}px, ${camera.y}px)`">
      <rect
        x="0"
        y="0"
        :width="width"
        :height="width"
        fill="#F0F2F5"
        class="bg-rect"
        :class="{ 'bg-rect-grabbing': grabbing }"
        @mousedown="onGrab"
        @mouseup="onGrabOut"
        @click="stopLinkMode"
        @dblclick="handleDoubleRectClick"
      ></rect>

      <Arrow
        v-for="edge in edges"
        :key="`edge:${edge.id}`"
        :id="edge.id"
        :svg-width="width"
        :svg-height="height"
        :from="positions[edge.from]"
        :to="positions[edge.to]"
        @click.native="handleArrowClick(edge.id)"
      />
      <Arrow
        v-if="nextEdgeFrom && (nextEdgeTo || mousePosition)"
        :key="`edge:new`"
        :svg-width="width"
        :svg-height="height"
        :from="nextEdgeFrom"
        :to="nextEdgeTo || {...mousePosition, width: 1, height: 1}"
        @click.native="stopLinkMode"
      />
      <Step
        v-for="node in nodes"
        :key="`node:${node.id}`"
        :ref="`node:${node.id}`"
        :id="node.id"
        :initial-text="node.text"
        :initial-type="node.type"
        :initial-filename="node.filename || ''"
        :initial-folder="node.folder || ''"
        :initial-tool="node.tool || ''"
        :svg-width="width"
        :svg-height="height"
        :initial-x="node.x"
        :initial-y="node.y"
        :initial-touch-point="node.touchPoint"
        :is-new="node.isNew"
        :camera="camera"
        draggable
        @updatePosition="handleUpdatePosition"
        @createLink="handleCreateLink"
        @resize="handleStepResize"
        @changeText="handleChangeText"
        @deleteNode="handleDeleteNode"
        @changeTouchPoint="handleChangeTouchPoint"
        @changeType="handleChangeType"
        @updatedForm="handleUpdatedForm"
        @click.native="handleStepClick()"
      />
    </svg>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import Step from './Step'
import Arrow from './Arrow'

export default {
  name: 'Diagram',

  components: { Step, Arrow },

  props: {
    initialNodes: {
      type: Array,
      default: () => []
    },

    initialEdges: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    zoom: 1,
    width: 4000,
    height: 4000,
    camera: {
      x: -2000,
      y: -2000
    },
    nodes: [],
    edges: [],
    positions: {},
    nextEdgeFromId: false,
    nextEdgeFrom: {},
    mousePosition: false,
    grabbing: false
  }),

  created () {
    for (let node of this.initialNodes) {
      this.nodes.push(Object.assign({}, node))
    }
  },

  mounted () {
    document.body.classList.add('full-width-modal-open')
    this.handleResize()

    for (let node of this.nodes) {
      this.handleUpdatePosition(node.id)
    }

    for (let edge of this.initialEdges) {
      this.edges.push(Object.assign({}, edge))
    }

    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy () {
    document.body.classList.remove('full-width-modal-open')
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('mousemove', this.onMouseMove)
  },

  computed: {
    nextEdgeToId () {
      if (!this.mousePosition) {
        return false
      }

      const { x, y } = this.mousePosition

      const found = this.nodes
        // reverse (prioritize newest nodes)
        .map((x, i, arr) => arr[arr.length - i - 1])
        .map(({ id }) => {
          const rect = this.positions[id]
          return rect && { id, rect }
        })
        .filter(x => x)
        .find(({ rect }) => isPointInside(rect, [x, y]))

      return found && found.id
    },

    nextEdgeTo () {
      return this.nextEdgeToId && this.positions[this.nextEdgeToId]
    }
  },

  methods: {
    handleResize () {
      this.updateCamera()
    },

    onGrab (e) {
      const x = e.pageX
      const y = e.pageY

      this.grabbing = {
        x,
        y
      }
      window.addEventListener('mousemove', this.onMouseMove)
    },

    onGrabOut () {
      window.removeEventListener('mousemove', this.onMouseMove)
      this.grabbing = false
    },

    onGrabMove (e) {
      const deltaX = e.pageX - this.grabbing.x
      const deltaY = e.pageY - this.grabbing.y
      this.updateCamera(deltaX, deltaY)
      this.grabbing.x = e.pageX
      this.grabbing.y = e.pageY
    },

    updateCamera (deltaX = 0, deltaY = 0) {
      const { width, height } = document.body.getBoundingClientRect()
      const visibleWidth = this.width - width
      const visibleHeight = this.height - height
      this.camera.x = Math.max(-visibleWidth, Math.min(0, this.camera.x + deltaX))
      this.camera.y = Math.max(-visibleHeight, Math.min(0, this.camera.y + deltaY))
    },

    handleStepResize ({ id }) {
      this.handleUpdatePosition(id)
    },

    handleChangeText ({ id }) {
      this.handleUpdatePosition(id)
    },

    handleUpdatePosition (id) {
      const ref = this.$refs[`node:${id}`][0]
      this.positions = Object.assign({}, this.positions, { [id]: ref.getInfo() })
      this.emitChangeNetwork()
    },

    handleDeleteNode (id) {
      this.edges = this.edges.filter(edge => edge.from !== id && edge.to !== id)
      this.nodes = this.nodes.filter(node => node.id !== id)
      this.positions[id] = undefined
      this.emitChangeNetwork()
    },

    handleChangeTouchPoint ({id}) {
      this.handleUpdatePosition(id)
    },

    handleChangeType ({ id, type }) {
      this.handleUpdatePosition(id)
    },

    handleUpdatedForm (id) {
      this.handleUpdatePosition(id)
    },

    handleStepClick (stepId) {
      if (!this.nextEdgeFromId || !this.nextEdgeToId) {
        return
      }

      const highestId = Math.max(...this.edges.map(({ id }) => id))
      const id = this.edges.length ? highestId + 1 : 1
      const from = this.nextEdgeFromId
      const to = this.nextEdgeToId

      this.edges.push({
        id,
        from,
        to
      })

      this.nextEdgeFromId = false
      this.nextEdgeFrom = {}
    },

    stopLinkMode (e) {
      this.nextEdgeFrom = false
      this.nextEdgeFromId = false
    },

    handleDoubleRectClick (e) {
      const highestId = Math.max(...this.nodes.map(({ id }) => id))
      const id = this.nodes.length ? highestId + 1 : 1
      const type = 'box'
      const width = 200
      const height = 100
      const filename = ''
      const folder = ''
      const tool = ''

      const x = Math.abs(this.camera.x) + e.pageX - (width * 0.5)
      const y = Math.abs(this.camera.y) + e.pageY - (height * 0.5)
      const isNew = true

      this.nodes.push({
        id,
        type,
        x,
        y,
        width,
        height,
        isNew,
        filename,
        folder,
        tool
      })

      // Wait for ref to be generated
      Promise.resolve().then(() => {
        this.handleUpdatePosition(id)
      })
    },

    handleCreateLink (id, from) {
      this.nextEdgeFromId = id
      this.nextEdgeFrom = from

      window.addEventListener('mousemove', this.onMouseMove)
    },

    onMouseMove (e) {
      if (this.grabbing) {
        return this.onGrabMove(e)
      }

      if (!this.nextEdgeFrom) {
        return window.removeEventListener('mousemove', this.onMouseMove)
      }

      this.mousePosition = {
        x: e.pageX + (-this.camera.x),
        y: e.pageY + (-this.camera.y)
      }
    },

    handleArrowClick (id) {
      this.edges = this.edges.filter(edge => edge.id !== id)
    },

    onWheel (e) {
      if (!e.ctrlKey) {
        return
      }

      e.preventDefault()
      e.stopPropagation()

      const delta = -(e.deltaY / 1000)
      this.zoom = Math.max(1, this.zoom + delta)
      this.handleResize()
    },

    emitChangeNetwork: pDebounce(function emitChangeNetwork () {
      const nodes = this.nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y,
        type: node.type,
        width: node.width,
        height: node.height,
        text: node.text,
        touchPoint: node.touchPoint,
        ...this.positions[node.id]
      }))
      const edges = this.edges.map(edge => ({
        id: edge.id,
        from: edge.from,
        to: edge.to
      }))

      this.$emit('changeNetwork', {
        nodes,
        edges
      })
    }, 500)
  },

  watch: {
    nodes: {
      deep: true,
      handler () {
        this.emitChangeNetwork()
      }
    },

    edges: {
      deep: true,
      handler () {
        this.emitChangeNetwork()
      }
    }
  }
}

function isPointInside (rect, [x, y]) {
  const top = rect.y
  const bottom = top + rect.height
  const left = rect.x
  const right = left + rect.width

  const insideX = x >= left && x <= right
  const insideY = y >= top && y <= bottom

  return insideX && insideY
}
</script>

<style scoped>
.main-svg {
  user-select: none;
}

.bg-rect {
  cursor: grab;
}
.bg-rect.bg-rect-grabbing {
  cursor: grabbing;
}
</style>
