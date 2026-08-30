/* كتب إضافية موثّقة من المكتبة الشاملة — تم التحقق من أرقام الشاملة */
(function () {
  var extra = [
    {id:176, title:"رياض الصالحين", author:"النووي", category:"adhkar", shamela:12014},
    {id:177, title:"الأذكار للنووي", author:"النووي", category:"adhkar", shamela:10639},
    {id:178, title:"سير أعلام النبلاء", author:"الذهبي", category:"seerah", shamela:10906},
    {id:179, title:"تاريخ الطبري", author:"الطبري", category:"seerah", shamela:9783},
    {id:180, title:"دليل الفالحين لطرق رياض الصالحين", author:"ابن علان", category:"adhkar", shamela:140},
    {id:181, title:"تهذيب سنن أبي داود", author:"ابن القيم", category:"hadith", shamela:201},
    {id:182, title:"شفاء العليل في القضاء والقدر", author:"ابن القيم", category:"aqeedah", shamela:205},
    {id:183, title:"فتاوى نور على الدرب", author:"ابن عثيمين", category:"fiqh", shamela:2300},
    {id:184, title:"الإنصاف لابن عبد البر", author:"ابن عبد البر", category:"hadith", shamela:13000},
    {id:185, title:"الطهور", author:"أبو عبيد القاسم بن سلام", category:"hadith", shamela:262},
    {id:186, title:"الزهد لأسد بن موسى", author:"أسد بن موسى", category:"adhkar", shamela:263},
    {id:187, title:"شرح ثلاثة الأصول", author:"صالح الفوزان", category:"aqeedah", shamela:8600},
    {id:188, title:"شرح أصول اعتقاد أهل السنة والجماعة", author:"اللالكائي", category:"aqeedah", shamela:9200},
    {id:189, title:"الحدود والتعزيرات عند ابن القيم", author:"باحثون", category:"fiqh", shamela:10500},
    {id:190, title:"البيان والتعريف في أسباب ورود الحديث", author:"ابن حمزة الحسيني", category:"hadith", shamela:6000},
    {id:191, title:"الأدلة الرضية لمتن الدرر البهية", author:"صديق حسن خان", category:"fiqh", shamela:6400},
    {id:192, title:"ذكر من اختلف العلماء ونقاد الحديث فيه", author:"علماء الحديث", category:"hadith", shamela:5800},
    {id:193, title:"الإبانة عن أسباب الإعانة على صلاة الفجر", author:"علماء", category:"adhkar", shamela:7800},
    {id:194, title:"منهج الصحابة في دعوة المشركين", author:"باحثون", category:"siasa", shamela:600},
    {id:195, title:"تحقيق الإيمان", author:"ابن تيمية", category:"aqeedah", shamela:264},
    {id:196, title:"خلاصة التأصيل لعلم الجرح والتعديل", author:"حاتم الشريف", category:"hadith", shamela:1210},
    {id:197, title:"فضائل القرآن وتلاوته", author:"الرازي", category:"tafsir", shamela:1600},
    {id:198, title:"الجامع في الخاتم للبيهقي", author:"البيهقي", category:"hadith", shamela:9300},
    {id:199, title:"محاسن الشريعة ومساوئ القوانين الوضعية", author:"باحثون", category:"siasa", shamela:5000},
    {id:200, title:"نيل الأماني من فتاوى القاضي العمراني", author:"محمد بن إسماعيل العمراني", category:"fiqh", shamela:900},
    {id:201, title:"المختصر الصغير لابن عبد الحكم", author:"ابن عبد الحكم", category:"fiqh", shamela:1206},
    {id:202, title:"الرحيق المختوم مع زيادات", author:"صفي الرحمن المباركفوري", category:"seerah", shamela:9900},
    {id:203, title:"إدامة النظر في تحرير نخبة الفكر", author:"علماء", category:"hadith", shamela:270},
    {id:204, title:"ذخائر العقبى في مناقب ذوي القربى", author:"محب الدين الطبري", category:"seerah", shamela:1001}
  ];
  if (Array.isArray(window.ALL_BOOKS)) {
    var existing = {};
    window.ALL_BOOKS.forEach(function (b) { existing[b.shamela] = true; });
    extra.forEach(function (b) {
      if (!existing[b.shamela]) window.ALL_BOOKS.push(b);
    });

    /* تصحيحات لأرقام شاملة خاطئة في الملف الأساسي المُثبَّت (books-data.js) --
       تم التحقق من الرقم الصحيح لكل كتاب مباشرة من صفحته الفعلية على
       shamela.ws (عنوان الكتاب ومؤلفه كما يظهران فعليًا في الصفحة)، وليس
       افتراضًا. هذا تصحيح لبيانات موجودة (بمطابقة id الأساسي، لا shamela)،
       وليس إضافة كتاب جديد -- الآلية أعلاه (extra.forEach) لا تصحح كتبًا
       موجودة بالفعل، فهذا القسم منفصل ومطلوب لهذا الغرض تحديدًا. */
    var corrections = {
      13: 1733,  /* المعجم الكبير للطبراني: كان 147 (رقم صفحة داخل كتاب آخر، وليس معرّف كتاب) */
      25: 8493   /* مسند الحميدي: كان 255 (لا صلة له بالكتاب على الإطلاق) */
    };
    window.ALL_BOOKS.forEach(function (b) {
      if (Object.prototype.hasOwnProperty.call(corrections, b.id)) {
        b.shamela = corrections[b.id];
      }
    });
  }
})();
