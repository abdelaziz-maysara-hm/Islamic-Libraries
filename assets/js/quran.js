/* ============================================================
   وحدة القرآن الكريم
   - النص والتفسير: Al Quran Cloud API (مجاني، بدون مفتاح) — https://api.alquran.cloud/v1
   - التلاوة الصوتية: بيانات القراء من mp3quran.net (assets/js/reciters-data.js) —
     مصدر مستقل تمامًا عن Al Quran Cloud، فمش متأثر بمشاكل الحظر بتاعته.
   بدون Backend: كل الطلبات بتتنادى مباشرة من متصفح المستخدم.
   ============================================================ */

const QURAN_API  = "https://api.alquran.cloud/v1";
const EDITION_TEXT   = "quran-uthmani";
const EDITION_TAFSIR = "ar.muyassar";

/* مصدر احتياطي: quranapi.pages.dev — مستضاف على بنية تحتية مختلفة تمامًا
   (Cloudflare Pages) عن api.alquran.cloud (Islamic Network)، فمش متأثر
   بنفس حظر الـ IPs. بيتفعّل تلقائيًا لو المصدر الأساسي فشل. */
const FALLBACK_API = "https://quranapi.pages.dev/api";
let usingFallback = false;

/* التلاوة الصوتية: بتستخدم بيانات القراء (assets/js/reciters-data.js)
   المصدر: mp3quran.net — مستقل تمامًا عن api.alquran.cloud، فمش متأثر
   بمشاكل الحظر بتاعته. */
const RECITER_PREF_KEY = "quran_reciter_id";

let SURAH_LIST_CACHE = null;
let currentSurahNum  = 0;   // track which surah is open
let currentAudio     = null;
let audioPlaying     = false;

function q(sel, root = document) { return root.querySelector(sel); }

function setStatus(msg, isError = false) {
  const box = q("#qStatus");
  if (!box) return;
  box.textContent = msg || "";
  box.style.color = isError ? "#b5432f" : "var(--muted)";
}

/* ---------- طلب مع إعادة محاولة واحدة (تعامل مع انقطاع مؤقت) ---------- */
async function fetchWithRetry(url, retries = 1, delayMs = 1200) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delayMs));
      return fetchWithRetry(url, retries - 1, delayMs);
    }
    throw err;
  }
}

/* رسالة الخطأ الموحّدة — توضّح السبب الأرجح (حظر بعض مزوّدي الإنترنت لخادم
   Al Quran Cloud نتيجة هجمات DDoS متكررة عليه منذ سبتمبر 2025) وتوفّر رابط
   بديل مباشر بدل ما يفضل المستخدم تايه قدام رسالة عامة. */
function apiFailureHTML(extraNote = "") {
  return `
    <p class="qa-loading" style="color:#b5432f; line-height:1.8;">
      تعذّر الوصول لخادم القرآن الكريم، حتى عبر المصدر الاحتياطي.
      ${extraNote}
      <br>السبب الأغلب: بعض مزوّدي الإنترنت في المنطقة بيكونوا محظورين مؤقتًا
      من عند الخادم نفسه بسبب هجمات إلكترونية متكررة عليه، مش عطل في الصفحة.
      <br>جرّب تاني بعد شوية، أو من شبكة/VPN مختلف، أو استخدم الرابط المباشر:
      <a href="https://alquran.cloud/quran" target="_blank" rel="noopener noreferrer">alquran.cloud/quran ←</a>
    </p>`;
}

function fallbackNotice() {
  return `<p style="font-size:12px;color:var(--muted);margin:6px 0 14px;">
    ⚡ تعذّر الوصول للمصدر الأساسي، فبيتم عرض النص من مصدر احتياطي (بدون تفسير الميسّر مؤقتًا).
  </p>`;
}

