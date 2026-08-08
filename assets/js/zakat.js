/* =============================================================
   حاسبة الزكاة — نقد + ذهب/فضة بالجرام + عروض تجارة
   نصاب الفضة (الأحوط) = 595 جرام فضة تقريباً
   نصاب الذهب = 85 جرام ذهب تقريباً
   ============================================================= */
(function () {
  const SILVER_NISAB_GRAMS = 595;
  const GOLD_NISAB_GRAMS = 85;
  const ZAKAT_RATE = 0.025;

  // أسعار تقريبية بالجنيه المصري (يحدّثها المستخدم)
  const DEFAULTS = {
    gold24: 4200,   // جنيه/جرام عيار 24 تقريباً
    silver: 55,     // جنيه/جرام فضة تقريباً
  };

  function num(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = parseFloat(String(el.value).replace(/,/g, ''));
    return isFinite(v) && v > 0 ? v : 0;
  }

  function fmt(n) {
    return Math.round(n).toLocaleString('ar-EG');
  }

  function karatFactor(karat) {
    const k = parseInt(karat, 10) || 24;
    return Math.min(24, Math.max(1, k)) / 24;
  }

  function calc() {
    const cash = num('zkCash');
    const debt = num('zkDebt');
    const trade = num('zkTrade');

    const goldG = num('zkGoldG');
    const goldK = (document.getElementById('zkGoldKarat') || {}).value || '24';
    const goldPrice = num('zkGoldPrice') || DEFAULTS.gold24;

    const silverG = num('zkSilverG');
    const silverPrice = num('zkSilverPrice') || DEFAULTS.silver;

    const pureGoldG = goldG * karatFactor(goldK);
    const goldValue = pureGoldG * goldPrice;
    const silverValue = silverG * silverPrice;

    const assets = cash + goldValue + silverValue + trade;
    const net = Math.max(0, assets - debt);

    // نصاب الفضة بالعملة (الأحوط للفقراء)
    const nisabSilverMoney = SILVER_NISAB_GRAMS * (silverPrice || DEFAULTS.silver);
    // نصاب الذهب بالعملة
    const nisabGoldMoney = GOLD_NISAB_GRAMS * (goldPrice || DEFAULTS.gold24);

    const modeEl = document.getElementById('zkNisabMode');
    const mode = modeEl ? modeEl.value : 'silver';
    const nisab = mode === 'gold' ? nisabGoldMoney : nisabSilverMoney;

    const box = document.getElementById('zakatResult');
    if (!box) return;

    let html = '';
    html += '<div style="margin-bottom:10px;font-size:13px;color:var(--muted)">تفصيل الحساب:</div>';
    html += '<ul style="margin:0 0 12px 0;padding-right:18px;font-size:13.5px;line-height:1.9">';
    if (cash) html += '<li>نقد ومدّخرات: <b>' + fmt(cash) + '</b> جنيه</li>';
    if (goldG) html += '<li>ذهب: ' + goldG + ' جرام عيار ' + goldK + ' ≈ <b>' + pureGoldG.toFixed(2) + '</b> جرام خالص × ' + fmt(goldPrice) + ' = <b>' + fmt(goldValue) + '</b> جنيه</li>';
    if (silverG) html += '<li>فضة: ' + silverG + ' جرام × ' + fmt(silverPrice) + ' = <b>' + fmt(silverValue) + '</b> جنيه</li>';
    if (trade) html += '<li>عروض تجارة (قيمة السوق): <b>' + fmt(trade) + '</b> جنيه</li>';
    if (debt) html += '<li>ديون مستحقة (تُخصم): <b>' + fmt(debt) + '</b> جنيه</li>';
    html += '<li>إجمالي الأصول: <b>' + fmt(assets) + '</b> جنيه</li>';
    html += '<li>صافي المال: <b>' + fmt(net) + '</b> جنيه</li>';
    html += '<li>النصاب المستخدم (' + (mode === 'gold' ? 'ذهب 85ج' : 'فضة 595ج') + '): <b>' + fmt(nisab) + '</b> جنيه</li>';
    html += '</ul>';

    if (net < nisab) {
      html += '<p>صافي مالك <b>' + fmt(net) + ' جنيه</b> أقل من النصاب، فلا تجب الزكاة على هذا المال في الحول الحالي (حسب المدخلات).</p>';
    } else {
      const zakat = net * ZAKAT_RATE;
      html += '<p>مقدار الزكاة الواجبة (2.5%): <b style="font-size:20px">' + fmt(zakat) + ' جنيه</b></p>';
    }

    box.innerHTML = html;
    box.classList.add('show');

    try {
      localStorage.setItem('il_zakat_last', JSON.stringify({
        cash: cash, debt: debt, trade: trade,
        goldG: goldG, goldK: goldK, goldPrice: goldPrice,
        silverG: silverG, silverPrice: silverPrice,
        mode: mode, at: Date.now()
      }));
    } catch (e) {}
  }

  function restore() {
    try {
      const raw = localStorage.getItem('il_zakat_last');
      if (!raw) return;
      const d = JSON.parse(raw);
      const set = function (id, v) {
        const el = document.getElementById(id);
        if (el && v != null && v !== '') el.value = v;
      };
      set('zkCash', d.cash || '');
      set('zkDebt', d.debt || '');
      set('zkTrade', d.trade || '');
      set('zkGoldG', d.goldG || '');
      set('zkGoldKarat', d.goldK || '21');
      set('zkGoldPrice', d.goldPrice || DEFAULTS.gold24);
      set('zkSilverG', d.silverG || '');
      set('zkSilverPrice', d.silverPrice || DEFAULTS.silver);
      set('zkNisabMode', d.mode || 'silver');
    } catch (e) {}
  }

  function fillDefaults() {
    const gp = document.getElementById('zkGoldPrice');
    const sp = document.getElementById('zkSilverPrice');
    if (gp && !gp.value) gp.value = DEFAULTS.gold24;
    if (sp && !sp.value) sp.value = DEFAULTS.silver;
  }

  function init() {
    fillDefaults();
    restore();
    const btn = document.getElementById('zkCalcBtn');
    if (btn) btn.addEventListener('click', calc);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.ZakatCalc = { calc: calc, defaults: DEFAULTS };
})();
