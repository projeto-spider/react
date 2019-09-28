const tour = {
  steps: [
    {
      target: '[data-v-step="1"]',
      content: `
        Define what's the <strong>problem you're trying to solve</strong>.<br>
        <em>"Manage finances in my workplace"</em>, <em>"The bank lack some mobile features"</em>
      `
    },

    {
      target: '[data-v-step="2"]',
      content: `
        What are your <strong>possible solutions</strong>?<br>
        <em>"Build a better mobile app"</em>, <em>"Enhance the current desktop app"</em>
      `
    },

    {
      target: '[data-v-step="3"]',
      content: `
        Here we state <strong>what we aim</strong> to make of our product<br>
        <em>"A mobile app"</em>, <em>"An offline-ready app"</em>
      `
    },

    {
      target: '[data-v-step="4"]',
      content: `
        Now we state <strong>what we don't want</strong> our product to be<br>
        <em>"A desktop app"</em>, <em>"An app that only work online"</em>
      `
    },

    {
      target: '[data-v-step="5"]',
      content: `
        Define <strong>rules</strong> to make guidelines over the development<br>
        <em>"Should work in modern browsers"</em>, <em>"Must have support for touch-screen"</em>
      `
    },

    {
      target: '[data-v-step="6"]',
      content: `
        For the next step we define <strong>personifications</strong> of possible users<br>
        <em>"John Doe, Bank Manager"</em>, <em>"Jane Doe, Bank Client"</em>
      `
    }
  ]
}

export default tour
