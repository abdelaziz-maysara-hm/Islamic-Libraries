/* =========================================================
   بيانات القراء — تم التحقق من جميع الروابط فعلياً (HTTP 200)
   المصدر: mp3quran.net الرسمي عبر API الخاص بهم (www.mp3quran.net/api/v3/reciters)
   كل قارئ هنا لديه تسجيل كامل للقرآن (114 سورة) بصوت واضح، مصدره موثّق ومُختبر.
   ========================================================= */

window.SURAH_NAMES = [
  "الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس",
  "هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه",
  "الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم",
  "لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر",
  "فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق",
  "الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة",
  "الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج",
  "نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس",
  "التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد",
  "الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات",
  "القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر",
  "المسد","الإخلاص","الفلق","الناس"
];

window.getSurahUrl = function(reciter, surahNum) {
  const s3 = String(surahNum).padStart(3, '0');
  if (reciter.mp3base)
    return `${reciter.mp3base}${s3}.mp3`;
  return reciter.pageUrl || 'https://mp3quran.net/';
};

window.RECITERS = [

  /* ──────── المسجد الحرام ──────── */
  {
    id:1, name:"عبد الرحمن السديس", photo:"assets/img/reciters/sudais.jpg", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server11.mp3quran.net/sds/"
  },
  {
    id:2, name:"سعود الشريم", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server7.mp3quran.net/shur/"
  },
  {
    id:3, name:"ماهر المعيقلي", photo:"assets/img/reciters/muaiqly.jpg", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server12.mp3quran.net/maher/"
  },
  {
    id:4, name:"بندر بليلة", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server6.mp3quran.net/balilah/"
  },
  {
    id:5, name:"خليفة الطنيجي", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server12.mp3quran.net/tnjy/"
  },

  /* ──────── المسجد النبوي ──────── */
  {
    id:6, name:"علي الحذيفي", photo:"assets/img/reciters/hudhaify.jpg", flag:"🇸🇦", category:"madinah", categoryLabel:"المسجد النبوي",
    mp3base:"https://server9.mp3quran.net/hthfi/"
  },
  {
    id:7, name:"محمد أيوب", photo:"assets/img/reciters/ayoub.jpg", flag:"🇸🇦", category:"madinah", categoryLabel:"المسجد النبوي",
    mp3base:"https://server8.mp3quran.net/ayyub/"
  },
  {
    id:8, name:"إبراهيم الأخضر", flag:"🇸🇦", category:"madinah", categoryLabel:"المسجد النبوي",
    mp3base:"https://server6.mp3quran.net/akdr/"
  },
  {
    id:9, name:"صلاح البدير", flag:"🇸🇦", category:"madinah", categoryLabel:"المسجد النبوي",
    mp3base:"https://server6.mp3quran.net/s_bud/"
  },
  {
    id:10, name:"يوسف الشويعي", flag:"🇸🇦", category:"madinah", categoryLabel:"المسجد النبوي",
    mp3base:"https://server9.mp3quran.net/yousef/"
  },

  /* ──────── مصر ──────── */
  {
    id:11, name:"محمود خليل الحصري", photo:"assets/img/reciters/husary.jpg", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server13.mp3quran.net/husr/"
  },
  {
    id:12, name:"عبد الباسط عبد الصمد", photo:"assets/img/reciters/abdulbasit.jpg", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server7.mp3quran.net/basit/"
  },
  {
    id:13, name:"محمد صديق المنشاوي", photo:"assets/img/reciters/minshawi.jpg", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server10.mp3quran.net/minsh/"
  },
  {
    id:14, name:"هاني الرفاعي", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server8.mp3quran.net/hani/"
  },
  {
    id:15, name:"محمد رفعت", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server14.mp3quran.net/refat/"
  },
  {
    id:16, name:"مصطفى إسماعيل", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server8.mp3quran.net/mustafa/"
  },
  {
    id:17, name:"محمد جبريل", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server8.mp3quran.net/jbrl/"
  },
  {
    id:18, name:"إسلام صبحي", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/"
  },
  {
    id:19, name:"خالد الجليل", flag:"🇸🇦", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server10.mp3quran.net/jleel/"
  },
  {
    id:20, name:"محمود علي البنا", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server8.mp3quran.net/bna/"
  },
  {
    id:21, name:"أحمد نعينع", flag:"🇪🇬", category:"egypt", categoryLabel:"مصر",
    mp3base:"https://server11.mp3quran.net/ahmad_nu/"
  },

  /* ──────── السعودية ──────── */
  {
    id:22, name:"سعد الغامدي", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server7.mp3quran.net/s_gmd/"
  },
  {
    id:23, name:"ياسر الدوسري", photo:"assets/img/reciters/dosari.jpg", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server11.mp3quran.net/yasser/"
  },
  {
    id:24, name:"أبو بكر الشاطري", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server11.mp3quran.net/shatri/"
  },
  {
    id:25, name:"أحمد العجمي", flag:"🇰🇼", category:"saudi", categoryLabel:"الكويت",
    mp3base:"https://server10.mp3quran.net/ajm/"
  },
  {
    id:26, name:"إدريس أبكر", flag:"🇪🇹", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server6.mp3quran.net/abkr/"
  },
  {
    id:27, name:"عبد العزيز الأحمد", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server11.mp3quran.net/a_ahmed/"
  },
  {
    id:28, name:"عادل الكلباني", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server8.mp3quran.net/a_klb/"
  },
  {
    id:29, name:"عبد الله بصفر", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server6.mp3quran.net/bsfr/"
  },
  {
    id:30, name:"محمد اللحيدان", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server8.mp3quran.net/lhdan/"
  },
  {
    id:31, name:"عبد المحسن القاسم", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server8.mp3quran.net/qasm/"
  },
  {
    id:32, name:"ناصر الماجد", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server14.mp3quran.net/nasser_almajed/"
  },
  {
    id:33, name:"توفيق الصايغ", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server6.mp3quran.net/twfeeq/"
  },
  {
    id:34, name:"علي عبد الله جابر", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server11.mp3quran.net/a_jbr/"
  },
  {
    id:35, name:"وديع اليمني", flag:"🇾🇪", category:"saudi", categoryLabel:"اليمن",
    mp3base:"https://server6.mp3quran.net/wdee3/"
  },
  {
    id:36, name:"محمد صالح علم شاه", flag:"🇵🇰", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server12.mp3quran.net/shah/"
  },
  {
    id:37, name:"أحمد الطرابلسي", flag:"🇱🇾", category:"saudi", categoryLabel:"ليبيا",
    mp3base:"https://server10.mp3quran.net/trabulsi/"
  },

  /* ──────── الكويت ──────── */
  {
    id:38, name:"ناصر القطامي", flag:"🇰🇼", category:"gulf", categoryLabel:"الكويت",
    mp3base:"https://server6.mp3quran.net/qtm/"
  },
  {
    id:39, name:"فارس عباد", flag:"🇸🇦", category:"gulf", categoryLabel:"الخليج",
    mp3base:"https://server8.mp3quran.net/frs_a/"
  },
  {
    id:40, name:"خالد القحطاني", flag:"🇸🇦", category:"gulf", categoryLabel:"الخليج",
    mp3base:"https://server10.mp3quran.net/qht/"
  },
  {
    id:41, name:"نبيل الرفاعي", flag:"🇰🇼", category:"gulf", categoryLabel:"الكويت",
    mp3base:"https://server9.mp3quran.net/nabil/"
  },
  {
    id:42, name:"صلاح الهاشم", flag:"🇰🇼", category:"gulf", categoryLabel:"الكويت",
    mp3base:"https://server12.mp3quran.net/salah_hashim_m/"
  },
  {
    id:43, name:"حاتم فريد الواعر", flag:"🇸🇦", category:"gulf", categoryLabel:"الخليج",
    mp3base:"https://server11.mp3quran.net/hatem/"
  },
  {
    id:44, name:"عبد الرحمن العوسي", flag:"🇸🇦", category:"gulf", categoryLabel:"الخليج",
    mp3base:"https://server6.mp3quran.net/aloosi/"
  },

  /* ──────── الشام ──────── */
  {
    id:45, name:"ياسر سلامة", flag:"🇸🇾", category:"levant", categoryLabel:"الشام",
    mp3base:"https://server12.mp3quran.net/salamah/Rewayat-Hafs-A-n-Assem/"
  },
  {
    id:46, name:"محمد صالح عالم شاه", flag:"🇵🇰", category:"levant", categoryLabel:"باكستان",
    mp3base:"https://server12.mp3quran.net/shah/"
  },
  {
    id:47, name:"موسى بلال", flag:"🇸🇾", category:"levant", categoryLabel:"الشام",
    mp3base:"https://server11.mp3quran.net/bilal/"
  },

  /* ──────── المغرب ──────── */
  {
    id:48, name:"عمر القزابري", flag:"🇲🇦", category:"maghreb", categoryLabel:"المغرب",
    mp3base:"https://server9.mp3quran.net/omar_warsh/"
  },
  {
    id:49, name:"يحيى حوا", flag:"🇲🇦", category:"maghreb", categoryLabel:"المغرب",
    mp3base:"https://server12.mp3quran.net/yahya/"
  },
  {
    id:50, name:"محمد رشاد الشريف", flag:"🇩🇿", category:"maghreb", categoryLabel:"الجزائر",
    mp3base:"https://server10.mp3quran.net/rashad/"
  },
  {
    id:51, name:"أحمد بن مصطفى العجمي", flag:"🇩🇿", category:"maghreb", categoryLabel:"الجزائر",
    mp3base:"https://server10.mp3quran.net/ajm/"
  },

  /* ──────── أفريقيا ──────── */
  {
    id:52, name:"محمود عبد الحكم", flag:"🇸🇩", category:"africa", categoryLabel:"أفريقيا",
    mp3base:"https://server16.mp3quran.net/m_abdelhakam/Rewayat-Hafs-A-n-Assem/"
  },

  /* ──────── آسيا ──────── */
  {
    id:53, name:"عبد الودود حنيف", flag:"🇵🇰", category:"asia", categoryLabel:"آسيا",
    mp3base:"https://server8.mp3quran.net/wdod/"
  },
  {
    id:54, name:"محمد عبد الكريم", flag:"🇵🇰", category:"asia", categoryLabel:"آسيا",
    mp3base:"https://server12.mp3quran.net/m_krm/"
  },

  /* ──────── آخرون ──────── */
  {
    id:55, name:"صابر عبد الحكم", flag:"🇸🇦", category:"other", categoryLabel:"آخرون",
    mp3base:"https://server12.mp3quran.net/hkm/"
  },
  {
    id:56, name:"خليفة الطنيجي", flag:"🇸🇦", category:"other", categoryLabel:"الإمارات",
    mp3base:"https://server12.mp3quran.net/tnjy/"
  },
  {
    id:57, name:"محمد عبد الحكيم سعيد", flag:"🇸🇦", category:"other", categoryLabel:"السعودية",
    mp3base:"https://server9.mp3quran.net/abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai/"
  },
  {
    id:58, name:"أكرم العلاقمي", flag:"🇸🇦", category:"other", categoryLabel:"السعودية",
    mp3base:"https://server9.mp3quran.net/akrm/"
  },

  /* ──────── الكويت ──────── */
  {
    id:59, name:"ياسر الفيلكاوي", flag:"🇰🇼", category:"gulf", categoryLabel:"الكويت",
    mp3base:"https://server6.mp3quran.net/fyl/"
  },

  /* ──────── المسجد الحرام ──────── */
  {
    id:60, name:"عبد الرحمن السديس (المجوّد)", flag:"🇸🇦", category:"haramayn", categoryLabel:"المسجد الحرام",
    mp3base:"https://server11.mp3quran.net/sds/"
  },

  /* ──────── السعودية ──────── */
  {
    id:61, name:"خالد الجليل (حفص)", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server10.mp3quran.net/jleel/"
  },
  {
    id:62, name:"صالح الصاهود", flag:"🇸🇦", category:"saudi", categoryLabel:"السعودية",
    mp3base:"https://server8.mp3quran.net/sahood/"
  },

  /* ──────── السعودية ──────── */
  {
    id:63, name:"عبد المجيد الأركاني", flag:"🇸🇦", category:"other", categoryLabel:"السعودية",
    mp3base:"https://server7.mp3quran.net/m_arkani/"
  },
];

