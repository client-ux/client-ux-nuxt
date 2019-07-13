export default {
  widgets: [
    {
      name: 'sanity-tutorials',
      options: {
        templateRepoId: 'sanity-io/sanity-template-nuxt-events'
      }
    },
    {name: 'structure-menu'},
    {
      name: 'project-info',
      options: {
        __experimental_before: [
          {
            name: 'netlify',
            options: {
              description:
                'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
              sites: [
                {
                  buildHookId: '',
                  title: 'Sanity Studio',
                  name: 'client-ux-nuxt-studio',
                  apiId: '3131c5e3-7b65-486b-a620-201571d925f9'
                },
                {
                  buildHookId: '5d29ffc11f26c48c97e9bf15',
                  title: 'Events Website',
                  name: 'client-ux-nuxt',
                  apiId: 'ee7c08cf-2f03-442f-b51d-614802fb7749'
                }
              ]
            }
          }
        ],
        data: [
          {
            title: 'GitHub repo',
            value: 'https://github.com/client-ux/client-ux-nuxt',
            category: 'Code'
          },
          {title: 'Frontend', value: 'https://client-ux-nuxt.netlify.com', category: 'apps'}
        ]
      }
    },
    {name: 'project-users', layout: {height: 'auto'}},
    {
      name: 'document-list',
      options: {title: 'Recently created sessions', order: '_createdAt desc', types: ['session']},
      layout: {width: 'medium'}
    }
  ]
}
