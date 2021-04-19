---
title: GraphQL に入門した（preact）
head:
  - - meta
    - name: og:title
      content: GraphQL に入門した（preact）
  - - meta
    - name: twitter:title
      content: GraphQL に入門した（preact）
  - - meta
    - name: og:description
      content: GraphQL に入門しました。フロントエンドの実装です。preact を使用しています。
  - - meta
    - name: twitter:description
      content: GraphQL に入門しました。フロントエンドの実装です。preact を使用しています。
---

# {{ $frontmatter.title }}

## はじめに

最近、GraphQL に入門したので preact でフロントエンドを実装しました。BFF などは噛ませておらず、シンプルな構成になっています。  
[GraphQL に入門した（概念）](/tech/graphql/concept)で触れた内容は省略します。  
  

最終的なコードは以下のようになります。  

- [repo](https://github.com/takurinton/graphql_suburi)
- [ここで触れる preact のコード](https://github.com/takurinton/graphql_suburi/tree/main/frontend)
- 使用ライブラリ
    - [preact](github.com/preactjs/preact)
    - [vite](github.com/vitejs/vite)
    - [@urql/preact](https://github.com/FormidableLabs/urql)
    - [graphql](https://github.com/graphql/graphql-js)

  
ディレクトリ構成としては以下のようになっています。  

- src
    - pages
        - ページコンポーネントが入っている
    - querys
        - query が入っている
        - mutation は未実装
    - router
        - 自作のルーターが入っている
        - preact-router と同じ動きをする
    - App.jsx
        - ルーターを呼び出してる
    - main.jsx
        - render する場所
- vite.config.js
    - vite でバンドルする設定ファイル
- index.html
    - エントリポイント


## 実装するもの

簡単な TODO リストを実装してみたいと思います。  
フロントエンドは取得だけをします。ごめんなさい。あとで投稿もできるようにするので。（今の段階で TODO リストと呼べるのか怪しい）  
データの形式は以下のような形になっています。 （サーバサイドから引用）  


```sql
MariaDB > show columns from todo;
+------------+---------------+------+-----+---------------------+----------------+
| Field      | Type          | Null | Key | Default             | Extra          |
+------------+---------------+------+-----+---------------------+----------------+
| id         | int(11)       | NO   | PRI | NULL                | auto_increment |
| title      | varchar(127)  | YES  |     | NULL                |                |
| content    | varchar(1023) | YES  |     | NULL                |                |
| is_active  | tinyint(1)    | NO   |     | 1                   |                |
| created_at | timestamp     | NO   |     | current_timestamp() |                |
| updated_at | timestamp     | NO   |     | current_timestamp() |                |
+------------+---------------+------+-----+---------------------+----------------+
6 rows in set (0.001 sec)
```

## Query を定義する

まずはフロントエンドからリクエストを投げる際に使用する query を定義します。  
`PostQuery` では `Int` 型の引数を受け取るようにしています。  

```jsx
// querys/querys.js

export const PostQuery = `
query PostQuery($id: Int){
  post (id: $id){
    id
    title
    content
    is_active
    created_at
  }
}
`
export const PostsQuery = `
query PostsQuery {
  posts {
    id
    title
    content
    is_active
    created_at
  }
}
`
```

## ページを作成する

本質ではないので基本的な構成などはコードから理解してください。ここでは `Posts.jsx`、`Post.jsx` についてのみ説明します。  

#### TODO 一覧を取得する
TODO の一覧を取得するためには query の定義が必要です。ということで先ほど定義した query を使用して書いていきます。  
  
```jsx
const { data, fetching, error } = result
if (fetching) return <p>Loading...</p>
if (error) return <p>Oh no... {error.message}</p>
```

この部分ですが、ドキュメントに記載があった通りに実装しました。一般的な書き方がわからないので有識者の方教えてください。  
  
全体は以下のようになります。  
あまり難しことはしていないので react の hook がわかれば問題ないと言った感じです。

```jsx
// pages/Posts.jsx

import { Link } from '../router/prefetch';
import { PostsQuery } from '../querys/querys';
import { useQuery } from '@urql/preact';

import { Post } from './Post';

export const Posts = () => {
    const [result] = useQuery({
      query: PostsQuery,
    });
    
    const { data, fetching, error } = result
    if (fetching) return <p>Loading...</p>
    if (error) return <p>Oh no... {error.message}</p>

    return (
      <>
      <h1>All Posts</h1>
      {
        data.posts.map(post => 
          <Link href={`/post/${post.id}`}>
            <Post id={post.id}>{ post.title }</Post>
          </Link>
        )
      }
      </>
    )
}
```
#### TODO を取得する

TODO の一覧を取得する際は以下のような形になります。
この部分で引数を渡すことができます。これはライブラリの使用ではなく GeaphQL の仕様です。覚えておくようにしましょう。  
  
```jsx
const [result] = useQuery({
    query: PostQuery,
    variables: { id },
});
```

全体のコードは以下のような形になります。

```jsx
// pages/Post.jsx

import { PostQuery } from '../querys/querys';
import { useQuery } from '@urql/preact';

export const Post = ({ id }) => {
    const [result] = useQuery({
      query: PostQuery,
      variables: { id },
    });
    
    const { data, fetching, error } = result  
    if (fetching) return <p>Loading...</p>
    if (error) return <p>Oh no... {error.message}</p>
    
    return (
      <>
        <h1>title: { data.post.title }</h1>
      </>
    )
}
```

## まとめ
このようにしてライブラリを使用すれば簡単にリクエストを投げることができることを知りました。  
また、手を動かさないとわからないことがたくさんあるので(GraphQLもそのパターン)、みなさん手を動かして知識を習得していきましょう。  
