# 資安小特工：像素任務 🛡️

一款**像素風格的 2D 網頁解謎遊戲**，用大約 **20 分鐘**帶著高中生**邊玩邊學**網頁與 App 的資訊安全（資安）觀念。全程有像素小助手「**位元君**」講解技術，並可在設定中開啟／關閉**提示模式**。

> 目標對象：高中生與資安初學者。內容以生活化情境呈現，重觀念、輕術語。
>
> 線上遊玩（GitHub Pages）：https://google-fb.github.io/pixel-sec/

![title](docs/screenshot-title.png)

## ✨ 特色

- **6 個互動關卡**，每關聚焦一個真實資安主題，循序解鎖。
- **小助手「位元君」**：每關開場會用白話講解技術原理，答對／答錯即時反應。
- **提示模式（可於設定開關）**：開啟後可請位元君一步步給線索；用越少提示，星星越多。
- **像素美術 + CRT 掃描線**：自訂復古調色盤、像素字型（Zpix）、8-bit 音效。
- **進度自動保存**：關卡進度與設定存於瀏覽器 `localStorage`。
- **響應式 + 無障礙**：支援桌機與手機；鍵盤可操作、`prefers-reduced-motion` 會關閉動畫。

## 🧩 關卡與學習重點

| # | 關卡 | 主題 | 你會學到 |
|---|------|------|----------|
| 1 | 強密碼工坊 | 密碼安全 | 密碼長度 > 複雜度、字典攻擊、密碼管理員、即時「破解時間」估算 |
| 2 | 釣魚郵件偵測 | 社交工程 | 檢查寄件網域、連結真實網址、仿冒網域、緊急感話術 |
| 3 | 密碼學實驗室 | 加密 / HTTPS | 明文 vs 密文、凱撒密碼、為什麼要用 HTTPS 與鎖頭 |
| 4 | 雙重驗證關卡 | 帳號防護 | 2FA 原理、TOTP 動態碼、簡訊 OTP 的風險 |
| 5 | App 權限稽核 | 隱私 / 權限 | 最小權限原則、過度索取權限的警訊 |
| 6 | 輸入驗證防線 | Web 漏洞 | SQL Injection 實際示範、參數化查詢、縱深防禦 |

每關結束都會附上一則「**帶回家的資安行動**」，把知識變成生活習慣。

## 🚀 本機執行

需求：Node.js 20+（建議 22）。

```bash
git clone https://github.com/google-fb/pixel-sec.git
cd pixel-sec
npm install
npm run dev
# 打開瀏覽器： http://127.0.0.1:43917/
```

其他指令：

```bash
npm run build     # 產生正式版到 dist/
npm run preview   # 預覽 dist/（同樣使用埠號 43917）
npm run lint      # oxlint 靜態檢查
```

推送到 `main` 後，GitHub Actions 會自動建置並部署到 GitHub Pages。

## 🛠️ 技術梯

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)（`@tailwindcss/vite`）
- [Zustand](https://github.com/pmndrs/zustand)（狀態管理 + `localStorage` 持久化）
- Web Audio API（純程式產生的 8-bit 音效，無音檔）
- 像素中文字型 [Zpix 最像素](https://github.com/SolidZORO/zpix-pixel-font)（已修正 OS/2 表並轉為 WOFF2 自架）

## 📁 專案結構

```
src/
  App.tsx                 # 依遊戲階段切換畫面
  types.ts                # 型別定義
  data/levels.ts          # 關卡文案（簡報、提示、學習重點）
  store/gameStore.ts      # Zustand 狀態 + 進度／設定持久化
  lib/                    # sfx 音效、密碼強度、色彩、工具
  components/             # Assistant 小助手、TopBar、Settings、UI 元件
  screens/                # Title / Map / Level / Summary 畫面
  levels/                 # 6 個關卡元件 + 共用 context（提示、成功判定）
  assets/Zpix.woff2       # 自架像素字型（依遊戲用字 subset）
.github/workflows/        # GitHub Pages 自動部署
```

## ♿ 設定與無障礙

- **設定**（右上角）：提示模式、音效、CRT 掃描線特效、重置進度。
- 尊重系統的「減少動態效果」偏好；主要互動皆可用鍵盤操作，並提供 `aria` 標籤。

## 📜 字型授權

像素字型為 **Zpix（最像素）**，版權與授權請見其[官方儲存庫](https://github.com/SolidZORO/zpix-pixel-font)。本專案僅將其修正字型表並轉檔為 WOFF2 作為靜態資源使用。

## 📄 授權

程式碼採用 MIT License。
