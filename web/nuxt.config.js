import pkg from './package'
import sanityClient from './sanityClient'
const webpack = require('webpack')

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
        src: 'https://code.jquery.com/jquery-1.12.4.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src: 'https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.5.0/js/swiper.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src: '/js/jquery.typewriter.js',
        type: 'text/javascript',
        body: true
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/odometer.js/0.4.8/odometer.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js',
        type: 'text/javascript',
        body: true
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
        type: 'text/javascript',
        body: true
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [{ src: 'normalize.css' }],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/eventInformation' },
    { src: '~/plugins/after-each', mode: 'client' }
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
    postcss: {
      plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
          stage: 3,
          features: {
            'color-mod-function': { unresolved: 'warn' },
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
    vendor: ['jquery', 'bootstrap'],
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery'
        // ...etc.
      })
    ],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
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
    }
  }
}
