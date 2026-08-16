/* =============================================================
   بيانات الفتاوى — ملخصات (توسيع الملخصات + مراجعة الروابط قيد العمل)
   كل فتوى: { id, q, a, category, source, sourceUrl }
   ============================================================= */
window.FATAWA_CATEGORIES = [
  { id:"taharah",   label:"الطهارة",           icon:"💧" },
  { id:"salah",     label:"الصلاة",             icon:"🕌" },
  { id:"sawm",      label:"الصوم",              icon:"🌙" },
  { id:"zakah",     label:"الزكاة",             icon:"💰" },
  { id:"hajj",      label:"الحج والعمرة",       icon:"🕋" },
  { id:"ibadat",    label:"عبادات أخرى",        icon:"🤲" },
  { id:"muamalat",  label:"المعاملات",          icon:"🤝" },
  { id:"usra",      label:"الأسرة والزواج",     icon:"👨‍👩‍👧" },
  { id:"adab",      label:"الآداب والأخلاق",    icon:"🌿" },
  { id:"asriya",    label:"قضايا معاصرة",       icon:"📱" },
  { id:"aqeedah",   label:"العقيدة",            icon:"☪️" },
  { id:"quran",     label:"القرآن وعلومه",      icon:"📖" },
];

/* مصادر موثوقة للربط */
const IQ  = (path) => `https://islamqa.info/ar/answers/${path}`;
const IW  = (path) => `https://islamweb.net/ar/fatwa/index.php?page=showfatwa&Id=${path}`;
const AL  = (path) => `https://www.alifta.net/ar/fatawa/fatawaDetails.aspx?BookID=3&ID=${path}`;
const DR  = (path) => `https://dar-alifta.org/ar/fatawa/details/${path}`;

window.FATAWA_DATA = [
{id:1,   category:"taharah", q:"هل يصح الوضوء من الماء المستعمل؟",
 a:"الماء المستعمل في رفع الحدث لا يرفع حدثاً آخر عند الجمهور، لكنه طاهر ومطهر للنجاسة.", source:"إسلام ويب", sourceUrl:IW("3215")},
{id:2,   category:"taharah", q:"ما حكم الاغتسال من الجنابة بالماء البارد في الشتاء؟",
 a:"يجب الاغتسال من الجنابة ولو كان الماء بارداً، إلا إذا كان في استخدام الماء البارد ضرر ظاهر على الصحة فيجوز التيمم عندئذٍ.", source:"إسلام سؤال وجواب", sourceUrl:IQ("6976")},
{id:3,   category:"taharah", q:"هل دم الحيض ينجس الثوب؟",
 a:"نعم، دم الحيض نجس يجب غسله، وإن أصاب الثوب وجب حكّه بالماء ثم غسله حتى يزول الأثر.", source:"إسلام سؤال وجواب", sourceUrl:IQ("2564")}
];
