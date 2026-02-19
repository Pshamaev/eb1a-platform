"use client"

import { useState } from "react"

type Lang = "en" | "ru" | "zh" | "hi" | "es" | "pt"
type Answers = Record<string, string | string[]>

const LANG_LABELS: Record<Lang, string> = { en: "EN", ru: "RU", zh: "中文", hi: "हिं", es: "ES", pt: "PT" }
const LANGS: Lang[] = ["en", "ru", "zh", "hi", "es", "pt"]

const BLOCKS = [
  { id: "A", questions: [
    { key: "field", type: "single+other" },
    { key: "exp", type: "single" },
    { key: "degree", type: "single" },
    { key: "role", type: "single+other" },
  ]},
  { id: "B", questions: [
    { key: "awards", type: "multi+other" },
    { key: "membership", type: "single+other" },
    { key: "media", type: "multi+other" },
    { key: "judging", type: "multi+other" },
    { key: "contributions", type: "multi+other" },
    { key: "articles", type: "multi+other" },
    { key: "exhibitions", type: "single+other" },
    { key: "critical_role", type: "single+other" },
    { key: "salary", type: "single" },
    { key: "commercial", type: "single" },
  ]},
  { id: "C", questions: [
    { key: "niw_merit", type: "single+other" },
    { key: "niw_importance", type: "single" },
    { key: "niw_positioned", type: "multi+other" },
    { key: "niw_justification", type: "single+other" },
  ]},
  { id: "D", questions: [
    { key: "evidence", type: "multi" },
  ]},
]

