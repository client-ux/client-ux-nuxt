export default ({ app }) => {
  // eslint-disable-next-line no-unused-vars
  app.router.afterEach((to, from) => {
    // eslint-disable-next-line no-undef
    $(document).trigger('router-loaded')
  })
}
