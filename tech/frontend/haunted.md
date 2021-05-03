---
title: haunted が良い
head:
  - - meta
    - name: og:title
      content: haunted が良い
  - - meta
    - name: twitter:title
      content: haunted が良い
  - - meta
    - name: og:description
      content: Web Components や lit で react hooks が使用できるライブラリがよかったのでまとめた
  - - meta
    - name: twitter:description
      content: Web Components や lit で react hooks が使用できるライブラリがよかったのでまとめた
---

# {{ $frontmatter.title }}

Web Components や lit で react hooks が使用できるライブラリがよかったのでまとめました。  

## haunted って何

[haunted](https://github.com/matthewp/haunted) は Web Components や lit、hyperHTML で react hooks が使用できるライブラリです。  
  
[README](https://github.com/matthewp/haunted#readme) には  

> React's Hooks API but for standard web components and lit-html or hyperHTML.

と書いてあります。  
  
`lit-html` と書いてありますが、自分が試した感じだと `lit-element` などの functional component を使用することができるなら使えそうでした。  


## 使用できる機能

なんか思ったよりも多くの機能がありそうでした。  
以下のものが使用できるみたいです。  
基本的に React hooks で使用できるものは使用できそうです。(一部 `useImperativeHandle` や `useDebugValue` など使用できないものはありますがまあ困らないだろうという印象)  

```ts
import {
  html,
  component,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useContext
} from 'haunted';
```
  
  
`component` というのは `customElements.define` するときにラッピングするものという感じです。  
  
`html` というのは [ここ](https://github.com/matthewp/haunted/blob/master/src/lit-haunted.ts#L1) を見る感じだと `lit-html` の `html` をそのまま export してる感じなのでおそらく脳死で `haunted` だけを install すれば `lit-html` と `hooks` を使用できる状態にしたかったのだと思います。  



## めちゃくちゃ簡単に素振り

#### カウンター

よくあるやつです。  
  
カウントアップをするコンポーネントを作ってみます。  

```ts
// my-counter.ts
import { html } from 'lit-element'
import { component, useState } from 'haunted';

export const Counter = () => {
    // useState を使用することができる
    const [count, setCount] = useState<number>(0);

    // count up の処理
    const handleCount = () => {
        setCount(count+1)
    }

    return html`
    <div id="count">${count}</div>
    <button type="button" @click=${handleCount}>
        count up!!!
    </button>
    `;
}

// component 関数でラッピングする
customElements.define('counter-component', component(Counter));
```

こんな感じで結構簡単に実装することができます。React や preact を使用したことがある人ならお馴染みの光景なのかなと思います。（カウンターを使ってデモをやるあたりまで含めて）  

#### データを取得する

素振りなのでしっかりやらなくていい気もしますが、useEffect くらいも試しておこうかなと思います。  
これは自分のブログの API サーバから id が 50 の投稿を取得するコードです。

```ts
// my-blog.ts
import { html } from 'lit-element'
import { component, useEffect, useState } from 'haunted';

type PostProps = {
    id: number,
    title: string, 
    category: string,
    contents: string, 
    contents_image_url: string,
    pub_date: string,
    comment: CommentProps[]
}

type CommentProps = {
    name: string, 
    contents: string, 
    pub_date: string
}

const initialPost:PostProps = {
    id: 0,
    title: '', 
    category: '', 
    contents: '',
    contents_image_url: '', 
    pub_date: '', 
    comment: []
}

export const Blog = () => {
    const [response, setResponse] = useState<PostProps>(initialPost);
    const [loading, setLoading] = useState<boolean>(true);

    // useEffect が普通に使える
    useEffect(() => {
        // これは僕のブログのエンドポイント
        fetch('https://api.takurinton.com/blog/v1/post/50')
        .then(res => res.json())
        .then(json => {
            setResponse(json);
            setLoading(false);
        })
        .catch(err => console.error(err));
    }, []);

    return html`
    <h1>blog</h1>
    <div>
    ${loading ? 
        `loading...` :
        `${response.title}`
    }
    </div>
    `;
}

customElements.define('blog-component', component(Blog));
```

こんな感じで問題なく使用することができます。  
適用方法は普通の web components と同じように html 側で呼び出すことができます。便利！  

## 補足

設定ファイルは以下のようになっています。  
設定ファイルは `package.json`、`tsconfig.json`、`vite.config.ts` の3つです。  
構成はルートに `index.html` がいて、`src/` にそれぞれの ts ファイルが置いてあるといった感じです。  

```json
// package.json
{
  "name": "suburi",
  "version": "0.0.0",
  "main": "dist/index.es.js",
  "exports": {
    ".": "./dist/index.es.js"
  },
  "types": "types/my-element.d.ts",
  "files": [
    "dist",
    "types"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "haunted": "^4.7.1",
    "lit-element": "^2.4.0"
  },
  "devDependencies": {
    "vite": "^2.2.3",
    "typescript": "^4.1.3"
  }
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "lib": ["es2017", "dom", "dom.iterable"],
    "types": ["vite/client"],
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./types",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit-element/
    }
  }
})
```

## まとめ

最近 Web Components に興味を持って、UI の分割や style のスコープで区切るなどの良い感じな書き方はできるけど状態管理などは切り離す必要があるなあなど想像していたらこんなものがあったので描いてみました。  
React の構文がまんま使える感じがして、複雑にならないアプリケーションならこれで良いのではないかなと思いました。これからの UI やフロントエンドは React を使うにしても剥がしやすい構成（=標準に近い形や責務の適切な分割）にする必要があるのでちょうど良いものがあってよかったです（存在自体は結構前からあったっぽい、僕が知らなかっただけ）。  