// Minimal translations structure - EN and RU full, others abbreviated
const T: Record<Lang, Record<string, any>> = {
  en: {
    title: "Free EB1A / NIW Assessment",
    subtitle: "Answer questions about your professional profile. Get an objective analysis of your US immigration pathway.",
    anonymous: "Anonymous · No personal data required · ~5 minutes",
    start: "Start Free Assessment",
    next: "Continue",
    back: "Back",
    analyze: "Analyze My Profile",
    analyzing: "Analyzing your profile...",
    other_label: "Other / add your own:",
    other_placeholder: "Describe in your own words...",
    result_title: "Your Assessment Result",
    eb1a: "EB1A — Extraordinary Ability",
    niw: "EB2-NIW — National Interest Waiver",
    strong: "Strong",
    moderate: "Moderate",
    weak: "Weak",
    strong_criteria: "Strong criteria",
    weak_criteria: "Needs development",
    recommendation: "Recommendation",
    cta_build: "Build Your Case — $499",
    cta_expert: "Expert Review — $149",
    cta_retake: "Retake Assessment",
    block_A: "Block A — Professional Profile",
    block_B: "Block B — EB-1A Criteria (10)",
    block_C: "Block C — National Interest Waiver (NIW)",
    block_D: "Block D — Evidence Availability",
    step: (s: number, total: number) => `Block ${s} of ${total}`,
    q: {
      field: { label: "Field of expertise", opts: ["Science / Research","Tech / Engineering","Business / Entrepreneurship","Medical / Healthcare","Arts / Creative","Law / Policy","Finance / Economics","Education"] },
      exp: { label: "Years of professional experience", opts: ["1–3 years","4–7 years","8–15 years","15+ years"] },
      degree: { label: "Highest academic degree", opts: ["Bachelor's","Master's","PhD / MD / JD","No degree"] },
      role: { label: "Current professional role", opts: ["Employee / Specialist","Manager / Team Lead","Director / VP","Founder / Co-Founder","Independent Expert / Consultant"] },
      awards: { label: "Have you received professional awards recognized outside your employer?", sublabel: "Select all that apply", opts: ["International competitive award","National competitive award","Regional award","Internal / corporate only","None"] },
      membership: { label: "Membership in associations requiring outstanding achievement", opts: ["Yes — competitive / exclusive membership","Yes — open / basic membership","No","Not sure"] },
      media: { label: "Has a third-party media or publication featured you or your work?", sublabel: "Select all that apply", opts: ["National media","International media","Industry / niche media","Company press release only","None"] },
      judging: { label: "Have you been invited to evaluate others' work?", sublabel: "Select all that apply", opts: ["Peer reviewer for journals","Competition judge","Grant / committee reviewer","Conference program committee","Not invited"] },
      contributions: { label: "Original contribution used or cited by others outside your organization?", sublabel: "Select all that apply", opts: ["Patents or industry standards","Technology adopted by other organizations","Methodology widely referenced","Open source with significant adoption","None"] },
      articles: { label: "Have you authored papers in professional publications?", sublabel: "Select all that apply", opts: ["Peer-reviewed journals (Scopus / WoS)","Conference proceedings","Industry publications","Books or book chapters","No publications"] },
      exhibitions: { label: "Artistic exhibitions (arts / creative only — others choose N/A)", opts: ["International exhibitions","National exhibitions","Local exhibitions","Not applicable"] },
      critical_role: { label: "Have you held a leading or critical role with measurable impact?", opts: ["Senior leadership (C-level, VP)","Director / Head of unit","Founder / key founding role","Critical technical / scientific role","No significant role"] },
      salary: { label: "Your compensation relative to peers in your field and region", opts: ["Top 5% or higher","Top 10%","Above average","Average","Not sure"] },
      commercial: { label: "Commercial success or measurable market impact (if applicable)", opts: ["Significant (major revenue / adoption)","Moderate","Limited","Not applicable"] },
      niw_merit: { label: "What best describes your planned work in the United States?", sublabel: "NIW requires work with direct US national impact — beyond your personal career", opts: ["Scientific research with US national impact","Technology / product with measurable US impact","Public health / healthcare improvement for the US","US infrastructure / energy / environment","US education / national workforce development","Business only (local market, no broader national impact)"] },
      niw_importance: { label: "Who will benefit from your work in the US?", sublabel: "National importance = impact beyond a single employer or local community", opts: ["Nationwide (all US)","Multi-state / regional","One city or local market only","Hard to define"] },
      niw_positioned: { label: "Evidence that you are well-positioned to execute this work in the US?", sublabel: "Select all that apply", opts: ["US-based partners or collaborators","LOI or contracts from US organizations","Funding or grants related to this work","Publications directly relevant to the US endeavor","Track record of success in this field","Nothing yet"] },
      niw_justification: { label: "Why should the US waive the normal job offer requirement for you?", sublabel: "The balance test — why is it in US national interest to waive PERM", opts: ["Urgent national need — delay would harm US interests","Unique expertise unavailable among US workers","Work benefits so significant that labor certification is impractical","Field where recruiting foreign nationals is standard (research, academia)"] },
      evidence: { label: "Which evidence do you currently have available?", sublabel: "Select all that apply", opts: ["CV / Resume","Award certificates or diplomas","Publication PDFs or links","Proof of judging / peer review invitations","Letters of recommendation from experts","Employment letters with role description","Media articles about you","Salary / compensation documents","Patent documents","None yet"] },
    },
  },
  ru: {
    title: "Бесплатная оценка EB1A / NIW",
    subtitle: "Ответьте на вопросы о вашем профессиональном профиле. Получите объективный анализ иммиграционного пути в США.",
    anonymous: "Анонимно · Личные данные не требуются · ~5 минут",
    start: "Начать бесплатную оценку",
    next: "Продолжить",
    back: "Назад",
    analyze: "Проанализировать профиль",
    analyzing: "Анализируем ваш профиль...",
    other_label: "Другое / свой вариант:",
    other_placeholder: "Опишите своими словами...",
    result_title: "Результат оценки",
    eb1a: "EB1A — Экстраординарные способности",
    niw: "EB2-NIW — Национальный интерес",
    strong: "Сильный",
    moderate: "Средний",
    weak: "Слабый",
    strong_criteria: "Сильные критерии",
    weak_criteria: "Требует развития",
    recommendation: "Рекомендация",
    cta_build: "Построить кейс — $499",
    cta_expert: "Экспертная проверка — $149",
    cta_retake: "Пройти заново",
    block_A: "Блок A — Профессиональный профиль",
    block_B: "Блок B — Критерии EB-1A (10)",
    block_C: "Блок C — Национальный интерес (NIW)",
    block_D: "Блок D — Наличие доказательств",
    step: (s: number, total: number) => `Блок ${s} из ${total}`,
    q: {
      field: { label: "Область экспертизы", opts: ["Наука / Исследования","Технологии / Инжиниринг","Бизнес / Предпринимательство","Медицина / Здравоохранение","Искусство / Творчество","Право / Политика","Финансы / Экономика","Образование"] },
      exp: { label: "Лет профессионального опыта", opts: ["1–3 года","4–7 лет","8–15 лет","15+ лет"] },
      degree: { label: "Высшая академическая степень", opts: ["Бакалавр","Магистр","PhD / MD / JD","Нет степени"] },
      role: { label: "Текущая профессиональная роль", opts: ["Сотрудник / Специалист","Менеджер / Руководитель группы","Директор / VP","Основатель / Со-основатель","Независимый эксперт / Консультант"] },
      awards: { label: "Получали ли вы профессиональные награды, признанные за пределами работодателя?", sublabel: "Выберите все подходящие варианты", opts: ["Международная конкурсная награда","Национальная конкурсная награда","Региональная награда","Только внутренняя / корпоративная","Нет"] },
      membership: { label: "Членство в ассоциациях, требующих выдающихся достижений", opts: ["Да — конкурсное / эксклюзивное членство","Да — открытое / базовое членство","Нет","Не уверен"] },
      media: { label: "Публиковали ли о вас материалы независимые СМИ или издания?", sublabel: "Выберите все подходящие варианты", opts: ["Национальные СМИ","Международные СМИ","Отраслевые / нишевые издания","Только корпоративный пресс-релиз","Нет"] },
      judging: { label: "Приглашали ли вас оценивать работы других?", sublabel: "Выберите все подходящие варианты", opts: ["Рецензент журналов","Судья конкурсов","Рецензент грантов / комитетов","Член программного комитета конференции","Не приглашали"] },
      contributions: { label: "Создавали ли вы оригинальный вклад, используемый другими за пределами вашей организации?", sublabel: "Выберите все подходящие варианты", opts: ["Патенты или отраслевые стандарты","Технология принята другими организациями","Методология широко цитируется","Open source со значительным adoption","Нет"] },
      articles: { label: "Публиковали ли вы статьи в профессиональных изданиях?", sublabel: "Выберите все подходящие варианты", opts: ["Рецензируемые журналы (Scopus / WoS)","Труды конференций","Отраслевые издания","Книги или главы книг","Публикаций нет"] },
      exhibitions: { label: "Художественные выставки (только для искусства / творчества — остальные выбирают N/A)", opts: ["Международные выставки","Национальные выставки","Местные выставки","Не применимо"] },
      critical_role: { label: "Занимали ли вы руководящую или критическую роль с измеримым влиянием?", opts: ["Высшее руководство (C-level, VP)","Директор / Руководитель подразделения","Основатель / ключевая учредительная роль","Критическая техническая / научная роль","Значимой роли не было"] },
      salary: { label: "Ваше вознаграждение относительно коллег в вашей области и регионе", opts: ["Топ 5% и выше","Топ 10%","Выше среднего","Среднее","Не уверен"] },
      commercial: { label: "Коммерческий успех или измеримое влияние на рынок (если применимо)", opts: ["Значительный","Умеренный","Ограниченный","Не применимо"] },
      niw_merit: { label: "Что лучше всего описывает вашу планируемую работу в США?", sublabel: "NIW требует работы с прямым национальным влиянием на США — за рамками личной карьеры", opts: ["Научные исследования с национальным влиянием на США","Технологии / продукт с измеримым влиянием на США","Улучшение здравоохранения для США","Инфраструктура / энергетика / экология США","Образование / развитие национальных кадров США","Только бизнес (локальный рынок, без национального влияния)"] },
      niw_importance: { label: "Кто выиграет от вашей работы в США?", sublabel: "Национальное значение = влияние за пределами одного работодателя или местного сообщества", opts: ["Вся страна (все США)","Несколько штатов / регион","Только один город или местный рынок","Сложно определить"] },
      niw_positioned: { label: "Есть ли у вас доказательства готовности выполнять эту работу в США?", sublabel: "Выберите все подходящие варианты", opts: ["Партнёры или коллаборации в США","LOI или контракты от американских организаций","Финансирование или гранты по этой теме","Публикации по теме деятельности в США","Подтверждённый опыт успеха в этой области","Пока ничего"] },
      niw_justification: { label: "Почему США должны освободить вас от требования о предложении работы?", sublabel: "Балансовый тест — почему в интересах США отказаться от PERM", opts: ["Срочная национальная потребность — задержка нанесёт ущерб США","Уникальная экспертиза, недоступная среди американских работников","Польза настолько значительна, что трудовая сертификация нецелесообразна","Область, где привлечение иностранных специалистов является стандартом"] },
      evidence: { label: "Какие доказательства у вас есть в наличии?", sublabel: "Выберите все подходящие варианты", opts: ["CV / Резюме","Сертификаты или дипломы о наградах","PDF публикаций или ссылки","Подтверждения рецензирования / приглашения в жюри","Рекомендательные письма от экспертов","Письма от работодателей с описанием роли","Медиа-статьи о вас","Документы о зарплате / вознаграждении","Патентные документы","Пока ничего"] },
    },
  },
  zh: {
    title: "免费 EB1A / NIW 评估", subtitle: "回答问题，获得您美国移民途径的客观分析。", anonymous: "匿名 · 无需个人数据 · 约5分钟", start: "开始免费评估", next: "继续", back: "返回", analyze: "分析我的档案", analyzing: "正在分析...", other_label: "其他：", other_placeholder: "用您自己的话描述...", result_title: "评估结果", eb1a: "EB1A — 杰出能力", niw: "EB2-NIW — 国家利益豁免", strong: "强", moderate: "中等", weak: "弱", strong_criteria: "强项", weak_criteria: "需要发展", recommendation: "建议", cta_build: "建立案例 — $499", cta_expert: "专家审核 — $149", cta_retake: "重新评估", block_A: "A — 职业档案", block_B: "B — EB-1A标准", block_C: "C — 国家利益(NIW)", block_D: "D — 证据", step: (s: number, t: number) => `第${s}块/共${t}块`,
    q: {
      field: { label: "专业领域", opts: ["科学/研究","技术/工程","商业/创业","医学/医疗","艺术/创意","法律/政策","金融/经济","教育"] },
      exp: { label: "职业经验年数", opts: ["1–3年","4–7年","8–15年","15年以上"] },
      degree: { label: "最高学历", opts: ["学士","硕士","博士/医学博士/法学博士","无学位"] },
      role: { label: "当前职业角色", opts: ["员工/专家","经理/团队负责人","总监/VP","创始人/联合创始人","独立专家/顾问"] },
      awards: { label: "您是否获得过专业奖项？", sublabel: "选择所有适用项", opts: ["国际竞争性奖项","国家竞争性奖项","地区奖项","仅内部/企业奖项","无"] },
      membership: { label: "需要杰出成就的协会会员资格", opts: ["是——竞争性/独家","是——开放/基本","否","不确定"] },
      media: { label: "第三方媒体是否报道过您？", sublabel: "选择所有适用项", opts: ["国家媒体","国际媒体","行业媒体","仅公司新闻稿","无"] },
      judging: { label: "您是否被邀请评估他人的工作？", sublabel: "选择所有适用项", opts: ["期刊同行评审员","竞赛评委","基金/委员会评审员","会议程序委员会","未被邀请"] },
      contributions: { label: "您是否做出了被他人使用的原创贡献？", sublabel: "选择所有适用项", opts: ["专利或行业标准","被其他组织采用的技术","被广泛引用的方法论","重大开源项目","无"] },
      articles: { label: "您是否在专业出版物上发表过文章？", sublabel: "选择所有适用项", opts: ["同行评审期刊","会议论文集","行业出版物","书籍","无出版物"] },
      exhibitions: { label: "艺术展览（仅艺术/创意）", opts: ["国际展览","国家展览","地方展览","不适用"] },
      critical_role: { label: "您是否担任过具有影响的领导角色？", opts: ["高级领导(C级、VP)","总监/部门负责人","创始人","关键技术角色","无重要角色"] },
      salary: { label: "您的薪酬与同行相比", opts: ["前5%或更高","前10%","高于平均","平均","不确定"] },
      commercial: { label: "商业成功（如适用）", opts: ["显著","适中","有限","不适用"] },
      niw_merit: { label: "您在美国计划的工作是什么？", sublabel: "NIW需要对美国有直接国家影响的工作", opts: ["对美国有国家影响的科学研究","对美国有影响的技术/产品","改善美国公共卫生","美国基础设施/能源","美国教育/劳动力发展","仅本地商业"] },
      niw_importance: { label: "谁将从您在美国的工作中受益？", sublabel: "国家重要性=超出单一雇主的影响", opts: ["全国（全美）","多州/地区","仅本地","难以定义"] },
      niw_positioned: { label: "您是否有在美国执行工作的证据？", sublabel: "选择所有适用项", opts: ["美国合作伙伴","LOI或合同","相关资金/赠款","相关出版物","成功记录","暂无"] },
      niw_justification: { label: "为什么美国应该豁免工作邀请要求？", sublabel: "平衡测试", opts: ["紧迫的国家需求","独特专业知识","工作价值极大","招募外国人是标准做法"] },
      evidence: { label: "您目前有哪些证据？", sublabel: "选择所有适用项", opts: ["简历","奖项证书","出版物PDF","评审邀请","推荐信","就业信","媒体文章","薪资文件","专利文件","暂无"] },
    },
  },
  hi: {
    title: "निःशुल्क EB1A / NIW मूल्यांकन", subtitle: "प्रश्नों का उत्तर दें। अमेरिकी आप्रवासन मार्ग का विश्लेषण पाएं।", anonymous: "गुमनाम · ~5 मिनट", start: "मूल्यांकन शुरू करें", next: "जारी रखें", back: "वापस", analyze: "विश्लेषण करें", analyzing: "विश्लेषण हो रहा है...", other_label: "अन्य:", other_placeholder: "अपने शब्दों में...", result_title: "परिणाम", eb1a: "EB1A — असाधारण क्षमता", niw: "EB2-NIW — राष्ट्रीय हित", strong: "मजबूत", moderate: "मध्यम", weak: "कमजोर", strong_criteria: "मजबूत", weak_criteria: "विकास चाहिए", recommendation: "सिफारिश", cta_build: "केस बनाएं — $499", cta_expert: "विशेषज्ञ — $149", cta_retake: "फिर से", block_A: "A — प्रोफ़ाइल", block_B: "B — EB-1A", block_C: "C — NIW", block_D: "D — साक्ष्य", step: (s: number, t: number) => `${s}/${t}`,
    q: {
      field: { label: "क्षेत्र", opts: ["विज्ञान","तकनीक","व्यापार","चिकित्सा","कला","कानून","वित्त","शिक्षा"] },
      exp: { label: "अनुभव के वर्ष", opts: ["1–3","4–7","8–15","15+"] },
      degree: { label: "डिग्री", opts: ["स्नातक","मास्टर्स","PhD/MD/JD","कोई नहीं"] },
      role: { label: "भूमिका", opts: ["कर्मचारी","प्रबंधक","निदेशक","संस्थापक","स्वतंत्र विशेषज्ञ"] },
      awards: { label: "पुरस्कार?", sublabel: "सभी चुनें", opts: ["अंतर्राष्ट्रीय","राष्ट्रीय","क्षेत्रीय","केवल आंतरिक","कोई नहीं"] },
      membership: { label: "प्रतिष्ठित संगठनों में सदस्यता?", opts: ["हां — प्रतिस्पर्धी","हां — खुली","नहीं","निश्चित नहीं"] },
      media: { label: "मीडिया कवरेज?", sublabel: "सभी चुनें", opts: ["राष्ट्रीय","अंतर्राष्ट्रीय","उद्योग","प्रेस विज्ञप्ति","कोई नहीं"] },
      judging: { label: "दूसरों के काम का मूल्यांकन?", sublabel: "सभी चुनें", opts: ["जर्नल समीक्षक","प्रतियोगिता न्यायाधीश","अनुदान समीक्षक","सम्मेलन","नहीं"] },
      contributions: { label: "मूल योगदान जो दूसरे उपयोग करते हैं?", sublabel: "सभी चुनें", opts: ["पेटेंट","अपनाई तकनीक","संदर्भित पद्धति","ओपन सोर्स","कोई नहीं"] },
      articles: { label: "प्रकाशन?", sublabel: "सभी चुनें", opts: ["पीयर-समीक्षित","सम्मेलन","उद्योग","पुस्तकें","कोई नहीं"] },
      exhibitions: { label: "कलात्मक प्रदर्शनियां (केवल कला)", opts: ["अंतर्राष्ट्रीय","राष्ट्रीय","स्थानीय","लागू नहीं"] },
      critical_role: { label: "नेतृत्व भूमिका?", opts: ["C-level/VP","निदेशक","संस्थापक","तकनीकी","कोई नहीं"] },
      salary: { label: "वेतन तुलना", opts: ["शीर्ष 5%","शीर्ष 10%","औसत से ऊपर","औसत","निश्चित नहीं"] },
      commercial: { label: "व्यावसायिक सफलता?", opts: ["महत्वपूर्ण","मध्यम","सीमित","लागू नहीं"] },
      niw_merit: { label: "अमेरिका में आपकी योजना?", sublabel: "अमेरिका पर प्रत्यक्ष राष्ट्रीय प्रभाव", opts: ["अमेरिकी वैज्ञानिक अनुसंधान","अमेरिकी तकनीक/उत्पाद","अमेरिकी स्वास्थ्य सेवा","अमेरिकी बुनियादी ढांचा","अमेरिकी शिक्षा","केवल स्थानीय व्यापार"] },
      niw_importance: { label: "अमेरिका में लाभार्थी?", sublabel: "राष्ट्रीय = एकल नियोक्ता से परे", opts: ["पूरा अमेरिका","बहु-राज्य","केवल स्थानीय","अनिश्चित"] },
      niw_positioned: { label: "अमेरिका में कार्य करने की क्षमता का प्रमाण?", sublabel: "सभी चुनें", opts: ["अमेरिकी भागीदार","LOI/अनुबंध","फंडिंग","प्रकाशन","सफलता का रिकॉर्ड","कुछ नहीं"] },
      niw_justification: { label: "PERM छूट क्यों?", sublabel: "संतुलन परीक्षण", opts: ["राष्ट्रीय आवश्यकता","अद्वितीय कौशल","बहुत महत्वपूर्ण काम","मानक भर्ती प्रथा"] },
      evidence: { label: "उपलब्ध साक्ष्य?", sublabel: "सभी चुनें", opts: ["CV","पुरस्कार प्रमाण","प्रकाशन","समीक्षा आमंत्रण","सिफारिश पत्र","रोजगार पत्र","मीडिया","वेतन दस्तावेज","पेटेंट","कुछ नहीं"] },
    },
  },
  es: {
    title: "Evaluación Gratuita EB1A / NIW", subtitle: "Responda preguntas sobre su perfil profesional.", anonymous: "Anónimo · ~5 minutos", start: "Iniciar Evaluación", next: "Continuar", back: "Atrás", analyze: "Analizar Mi Perfil", analyzing: "Analizando...", other_label: "Otro:", other_placeholder: "Describa...", result_title: "Resultado", eb1a: "EB1A — Habilidad Extraordinaria", niw: "EB2-NIW — Interés Nacional", strong: "Fuerte", moderate: "Moderado", weak: "Débil", strong_criteria: "Criterios fuertes", weak_criteria: "Necesita desarrollo", recommendation: "Recomendación", cta_build: "Construir Caso — $499", cta_expert: "Experto — $149", cta_retake: "Repetir", block_A: "A — Perfil", block_B: "B — Criterios EB-1A", block_C: "C — NIW", block_D: "D — Evidencia", step: (s: number, t: number) => `Bloque ${s} de ${t}`,
    q: {
      field: { label: "Campo", opts: ["Ciencia","Tecnología","Negocios","Medicina","Arte","Derecho","Finanzas","Educación"] },
      exp: { label: "Años de experiencia", opts: ["1–3","4–7","8–15","15+"] },
      degree: { label: "Grado académico", opts: ["Licenciatura","Maestría","PhD/MD/JD","Sin título"] },
      role: { label: "Rol actual", opts: ["Empleado","Gerente","Director/VP","Fundador","Consultor independiente"] },
      awards: { label: "¿Premios reconocidos fuera de su empleador?", sublabel: "Todo lo que aplique", opts: ["Internacional","Nacional","Regional","Solo interno","Ninguno"] },
      membership: { label: "¿Membresía que requiere logros?", opts: ["Sí — competitiva","Sí — abierta","No","No estoy seguro"] },
      media: { label: "¿Medios de terceros lo han destacado?", sublabel: "Todo lo que aplique", opts: ["Nacional","Internacional","Industria","Solo corporativo","Ninguno"] },
      judging: { label: "¿Invitado a evaluar trabajo de otros?", sublabel: "Todo lo que aplique", opts: ["Revisor de revistas","Juez de competencias","Revisor de becas","Comité conferencia","No"] },
      contributions: { label: "¿Contribución original usada por otros?", sublabel: "Todo lo que aplique", opts: ["Patentes/estándares","Tecnología adoptada","Metodología citada","Código abierto","Ninguno"] },
      articles: { label: "¿Artículos en publicaciones profesionales?", sublabel: "Todo lo que aplique", opts: ["Revistas revisadas","Conferencias","Industria","Libros","Sin publicaciones"] },
      exhibitions: { label: "Exposiciones artísticas (solo arte)", opts: ["Internacional","Nacional","Local","No aplica"] },
      critical_role: { label: "¿Rol de liderazgo con impacto?", opts: ["C-level/VP","Director","Fundador","Técnico crítico","Sin rol"] },
      salary: { label: "Compensación vs. pares", opts: ["Top 5%","Top 10%","Por encima","Promedio","No sé"] },
      commercial: { label: "Éxito comercial", opts: ["Significativo","Moderado","Limitado","No aplica"] },
      niw_merit: { label: "¿Su trabajo planificado en EE.UU.?", sublabel: "NIW requiere impacto nacional directo en EE.UU.", opts: ["Investigación científica nacional","Tecnología con impacto en EE.UU.","Salud pública EE.UU.","Infraestructura EE.UU.","Educación/fuerza laboral EE.UU.","Solo negocio local"] },
      niw_importance: { label: "¿Quién se beneficia en EE.UU.?", sublabel: "Importancia nacional = más allá de un empleador", opts: ["Todo EE.UU.","Multi-estatal","Solo local","Difícil definir"] },
      niw_positioned: { label: "¿Evidencia de estar posicionado en EE.UU.?", sublabel: "Todo lo que aplique", opts: ["Socios en EE.UU.","LOI/contratos","Financiación","Publicaciones relevantes","Historial de éxito","Nada"] },
      niw_justification: { label: "¿Por qué eximir oferta de trabajo?", sublabel: "Prueba de equilibrio", opts: ["Necesidad urgente","Experiencia única","Beneficios enormes","Campo estándar de extranjeros"] },
      evidence: { label: "¿Qué evidencia tiene?", sublabel: "Todo lo que aplique", opts: ["CV","Certificados","Publicaciones","Prueba de revisión","Cartas de recomendación","Cartas de empleo","Medios","Salario","Patentes","Nada"] },
    },
  },
  pt: {
    title: "Avaliação Gratuita EB1A / NIW", subtitle: "Responda perguntas sobre seu perfil profissional.", anonymous: "Anônimo · ~5 minutos", start: "Iniciar Avaliação", next: "Continuar", back: "Voltar", analyze: "Analisar Perfil", analyzing: "Analisando...", other_label: "Outro:", other_placeholder: "Descreva...", result_title: "Resultado", eb1a: "EB1A — Habilidade Extraordinária", niw: "EB2-NIW — Interesse Nacional", strong: "Forte", moderate: "Moderado", weak: "Fraco", strong_criteria: "Critérios fortes", weak_criteria: "Precisa desenvolvimento", recommendation: "Recomendação", cta_build: "Construir Caso — $499", cta_expert: "Especialista — $149", cta_retake: "Refazer", block_A: "A — Perfil", block_B: "B — Critérios EB-1A", block_C: "C — NIW", block_D: "D — Evidências", step: (s: number, t: number) => `Bloco ${s} de ${t}`,
    q: {
      field: { label: "Área", opts: ["Ciência","Tecnologia","Negócios","Medicina","Arte","Direito","Finanças","Educação"] },
      exp: { label: "Anos de experiência", opts: ["1–3","4–7","8–15","15+"] },
      degree: { label: "Grau acadêmico", opts: ["Bacharelado","Mestrado","PhD/MD/JD","Sem diploma"] },
      role: { label: "Função atual", opts: ["Funcionário","Gerente","Diretor/VP","Fundador","Consultor independente"] },
      awards: { label: "Prêmios reconhecidos fora do empregador?", sublabel: "Tudo que se aplica", opts: ["Internacional","Nacional","Regional","Apenas interno","Nenhum"] },
      membership: { label: "Filiação que exige conquistas?", opts: ["Sim — competitiva","Sim — aberta","Não","Não tenho certeza"] },
      media: { label: "Mídia de terceiros destacou você?", sublabel: "Tudo que se aplica", opts: ["Nacional","Internacional","Setor","Apenas corporativo","Nenhum"] },
      judging: { label: "Convidado para avaliar outros?", sublabel: "Tudo que se aplica", opts: ["Revisor de periódicos","Juiz de competições","Revisor de bolsas","Comitê conferência","Não"] },
      contributions: { label: "Contribuição original usada por outros?", sublabel: "Tudo que se aplica", opts: ["Patentes/padrões","Tecnologia adotada","Metodologia citada","Código aberto","Nenhum"] },
      articles: { label: "Artigos em publicações profissionais?", sublabel: "Tudo que se aplica", opts: ["Periódicos revisados","Conferências","Setor","Livros","Sem publicações"] },
      exhibitions: { label: "Exposições artísticas (apenas arte)", opts: ["Internacional","Nacional","Local","Não aplicável"] },
      critical_role: { label: "Papel de liderança com impacto?", opts: ["C-level/VP","Diretor","Fundador","Técnico crítico","Sem papel"] },
      salary: { label: "Remuneração vs. pares", opts: ["Top 5%","Top 10%","Acima da média","Média","Não sei"] },
      commercial: { label: "Sucesso comercial", opts: ["Significativo","Moderado","Limitado","Não aplicável"] },
      niw_merit: { label: "Seu trabalho planejado nos EUA?", sublabel: "NIW requer impacto nacional direto nos EUA", opts: ["Pesquisa científica nacional","Tecnologia com impacto nos EUA","Saúde pública EUA","Infraestrutura EUA","Educação EUA","Apenas negócio local"] },
      niw_importance: { label: "Quem se beneficia nos EUA?", sublabel: "Importância nacional = além de um empregador", opts: ["Todo EUA","Multi-estadual","Apenas local","Difícil definir"] },
      niw_positioned: { label: "Evidência de estar posicionado nos EUA?", sublabel: "Tudo que se aplica", opts: ["Parceiros nos EUA","LOI/contratos","Financiamento","Publicações relevantes","Histórico de sucesso","Nada"] },
      niw_justification: { label: "Por que dispensar oferta de emprego?", sublabel: "Teste de equilíbrio", opts: ["Necessidade urgente","Expertise única","Benefícios enormes","Campo padrão para estrangeiros"] },
      evidence: { label: "Que evidências você tem?", sublabel: "Tudo que se aplica", opts: ["CV","Certificados","Publicações","Prova de revisão","Cartas de recomendação","Cartas de emprego","Mídia","Salário","Patentes","Nada"] },
    },
  },
}

