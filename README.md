# [みんなのしりとり](https://jig-jp-intern-pre-task.deno.dev/)

## Description
世界中どこでも誰とでも遊ぶことのできるしりとりアプリです

> jig.jp様のインターンの事前課題で作成しました

## Built With
- Deno
- Packup
- React
- SWR
- Firestore

## Features
#### 公開ルーム
世界中のいろんな人としりとりで遊ぶことができます。
次の言葉を送信するとページを開いているすべての人が知ることができます。

#### プライベートルーム
合言葉を設定できるモードです。
同じ合言葉を入力することで同じ部屋に入ることができます。

#### リセットボタン
今までのしりとりの履歴をすべてリセットします。
最初の単語はランダムに決められます。

#### このアプリ上でのしりとりのルール
- 同じ単語は1度しか使用できません。
- 入力はひらがなのみです。
- 入力は20文字までです。
- 最初のワードはランダムで決められます。
- 小書き文字(ゃゅょなど)は大文字としても続けることができます。
- 小書き文字で終わった場合最後の文字からとなります。
- ゐ、ゑ、をで終わった場合い、え、おとして続けることができます。
- 伸ばし棒で終わった場合は一文字前の文字からとなります。
- 伸ばし棒を2文字以上続けて使用できません。
- 伸ばし棒で単語を始めることはできません。
- 「ん」で終わった場合は次の単語は入力できず、最初からとなります。

## Links
- [**みんなのしりとり**](https://jig-jp-intern-pre-task.deno.dev/)
