<template>
  <svg
    :width="svgWidth"
    :height="svgHeight"
    style="outline: none"
  >
    <g ref="inside">
      <svg
        :x="x"
        :y="y"
        :width="width"
        :height="height"
        class="shadow"
        :class="{ draggable, dragging, 'content-editable': contentEditable }"
        @mousedown="mouseDownDragging"
        @dblclick="toggleContentEditable"
      >
        <template v-if="type === 'box'">
          <rect
            x="0"
            y="0"
            :width="width"
            :height="height"
            rx="5"
            ry="3"
            fill="white"
            stroke="#d9d9d9"
          ></rect>

          <foreignObject ref="foreign" x="0" y="0" :width="width" :height="height">
            <div
              ref="textDiv"
              xmlns="http://www.w3.org/1999/xhtml"
              class="foreign-div ant-alert ant-alert-info ant-alert-no-icon ant-alert-with-description"
            >
              <span ref="editableSpan" :contenteditable="contentEditable" class="node-text ant-alert-description" v-html="text"></span>
            </div>
          </foreignObject>

          <ellipse
            v-show="touchPoint"
            :x="width - 12"
            :y="height - 12"
            :cx="width - 12"
            :cy="height - 12"
            width="6"
            height="6"
            rx="6"
            ry="6"
            fill="red"
          ></ellipse>
        </template>

        <template v-else-if="type === 'and' || type === 'or'">
          <polygon
            :points="`${width / 2},0 0,${height / 2} ${width / 2},${height} ${width},${height / 2}`"
            style="fill:#f6ffed;stroke:#b7eb8f;stroke-width:1"
          />
          <text x="50%" :y="(height / 2) + 6" fill="#52c41a" style="font-size: 64px;" dominant-baseline="middle" text-anchor="middle">
            {{ type === 'and' ? '×' : '+'}}
          </text>
        </template>
      </svg>
    </g>

    <g v-if="showControls">
      <svg :x="x + (width / 2) - 44" :y="y - 30" :width="width">
        <g>
          <svg
            style="cursor: pointer"
            :x="0 + (type !== 'box' ? 16 : 0)"
            @mousedown="askToDelete"
          >
            <IconTrash style="fill: rgb(140, 140, 140)"/>
          </svg>

          <svg
            style="cursor: pointer"
            :x="32 + (type !== 'box' ? 16 : 0)"
            @click="startLinkMode"
          >
            <IconArrow style="fill: rgb(140, 140, 140)"/>
          </svg>

          <svg
            style="cursor: pointer"
            :x="64"
            @click="toggleTouchPoint"
            v-if="type === 'box'"
          >
            <IconChecked v-if="touchPoint" style="fill: rgb(140, 140, 140)"/>
            <IconUnchecked v-else style="fill: rgb(140, 140, 140)"/>
          </svg>
        </g>
      </svg>

      <svg :x="x + (width / 2) - 44" :y="y + height + 15" :width="width">
        <g>
          <svg
            style="cursor: pointer;"
            :x="0"
            @click="changeType('box')"
          >
            <IconLetter :style="`fill: ${type === 'box' ? '#1890ff' : 'rgb(140, 140, 140)'}`" />
          </svg>

          <svg
            style="cursor: pointer"
            :x="32"
            @click="changeType('and')"
          >
            <IconCross :style="`fill: ${type === 'and' ? '#1890ff' : 'rgb(140, 140, 140)'}`" />
          </svg>

          <svg
            style="cursor: pointer"
            :x="64"
            @click="changeType('or')"
          >
            <IconAdd :style="`fill: ${type === 'or' ? '#1890ff' : 'rgb(140, 140, 140)'}`" />
          </svg>
        </g>
      </svg>

      <template v-if="type === 'box'">
        <ellipse
          :x="x"
          :y="y"
          :cx="x"
          :cy="y"
          width="6"
          height="6"
          rx="6"
          ry="6"
          fill="#c6bde4"
          style="cursor: nw-resize"
          @mousedown="startResize({ fixBottom: true, fixRight: true })"
        ></ellipse>

        <ellipse
          :x="x"
          :y="y"
          :cx="x + width"
          :cy="y"
          width="6"
          height="6"
          rx="6"
          ry="6"
          fill="#c6bde4"
          style="cursor: ne-resize"
          @mousedown="startResize({ fixBottom: true, fixLeft: true })"
        ></ellipse>

        <ellipse
          :x="x"
          :y="y"
          :cx="x"
          :cy="y + height"
          width="6"
          height="6"
          rx="6"
          ry="6"
          fill="#c6bde4"
          style="cursor: sw-resize"
          @mousedown="startResize({ fixTop: true, fixRight: true })"
        ></ellipse>

        <ellipse
          :x="x"
          :y="y"
          :cx="x + width"
          :cy="y + height"
          width="6"
          height="6"
          rx="6"
          ry="6"
          fill="#c6bde4"
          style="cursor: se-resize"
          @mousedown="startResize({ fixTop: true, fixLeft: true })"
        ></ellipse>
      </template>
    </g>
  </svg>