function computeScore(answers: Answers) {
  let eb1a = 0
  const strongEB1A: string[] = []
  const weakEB1A: string[] = []
  const has = (key: string, idx: number) => {
    const val = answers[key]
    return Array.isArray(val) ? val.includes(String(idx)) : val === String(idx)
  }
  if (has("awards",0)){eb1a+=3;strongEB1A.push("Awards")}
  else if(has("awards",1)){eb1a+=2;strongEB1A.push("Awards")}
  else if(has("awards",2)){eb1a+=0.5;weakEB1A.push("Awards")}
  else weakEB1A.push("Awards")

  if(has("membership",0)){eb1a+=2;strongEB1A.push("Membership")}
  else weakEB1A.push("Membership")

  if(has("media",0)||has("media",1)){eb1a+=2;strongEB1A.push("Media")}
  else if(has("media",2)){eb1a+=1;weakEB1A.push("Media")}
  else weakEB1A.push("Media")

  const jc=[0,1,2,3].filter(i=>has("judging",i)).length
  if(jc>=2){eb1a+=2;strongEB1A.push("Judging")}
  else if(jc===1){eb1a+=1.5;strongEB1A.push("Judging")}
  else weakEB1A.push("Judging")

  const cc=[0,1,2,3].filter(i=>has("contributions",i)).length
  if(cc>=2){eb1a+=3;strongEB1A.push("Contributions")}
  else if(cc===1){eb1a+=1.5;strongEB1A.push("Contributions")}
  else weakEB1A.push("Contributions")

  if(has("articles",0)){eb1a+=2.5;strongEB1A.push("Publications")}
  else if(has("articles",1)||has("articles",2)){eb1a+=1;weakEB1A.push("Publications")}
  else weakEB1A.push("Publications")

  if(has("critical_role",0)||has("critical_role",2)){eb1a+=2;strongEB1A.push("Critical Role")}
  else if(has("critical_role",1)||has("critical_role",3)){eb1a+=1.5;strongEB1A.push("Critical Role")}
  else weakEB1A.push("Critical Role")

  if(has("salary",0)){eb1a+=2;strongEB1A.push("High Salary")}
  else if(has("salary",1)){eb1a+=1.5;strongEB1A.push("High Salary")}
  else if(has("salary",2)){eb1a+=0.5;weakEB1A.push("High Salary")}
  else weakEB1A.push("High Salary")

  let niw=0
  const merit=answers.niw_merit as string
  if(merit&&merit!=="5") niw+=3
  if(has("niw_importance",0)) niw+=3
  else if(has("niw_importance",1)) niw+=2
  else niw+=0.5
  const pc=[0,1,2,3,4].filter(i=>has("niw_positioned",i)).length
  niw+=Math.min(pc,3)
  if(has("niw_justification",0)||has("niw_justification",1)) niw+=2
  else niw+=1

  const eb1aLevel=eb1a>=11?"strong":eb1a>=6?"moderate":"weak"
  const niwLevel=niw>=9?"strong":niw>=5?"moderate":"weak"
  const uniq=(a:string[])=>[...new Set(a)]
  return {eb1aLevel,niwLevel,strongEB1A:uniq(strongEB1A),weakEB1A:uniq(weakEB1A).filter(w=>!strongEB1A.includes(w))}
}

