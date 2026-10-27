// Site-wide search index. Add a new object here whenever you add a book, video, fatwa or app.
window.SITE_INDEX = [
  // ---- Quran ----
  { type: "القرآن الكريم", title: "تصفح القرآن الكريم كاملاً (نص + تفسير ميسّر + استماع)", tags: ["قرآن", "تفسير", "استماع", "تلاوة", "بحث في القرآن"], url: "quran.html" },

  // ---- Books: Fiqh ----
  { type: "كتاب - فقه", title: "فقه السنة - سيد سابق", tags: ["فقه", "عبادات", "فقه السنة"], url: "books-fiqh.html" },
  { type: "كتاب - فقه", title: "المغني - ابن قدامة", tags: ["فقه", "مقارن", "حنبلي"], url: "books-fiqh.html" },
  { type: "كتاب - فقه", title: "بداية المجتهد - ابن رشد", tags: ["فقه", "مقارن"], url: "books-fiqh.html" },
  { type: "فرع فقه", title: "الطهارة والصلاة", tags: ["فقه", "طهارة", "صلاة", "وضوء"], url: "fiqh/taharah-salah.html" },
  { type: "فرع فقه", title: "الزكاة والصيام", tags: ["فقه", "زكاة", "صيام", "رمضان"], url: "fiqh/zakah-siyam.html" },
  { type: "فرع فقه", title: "الحج والمناسك", tags: ["فقه", "حج", "عمرة", "مناسك"], url: "fiqh/hajj-manasik.html" },
  { type: "فرع فقه", title: "المعاملات المالية", tags: ["فقه", "بيوع", "ربا", "معاملات"], url: "fiqh/muamalat.html" },
  { type: "فرع فقه", title: "الأسرة والمواريث", tags: ["فقه", "زواج", "طلاق", "ميراث"], url: "fiqh/usra-mirath.html" },
  { type: "فرع فقه", title: "الجنائز وأحكام الموت", tags: ["فقه", "جنازة", "تغسيل", "دفن"], url: "fiqh/janaiz.html" },
  { type: "فرع فقه", title: "الأيمان والنذور", tags: ["فقه", "يمين", "نذر", "كفارة"], url: "fiqh/ayman-nudhur.html" },
  { type: "فرع فقه", title: "الأطعمة والأشربة", tags: ["فقه", "أطعمة", "ذبائح", "حلال", "حرام"], url: "fiqh/atima-ashriba.html" },
  { type: "فرع فقه", title: "القضاء والشهادات", tags: ["فقه", "قضاء", "شهادة", "حقوق"], url: "fiqh/qada-shahadat.html" },
  { type: "فرع فقه", title: "الجهاد والسير", tags: ["فقه", "جهاد", "سير", "علاقات دولية"], url: "fiqh/jihad-siyar.html" },
  { type: "فرع فقه", title: "الوقف والوصايا", tags: ["فقه", "وقف", "وصية"], url: "fiqh/waqf-wasaya.html" },
  { type: "فرع فقه", title: "الحدود والتعزيرات", tags: ["فقه", "حدود", "تعزير", "عقوبات"], url: "fiqh/hudud-taazir.html" },
  { type: "فرع فقه", title: "اللباس والزينة", tags: ["فقه", "لباس", "زينة", "حجاب"], url: "fiqh/libas-zinah.html" },

  // ---- Books: Seerah ----
  { type: "كتاب - سيرة", title: "الرحيق المختوم - المباركفوري", tags: ["سيرة", "السيرة النبوية"], url: "books-seerah.html" },
  { type: "كتاب - سيرة", title: "السيرة النبوية - ابن هشام", tags: ["سيرة"], url: "books-seerah.html" },
  { type: "كتاب - سيرة", title: "فقه السيرة - الغزالي", tags: ["سيرة", "فقه"], url: "books-seerah.html" },

  // ---- Books: Tafsir ----
  { type: "كتاب - تفسير", title: "تفسير ابن كثير", tags: ["تفسير", "قرآن"], url: "books-tafsir.html" },
  { type: "كتاب - تفسير", title: "تفسير السعدي", tags: ["تفسير"], url: "books-tafsir.html" },
  { type: "كتاب - تفسير", title: "في ظلال القرآن - سيد قطب", tags: ["تفسير"], url: "books-tafsir.html" },

  // ---- Books: Hadith ----
  { type: "كتاب - حديث", title: "صحيح البخاري", tags: ["حديث", "صحاح"], url: "books-hadith.html" },
  { type: "كتاب - حديث", title: "صحيح مسلم", tags: ["حديث", "صحاح"], url: "books-hadith.html" },
  { type: "كتاب - حديث", title: "رياض الصالحين - النووي", tags: ["حديث", "أخلاق"], url: "books-hadith.html" },

  // ---- Books: Aqeedah ----
  { type: "كتاب - عقيدة", title: "العقيدة الطحاوية", tags: ["عقيدة"], url: "books-aqeedah.html" },
  { type: "كتاب - عقيدة", title: "شرح أصول الإيمان", tags: ["عقيدة"], url: "books-aqeedah.html" },

  // ---- Books: Adhkar ----
  { type: "كتاب - أذكار", title: "حصن المسلم", tags: ["أذكار", "أدعية"], url: "books-adhkar.html" },
  { type: "كتاب - أذكار", title: "الأذكار - النووي", tags: ["أذكار"], url: "books-adhkar.html" },

  // ---- Videos ----
  { type: "فيديو - تفسير", title: "دروس في التفسير", tags: ["تفسير", "فيديو"], url: "videos-tafsir.html" },
  { type: "فيديو - فقه", title: "شرح أحكام الصلاة", tags: ["فقه", "صلاة", "فيديو"], url: "videos-fiqh.html" },
  { type: "فيديو - سيرة", title: "دروس في السيرة النبوية", tags: ["سيرة", "فيديو"], url: "videos-seerah.html" },
  { type: "فيديو - عقيدة", title: "شرح نواقض الإسلام", tags: ["عقيدة", "فيديو"], url: "videos-aqeedah.html" },

  // ---- Fatawa ----
  { type: "فتوى - عبادات", title: "حكم الجمع بين الصلاتين للمسافر", tags: ["فتوى", "صلاة", "سفر"], url: "fatawa.html#f-safar" },
  { type: "فتوى - عبادات", title: "حكم صيام من نسي النية", tags: ["فتوى", "صيام"], url: "fatawa.html#f-siyam" },
  { type: "فتوى - معاملات", title: "حكم العمل في شركات الفوائد البنكية", tags: ["فتوى", "معاملات", "ربا"], url: "fatawa.html#f-riba" },
  { type: "فتوى - أسرة", title: "حقوق الزوجة في الإسلام", tags: ["فتوى", "أسرة", "زواج"], url: "fatawa.html#f-zawaj" },

  { type: "أداة", title: "حاسبة الزكاة", tags: ["أدوات", "زكاة", "حاسبة"], url: "tools.html" },
  { type: "أداة", title: "محول التاريخ الهجري", tags: ["أدوات", "هجري", "تاريخ", "تحويل"], url: "tools.html" },
  { type: "قاموس", title: "قاموس المصطلحات الإسلامية", tags: ["قاموس", "مصطلحات"], url: "glossary.html" },
  { type: "فرع سيرة", title: "الخط الزمني التفاعلي للسيرة", tags: ["سيرة", "خط زمني", "تايم لاين"], url: "seerah/timeline.html" },
  { type: "تطبيق", title: "تطبيق حصن المسلم", tags: ["تطبيق", "أذكار"], url: "apps.html" },
  { type: "تطبيق", title: "تطبيق قرآن كريم", tags: ["تطبيق", "قرآن"], url: "apps.html" },
  { type: "تطبيق", title: "تطبيق مواقيت الصلاة", tags: ["تطبيق", "صلاة", "مواقيت"], url: "apps.html" },

  // ---- Seerah sub-branches ----
  { type: "فرع سيرة", title: "قبل البعثة والنشأة", tags: ["سيرة", "نسب", "نشأة"], url: "seerah/before-prophethood.html" },
  { type: "فرع سيرة", title: "الدعوة والهجرة", tags: ["سيرة", "هجرة", "دعوة"], url: "seerah/dawah-hijra.html" },
  { type: "فرع سيرة", title: "الغزوات والمعارك", tags: ["سيرة", "غزوات", "بدر", "أحد"], url: "seerah/ghazawat.html" },
  { type: "فرع سيرة", title: "شمائل النبي وأخلاقه", tags: ["سيرة", "شمائل", "أخلاق"], url: "seerah/shamail.html" },

  // ---- Seerah books (expanded) ----
  { type: "كتاب - سيرة", title: "نور اليقين في سيرة سيد المرسلين - الخضري بك", tags: ["سيرة", "النبي"], url: "seerah/before-prophethood.html" },
  { type: "كتاب - سيرة", title: "زاد المعاد في هدي خير العباد - ابن القيم", tags: ["سيرة", "فقه السيرة", "ابن القيم"], url: "seerah/ghazawat.html" },
  { type: "كتاب - سيرة", title: "المغازي - الواقدي", tags: ["سيرة", "غزوات", "المغازي"], url: "seerah/ghazawat.html" },
  { type: "كتاب - سيرة", title: "شمائل الرسول ودلائل نبوته - ابن كثير", tags: ["سيرة", "شمائل", "ابن كثير"], url: "seerah/shamail.html" },

  // ---- Tafsir sub-branches ----
  { type: "فرع تفسير", title: "علوم القرآن", tags: ["تفسير", "علوم القرآن", "أسباب النزول"], url: "tafsir/quran-sciences.html" },
  { type: "فرع تفسير", title: "تفسير جزء عم", tags: ["تفسير", "جزء عم", "قصار السور"], url: "tafsir/juz-amma.html" },
  { type: "فرع تفسير", title: "التفسير الموضوعي", tags: ["تفسير", "موضوعي"], url: "tafsir/thematic-tafsir.html" },

  // ---- Tafsir books (expanded) ----
  { type: "كتاب - تفسير", title: "الإتقان في علوم القرآن - السيوطي", tags: ["تفسير", "علوم القرآن", "السيوطي"], url: "tafsir/quran-sciences.html" },
  { type: "كتاب - تفسير", title: "التفسير الميسر - مجمع الملك فهد", tags: ["تفسير", "ميسر"], url: "tafsir/juz-amma.html" },
  { type: "كتاب - تفسير", title: "التفسير الموضوعي لسور القرآن - مصطفى مسلم", tags: ["تفسير", "موضوعي"], url: "tafsir/thematic-tafsir.html" },
  { type: "كتاب - تفسير", title: "نحو تفسير موضوعي - الفرماوي", tags: ["تفسير", "موضوعي"], url: "tafsir/thematic-tafsir.html" },

  // ---- Hadith sub-branches ----
  { type: "فرع حديث", title: "علوم الحديث (المصطلح)", tags: ["حديث", "مصطلح", "صحيح", "ضعيف"], url: "hadith/hadith-sciences.html" },
  { type: "فرع حديث", title: "الكتب الستة", tags: ["حديث", "بخاري", "مسلم", "الكتب الستة"], url: "hadith/sihah-sittah.html" },
  { type: "فرع حديث", title: "الأربعين النووية", tags: ["حديث", "الأربعين", "النووي"], url: "hadith/arbaeen.html" },
  { type: "فرع حديث", title: "أحاديث الآداب والأخلاق", tags: ["حديث", "آداب", "أخلاق"], url: "hadith/hadith-akhlaq.html" },

  // ---- Hadith books (expanded) ----
  { type: "كتاب - حديث", title: "الباعث الحثيث شرح علوم الحديث - ابن كثير", tags: ["حديث", "مصطلح", "ابن كثير"], url: "hadith/hadith-sciences.html" },
  { type: "كتاب - حديث", title: "منهج النقد في علوم الحديث - نور الدين عتر", tags: ["حديث", "مصطلح", "نقد"], url: "hadith/hadith-sciences.html" },
  { type: "كتاب - حديث", title: "سنن النسائي", tags: ["حديث", "صحاح", "الكتب الستة"], url: "hadith/sihah-sittah.html" },
  { type: "كتاب - حديث", title: "سنن ابن ماجه", tags: ["حديث", "صحاح", "الكتب الستة"], url: "hadith/sihah-sittah.html" },
  { type: "كتاب - حديث", title: "جامع العلوم والحكم - ابن رجب الحنبلي", tags: ["حديث", "الأربعين", "شرح"], url: "hadith/arbaeen.html" },
  { type: "كتاب - حديث", title: "الأدب المفرد - البخاري", tags: ["حديث", "آداب", "البخاري"], url: "hadith/hadith-akhlaq.html" },
  { type: "كتاب - حديث", title: "الآداب الشرعية - ابن مفلح", tags: ["حديث", "آداب", "أخلاق"], url: "hadith/hadith-akhlaq.html" },
  { type: "كتاب - حديث", title: "مكارم الأخلاق - الخرائطي", tags: ["حديث", "أخلاق"], url: "hadith/hadith-akhlaq.html" },

  // ---- Aqeedah sub-branches ----
  { type: "فرع عقيدة", title: "توحيد الألوهية والربوبية", tags: ["عقيدة", "توحيد"], url: "aqeedah/tawheed.html" },
  { type: "فرع عقيدة", title: "الإيمان بالغيب", tags: ["عقيدة", "ملائكة", "جن", "يوم آخر"], url: "aqeedah/ghayb.html" },
  { type: "فرع عقيدة", title: "نواقض الإسلام", tags: ["عقيدة", "نواقض"], url: "aqeedah/nawaqid.html" },

  // ---- Aqeedah books (expanded) ----
  { type: "كتاب - عقيدة", title: "القواعد المثلى في أسماء الله وصفاته - ابن عثيمين", tags: ["عقيدة", "توحيد", "أسماء وصفات"], url: "aqeedah/tawheed.html" },
  { type: "كتاب - عقيدة", title: "شرح أصول الإيمان - ابن عثيمين", tags: ["عقيدة", "توحيد", "ابن عثيمين"], url: "aqeedah/tawheed.html" },
  { type: "كتاب - عقيدة", title: "عالم الجن والشياطين - عمر الأشقر", tags: ["عقيدة", "جن", "شياطين"], url: "aqeedah/ghayb.html" },
  { type: "كتاب - عقيدة", title: "القيامة الصغرى - عمر الأشقر", tags: ["عقيدة", "يوم آخر", "قيامة"], url: "aqeedah/ghayb.html" },
  { type: "كتاب - عقيدة", title: "نواقض الإسلام - محمد بن عبد الوهاب", tags: ["عقيدة", "نواقض", "ردة"], url: "aqeedah/nawaqid.html" },

  // ---- Adhkar sub-branches ----
  { type: "فرع أذكار", title: "أذكار الصباح والمساء", tags: ["أذكار", "صباح", "مساء"], url: "adhkar/morning-evening.html" },
  { type: "فرع أذكار", title: "أدعية القرآن والسنة", tags: ["أذكار", "أدعية", "قرآن"], url: "adhkar/quran-sunnah-duas.html" },
  { type: "فرع أذكار", title: "أذكار المناسبات", tags: ["أذكار", "سفر", "مرض", "مناسبات"], url: "adhkar/occasions-duas.html" },

  // ---- Adhkar books (expanded) ----
  { type: "كتاب - أذكار", title: "الوابل الصيب من الكلم الطيب - ابن القيم", tags: ["أذكار", "دعاء", "ابن القيم"], url: "adhkar/morning-evening.html" },
  { type: "كتاب - أذكار", title: "الكلم الطيب - ابن تيمية", tags: ["أذكار", "أدعية", "ابن تيمية"], url: "adhkar/occasions-duas.html" },
  { type: "كتاب - أذكار", title: "عمل اليوم والليلة - ابن السني", tags: ["أذكار", "مناسبات", "يوم وليلة"], url: "adhkar/occasions-duas.html" },

  // ---- Articles & site pages ----
  { type: "مقالات", title: "كل المقالات", tags: ["مقالات", "مقال"], url: "articles.html" },
  { type: "مقال", title: "كيف تبدأ حفظ القرآن الكريم؟ خطة عملية للمبتدئين", tags: ["حفظ", "حفظ القرآن", "مراجعة", "مبتدئين"], url: "articles/how-to-start-memorizing-quran.html" },
  { type: "مقال", title: "أحكام النون الساكنة والتنوين للمبتدئين", tags: ["تجويد", "نون ساكنة", "تنوين", "إظهار", "إدغام", "إقلاب", "إخفاء"], url: "articles/noon-sakinah-tanween-rules.html" },
  { type: "مقال", title: "فضائل سورة الملك وآية الكرسي وآخر البقرة — ما صحّ منها", tags: ["فضائل", "آية الكرسي", "سورة الملك", "خواتيم البقرة", "تبارك"], url: "articles/virtues-ayat-al-kursi-al-baqarah-al-mulk.html" },
  { type: "مقال", title: "كيف تستعد لرمضان قبل شهرين؟", tags: ["رمضان", "شعبان", "صيام", "استعداد"], url: "articles/prepare-for-ramadan-two-months-before.html" },
  { type: "مقال", title: "تعليم طفلك القرآن في البيت — خطوات عملية", tags: ["أطفال", "تربية", "تحفيظ", "أسرة"], url: "articles/teach-your-child-quran-at-home.html" },
  { type: "مقال", title: "أحكام الميم الساكنة والمدود للمبتدئين", tags: ["تجويد", "ميم ساكنة", "إخفاء شفوي", "إدغام شفوي", "إظهار شفوي", "مدود", "مد"], url: "articles/meem-sakinah-and-madd-rules.html" },
  { type: "مقال", title: "فضل سورة الكهف يوم الجمعة: ما صح وما لم يصح", tags: ["سورة الكهف", "الكهف", "الجمعة", "فضائل", "الدجال"], url: "articles/surat-al-kahf-friday-authentic-virtues.html" },
  { type: "مقال", title: "كيف تحافظ على حفظك ولا تنسى القرآن؟", tags: ["مراجعة", "حفظ القرآن", "تثبيت الحفظ", "نسيان", "متشابهات"], url: "articles/how-to-keep-quran-memorization.html" },
  { type: "مقال", title: "حساب زكاة المال خطوة بخطوة (مع مثال بالجنيه المصري)", tags: ["زكاة", "زكاة المال", "نصاب", "حاسبة الزكاة", "ذهب"], url: "articles/how-to-calculate-zakat-al-mal-egypt.html" },
  { type: "مقال", title: "ختمة القرآن في شهر: جداول جاهزة", tags: ["ختمة", "ختم القرآن", "جدول", "رمضان", "ورد يومي"], url: "articles/quran-khatma-in-a-month-schedules.html" },
  { type: "مقال", title: "فضل الصلاة على النبي ﷺ وصيغها الصحيحة", tags: ["الصلاة على النبي", "الصلاة الإبراهيمية", "يوم الجمعة", "الوسيلة", "أذكار"], url: "articles/salat-ala-an-nabi-virtues-and-forms.html" },
  { type: "مقال", title: "آداب تلاوة القرآن الكريم", tags: ["آداب التلاوة", "تلاوة القرآن", "ترتيل", "المصحف", "سجود التلاوة"], url: "articles/quran-recitation-etiquette.html" },
  { type: "مقال", title: "كيف تخشع في صلاتك؟ خطوات عملية", tags: ["الخشوع", "الصلاة", "السرحان في الصلاة", "الوسوسة", "الطمأنينة"], url: "articles/how-to-achieve-khushu-in-salah.html" },
  { type: "مقال", title: "فضل قيام الليل وكيف تبدأ", tags: ["قيام الليل", "التهجد", "الوتر", "الثلث الأخير", "صلاة الليل"], url: "articles/qiyam-al-layl-virtues-how-to-start.html" },
  { type: "مقال", title: "آداب الدعاء وأوقات الإجابة", tags: ["الدعاء", "أوقات الإجابة", "آداب الدعاء", "موانع الإجابة", "أدعية"], url: "articles/dua-etiquette-and-times-of-acceptance.html" },
  { type: "مقال", title: "صيام التطوع: الست من شوال والاثنين والخميس وعرفة وعاشوراء", tags: ["صيام التطوع", "الست من شوال", "الاثنين والخميس", "الأيام البيض", "عرفة", "عاشوراء"], url: "articles/voluntary-fasting-days-shawwal-monday-thursday.html" },
  { type: "مقال", title: "أحكام الصيام للمبتدئين", tags: ["أحكام الصيام", "رمضان", "مفطرات الصيام", "السحور", "القضاء", "الفدية"], url: "articles/fasting-rules-for-beginners.html" },
  { type: "مقال", title: "فضل العشر الأوائل من ذي الحجة", tags: ["عشر ذي الحجة", "يوم عرفة", "الأضحية", "التكبير", "عيد الأضحى", "أيام التشريق"], url: "articles/first-ten-days-of-dhul-hijjah.html" },
  { type: "مقال", title: "بر الوالدين: فضله وصوره العملية", tags: ["بر الوالدين", "العقوق", "الأم", "الأب", "صلة الرحم", "الدعاء للوالدين"], url: "articles/birr-al-walidayn-honoring-parents.html" },
  { type: "مقال", title: "أركان الإيمان الستة بشرح مبسط", tags: ["أركان الإيمان", "العقيدة", "الإيمان بالقدر", "الملائكة", "اليوم الآخر", "حديث جبريل"], url: "articles/six-pillars-of-iman.html" },
  { type: "مقال", title: "أركان الإسلام الخمسة: شرح مبسط بالأدلة", tags: ["أركان الإسلام", "الشهادتان", "الصلاة", "الزكاة", "الحج"], url: "articles/five-pillars-of-islam.html" },
  { type: "مقال", title: "التوبة النصوح: شروطها وفضلها وكيف تبدأ", tags: ["التوبة", "الاستغفار", "تزكية النفس", "الذنوب"], url: "articles/tawbah-repentance-conditions.html" },
  { type: "مقال", title: "الصبر في القرآن والسنة: أنواعه وثمراته", tags: ["الصبر", "المصائب", "الابتلاء", "تزكية النفس"], url: "articles/sabr-patience-in-quran-and-sunnah.html" },
  { type: "مقال", title: "فضل الصدقة وآدابها وأفضل أنواعها", tags: ["الصدقة", "الإنفاق", "الصدقة الجارية", "الزكاة"], url: "articles/sadaqah-virtues-and-etiquette.html" },
  { type: "مقال", title: "تدبر القرآن: خطوات عملية لفهم الآيات والعمل بها", tags: ["تدبر القرآن", "التفسير", "تلاوة القرآن", "القرآن الكريم"], url: "articles/tadabbur-quran-practical-steps.html" },
  { type: "مقال", title: "صفة الوضوء خطوة بخطوة: الفرائض والسنن والنواقض", tags: ["الوضوء", "الطهارة", "نواقض الوضوء", "فرائض الوضوء", "سنن الوضوء", "المسح على الخفين"], url: "articles/wudu-step-by-step-faraid-sunan-nawaqid.html" },
  { type: "الموقع", title: "عن الموقع", tags: ["عن", "من نحن"], url: "about.html" },
  { type: "الموقع", title: "سياسة الخصوصية", tags: ["خصوصية", "كوكيز", "إعلانات"], url: "privacy.html" },
  { type: "الموقع", title: "تواصل معنا", tags: ["تواصل", "اتصل بنا", "بريد"], url: "contact.html" }
];
