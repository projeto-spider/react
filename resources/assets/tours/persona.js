const tour = {
  steps: [
    {
      target: '[data-v-step="personas-1"]',
      content: `
        Give a <strong>fake name</strong> for this person.<br>
        <em>"John Doe"</em>, <em>"Jane Doe"</em>
      `
    },

    {
      target: '[data-v-step="personas-2"]',
      content: `
        What's their <strong>job</strong> in this app?<br>
        <em>"Visitor"</em>, <em>"Client"</em>
      `
    },

    {
      target: '[data-v-step="personas-3"]',
      content: `
        Stabilish <strong>character</strong> for this person<br>
        <em>"Client for 27 years"</em>, <em>"Uses her smartphone a lot"</em>
      `
    },

    {
      target: '[data-v-step="personas-4"]',
      content: `
        Define <strong>your aim</strong> for the app to impact in your client<br>
        <em>"Solve common banking problems"</em>, <em>"No need to go to the bank for simple transactions"</em>
      `
    },

    {
      target: '[data-v-step="personas-5"]',
      content: `
        What's the <strong>endgame</strong> for the client<br>
        <em>"Make transactions in their phone"</em>, <em>"Play a fun game"</em>
      `
    }
  ]
}

export default tour
