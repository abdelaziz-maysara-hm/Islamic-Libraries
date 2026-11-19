/* ============================================================
   محرك حساب المواريث (الفرائض) — كسور مضبوطة (بدون أخطاء تقريب)
   يغطي: الزوج/الزوجة، الأب، الأم، الجد لأب، الجدة، الأبناء والبنات،
         الإخوة والأخوات الأشقاء.
   لا يغطي: أبناء الابن، الإخوة لأب أو لأم، الأعمام، ذوي الأرحام —
         الحالات دي لازم تُعرض على عالم شرعي أو المحكمة.
   المصدر الفقهي: أحكام الفرائض المتفق عليها عند جمهور الفقهاء
   (الشافعية/المالكية/الحنابلة)، مع الإشارة صراحة لمواضع الخلاف
   (زي الغراوين وحجب الجد بالإخوة).
   ============================================================ */

const Faraid = (function () {

  /* ---------- كسور مضبوطة ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
  function frac(n, d) { const g = gcd(n, d); return { n: n / g, d: d / g }; }
  function fAdd(a, b) { return frac(a.n * b.d + b.n * a.d, a.d * b.d); }
  function fSub(a, b) { return frac(a.n * b.d - b.n * a.d, a.d * b.d); }
  function fMul(a, b) { return frac(a.n * b.n, a.d * b.d); }
  function fCmp(a, b) { return a.n * b.d - b.n * a.d; } // >0 يعني a>b
  const ZERO = frac(0, 1);

  /* ---------- الدالة الرئيسية ---------- */
  // input = {
  //   deceasedGender: 'male'|'female',
  //   spouseCount: عدد الزوجات (لو المتوفى ذكر) أو 1/0 للزوج (لو أنثى)
  //   father, mother, grandfather, grandmother: boolean
  //   sons, daughters, brothers, sisters: عدد (أشقاء فقط)
  // }
  function calculate(input) {
    const notes = [];
    const heirs = []; // {key,label,share:frac,isResidueTaker:false}

    const hasSon      = input.sons > 0;
    const hasDaughter = input.daughters > 0;
    const hasChild     = hasSon || hasDaughter;
    const fatherAlive  = !!input.father;

    // الجد محجوب كليًا بالأب
    const grandfatherAlive = !!input.grandfather && !fatherAlive;
    if (input.grandfather && fatherAlive) notes.push('الجد محجوب بالأب (الأب موجود).');

    // الأم تحجب الجدة كليًا
    const motherAlive = !!input.mother;
    const grandmotherAlive = !!input.grandmother && !motherAlive;
    if (input.grandmother && motherAlive) notes.push('الجدة محجوبة بالأم (الأم موجودة).');

    // حجب الإخوة الأشقاء: بالأب، أو بالجد الوارث، أو بالابن (وليس بالبنت وحدها)
    const inheritingGrandfather = grandfatherAlive; // مبسّط: رأي حجب الإخوة بالجد (قول جمهور)
    const siblingsBlocked = fatherAlive || inheritingGrandfather || hasSon;
    if ((input.brothers > 0 || input.sisters > 0) && siblingsBlocked) {
      notes.push('الإخوة والأخوات الأشقاء محجوبون (بالأب أو الجد أو الابن).');
    }
    const brothersCount = siblingsBlocked ? 0 : (input.brothers || 0);
    const sistersCount  = siblingsBlocked ? 0 : (input.sisters  || 0);
    const hasBrother = brothersCount > 0;
    const hasSister  = sistersCount  > 0;

    // عدد الإخوة/الأخوات الخام (قبل الحجب) — يُستخدم فقط لتحديد نصيب الأم
    // (الإخوة يحجبون الأم من الثلث إلى السدس حتى لو كانوا هم أنفسهم محجومين بالأب)
    const rawSiblingCount = (input.brothers || 0) + (input.sisters || 0);

    /* ----- 1) الزوج / الزوجة ----- */
    let spouseShare = ZERO;
    const spousePresent = input.deceasedGender === 'male' ? (input.spouseCount > 0) : !!input.spouseCount;
    if (input.deceasedGender === 'male' && input.spouseCount > 0) {
      const wivesFrac = hasChild ? frac(1, 8) : frac(1, 4);
      spouseShare = wivesFrac;
      if (input.spouseCount === 1) {
        heirs.push({ key: 'wife', label: 'الزوجة', share: wivesFrac });
      } else {
        heirs.push({ key: 'wives', label: `الزوجات (${input.spouseCount}، بالتساوي بينهن)`, share: wivesFrac });
      }
    } else if (input.deceasedGender === 'female' && input.spouseCount) {
      const husbandFrac = hasChild ? frac(1, 4) : frac(1, 2);
      spouseShare = husbandFrac;
      heirs.push({ key: 'husband', label: 'الزوج', share: husbandFrac });
    }

    /* ----- 2) الأم (مع حالتي الغراوين) ----- */
    let motherShare = ZERO;
    if (motherAlive) {
      const reducedToSixth = hasChild || rawSiblingCount >= 2;
      if (!reducedToSixth && fatherAlive && spousePresent) {
        // الغراوين/العُمَريّتان: تأخذ الأم ثلث الباقي بعد نصيب الزوج/الزوجة، مش ثلث كل التركة
        const remainder = fSub(frac(1, 1), spouseShare);
        motherShare = fMul(remainder, frac(1, 3));
        notes.push('حالة الغراوين (العُمَريّتان): الأم أخذت ثلث الباقي بعد نصيب الزوج/الزوجة، وفق قضاء عمر بن الخطاب رضي الله عنه الذي عليه الأئمة الأربعة وجمهور الفقهاء (وخالف فيه ابن عباس رضي الله عنهما فأعطى الأم ثلث التركة كاملًا).');
      } else if (!reducedToSixth) {
        motherShare = frac(1, 3);
      } else {
        motherShare = frac(1, 6);
      }
      heirs.push({ key: 'mother', label: 'الأم', share: motherShare });
    }

    /* ----- 3) الأب / الجد (فرض + احتمال تعصيب) ----- */
    let fatherAsabaFlag = false, fatherPureAsaba = false;
    if (fatherAlive) {
      if (hasSon) {
        heirs.push({ key: 'father', label: 'الأب', share: frac(1, 6) });
      } else if (hasDaughter) {
        heirs.push({ key: 'father', label: 'الأب (فرض + تعصيب)', share: frac(1, 6) });
        fatherAsabaFlag = true;
      } else {
        heirs.push({ key: 'father', label: 'الأب (تعصيب بالكامل)', share: ZERO });
        fatherPureAsaba = true;
      }
    }
    let grandfatherAsabaFlag = false, grandfatherPureAsaba = false;
    if (grandfatherAlive) {
      if (hasSon) {
        heirs.push({ key: 'grandfather', label: 'الجد لأب', share: frac(1, 6) });
      } else if (hasDaughter) {
        heirs.push({ key: 'grandfather', label: 'الجد لأب (فرض + تعصيب)', share: frac(1, 6) });
        grandfatherAsabaFlag = true;
      } else {
        heirs.push({ key: 'grandfather', label: 'الجد لأب (تعصيب بالكامل)', share: ZERO });
        grandfatherPureAsaba = true;
      }
    }

    /* ----- 4) الجدة ----- */
    if (grandmotherAlive) {
      heirs.push({ key: 'grandmother', label: 'الجدة', share: frac(1, 6) });
    }

    /* ----- 5) البنات (فرض) — فقط لو مفيش ابن ----- */
    let daughtersFixed = ZERO;
    if (hasDaughter && !hasSon) {
      daughtersFixed = input.daughters === 1 ? frac(1, 2) : frac(2, 3);
      heirs.push({
        key: 'daughters',
        label: input.daughters === 1 ? 'البنت' : `البنات (${input.daughters}، بالتساوي بينهن)`,
        share: daughtersFixed
      });
    }

    /* ----- 6) الأخوات الشقيقات (فرض) — فقط لو مفيش أخ ومفيش بنات ----- */
    let sistersFixed = ZERO;
    let sistersAsabaWithDaughters = false;
    if (hasSister && !hasBrother) {
      if (hasDaughter && !hasSon) {
        // الأخوات عصبة مع البنات: يأخذن الباقي بعد الفروض، بالتساوي بينهن
        sistersAsabaWithDaughters = true;
        notes.push('الأخوات الشقيقات عصبة مع البنات: يأخذن ما تبقى من التركة بعد الفروض.');
      } else {
        sistersFixed = input.sisters === 1 ? frac(1, 2) : frac(2, 3);
        heirs.push({
          key: 'sisters',
          label: input.sisters === 1 ? 'الأخت الشقيقة' : `الأخوات الشقيقات (${input.sisters}، بالتساوي بينهن)`,
          share: sistersFixed
        });
      }
    }

    /* ----- إجمالي الفروض ----- */
    let totalFixed = ZERO;
    heirs.forEach(h => { totalFixed = fAdd(totalFixed, h.share); });

    /* ----- العول: لو مجموع الفروض أكبر من الواحد الصحيح ----- */
    let awlApplied = false;
    if (fCmp(totalFixed, frac(1, 1)) > 0) {
      awlApplied = true;
      const newBase = totalFixed.n; // كل الكسور بتتحول لمقام totalFixed.d، والعول بيرفع المقام لمجموع البسوط
      heirs.forEach(h => {
        const scaled = h.share.d === totalFixed.d ? h.share.n : (h.share.n * (totalFixed.d / h.share.d));
        h.share = frac(scaled, newBase);
      });
      totalFixed = frac(1, 1);
      notes.push(`تم تطبيق العول: مجموع الفروض الأصلي كان أكبر من التركة، فزيد المقام لِـ ${newBase} ليستوعب كل الفروض بنفس النسبة، ونقص نصيب كل وارث بالتساوي.`);
    }

    /* ----- الباقي (إن وجد) وتوزيعه على العصبة ----- */
    const residue = fSub(frac(1, 1), totalFixed);
    let residueNote = '';

    if (fCmp(residue, ZERO) > 0) {
      if (hasSon) {
        // الأبناء والبنات عصبة بالباقي، للذكر مثل حظ الأنثيين
        const totalParts = input.sons * 2 + (input.daughters || 0) * 1;
        const sonShare = fMul(residue, frac(input.sons * 2, totalParts));
        const daughterShare = input.daughters > 0 ? fMul(residue, frac(input.daughters * 1, totalParts)) : ZERO;
        heirs.push({ key: 'sons', label: `الأبناء (${input.sons}، للذكر مثل حظ الأنثيين)`, share: sonShare, perHead: true, count: input.sons });
        if (input.daughters > 0) {
          heirs.push({ key: 'daughters_asaba', label: `البنات (${input.daughters}) — مع الأبناء تعصيبًا`, share: daughterShare, perHead: true, count: input.daughters });
        }
      } else if (fatherAsabaFlag || fatherPureAsaba) {
        const idx = heirs.findIndex(h => h.key === 'father');
        heirs[idx].share = fAdd(heirs[idx].share, residue);
      } else if (grandfatherAsabaFlag || grandfatherPureAsaba) {
        const idx = heirs.findIndex(h => h.key === 'grandfather');
        heirs[idx].share = fAdd(heirs[idx].share, residue);
      } else if (hasBrother) {
        const totalParts = brothersCount * 2 + sistersCount * 1;
        const brotherShare = fMul(residue, frac(brothersCount * 2, totalParts));
        heirs.push({ key: 'brothers', label: `الإخوة الأشقاء (${brothersCount}، للذكر مثل حظ الأنثيين)`, share: brotherShare, perHead: true, count: brothersCount });
        if (sistersCount > 0) {
          const sisterShare = fMul(residue, frac(sistersCount * 1, totalParts));
          heirs.push({ key: 'sisters_asaba', label: `الأخوات الشقيقات (${sistersCount}) — مع الإخوة تعصيبًا`, share: sisterShare, perHead: true, count: sistersCount });
        }
      } else if (sistersAsabaWithDaughters) {
        heirs.push({ key: 'sisters', label: `الأخوات الشقيقات (${input.sisters}، عصبة مع البنات، بالتساوي بينهن)`, share: residue, perHead: true, count: input.sisters });
      } else {
        // لا يوجد عصبة → الرد (رجوع الباقي لأصحاب الفروض من غير الزوجين، بنسبة أنصبتهم)
        const raddEligible = heirs.filter(h => h.key !== 'wife' && h.key !== 'wives' && h.key !== 'husband');
        if (raddEligible.length > 0) {
          let raddBase = ZERO;
          raddEligible.forEach(h => { raddBase = fAdd(raddBase, h.share); });
          raddEligible.forEach(h => {
            const portion = fMul(residue, frac(h.share.n * raddBase.d, raddBase.n * h.share.d));
            h.share = fAdd(h.share, portion);
          });
          notes.push('تم تطبيق الرد: مفيش عصبة، فالباقي من التركة اتوزع على أصحاب الفروض (غير الزوجين) بنسبة أنصبتهم الأصلية، لأن الزوج/الزوجة لا يُرَدّ عليهما عند جمهور الفقهاء.');
        } else {
          residueNote = 'لا يوجد عاصب ولا صاحب فرض (غير الزوجين) يستحق الباقي — الفقه الإسلامي يوجّه هذا الباقي لبيت مال المسلمين أو لذوي الأرحام (أقارب أبعد لم تُدخلهم هذه الحاسبة). استشر عالمًا شرعيًا لتحديد المستحق الفعلي.';
          notes.push(residueNote);
        }
      }
    }

    return { heirs, notes, awlApplied };
  }

  return { calculate, frac, fAdd };
})();

if (typeof module !== 'undefined') module.exports = Faraid;