</template>

<script>
import IconPencil from '@/components/icons/pencil'
import IconCross from '@/components/icons/cross'
import IconArrow from '@/components/icons/arrow'
import IconTrash from '@/components/icons/trash'
import IconUnchecked from '@/components/icons/unchecked'
import IconChecked from '@/components/icons/checked'
import IconLetter from '@/components/icons/letter'
import IconAdd from '@/components/icons/add'

const MIN_WIDTH = 100
const MIN_HEIGHT = 50
const INITIAL_WIDTH = 200
const INITIAL_HEIGHT = 100
const DIAMOND_WIDTH = 100
const DIAMOND_HEIGHT = 100

export default {
  name: 'Step',

  components: {
    IconPencil,
    IconCross,
    IconArrow,
    IconTrash,
    IconUnchecked,
    IconChecked,
    IconLetter,
    IconAdd
  },

  props: {
    id: {
      type: Number,
      required: true
    },

    initialType: {
      type: String,
      default: 'and'
    },

    svgWidth: {
      type: Number,
      required: true
    },

    svgHeight: {
      type: Number,
      required: true
    },

    initialText: {
      type: String,
      required: false,
      default: ''
    },

    initialWidth: {
      type: Number,
      default: 200
    },

    initialHeight: {
      type: Number,
      default: 100
    },

    initialTouchPoint: {
      type: Boolean,
      default: false
    },

    initialX: {
      type: Number,
      required: true
    },

    initialY: {
      type: Number,
      required: true
    },

    draggable: {
      type: Boolean,
      default: false
    },

    isNew: {
      type: Boolean,
      default: false
    },

    camera: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    text: '',
    type: 'box',
    x: 0,
    y: 0,
    width: INITIAL_WIDTH,
    height: INITIAL_HEIGHT,
    touchPoint: false,

    dragging: false,
    resizing: false,
    showControls: false,
    contentEditable: false,

    cursorOffset: {
      x: 0,
      y: 0
    },

    dragStart: {
      x: 0,
      y: 0
    },

    fixedPositions: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  }),

  created () {
    this.text = this.initialText
    this.type = this.initialType
    this.x = this.initialX
    this.y = this.initialY
    this.width = this.type !== 'box' ? DIAMOND_WIDTH : Math.max(MIN_WIDTH, this.initialWidth)
    this.height = this.type !== 'box' ? DIAMOND_HEIGHT : Math.max(MIN_HEIGHT, this.initialHeight)
    this.touchPoint = this.initialTouchPoint
    this.contentEditable = this.isNew
    this.showControls = this.isNew
  },

  mounted () {
    this.tryToHighlightEditableSpan()

    if (this.isNew) {
      document.body.addEventListener('mousedown', this.handleClickOutside)
    }
  },

  beforeDestroy () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  },

  methods: {
    mouseDownDragging (e) {
      this.displayControls()

      if (!this.draggable || this.contentEditable) {
        return
      }

      this.cursorOffset.x = e.pageX
      this.cursorOffset.y = e.pageY
      this.dragStart.x = this.x
      this.dragStart.y = this.y
      this.dragging = true

      document.addEventListener('mousemove', this.mouseMoveDragging)
      document.addEventListener('mouseup', this.mouseUpDragging)
    },

    mouseMoveDragging (e) {
      const x = e.pageX
      const y = e.pageY

      this.x = this.dragStart.x + (x - this.cursorOffset.x)
      this.y = this.dragStart.y + (y - this.cursorOffset.y)

      this.$emit('updatePosition', this.id)
    },

    mouseUpDragging () {
      this.dragStart.x = null
      this.dragStart.y = null
      this.dragging = false

      document.removeEventListener('mousemove', this.mouseMoveDragging)
      document.removeEventListener('mouseup', this.mouseUpDragging)
    },

    displayControls () {
      this.showControls = true
      document.body.addEventListener('mousedown', this.handleClickOutside)
    },

    handleClickOutside (e) {
      const clickedInside = e.target.contains(this.$el) || this.$el.contains(e.target)
      if (clickedInside) {
        return
      }

      if (this.contentEditable) {
        this.toggleContentEditable(e)
      }

      this.showControls = false

      document.body.removeEventListener('click', this.handleClickOutside)
    },

    resize () {
      const textWidth = this.$refs.text.getComputedTextLength()
      const blockWidth = textWidth + 20
      this.blockWidth = blockWidth
    },

    startResize ({ fixTop = false, fixBottom = false, fixRight = false, fixLeft = false }) {
      this.fixedPositions.top = fixTop && this.y
      this.fixedPositions.bottom = fixBottom && this.y + this.height
      this.fixedPositions.right = fixRight && this.x + this.width
      this.fixedPositions.left = fixLeft && this.x
      this.resizing = true

      document.addEventListener('mousemove', this.mouseMoveResize)
      document.addEventListener('mouseup', this.mouseUpResizing)
    },

    mouseMoveResize (e) {
      const x = e.pageX + (-this.camera.x)
      const y = e.pageY + (-this.camera.y)

      if (this.fixedPositions.top) {
        this.height = Math.max(MIN_HEIGHT, y - this.fixedPositions.top)
      }

      if (this.fixedPositions.bottom) {
        this.y = Math.max(0, y)
        this.height = Math.max(MIN_HEIGHT, this.fixedPositions.bottom - y)
      }

      if (this.fixedPositions.right) {
        this.x = Math.max(0, x)
        this.width = Math.max(MIN_WIDTH, this.fixedPositions.right - x)
      }

      if (this.fixedPositions.left) {
        this.width = Math.max(MIN_WIDTH, x - this.fixedPositions.left)
      }

      this.$emit('resize', {
        id: this.id,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      })
    },

    mouseUpResizing () {
      this.resizing = false

      document.removeEventListener('mousemove', this.mouseMoveResize)
      document.removeEventListener('mouseup', this.mouseUpResizing)
    },

    toggleContentEditable (e) {
      e.preventDefault()
      e.stopPropagation()

      if (this.type !== 'box') {
        return
      }

      if (this.contentEditable) {
        if (this.$refs.editableSpan) {
          this.text = this.$refs.editableSpan.textContent
          this.$emit('changeText', {
            id: this.id,
            text: this.text
          })
        }

        this.contentEditable = false
        return
      }

      this.contentEditable = true
      setTimeout(() => this.tryToHighlightEditableSpan(), 1)
    },

    toggleTouchPoint (e) {
      this.touchPoint = !this.touchPoint
      this.$emit('changeTouchPoint', {
        id: this.id,
        touchPoint: this.touchPoint
      })
    },

    getInfo () {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        text: this.text,
        touchPoint: this.touchPoint,
        type: this.type
      }
    },

    startLinkMode () {
      if (this.contentEditable) {
        return
      }
      this.$emit('createLink', this.id, this.getInfo())
    },

    tryToHighlightEditableSpan () {
      if (this.contentEditable && this.$refs.editableSpan && this.$refs.editableSpan.focus) {
        this.$refs.editableSpan.focus()

        let range, selection
        if (document.body.createTextRange) {
          range = document.body.createTextRange()
          range.moveToElementText(this.$refs.editableSpan)
          range.select()
        } else if (window.getSelection) {
          selection = window.getSelection()
          range = document.createRange()
          range.selectNodeContents(this.$refs.editableSpan)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    },

    askToDelete () {
      this.$confirm({
        title: 'Do you want to delete this node?',
        onOk: () => {
          this.$emit('deleteNode', this.id)
        },
        onCancel () {}
      })
    },

    changeType (type) {
      if (type === this.type) {
        return
      }

      this.type = type

      this.text = ''

      if (type === 'box') {
        this.width = INITIAL_WIDTH
        this.height = INITIAL_HEIGHT
      } else {
        this.contentEditable = false
        this.width = DIAMOND_WIDTH
        this.height = DIAMOND_HEIGHT
      }

      this.$emit('resize', {
        id: this.id,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      })

      this.$emit('changeType', {
        id: this.id,
        type
      })
    }
  }
}
</script>

<style>
.foreign-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  overflow: hidden;
}

.draggable {
  cursor: grab;
}

.draggable.dragging {
  cursor: grabbing;
  user-select: none;
}

.content-editable {
  cursor: text!important;
}

.node-text {
  width: 100%;
  outline: none;
}
</style>
