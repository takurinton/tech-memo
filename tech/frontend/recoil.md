---
title: Recoil の素振り
head:
  - - meta
    - name: og:title
      content: Recoil の素振り
  - - meta
    - name: twitter:title
      content: Recoil の素振り
  - - meta
    - name: og:description
      content: Recoil という状態管理ライブラリの素振りをした
  - - meta
    - name: twitter:description
      content: Recoil という状態管理ライブラリの素振りをした
---

# {{ $frontmatter.title }}

## Recoil とは何か
Recoil は React で状態管理をするためのライブラリです。  
下で説明していますが、Recoilは、下で説明している Context API の制約・問題を解決するために Facebook によって提唱されている実験的な状態管理ライブラリです。
Atom、Selector という単位を使用してアプリケーションのステートを管理し、各 Atom には一意のキーとそれが管理するデータの一部が含まれています。

- Atom の例

```jsx
const textState = atom({
    key: 'textState',
    default: '',
});
```

- selector の例

```jsx 
const charCountState = selector({
    key: 'charCountState',
    get: ({get}) => {
      const text = get(textState);
      return text.length;
    },
});
```

## 状態管理ライブラリとは
有名なものだと Redux などがあります。React の状態管理ライブラリではアプリケーション全体で状態が一貫していることを保証してくれます。  
これにより、状態管理を一か所にまとめられるというメリットがあります。  
しかし、Redux は状態管理を行なっている store がひとつであるため、アプリケーション上のデータを常に上書きします。たとえばストアの状態を空オブジェクトのみで更新してしまうと、アプリケーション上のデータはすべて消えてしまいます。  
  
また、React のみで状態管理をしようとすると Context API を使用することになりますが Context API にはいくつかの制約があります。  
例えば状態をバケツリレーしてる際には子コンポーネントの状態を変更するときに祖先のコンポーネントまで遡らなければなりません。  
別に状態が変わらない時はいいかもしれないのですが、頻繁に変わると時には向きません。  

## 使い方
ドキュメントのお作法に従います。  

```bash 
npm install recoil
```

React を import し、Recoil で使用できる諸々も import します。

```jsx
import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}
```

次に Atom を定義します。上でも説明した通り Atom は一意に定まる値を設定する必要があります。

```jsx
const textState = atom({
  key: 'textState', // Atom はユニークな ID にする必要がある
  default: '', // initial state 
});
```

次に Recoil で使用することのできる hooks の `useRecoilState()` を使用します。  
引数には先ほど指定した `textState` を渡してあげます。  
お作法的には React hooks と同じように使えるので良さそう。

```jsx
const CharacterCounter = () => {
  return (
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  );
}

const TextInput = () => {
  const [text, setText] = useRecoilState(textState);

  const onChange = e => {
    setText(e.target.value);
  };

  return (
    <div>
      <input type="text" value={ text } onChange={ onChange } /><br />
      文字: { text }
    </div> 
  );
}
```

次に selector を定義します。  
selector は派生状態を表します。
特定の状態を何らかの方法で変更する純粋関数に状態を渡す出力という感じです。

```jsx
const charCountState = selector({
  key: 'charCountState', // ユニークな ID にする
  get: ({get}) => {
    const text = get(textState);

    return text.length;
  },
});

const CharacterCount = () => {
  const count = useRecoilValue(charCountState);
  return (
      <>
        文字数: { count }
      </>
  );
}
```

## まとめ
ブログだったらもっと一生懸命書くけどまあメモ帳なのでこれくらいで  
いい感じに情報を持ち回るやつやりたいからちょっと使うの前向きに検討しようと思ったのですが、preact で使えないとのことなので（多分）もう少し考えます。