import pkg from './package'
import sanityClient from './sanityClient'
import webpack from 'webpack'
import { TweenMax } from 'gsap'
// import objectFitImages from 'object-fit-images'
// import imagesLoaded from 'vue-images-loaded'

const routesQuery = `
  {
    "sessions": *[_type == "session"],
    "speakers": *[_type == "person" && defined(slug.current)]
  }
`

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    //link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    script: [
      {
        src: '@/assets/js/jquery.min.js'
      },
      {
        src: '@/assets/js/plugins.js'
      },
      {
        src: '@/assets/js/scripts.js'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  // loading: false,

  /*
   ** Global CSS
   */
  css: [
    { src: 'normalize.css' },
    { src: '@fortawesome/fontawesome-svg-core/styles.css' }
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/eventInformation' }
    /* { src: '~/plugins/fontawesome' },
    { src: '~/plugins/VueFlickity', ssr: false },
    { src: '~/plugins/vue-isotope', ssr: false },
    { src: '~/plugins/vue-photoswipe', ssr: false },
    { src: '~/plugins/vue-recognizer', ssr: false } */
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa'],
  /*
   ** Set global info from sanity document
   */
  eventInformation: () => {
    return sanityClient.fetch('*[_id == "eventInformation"]').then(res => res)
  },

  /*
   ** Generate dynamic routes from data from sanity.
   ** Used only for generating static served HTML files
   */
  generate: {
    routes: () => {
      return sanityClient.fetch(routesQuery).then(res => {
        return [
          ...res.sessions.map(item => `/sessions/${item._id}`),
          ...res.speakers.map(item => `/speakers/${item.slug.current}`)
        ]
      })
    }
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, ctx) {
      // adding the new loader as the first in the list
      config.module.rules.unshift({
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'responsive-loader',
          options: {
            // disable: isDev,
            placeholder: true,
            quality: 85,
            placeholderSize: 30,
            name: 'img/[name].[hash:hex:7].[width].[ext]',
            adapter: require('responsive-loader/sharp')
          }
        }
      }),
        config.module.rules.forEach(value => {
          if (String(value.test) === String(/\.(png|jpe?g|gif|svg|webp)$/)) {
            // reduce to svg and webp, as other images are handled above
            value.test = /\.(svg|webp)$/
          }
        })
      config.devtool = ctx.isClient ? 'eval-source-map' : 'inline-source-map'
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    // vendor: ['jquery', 'bootstrap', 'TweenMax', 'ScrollToPlugin'],
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ],
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
          stage: 3,
          features: {
            'color-mod-function': {
              unresolved: 'warn'
            },
            'nesting-rules': true,
            'custom-media-queries': {
              preserve: false
            },
            'custom-properties': {
              preserve: false
            }
          }
        }
      }
    },
    transpile: ['TweenMax', 'ScrollToPlugin']
    /*
     ** You can extend webpack config here
     */
  }
}