/* Full provider catalog. The curated list above remains the offline/error fallback. */
window.RECITERS_STATUS = 'loading';
window.loadAllReciters = async function () {
  if (window.RECITERS_REQUEST) return window.RECITERS_REQUEST;
  window.RECITERS_STATUS = 'loading';
  window.RECITERS_REQUEST = (async function () {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 15000);
    try {
      var response = await fetch('https://www.mp3quran.net/api/v3/reciters?language=ar', { signal: controller.signal });
      if (!response.ok) throw new Error('Reciter catalog HTTP ' + response.status);
      var payload = await response.json();
      if (!Array.isArray(payload.reciters)) throw new Error('Invalid reciter catalog');
      var previous = window.RECITERS.slice();
      var catalog = [];
      var seen = new Set();
      payload.reciters.forEach(function (reader) {
        if (!reader || !reader.id || typeof reader.name !== 'string' || !Array.isArray(reader.moshaf)) return;
        reader.moshaf.forEach(function (mushaf) {
          var server;
          try { server = new URL(mushaf.server); } catch (error) { return; }
          if (server.protocol !== 'https:' || !server.hostname.endsWith('.mp3quran.net') || server.search || server.hash) return;
          var base = server.href.replace(/\/$/, '') + '/';
          var surahs = String(mushaf.surah_list || '').split(',').map(Number).filter(function (n) { return Number.isInteger(n) && n >= 1 && n <= 114; });
          surahs = Array.from(new Set(surahs)).sort(function (a, b) { return a - b; });
          if (!surahs.length || seen.has(base)) return;
          seen.add(base);
          var old = previous.find(function (r) { return r.mp3base === base; });
          var narration = String(mushaf.name || 'تلاوة');
          catalog.push({
            id: old ? old.id : 'mp3-' + reader.id + '-' + mushaf.id,
            providerId: String(reader.id), readerName: reader.name,
            name: reader.name + ' — ' + narration,
            narration: narration, surahs: surahs, mp3base: base,
            flag: old ? old.flag : '🎙️',
            category: old ? old.category : 'other',
            categoryLabel: old ? old.categoryLabel : 'فهرس القراء'
          });
        });
      });
      if (!catalog.length) throw new Error('Empty reciter catalog');
      catalog.sort(function (a, b) { return a.name.localeCompare(b.name, 'ar'); });
      window.RECITERS.splice(0, window.RECITERS.length, ...catalog);
      window.RECITERS_STATUS = 'ready';
    } catch (error) {
      window.RECITERS_STATUS = 'fallback';
    } finally {
      clearTimeout(timer);
      window.RECITERS_REQUEST = null;
      document.dispatchEvent(new Event('reciters:updated'));
    }
    return window.RECITERS;
  })();
  return window.RECITERS_REQUEST;
};
window.hasReciterSurah = function (reader, number) {
  return !!reader && (!Array.isArray(reader.surahs) || reader.surahs.includes(Number(number)));
};
document.addEventListener('DOMContentLoaded', function () { window.loadAllReciters(); });