function getRec(eb:string,niw:string,lang:Lang):string{
  const r:Record<Lang,Record<string,string>>={
    en:{both_strong:"Both EB1A and NIW are viable. Consider filing both simultaneously to maximize approval chances.",eb1a_strong:"EB1A is your primary path. Focus on assembling your top 3–5 criteria with solid documentation.",niw_strong:"EB2-NIW is your strongest path. Your work has clear US national importance and you are well-positioned.",both_moderate:"Both paths are possible but need strengthening. NIW is more accessible — focus on demonstrating US national impact.",eb1a_moderate:"EB1A is possible but needs development. Build 3 strong criteria with solid evidence before filing.",niw_moderate:"NIW is your best current option. Strengthen your case by documenting national US impact and securing connections.",weak:"Your profile needs significant development. Expert consultation will identify the fastest path forward."},
    ru:{both_strong:"И EB1A, и NIW реально достижимы. Рассмотрите подачу обоих одновременно для максимальных шансов.",eb1a_strong:"EB1A — ваш основной путь. Соберите доказательства по топ 3–5 критериям.",niw_strong:"EB2-NIW — ваш сильнейший путь. Ваша работа имеет чёткое национальное значение для США.",both_moderate:"Оба пути возможны, но требуют усиления. NIW более доступен — фокус на национальном значении для США.",eb1a_moderate:"EB1A возможен, но требует развития. Усильте минимум 3 критерия перед подачей.",niw_moderate:"NIW — ваш лучший текущий вариант. Документируйте национальное значение и получайте американские связи.",weak:"Профиль требует существенного развития. Экспертная консультация определит быстрейший путь."},
    zh:{both_strong:"EB1A和NIW都可行，建议同时申请。",eb1a_strong:"EB1A是您的主要途径，专注于建立3-5个强有力的标准。",niw_strong:"EB2-NIW是您最强的途径，您的工作对美国具有明确的国家重要性。",both_moderate:"两条路径都可能，NIW更容易，专注于美国国家影响。",eb1a_moderate:"EB1A可能，但需要发展，申请前建立3个强标准。",niw_moderate:"NIW是您目前最好的选择，加强国家影响的文件。",weak:"您的档案需要大量发展，建议专家咨询。"},
    hi:{both_strong:"EB1A और NIW दोनों व्यवहार्य हैं।",eb1a_strong:"EB1A आपका मुख्य मार्ग है।",niw_strong:"NIW आपका सबसे मजबूत मार्ग है।",both_moderate:"दोनों संभव हैं लेकिन मजबूती चाहिए।",eb1a_moderate:"EB1A संभव है, 3 मजबूत मानदंड बनाएं।",niw_moderate:"NIW सबसे अच्छा विकल्प है।",weak:"प्रोफ़ाइल को विकास की जरूरत है।"},
    es:{both_strong:"Tanto EB1A como NIW son viables. Considere presentar ambas.",eb1a_strong:"EB1A es su camino principal. Construya 3-5 criterios sólidos.",niw_strong:"NIW es su camino más fuerte. Su trabajo tiene clara importancia nacional para EE.UU.",both_moderate:"Ambos son posibles. NIW es más accesible.",eb1a_moderate:"EB1A posible pero necesita desarrollo.",niw_moderate:"NIW es su mejor opción actual.",weak:"Su perfil necesita desarrollo significativo."},
    pt:{both_strong:"Tanto EB1A quanto NIW são viáveis.",eb1a_strong:"EB1A é o seu caminho principal.",niw_strong:"NIW é o seu caminho mais forte.",both_moderate:"Ambos possíveis, NIW mais acessível.",eb1a_moderate:"EB1A possível mas precisa desenvolvimento.",niw_moderate:"NIW é sua melhor opção.",weak:"Seu perfil precisa de desenvolvimento."},
  }
  const k=eb==="strong"&&niw==="strong"?"both_strong":eb==="strong"?"eb1a_strong":niw==="strong"?"niw_strong":eb==="moderate"&&niw==="moderate"?"both_moderate":eb==="moderate"?"eb1a_moderate":niw==="moderate"?"niw_moderate":"weak"
  return r[lang][k]
}

