
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
        ['meta',{ name:"og:type", content:"website"}],
        ['meta',{ name:"og:url", content:"https://dev.takurinton.com"}],
        ['meta',{ name:"twitter:card", content:"summary_large_image"}],
        ['meta',{ name:"twitter:type", content:"website"}],
        ['meta',{ name:"twitter:url", content:"https://dev.takurinton.com"}],
    ],
    themeConfig: {
      repo: 'takurinton/dev',
      docsBranch: 'main',
      // algolia: {
      //   apiKey: 'b573aa848fd57fb47d693b531297403c',
      //   indexName: 'vitejs'
      // },
      nav: [
        { text: 'このサイトについて', link: '/about/' },
        { text: '技術メモ', link: '/tech/' },
        { text: '日常のメモ', link: '/dairy/' },
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
            link: '/tech/', 
            children: [
              {
                text: 'PHP',
                link: '/tech/php/',
                children: [
                  {
                    text: 'isset と empty について',
                    link: '/tech/php/isset_empty', 
                  },{
                    text: 'compact 関数に関して',
                    link: '/tech/php/compact', 
                  }
                ]
              },
              {
                text: 'フロントエンド',
                link: '/tech/frontend/',
                children: [
                  {
                    text: '構造化データについて',
                    link: '/tech/frontend/struct-data', 
                  },
                  {
                    text: 'wmr と preact-iso について',
                    link: '/tech/frontend/preact-iso', 
                  },
                  {
                    text: 'Recoil の素振り',
                    link: '/tech/frontend/recoil', 
                  },
                  {
                    text: 'Web Components について',
                    link: '/tech/frontend/web-components', 
                  },
                  {
                    text: 'credentials を指定した際に注意するべきこと',
                    link: '/tech/frontend/credentials_all', 
                  },
                  {
                    text: 'lit-html の素振り',
                    link: '/tech/frontend/lit-html', 
                  },
                  {
                    text: 'Vitejs について',
                    link: '/tech/frontend/vite', 
                  },
                  {
                    text: 'haunted が良い',
                    link: '/tech/frontend/haunted', 
                  },
                  {
                    text: 'ESM について',
                    link: '/tech/frontend/esm', 
                  },
                  {
                    text: 'Blitz について学ぶ',
                    link: '/tech/frontend/blitz', 
                  },
                ]
              },
              {
                text: 'インフラ周り',
                link: '/tech/infrastructure/',
                children: [
                  {
                    text: '挙動が怪しい時',
                    link: '/tech/infrastructure/watch', 
                  },
                ]
              },
              // {
              //   text: 'Python',
              //   link: '/tech/python/',
              //   children: [
              //     {
              //       text: '並行処理と並列処理',
              //       link: '/tech/python/multi', 
              //     }
              //   ]
              // },
              {
                text: 'GraphQL',
                link: '/tech/graphql/',
                children: [
                  {
                    text: 'GraphQL 入門（概念）',
                    link: '/tech/graphql/concept', 
                  },
                  {
                    text: 'GraphQL 入門（Go）',
                    link: '/tech/graphql/base_server_go', 
                  },
                  {
                    text: 'GraphQL 入門（preact）',
                    link: '/tech/graphql/base_frontend_preact', 
                  }
                ]
              },
              {
                text: 'http',
                link: '/tech/http/', 
                children: [
                  {
                    text: 'HTTP の意味論',
                    link: '/tech/http/semantics', 
                  },
                  {
                    text: 'Real World HTTP',
                    link: '/tech/http/real-world-http/',
                    children: [
                      {
                        text: '1章',
                        link: '/tech/http/real-world-http/1', 
                      },
                      {
                        text: '2章',
                        link: '/tech/http/real-world-http/2', 
                      }
                    ]
                  },
                ]
              },
              {
                text: '機械学習',
                link: '/tech/ml/',
                children: [
                  {
                    text: '機械学習超入門',
                    link: '/tech/ml/beginner', 
                  },
                  {
                    text: 'クラスタについて',
                    link: '/tech/ml/cluster', 
                  },
                ]
              },
              {
                text: '共通？その他？',
                link: '/tech/common/',
                children: [
                  {
                    text: 'ソフトウェアを構成する12の要素',
                    link: '/tech/common/12-factor', 
                  },
                  {
                    text: 'バンドラを作る',
                    link: '/tech/common/bundler', 
                  },
                ]
              },
            ]
          },
          {
            text: '日常のメモ',
            link: '/dairy/',
            children: [
              {
                text: '臨界フリッカー周波数について',
                link: '/dairy/critical-flicker-frequency'
              },
            ]
          }
        ]
      }
    }, 
    markdown: {
      lineNumbers: true
    }
  }