/* ---------- مصدر احتياطي: quranapi.pages.dev ---------- */
async function loadSurahListFallback() {
  const res = await fetchWithRetry(`${FALLBACK_API}/surah.json`, 0);
  const data = await res.json();
  return data.map((s, i) => ({
    number: i + 1,
    name: s.surahNameArabicLong || s.surahNameArabic,
    englishName: s.surahName,
    englishNameTranslation: s.surahNameTranslation,
    numberOfAyahs: s.totalAyah,
    revelationType: s.revelationPlace === "Mecca" ? "Meccan" : "Medinan"
  }));
}

async function openSurahFallback(number) {
  const res  = await fetchWithRetry(`${FALLBACK_API}/${number}.json`, 0);
  const data = await res.json();
  const arabicArr = data.arabic1 || data.arabic2 || [];
  return {
    name: data.surahNameArabicLong || data.surahNameArabic,
    ayahs: arabicArr.map((text, i) => ({ numberInSurah: i + 1, text })),
    tafsirAvailable: false
  };
}

/* ---------- قائمة السور ---------- */
async function loadSurahList() {
  if (SURAH_LIST_CACHE) return SURAH_LIST_CACHE;
  setStatus("جارِ تحميل قائمة السور...");
  try {
    const res = await fetchWithRetry(`${QURAN_API}/surah`);
    const data = await res.json();
    SURAH_LIST_CACHE = data.data;
    usingFallback = false;
  } catch (err) {
    SURAH_LIST_CACHE = await loadSurahListFallback(); // يرمي خطأ لو فشل هو كمان
    usingFallback = true;
  }
  setStatus("");
  return SURAH_LIST_CACHE;
}

function renderSurahGrid(list) {
  const grid = q("#surahGrid");
  if (!grid) return;
  grid.innerHTML = list.map(s => `
    <button class="surah-card" data-surah="${s.number}">
      <span class="surah-num">${s.number}</span>
      <span class="surah-names">
        <b>${s.name}</b>
        <small>${s.englishName} · ${s.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${s.numberOfAyahs} آية</small>
      </span>
    </button>
  `).join("");
  grid.querySelectorAll(".surah-card").forEach(btn => {
    btn.addEventListener("click", () => openSurah(parseInt(btn.dataset.surah, 10)));
  });
}

/* ---------- مشغّل الصوت ---------- */
function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
    audioPlaying = false;
  }
}

function updatePlayBtn(btn, playing) {
  if (!btn) return;
  btn.textContent = playing ? "⏸ إيقاف مؤقت" : "🔊 استماع للسورة كاملة";
}

/* ---------- اختيار القارئ ---------- */
function getReciterById(id) {
  const list = window.RECITERS || [];
  return list.find(r => String(r.id) === String(id)) || list[0] || null;
}

function populateReciterSelect(select) {
  const list = window.RECITERS || [];
  if (!select || list.length === 0) return;
  const saved = localStorage.getItem(RECITER_PREF_KEY);
  select.innerHTML = list.map(r =>
    `<option value="${r.id}">${r.flag} ${r.name}</option>`
  ).join("");
  select.value = saved && getReciterById(saved) ? saved : list[0].id;
  select.addEventListener("change", () => {
    localStorage.setItem(RECITER_PREF_KEY, select.value);
    stopAudio();
    updatePlayBtn(q("#btnPlaySurah"), false);
  });
}

function playSurahAudio(num) {
  const btn = q("#btnPlaySurah");
  if (currentAudio && audioPlaying) {
    currentAudio.pause();
    audioPlaying = false;
    updatePlayBtn(btn, false);
    return;
  }
  if (currentAudio && !audioPlaying) {
    currentAudio.play().catch(() => setStatus("تعذّر تشغيل الصوت.", true));
    audioPlaying = true;
    updatePlayBtn(btn, true);
    return;
  }
  stopAudio();
  const select   = q("#reciterSelect");
  const reciter  = getReciterById(select ? select.value : null);
  if (!reciter || typeof window.getSurahUrl !== "function") {
    setStatus("تعذّر تحديد القارئ.", true);
    return;
  }
  const audioUrl = window.getSurahUrl(reciter, num);
  currentAudio = new Audio(audioUrl);
  currentAudio.play().catch(() => {
    setStatus("تعذّر تشغيل الصوت — تأكد من اتصالك بالإنترنت، أو جرّب قارئ تاني.", true);
  });
  audioPlaying = true;
  updatePlayBtn(btn, true);
  currentAudio.onended = () => { audioPlaying = false; updatePlayBtn(btn, false); };
  currentAudio.onerror = () => {
    audioPlaying = false;
    updatePlayBtn(btn, false);
    setStatus("تعذّر تشغيل الصوت من هذا القارئ — جرّب قارئ تاني من القائمة.", true);
  };
}

