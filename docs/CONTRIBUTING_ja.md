## 🌐 言語選択

<table align="center">
  <tr>
    <td align="center">
      <a href="../CONTRIBUTING.md">
        <img src="https://flagcdn.com/24x18/gb.png" alt="English" />  
        <br/><strong>English</strong>
      </a>
    </td>
    <td align="center">
      <a href="CONTRIBUTING_km.md">
        <img src="https://flagcdn.com/24x18/kh.png" alt="Khmer" />  
        <br/><strong>ខ្មែរ</strong>
      </a>
    </td>
    <td align="center">
      <a href="CONTRIBUTING_ja.md">
        <img src="https://flagcdn.com/24x18/jp.png" alt="Japanese" />  
        <br/><strong>日本語</strong>
      </a>
    </td>
  </tr>
</table>


<p align="center">
  このプロジェクトを発展させてくださったすべての貢献者、ユーザー、サポーターの皆様に感謝いたします。
</p>

<p align="center">
  🚀 <strong>今後のアップデート、機能、改善にご期待ください。</strong>
</p>

# 🛠️ CheckCleへの貢献

**CheckCle**への貢献にご興味をお持ちいただき、ありがとうございます — リアルタイムフルスタック監視のための究極のオープンソースプラットフォームです。バグの報告、機能の提案、ドキュメントの改善、またはコードの提出など、どのような形でのご貢献でも歓迎いたします！

大小を問わず、あらゆる種類の貢献を歓迎します。このガイドが始めるのに役立ちます。

---

## 📌 目次
- [行動規範](#-行動規範)
- [貢献の方法](#-貢献の方法)
- [開発環境のセットアップ](#-開発環境のセットアップ)
- [プルリクエストのプロセス](#-プルリクエストのプロセス)
- [バグと問題の報告](#-バグと問題の報告)
- [機能リクエスト](#-機能リクエスト)
- [コミュニティとサポート](#-コミュニティとサポート)
- [ライセンス](#-ライセンス)

---

## 📜 行動規範

私たちは[行動規範](https://opensource.guide/code-of-conduct/)に従い、オープンで歓迎するコミュニティを促進しています。参加することで、これらの基準を守ることに同意したものとします。

---

## 🤝 貢献の方法

CheckCleの改善に役立つ方法をいくつか紹介します：

- 🐞 **バグの報告** – 不具合を見つけましたか？[GitHub Issue](https://github.com/operacle/checkcle/issues)を開いてお知らせください。
- 🌟 **機能の提案** – アイデアはありますか？[Discussion](https://github.com/operacle/checkcle/discussions)を始めるか、機能リクエストのissueを開いてください。
- 🛠 **プルリクエストの提出** – コードの改善、バグの修正、機能の追加、ドキュメントの改善を行ってください。
- 📝 **ドキュメントの改善** – タイポの修正でも大変助かります！
- 🌍 **宣伝の協力** – リポジトリに⭐をつけて、SNSでシェアし、他の方にも貢献を呼びかけてください！

---

## 🧰 開発環境のセットアップ

コードに貢献する前に、プロジェクトをローカルで設定してください：

### 1. リポジトリをフォーク
[GitHub](https://github.com/operacle/checkcle)で「Fork」をクリックして、自分のコピーを作成してください。

### 2. フォークをクローン
```bash
git clone https://github.com/yourusername/checkcle.git
cd checkcle
```

### 3. 依存関係のインストール
READMEまたはプロジェクトドキュメントの指示に従って、必要なパッケージをインストールし、ローカル開発サーバーを実行してください。

### 4. ローカル開発の開始
```bash
#Webアプリケーション
cd application/
npm install && npm run dev

#サーバーバックエンド
cd server
./pocketbase serve --dir pb_data

localhostを使用していない場合は、次のコマンドで実行してください (./pocketbase serve --http=0.0.0.0:8090 --dir pb_data)
```

### 5. サービスチェック操作の開始

```bash
#サーバーバックエンド
サービス操作を開始 (PING、HTTP、TCP、DNSのサービスチェック)

cd server/service-operation

go run main.go (localhost接続の場合、.envを変更する必要はありません)
```

### 6. 分散地域エージェントの開始
```bash
#### 1. リポジトリをフォーク
[GitHub](https://github.com/operacle/Distributed-Regional-Monitoring)で「Fork」をクリックして、自分のコピーを作成してください。

#### 2. フォークをクローン
git clone https://github.com/yourusername/Distributed-Regional-Monitoring.git
cd Distributed-Regional-Monitoring

#### 3. Goサービスのインストール（Goサービスがインストールされていることを確認してください）

.env.example -> .envにコピー
.envファイルで地域エージェント設定を変更
そして実行: go run main.go

```

---

## ✅ プルリクエストのプロセス

1. コードが既存のスタイルと命名規則に従っていることを確認してください。
2. 明確で簡潔なコミットメッセージを書いてください。
3. ブランチをプッシュし、`develop`ブランチにプルリクエスト（PR）を開いてください。
4. 意味のあるPRの説明を提供してください（何を/なぜ/どのように）。
5. 関連するissueがある場合はリンクしてください（例：`Closes #12`）。
6. すべてのチェックが通ることを確認してください（例：リンティング、テスト）。

PRをレビューし、必要に応じて変更をリクエストし、準備ができ次第マージします！

---

## 🐛 バグと問題の報告

可能な限り多くの情報を含めてください：
- 明確で説明的なタイトル
- 再現手順
- 期待される動作と実際の動作
- 環境情報（OS、ブラウザ、デバイスなど）
- 該当する場合はスクリーンショットやログ

報告には[Issue Tracker](https://github.com/operacle/checkcle/issues)をご利用ください。

---

## 💡 機能リクエスト

アイデアをお聞かせください！[Discussion](https://github.com/operacle/checkcle/discussions)または機能リクエストのissueを開いてください。[ロードマップ](https://github.com/operacle/checkcle#development-roadmap)に既に記載されていないことを確認してください。

---

## 🌍 コミュニティとサポート

ヘルプが必要ですか？つながりたいですか？

- 💬 [Discordに参加](https://discord.gg/xs9gbubGwX)
- 🗣 [GitHub Discussion](https://github.com/operacle/checkcle/discussions)を開始または参加
- 🐦 [X（Twitter）](https://x.com/tl)でフォロー

---

## 📜 ライセンス

貢献することで、あなたの貢献が[MITライセンス](LICENSE)の下でライセンスされることに同意したものとします。

---

## 🙏 ありがとうございます

CheckCleを一緒に構築できることを嬉しく思います — **コミュニティによる、コミュニティのための**強力な監視プラットフォーム。あなたのサポートは私たちにとってとても大切です！💙