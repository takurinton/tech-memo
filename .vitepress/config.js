
module.exports = {
    title: 'たくりんとんのメモ帳',
    description: 'たくりんとん',
    head: [
        ['link', { 
            rel: 'icon', 
            type: 'image', 
            href: 'https://www.takurinton.com/me.jpeg' 
        }], 
        ['meta',{ name:"keywords", content:"takurinton 技術メモ"}],
        ['meta',{ name:"og:title", content:"たくりんとん"}],
        ['meta',{ name:"og:description", content:"たくりんとんの技術メモ"}],
        ['meta',{ name:"og:type", content:"website"}],
        ['meta',{ name:"og:url", content:"https://dev.takurinton.com"}],
        ['meta',{ name:"og:image", content:"https://www.takurinton.com/me.jpeg"}],
        ['meta',{ name:"twitter:card", content:"summary_large_image"}],
        ['meta',{ name:"twitter:title", content:"たくりんとん"}],
        ['meta',{ name:"twitter:description", content:"たくりんとんの技術メモ"}],
        ['meta',{ name:"twitter:type", content:"website"}],
        ['meta',{ name:"twitter:url", content:"https://dev.takurinton.com"}],
        ['meta',{ name:"twitter:image", content:"https://www.takurinton.com/me.jpeg"}],
    ],
    themeConfig: {
      repo: 'takurinton/tech-memo',
      docsBranch: 'main',
      algolia: {
        apiKey: 'b573aa848fd57fb47d693b531297403c',
        indexName: 'vitejs'
      },
  
      carbonAds: {
        carbon: 'CEBIEK3N',
        placement: 'vitejsdev'
      },
  
      nav: [
        { text: 'このサイトについて', link: '/about/' },
        { text: '技術メモ', link: '/tech/' },
        {
          text: '外部リンク',
          items: [
            {
              text: 'ポートフォリオ',
              link: 'https://www.takurinton.com/'
            },
            {
                text: 'GitHub',
                link: 'https://github.com/takurinton'
            },
            {
                text: 'Twitter',
                link: 'https://twitter.com/takurinton'
            }
          ]
        }
      ],
  
      sidebar: {
        '/': [
          {
            text: '技術メモ',
            children: [
              {
                text: 'PHP',
                link: '/tech/php/index.html'
              },
              {
                text: 'frontend',
                link: '/tech/frontend/index.html'
              }
            ]
          },
          {
            text: '日常のメモ',
            children: [
              {
                text: '準備中',
              }
            ]
          }
        ]
      }
    }
  }