/* ---------- فتح سورة ---------- */
async function openSurah(number) {
  const reader  = q("#surahReader");
  const browser = q("#surahBrowser");
  if (!reader || !browser) return;

  stopAudio();
  currentSurahNum = number;
  const list = SURAH_LIST_CACHE || [];

  browser.style.display = "none";
  reader.style.display  = "block";
  reader.innerHTML = `<p class="qa-loading">جارِ تحميل السورة ${number}...</p>`;
  window.scrollTo({ top: (reader.offsetTop || 0) - 90, behavior: "smooth" });

  try {
    let meta, tafsirEd, hasTafsir;
    try {
      const res = await fetchWithRetry(`${QURAN_API}/surah/${number}/editions/${EDITION_TEXT},${EDITION_TAFSIR}`);
      const data = await res.json();
      [meta, tafsirEd] = data.data;
      hasTafsir = true;
      usingFallback = false;
    } catch (primaryErr) {
      const fb = await openSurahFallback(number); // يرمي خطأ لو فشل هو كمان → يوديك لل catch الخارجي
      meta = { name: fb.name, englishName: list[number - 1] ? list[number - 1].englishName : "",
                revelationType: list[number - 1] ? list[number - 1].revelationType : "Meccan",
                numberOfAyahs: fb.ayahs.length, ayahs: fb.ayahs.map(a => ({ ...a, number: null })) };
      tafsirEd = { ayahs: [] };
      hasTafsir = false;
      usingFallback = true;
    }

    const prevNum = number > 1   ? number - 1 : null;
    const nextNum = number < 114 ? number + 1 : null;
    const prevName = prevNum && list[prevNum - 1] ? list[prevNum - 1].name : "";
    const nextName = nextNum && list[nextNum - 1] ? list[nextNum - 1].name : "";

    let html = `
      ${usingFallback ? fallbackNotice() : ""}
      <div class="reader-head">
        <div style="display:flex; align-items:center; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
          <button class="btn-back" id="btnBackToList">→ رجوع لكل السور</button>
          ${nextNum ? `<button class="btn-nav" id="btnNext" data-to="${nextNum}">التالية: ${nextName} ←</button>` : ''}
          ${prevNum ? `<button class="btn-nav" id="btnPrev" data-to="${prevNum}">→ السابقة: ${prevName}</button>` : ''}
        </div>
        <h2>سورة ${meta.name.replace('سُورَةُ ', '')}</h2>
        <p class="reader-sub">${meta.englishName} · ${meta.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} · ${meta.numberOfAyahs} آية</p>
        <div class="reciter-picker">
          <select id="reciterSelect" aria-label="اختر القارئ"></select>
          <button class="btn-calc" id="btnPlaySurah">🔊 استماع للسورة كاملة</button>
        </div>
      </div>
      <div class="ayah-list">
    `;

    meta.ayahs.forEach((ayah, i) => {
      const tafsirText = hasTafsir && tafsirEd.ayahs[i] ? tafsirEd.ayahs[i].text : "";
      html += `
        <div class="ayah-block">
          <div class="ayah-text">
            ${ayah.text}
            <span class="ayah-badge">﴿${ayah.numberInSurah}﴾</span>
          </div>
          ${hasTafsir ? `
          <div class="ayah-actions">
            <button class="mini-btn" data-tafsir-toggle="${i}">📖 التفسير الميسّر</button>
          </div>
          <div class="ayah-tafsir" id="tafsir-${i}" style="display:none;">${tafsirText}</div>
          ` : ""}
        </div>
      `;
    });
    html += `</div>`;
    reader.innerHTML = html;

    // Back button
    q("#btnBackToList").addEventListener("click", () => {
      stopAudio();
      reader.style.display  = "none";
      browser.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Prev / Next
    [q("#btnPrev"), q("#btnNext")].forEach(btn => {
      if (btn) btn.addEventListener("click", () => openSurah(parseInt(btn.dataset.to, 10)));
    });

    // القارئ + تشغيل السورة
    populateReciterSelect(q("#reciterSelect"));
    q("#btnPlaySurah").addEventListener("click", () => playSurahAudio(number));

    // Tafsir toggle
    reader.querySelectorAll("[data-tafsir-toggle]").forEach(btn => {
      btn.addEventListener("click", () => {
        const box = q(`#tafsir-${btn.dataset.tafsirToggle}`);
        if (box) box.style.display = box.style.display === "none" ? "block" : "none";
      });
    });

  } catch (err) {
    reader.innerHTML = `
      ${apiFailureHTML(`(السورة ${number})`)}
      <button class="btn-back" id="btnBackErr">→ رجوع</button>`;
    q("#btnBackErr") && q("#btnBackErr").addEventListener("click", () => {
      reader.style.display  = "none";
      browser.style.display = "block";
    });
  }
}

/* ---------- CSS للأزرار الجديدة (مضاف ديناميكيًا) ---------- */
(function injectCSS() {
  const style = document.createElement("style");
  style.textContent = `
    .btn-nav{
      background:var(--teal-soft); color:var(--teal-deep); border:1px solid var(--line);
      font-family:'Cairo'; font-weight:700; font-size:13px;
      padding:8px 16px; border-radius:20px; cursor:pointer; transition:background .2s;
    }
    .btn-nav:hover{background:var(--teal); color:#fff;}
  `;
  document.head.appendChild(style);
})();

/* ---------- البحث في القرآن ---------- */
let searchDebounce = null;
async function searchQuran(keyword) {
  const resultsBox = q("#qSearchResults");
  if (!resultsBox) return;
  if (!keyword || keyword.trim().length < 2) { resultsBox.innerHTML = ""; return; }
  resultsBox.innerHTML = `<p class="qa-loading">جارِ البحث...</p>`;
  try {
    const res  = await fetch(`${QURAN_API}/search/${encodeURIComponent(keyword.trim())}/all/${EDITION_TEXT}`);
    const data = await res.json();
    if (data.code !== 200 || !data.data.matches || data.data.matches.length === 0) {
      resultsBox.innerHTML = `<p class="qa-loading">لا توجد نتائج لـ "${keyword}".</p>`;
      return;
    }
    const matches = data.data.matches.slice(0, 20);
    resultsBox.innerHTML =
      `<p class="qa-count">${data.data.count} نتيجة (المعروض أول ${matches.length})</p>` +
      matches.map(m => `
        <div class="search-hit" data-surah="${m.surah.number}" style="cursor:pointer;">
          <span class="ayah-badge">سورة ${m.surah.name} ﴿${m.numberInSurah}﴾</span>
          <p>${m.text}</p>
        </div>
      `).join("");
    resultsBox.querySelectorAll(".search-hit").forEach(el => {
      el.addEventListener("click", () => openSurah(parseInt(el.dataset.surah, 10)));
    });
  } catch (err) {
    resultsBox.innerHTML = `<p class="qa-loading" style="color:#b5432f;">تعذّر البحث الآن، حاول مرة أخرى.</p>`;
  }
}

/* ---------- بدء التشغيل ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  if (!q("#surahGrid")) return;
  try {
    const list = await loadSurahList();
    renderSurahGrid(list);
  } catch (err) {
    const grid = q("#surahGrid");
    if (grid) grid.innerHTML = apiFailureHTML();
    setStatus("");
  }

  const searchInput = q("#qSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => searchQuran(e.target.value), 450);
    });
  }
});
