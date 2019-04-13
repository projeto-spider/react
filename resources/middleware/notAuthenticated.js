export default function ({ store, redirect }) {
  console.log(store, store.state.auth.user)
  if (store.state.auth.user) {
    return redirect('/')
  }
}