export default function AssessmentPage() {
  const [lang,setLang]=useState<Lang>("en")
  const [blockIdx,setBlockIdx]=useState(-1)
  const [answers,setAnswers]=useState<Answers>({})
  const [other,setOther]=useState<Record<string,string>>({})
  const t=T[lang]
  const curBlock=BLOCKS[blockIdx]

  const setSingle=(key:string,val:string)=>setAnswers(p=>({...p,[key]:val}))
  const toggleMulti=(key:string,idx:string)=>{
    const cur=(answers[key] as string[])||[]
    setAnswers(p=>({...p,[key]:cur.includes(idx)?cur.filter(v=>v!==idx):[...cur,idx]}))
  }
  const isSel=(key:string,idx:string)=>{
    const v=answers[key]
    return Array.isArray(v)?v.includes(idx):v===idx
  }
  const blockOk=()=>{
    if(!curBlock) return false
    return curBlock.questions.every(({key,type})=>{
      if(type.includes("multi")) return ((answers[key] as string[])||[]).length>0||!!other[key]
      return !!answers[key]||!!other[key]
    })
  }
  const goNext=()=>{
    if(blockIdx===BLOCKS.length-1){setBlockIdx(BLOCKS.length);setTimeout(()=>setBlockIdx(BLOCKS.length+1),2000)}
    else setBlockIdx(i=>i+1)
  }

  const renderQ=(key:string,type:string)=>{
    const q=t.q[key]; if(!q) return null
    const multi=type.includes("multi")
    const hasOth=type.includes("other")
    return(
      <div key={key} className="mb-8">
        <p className="text-sm font-bold text-slate-800 mb-1">{q.label}</p>
        {q.sublabel&&<p className="text-xs text-slate-500 mb-3">{q.sublabel}</p>}
        <div className={multi?"flex flex-wrap gap-2":"grid gap-2"}>
          {q.opts.map((opt:string,i:number)=>{
            const idx=String(i),sel=isSel(key,idx)
            return(
              <button key={i} onClick={()=>multi?toggleMulti(key,idx):setSingle(key,idx)}
                className={`${multi?"px-3 py-2":"w-full text-left px-4 py-3"} rounded-xl border text-sm font-medium transition-all ${sel?"bg-blue-600 text-white border-blue-600 shadow-md":"bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50"}`}>
                {opt}
              </button>
            )
          })}
        </div>
        {hasOth&&(
          <div className="mt-3">
            <p className="text-xs text-slate-400 mb-1">{t.other_label}</p>
            <textarea value={other[key]||""} onChange={e=>setOther(p=>({...p,[key]:e.target.value}))}
              placeholder={t.other_placeholder} rows={2}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-blue-400 text-slate-700 placeholder-slate-300"/>
          </div>
        )}
      </div>
    )
  }

  const renderResult=()=>{
    const{eb1aLevel,niwLevel,strongEB1A,weakEB1A}=computeScore(answers)
    const rec=getRec(eb1aLevel,niwLevel,lang)
    const lc=(l:string)=>l==="strong"?"text-emerald-700 bg-emerald-50 border-emerald-200":l==="moderate"?"text-amber-700 bg-amber-50 border-amber-200":"text-red-600 bg-red-50 border-red-200"
    const lt=(l:string)=>l==="strong"?t.strong:l==="moderate"?t.moderate:t.weak
    return(
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t.result_title}</h1>
        <div className="grid gap-3 mb-6">
          {[{label:"EB1A",name:t.eb1a,level:eb1aLevel},{label:"NIW",name:t.niw,level:niwLevel}].map(item=>(
            <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
              <div><p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p><p className="font-semibold text-slate-800 text-sm">{item.name}</p></div>
              <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${lc(item.level)}`}>{lt(item.level)}</span>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">{t.strong_criteria}</p>
          <div className="flex flex-wrap gap-2 mb-4">{strongEB1A.length>0?strongEB1A.map(c=><span key={c} className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">{c}</span>):<span className="text-slate-400 text-xs">—</span>}</div>
          <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">{t.weak_criteria}</p>
          <div className="flex flex-wrap gap-2">{weakEB1A.slice(0,5).map(c=><span key={c} className="bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full">{c}</span>)}</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">{t.recommendation}</p>
          <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
        </div>
        <div className="grid gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-sm">{t.cta_build}</button>
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 rounded-xl border border-slate-200 text-sm">{t.cta_expert}</button>
          <button onClick={()=>{setBlockIdx(-1);setAnswers({});setOther({})}} className="text-slate-400 text-sm py-2 hover:text-slate-600">{t.cta_retake}</button>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <span className="font-bold text-slate-800 text-sm">CaseBuilder</span>
        </div>
        <div className="flex gap-1">
          {LANGS.map(l=><button key={l} onClick={()=>setLang(l)} className={`px-2 py-1 rounded text-xs font-bold ${lang===l?"bg-blue-600 text-white":"text-slate-400 hover:text-slate-700"}`}>{LANG_LABELS[l]}</button>)}
        </div>
      </div>

      {blockIdx===-1&&(
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t.title}</h1>
          <p className="text-slate-600 mb-3 leading-relaxed">{t.subtitle}</p>
          <p className="text-slate-400 text-sm mb-10">{t.anonymous}</p>
          <button onClick={()=>setBlockIdx(0)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-xl shadow-lg text-lg">{t.start}</button>
        </div>
      )}

      {blockIdx>=0&&blockIdx<BLOCKS.length&&(
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            {BLOCKS.map((b,i)=>(
              <div key={b.id} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i<blockIdx?"bg-emerald-500 text-white":i===blockIdx?"bg-blue-600 text-white":"bg-slate-200 text-slate-500"}`}>{i<blockIdx?"✓":b.id}</div>
                {i<BLOCKS.length-1&&<div className={`h-0.5 flex-1 ${i<blockIdx?"bg-emerald-400":"bg-slate-200"}`}/>}
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-2">{t.step(blockIdx+1,BLOCKS.length)}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">{t[`block_${BLOCKS[blockIdx].id}`]}</h2>
          {curBlock.questions.map(({key,type})=>renderQ(key,type))}
          <div className="flex gap-3 mt-8">
            {blockIdx>0&&<button onClick={()=>setBlockIdx(i=>i-1)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 text-sm">{t.back}</button>}
            <button onClick={goNext} disabled={!blockOk()} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              {blockIdx===BLOCKS.length-1?t.analyze:t.next}
            </button>
          </div>
        </div>
      )}

      {blockIdx===BLOCKS.length&&(
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"/>
          <p className="text-slate-600 font-medium">{t.analyzing}</p>
        </div>
      )}

      {blockIdx===BLOCKS.length+1&&renderResult()}
    </div>
  )
}
