# 資安小特工：像素任務

像素風格 2D 網頁解謎遊戲，約 20 分鐘帶高中生邊玩邊學網頁與 App 資安。

- GitHub 儲存庫：https://github.com/google-fb/pixel-sec
- 線上遊玩（GitHub Pages，推送完整程式後自動啟用）：https://google-fb.github.io/pixel-sec/

完整原始碼請用下方指令從本機推送到這個儲存庫（GitHub MCP 目前無法批次寫入 workflow 與大型 tree）。

## 把完整專案推上來（Windows）

GitHub CLI 可在 PowerShell 使用。在專案目錄執行：

```powershell
gh auth login
git remote add github https://github.com/google-fb/pixel-sec.git
git push -u github main --force
```

然後到儲存庫 Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。

推送到 `main` 後，workflow `.github/workflows/deploy-pages.yml` 會建置 Vite 並發布到 GitHub Pages。
