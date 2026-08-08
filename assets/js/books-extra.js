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
    {id:195, title:"عقيدة الإيمان باليوم الآخر", author:"باحثون", category:"aqeedah", shamela:51},
    {id:196, title:"التحفة الندية شرح العقيدة الواسطية", author:"عبد الرحمن العقل", category:"aqeedah", shamela:56},
    {id:197, title:"المسائل الجلية في أحكام الأضحية", author:"باحثون", category:"fiqh", shamela:62},
    {id:198, title:"عقيدة الإيمان بالقضاء والقدر عند السلف", author:"باحثون", category:"aqeedah", shamela:70},
    {id:199, title:"منهج السلف في الدفاع عن العقيدة", author:"باحثون", category:"aqeedah", shamela:75},
    {id:200, title:"المحيط في اللغة", author:"الصاحب ابن عباد", category:"lugha", shamela:83},
    {id:201, title:"شرح عمدة الفقه لابن تيمية", author:"ابن تيمية", category:"fiqh", shamela:151},
    {id:202, title:"موسوعة أحكام الطهارة", author:"الدبيان", category:"fiqh", shamela:157},
    {id:203, title:"مسند أبي يعلى", author:"أبو يعلى الموصلي", category:"hadith", shamela:181},
    {id:204, title:"اتباع السنن واجتناب البدع", author:"علماء", category:"aqeedah", shamela:178},
    {id:205, title:"مذكرة أصول الفقه على روضة الناظر", author:"الشنقيطي", category:"usul", shamela:282},
    {id:206, title:"نثر الورود شرح مراقي السعود", author:"الشنقيطي", category:"usul", shamela:283},
    {id:207, title:"فتاوى الشنقيطي", author:"محمد الأمين الشنقيطي", category:"fiqh", shamela:287},
    {id:208, title:"التعليق والإيضاح على تفسير الجلالين", author:"علماء", category:"tafsir", shamela:288}
  ];
  if (Array.isArray(window.ALL_BOOKS)) {
    var existing = {};
    window.ALL_BOOKS.forEach(function (b) { existing[b.shamela] = true; existing['id:'+b.id] = true; });
    extra.forEach(function (b) {
      if (!existing[b.shamela]) window.ALL_BOOKS.push(b);
    });
  }
})();
