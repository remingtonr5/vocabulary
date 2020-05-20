# vocabulary
## input
手書きの英単語のメモをGoogle Cloud Vision APIを使ってJSONに保存する  
洋書を読むときに知らなかった単語を手書きでメモ帳に書いていたが、一覧性が悪すぎる＆キーボードで打つのも面倒臭いということで作った
## test
単語のストックからランダムに呼び出してテスト  
覚えていた単語は以降の出現確率が低くなり、覚えていなかった単語は出現確率が高くなる
## statistic
主にweblioをスクレイピングして単語の学習レベルを記録する用  
そのうち語彙数を区間推定できるような機能も作りたい
### 成果
・英単語の出現確率top10000(https://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/PG/2006/04/1-10000) について学習レベルを調べた結果、743個が時制変化や比較級などの活用による重複であり、除いた9257個のうち学習レベル12(英検1級レベルの上限)以下のものは8116個だった。prefixやsuffixによる重複があるので実際はもっと少ないと思われる。
