---
title: Docker で playwright を導入する際のメモ
head:
  - - meta
    - name: og:title
      content: Docker で playwright を導入する際のメモ
  - - meta
    - name: twitter:title
      content: Docker で playwright を導入する際のメモ
  - - meta
    - name: og:description
      content: playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debine-slim に乗り換えた、いろいろつまづいたのでメモ。
  - - meta
    - name: twitter:description
      content: playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debine-slim に乗り換えた、いろいろつまづいたのでメモ。
  - - meta
    - name: og:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:playwright 導入時のメモ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
  - - meta
    - name: twitter:image
      content: https://res.cloudinary.com/dtapptgdd/image/upload/w_1000/l_text:Sawarabi Gothic_70_bold:playwright 導入時のメモ/v1620370500/Screen_Shot_2021-05-07_at_15.54.47_extlvu.png
---

# {{ $frontmatter.title }}

playwright が alpine で動作しなかった（するようにもできるっぽいけど）ので debine-slim に乗り換えた、いろいろつまづいたのでメモに残す。