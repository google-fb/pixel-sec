import type { LevelId, LevelMeta } from '../types'

export const LEVEL_ORDER: LevelId[] = [
  'password',
  'phishing',
  'cipher',
  'twofactor',
  'permissions',
  'injection',
]

export const LEVELS: Record<LevelId, LevelMeta> = {
  password: {
    id: 'password',
    index: 1,
    title: '強密碼工坊',
    subtitle: '打造一組駭客猜不到的密碼',
    tag: '密碼安全',
    accent: 'neon',
    estMinutes: 3,
    intro: [
      '嗨！我是你的資安小助手「位元君」，歡迎加入像素資安局！',
      '第一課：密碼。駭客常用「暴力破解」和「字典攻擊」不停猜你的密碼。',
      '密碼越長、越亂、越少見，被猜中要花的時間就越久。來幫「喵喵社群」設一組夠強的密碼吧！',
    ],
    hints: [
      '長度最重要！每多一個字元，破解難度就翻好幾倍，先湊到 12 個字以上。',
      '混用大寫、小寫、數字、符號，可能的組合會暴增。',
      '別用 password、123456、生日或鍵盤順序 qwerty，這些全都在駭客的字典裡。',
    ],
    learn: [
      '密碼的「長度」往往比「複雜度」更關鍵。',
      '常見密碼與個人資訊（生日、姓名）幾乎是秒破。',
      '每個網站用不同密碼，並交給密碼管理員（Password Manager）保管。',
    ],
    realWorld:
      '回家把最重要的 Email 帳號改成一組 12 字以上的獨特密碼，並開啟兩步驟驗證。',
  },
  phishing: {
    id: 'phishing',
    index: 2,
    title: '釣魚郵件偵測',
    subtitle: '從收件匣揪出假冒訊息',
    tag: '社交工程',
    accent: 'gold',
    estMinutes: 4,
    intro: [
      '警報！有幾封可疑訊息混進了收件匣。',
      '「釣魚」(Phishing) 就是假冒可信任的人或網站，騙你點連結、交出帳號密碼。',
      '仔細看寄件人網域、連結網址，還有它想製造的「緊急感」，把釣魚訊息全都揪出來！',
    ],
    hints: [
      '先看寄件人的網域（@ 後面）。bank.com 和 bank.security-check.com 是完全不同的網站！',
      '檢查連結真正要去的網址，小心 paypa1（把 l 換成數字 1）這種假冒手法。',
      '「帳號將在 24 小時內停用」「恭喜中獎」這種製造恐慌或貪念的話術，多半是詐騙。',
    ],
    learn: [
      '網域名稱要「從右往左」看，真正的主網域在最後面。',
      '假網站常用相似字元或多加一層子網域來騙人。',
      '正規機構不會用 Email/簡訊 要你立刻點連結、輸入密碼。',
    ],
    realWorld:
      '收到要你「立即驗證帳號」的訊息時別點連結，改成自己手動打開官方 App 或網站確認。',
  },
  cipher: {
    id: 'cipher',
    index: 3,
    title: '密碼學實驗室',
    subtitle: '解開被加密的攔截訊息',
    tag: '加密 / HTTPS',
    accent: 'cyan',
    estMinutes: 3,
    intro: [
      '這裡是密碼學實驗室，我們來聊「加密」。',
      '沒加密的 HTTP 就像用明信片寄密碼，沿途每個人都看得到；HTTPS 會把內容鎖起來。',
      '我們攔截到一段被「凱撒密碼」位移過的訊息，轉動齒輪把它解回原文吧！',
    ],
    hints: [
      '凱撒密碼就是把每個字母往後位移固定格數，解密要往回轉。',
      '英文最常出現的字是 the、and，試著讓解出來的內容看起來像正常單字。',
      '位移量一格一格試（最多 25 種），很快就會看到通順的句子。',
    ],
    learn: [
      '加密把「明文」變成看不懂的「密文」，只有拿到金鑰才能還原。',
      '凱撒密碼太簡單，現代網路用的是 TLS/HTTPS 這種強得多的加密。',
      '網址是 https:// 又有鎖頭，代表傳輸內容有被加密保護。',
    ],
    realWorld:
      '在公共 Wi-Fi 輸入帳密前，先確認網址是 https:// 開頭；重要操作盡量用行動網路或 VPN。',
  },
  twofactor: {
    id: 'twofactor',
    index: 4,
    title: '雙重驗證關卡',
    subtitle: '密碼外洩了，也要擋住駭客',
    tag: '帳號防護',
    accent: 'violet',
    estMinutes: 3,
    intro: [
      '糟了，駭客已經偷到某個用戶的密碼了！',
      '還好我們有「兩步驟驗證 (2FA)」：登入除了密碼，還要通過第二道關卡。',
      '幫這個帳號開啟 2FA，再用驗證器 App 產生的 6 位動態碼完成登入！',
    ],
    hints: [
      '第二道驗證通常是「你擁有的東西」——手機上的驗證器 App 每 30 秒換一組新碼。',
      '簡訊 OTP 也算 2FA，但可能被 SIM 卡盜用攻擊，驗證器 App 更安全。',
      '動態碼有時效性，看畫面上「目前顯示」的那一組輸入即可。',
    ],
    learn: [
      '2FA = 你「知道」的（密碼）+ 你「擁有」的（手機動態碼）。',
      '就算密碼外洩，少了第二道碼，駭客也進不來。',
      '驗證器 App（TOTP）比簡訊更能抵擋盜用。',
    ],
    realWorld:
      '為你的 Email、社群、遊戲帳號開啟兩步驟驗證，優先選 Authenticator 類 App。',
  },
  permissions: {
    id: 'permissions',
    index: 5,
    title: 'App 權限稽核',
    subtitle: '只放行功能真正需要的權限',
    tag: '隱私 / 權限',
    accent: 'pink',
    estMinutes: 3,
    intro: [
      '有個「像素手電筒」App 想安裝，卻要求了一大堆權限……',
      'App 應遵守「最小權限原則」：只要求功能真正需要的權限。',
      '幫忙稽核，只放行合理的權限，把偷窺隱私的通通拒絕！',
    ],
    hints: [
      '先想：這個 App 的「核心功能」是什麼？跟功能無關的權限就該懷疑。',
      '手電筒需要的其實只有「相機閃光燈」；它為什麼要讀通訊錄和定位？',
      '要求越多不相關權限，越可能是想偷偷蒐集、販賣你的個資。',
    ],
    learn: [
      '最小權限原則：只給剛好夠用的權限。',
      '權限可以事後在系統設定裡逐項關掉。',
      '過度索取權限，是隱私外洩與惡意 App 的警訊。',
    ],
    realWorld:
      '定期到手機「設定 → 隱私權 / 權限」檢查，關掉 App 用不到的定位、麥克風、通訊錄權限。',
  },
  injection: {
    id: 'injection',
    index: 6,
    title: '輸入驗證防線',
    subtitle: '修補登入頁的注入漏洞',
    tag: 'Web 漏洞',
    accent: 'danger',
    estMinutes: 4,
    intro: [
      '最終關卡！我們要修補「喵喵社群」登入頁的漏洞。',
      '如果程式把使用者輸入直接拼進資料庫查詢，就會出現「SQL Injection（注入攻擊）」。',
      '先看駭客如何用一句話繞過登入，再選出正確的修補方式，守住最後防線！',
    ],
    hints: [
      '觀察輸入框：如果打上  \' OR \'1\'=\'1  就能登入，代表輸入被當成程式碼執行了。',
      '根本解法是把「資料」和「指令」分開：使用參數化查詢 (Prepared Statement)。',
      '只做前端檢查沒有用，駭客能繞過；一定要在後端驗證並參數化。',
    ],
    learn: [
      '永遠不要相信使用者輸入，後端一定要驗證與過濾。',
      '參數化查詢能從根本擋掉 SQL Injection。',
      '縱深防禦：輸入驗證 + 參數化 + 資料庫最小權限一起上。',
    ],
    realWorld:
      '寫程式時用 ORM 或參數化查詢；使用網站時，遇到能亂輸入就登入的站台要提高警覺。',
  },
}

export const TOTAL_MINUTES = LEVEL_ORDER.reduce(
  (sum, id) => sum + LEVELS[id].estMinutes,
  0,
)
