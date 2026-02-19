"use client"

import { useState } from "react"

// ─── TYPES ─────────────────────────────────────────────────────────────────────
type Lang = "en" | "ru" | "zh" | "hi" | "es" | "pt"
type Answers = Record<string, string | string[]>

// ─── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T: Record<Lang, Record<string, any>> = {
  en: {
    title: "Free EB1A / NIW Assessment",
    subtitle: "12 questions. Objective analysis of your US immigration pathway.",
    anonymous: "Anonymous · No personal data required · ~3 minutes",
    start: "Start Assessment",
    next: "Continue",
    back: "Back",
    analyze: "Analyze My Profile",
    analyzing: "Analyzing...",
    result_title: "Your Assessment Result",
    eb1a: "EB1A — Extraordinary Ability",
    niw: "EB2-NIW — National Interest Waiver",
    strong: "Strong",
    moderate: "Moderate",
    weak: "Weak — needs development",
    strong_criteria: "Strong criteria",
    weak_criteria: "Weak criteria",
    recommendation: "Recommendation",
    cta_build: "Build Your Case — $499",
    cta_expert: "Expert Review — $149",
    cta_retake: "Retake",
    block1_title: "Professional Background",
    block2_title: "EB1A Criteria",
    block3_title: "National Interest (NIW)",
    step: (s: number, t: number) => `Step ${s} of ${t}`,
    q: {
      field: { label: "Primary professional field", opts: ["Technology & Engineering","Medicine & Healthcare","Science & Research","Business & Entrepreneurship","Law & Policy","Arts & Design","Education & Academia","Finance","Other"] },
      exp: { label: "Years of professional experience", opts: ["1–3 years","4–7 years","8–15 years","15+ years"] },
      degree: { label: "Highest academic degree", opts: ["Bachelor's","Master's","PhD / MD / JD","No degree"] },
      role: { label: "Current professional role", opts: ["Employee / Specialist","Manager / Team Lead","Director / VP","C-Level / Founder","Independent Researcher"] },
      awards: { label: "Professional awards or prizes", opts: ["None","Internal / corporate only","Regional or national level","International level"] },
      pubs: { label: "Peer-reviewed publications", opts: ["None","1–5 publications","6–20 publications","20+ publications"] },
      citations: { label: "Total citations of your work", opts: ["None / unknown","1–50 citations","50–200 citations","200+ citations"] },
      judging: { label: "Peer review or jury activity", opts: ["None","Journal peer reviewer","Jury member in competitions or grants","Both"] },
      media: { label: "Independent media coverage about you personally", opts: ["None","Industry or niche publications","National media","International media"] },
      contrib: { label: "Original work adopted outside your organization", opts: ["None","Used internally only","Adopted by other organizations","Industry-wide or widely adopted"] },
      salary: { label: "Your income relative to peers in your field and region", opts: ["Average or below","Above average","Top 10%","Top 5% or higher"] },
      niw_impact: { label: "Your work directly impacts (select all that apply)", opts: ["National economy","Technology / competitiveness","Healthcare / public health","Education / research","Energy / infrastructure","National security","None of the above"], multi: true },
      niw_positioned: { label: "How well are you positioned to execute your work in the US?", opts: ["Weak — no US connections or track record","Moderate — some connections or publications","Strong — US partners, contracts, or active collaborations"] },
      niw_links: { label: "Existing connections to the United States", opts: ["None","Publications citing US research","US-based collaborators or partners","Contracts, LOIs, or funding from US organizations"] },
    },
  },
  ru: {
    title: "Бесплатная оценка EB1A / NIW",
    subtitle: "12 вопросов. Объективный анализ вашего иммиграционного пути в США.",
    anonymous: "Анонимно · Личные данные не требуются · ~3 минуты",
    start: "Начать оценку",
    next: "Продолжить",
    back: "Назад",
    analyze: "Проанализировать профиль",
    analyzing: "Анализируем...",
    result_title: "Результат оценки",
    eb1a: "EB1A — Экстраординарные способности",
    niw: "EB2-NIW — Национальный интерес",
    strong: "Сильный",
    moderate: "Средний",
    weak: "Слабый — требует развития",
    strong_criteria: "Сильные критерии",
    weak_criteria: "Слабые критерии",
    recommendation: "Рекомендация",
    cta_build: "Построить кейс — $499",
    cta_expert: "Экспертная проверка — $149",
    cta_retake: "Пройти заново",
    block1_title: "Профессиональный профиль",
    block2_title: "Критерии EB1A",
    block3_title: "Национальный интерес (NIW)",
    step: (s: number, t: number) => `Шаг ${s} из ${t}`,
    q: {
      field: { label: "Основная профессиональная область", opts: ["Технологии и инжиниринг","Медицина и здравоохранение","Наука и исследования","Бизнес и предпринимательство","Право и политика","Искусство и дизайн","Образование и академия","Финансы","Другое"] },
      exp: { label: "Лет профессионального опыта", opts: ["1–3 года","4–7 лет","8–15 лет","15+ лет"] },
      degree: { label: "Высшая академическая степень", opts: ["Бакалавр","Магистр","PhD / MD / JD","Нет степени"] },
      role: { label: "Текущая роль", opts: ["Сотрудник / Специалист","Менеджер / Руководитель группы","Директор / VP","C-Level / Основатель","Независимый исследователь"] },
      awards: { label: "Профессиональные награды или премии", opts: ["Нет","Только внутренние / корпоративные","Региональный или национальный уровень","Международный уровень"] },
      pubs: { label: "Рецензируемые публикации", opts: ["Нет","1–5 публикаций","6–20 публикаций","20+ публикаций"] },
      citations: { label: "Общее число цитирований ваших работ", opts: ["Нет / не знаю","1–50 цитирований","50–200 цитирований","200+ цитирований"] },
      judging: { label: "Рецензирование или участие в жюри", opts: ["Нет","Рецензент журналов","Член жюри конкурсов или грантов","Оба варианта"] },
      media: { label: "Независимые публикации СМИ о вас лично", opts: ["Нет","Отраслевые или нишевые издания","Национальные СМИ","Международные СМИ"] },
      contrib: { label: "Оригинальные разработки используются за пределами вашей организации", opts: ["Нет","Только внутри компании","Приняты другими организациями","Широко adopted в индустрии"] },
      salary: { label: "Ваш доход относительно коллег в вашей области и регионе", opts: ["Средний или ниже","Выше среднего","Топ 10%","Топ 5% и выше"] },
      niw_impact: { label: "Ваша работа напрямую влияет на (выберите все подходящие)", opts: ["Национальную экономику","Технологии / конкурентоспособность","Здравоохранение","Образование / науку","Энергетику / инфраструктуру","Национальную безопасность","Ничего из вышеперечисленного"], multi: true },
      niw_positioned: { label: "Насколько вы готовы реализовывать свою работу в США?", opts: ["Слабо — нет связей или опыта в США","Умеренно — есть некоторые связи или публикации","Сильно — есть партнёры, контракты или активное сотрудничество"] },
      niw_links: { label: "Существующие связи с США", opts: ["Нет","Публикации с цитированием американских исследований","Коллаборации с американскими организациями","Контракты, LOI или финансирование от американских организаций"] },
    },
  },
  zh: {
    title: "免费 EB1A / NIW 评估",
    subtitle: "12个问题。客观分析您的美国移民路径。",
    anonymous: "匿名 · 无需个人信息 · 约3分钟",
    start: "开始评估",
    next: "继续",
    back: "返回",
    analyze: "分析我的档案",
    analyzing: "分析中...",
    result_title: "评估结果",
    eb1a: "EB1A — 杰出能力",
    niw: "EB2-NIW — 国家利益豁免",
    strong: "强",
    moderate: "中等",
    weak: "弱 — 需要加强",
    strong_criteria: "强项标准",
    weak_criteria: "弱项标准",
    recommendation: "建议",
    cta_build: "建立案例 — $499",
    cta_expert: "专家审核 — $149",
    cta_retake: "重新评估",
    block1_title: "职业背景",
    block2_title: "EB1A 标准",
    block3_title: "国家利益 (NIW)",
    step: (s: number, t: number) => `第 ${s} 步，共 ${t} 步`,
    q: {
      field: { label: "主要专业领域", opts: ["技术与工程","医学与医疗","科学与研究","商业与创业","法律与政策","艺术与设计","教育与学术","金融","其他"] },
      exp: { label: "职业经验年数", opts: ["1–3年","4–7年","8–15年","15年以上"] },
      degree: { label: "最高学历", opts: ["学士","硕士","博士 / 医学博士 / 法学博士","无学位"] },
      role: { label: "当前职业角色", opts: ["员工 / 专家","经理 / 团队负责人","总监 / 副总裁","高管 / 创始人","独立研究员"] },
      awards: { label: "专业奖项或奖励", opts: ["无","仅内部 / 企业级","地区或国家级","国际级"] },
      pubs: { label: "同行评审出版物", opts: ["无","1–5篇","6–20篇","20篇以上"] },
      citations: { label: "您作品的总引用次数", opts: ["无 / 不知道","1–50次","50–200次","200次以上"] },
      judging: { label: "同行评审或评审委员会活动", opts: ["无","期刊同行评审","竞赛或资助评审委员会","两者都有"] },
      media: { label: "关于您个人的独立媒体报道", opts: ["无","行业或小众媒体","国家媒体","国际媒体"] },
      contrib: { label: "在您的组织之外被采用的原创工作", opts: ["无","仅内部使用","被其他组织采用","行业广泛采用"] },
      salary: { label: "您的收入与同领域同地区的同行相比", opts: ["平均或以下","高于平均","前10%","前5%或更高"] },
      niw_impact: { label: "您的工作直接影响到（选择所有适用的）", opts: ["国家经济","技术 / 竞争力","医疗卫生","教育 / 研究","能源 / 基础设施","国家安全","以上均不适用"], multi: true },
      niw_positioned: { label: "您在美国执行工作的准备程度如何？", opts: ["弱 — 没有美国联系或经验","中等 — 有一些联系或出版物","强 — 有美国合作伙伴、合同或积极合作"] },
      niw_links: { label: "与美国的现有联系", opts: ["无","引用美国研究的出版物","与美国组织的合作","来自美国组织的合同、意向书或资金"] },
    },
  },
  hi: {
    title: "निःशुल्क EB1A / NIW मूल्यांकन",
    subtitle: "12 प्रश्न। अमेरिकी आप्रवासन मार्ग का वस्तुनिष्ठ विश्लेषण।",
    anonymous: "गुमनाम · कोई व्यक्तिगत डेटा आवश्यक नहीं · ~3 मिनट",
    start: "मूल्यांकन शुरू करें",
    next: "जारी रखें",
    back: "वापस",
    analyze: "मेरी प्रोफ़ाइल विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है...",
    result_title: "आपका मूल्यांकन परिणाम",
    eb1a: "EB1A — असाधारण क्षमता",
    niw: "EB2-NIW — राष्ट्रीय हित छूट",
    strong: "मजबूत",
    moderate: "मध्यम",
    weak: "कमजोर — विकास की आवश्यकता",
    strong_criteria: "मजबूत मानदंड",
    weak_criteria: "कमजोर मानदंड",
    recommendation: "सिफारिश",
    cta_build: "केस बनाएं — $499",
    cta_expert: "विशेषज्ञ समीक्षा — $149",
    cta_retake: "फिर से लें",
    block1_title: "व्यावसायिक पृष्ठभूमि",
    block2_title: "EB1A मानदंड",
    block3_title: "राष्ट्रीय हित (NIW)",
    step: (s: number, t: number) => `चरण ${s} / ${t}`,
    q: {
      field: { label: "मुख्य व्यावसायिक क्षेत्र", opts: ["प्रौद्योगिकी और इंजीनियरिंग","चिकित्सा और स्वास्थ्य सेवा","विज्ञान और अनुसंधान","व्यापार और उद्यमिता","कानून और नीति","कला और डिजाइन","शिक्षा और शिक्षाविद","वित्त","अन्य"] },
      exp: { label: "व्यावसायिक अनुभव के वर्ष", opts: ["1–3 वर्ष","4–7 वर्ष","8–15 वर्ष","15+ वर्ष"] },
      degree: { label: "उच्चतम शैक्षणिक डिग्री", opts: ["स्नातक","मास्टर्स","PhD / MD / JD","कोई डिग्री नहीं"] },
      role: { label: "वर्तमान भूमिका", opts: ["कर्मचारी / विशेषज्ञ","प्रबंधक / टीम लीड","निदेशक / VP","C-Level / संस्थापक","स्वतंत्र शोधकर्ता"] },
      awards: { label: "व्यावसायिक पुरस्कार", opts: ["कोई नहीं","केवल आंतरिक / कॉर्पोरेट","क्षेत्रीय या राष्ट्रीय स्तर","अंतर्राष्ट्रीय स्तर"] },
      pubs: { label: "पीयर-समीक्षित प्रकाशन", opts: ["कोई नहीं","1–5","6–20","20+"] },
      citations: { label: "आपके काम के कुल उद्धरण", opts: ["कोई नहीं / अज्ञात","1–50","50–200","200+"] },
      judging: { label: "पीयर समीक्षा या जूरी गतिविधि", opts: ["कोई नहीं","जर्नल पीयर समीक्षक","प्रतियोगिता या अनुदान जूरी सदस्य","दोनों"] },
      media: { label: "आपके बारे में स्वतंत्र मीडिया कवरेज", opts: ["कोई नहीं","उद्योग या आला प्रकाशन","राष्ट्रीय मीडिया","अंतर्राष्ट्रीय मीडिया"] },
      contrib: { label: "मूल कार्य जो आपके संगठन के बाहर अपनाया गया", opts: ["कोई नहीं","केवल आंतरिक उपयोग","अन्य संगठनों द्वारा अपनाया गया","उद्योग-व्यापी रूप से अपनाया गया"] },
      salary: { label: "आपके क्षेत्र और क्षेत्र में साथियों की तुलना में आपकी आय", opts: ["औसत या नीचे","औसत से ऊपर","शीर्ष 10%","शीर्ष 5% या उससे अधिक"] },
      niw_impact: { label: "आपका काम सीधे प्रभावित करता है (सभी लागू चुनें)", opts: ["राष्ट्रीय अर्थव्यवस्था","प्रौद्योगिकी / प्रतिस्पर्धात्मकता","स्वास्थ्य सेवा","शिक्षा / अनुसंधान","ऊर्जा / बुनियादी ढांचा","राष्ट्रीय सुरक्षा","उपरोक्त में से कोई नहीं"], multi: true },
      niw_positioned: { label: "अमेरिका में अपना काम करने के लिए आप कितने तैयार हैं?", opts: ["कमजोर — कोई अमेरिकी संबंध नहीं","मध्यम — कुछ संबंध या प्रकाशन","मजबूत — अमेरिकी भागीदार, अनुबंध या सहयोग"] },
      niw_links: { label: "अमेरिका के साथ मौजूदा संबंध", opts: ["कोई नहीं","अमेरिकी अनुसंधान उद्धृत करने वाले प्रकाशन","अमेरिकी संगठनों के साथ सहयोग","अमेरिकी संगठनों से अनुबंध या वित्त पोषण"] },
    },
  },
  es: {
    title: "Evaluación Gratuita EB1A / NIW",
    subtitle: "12 preguntas. Análisis objetivo de su camino de inmigración a EE.UU.",
    anonymous: "Anónimo · Sin datos personales · ~3 minutos",
    start: "Iniciar Evaluación",
    next: "Continuar",
    back: "Atrás",
    analyze: "Analizar Mi Perfil",
    analyzing: "Analizando...",
    result_title: "Resultado de su Evaluación",
    eb1a: "EB1A — Habilidad Extraordinaria",
    niw: "EB2-NIW — Interés Nacional",
    strong: "Fuerte",
    moderate: "Moderado",
    weak: "Débil — necesita desarrollo",
    strong_criteria: "Criterios fuertes",
    weak_criteria: "Criterios débiles",
    recommendation: "Recomendación",
    cta_build: "Construir Caso — $499",
    cta_expert: "Revisión de Experto — $149",
    cta_retake: "Repetir",
    block1_title: "Perfil Profesional",
    block2_title: "Criterios EB1A",
    block3_title: "Interés Nacional (NIW)",
    step: (s: number, t: number) => `Paso ${s} de ${t}`,
    q: {
      field: { label: "Campo profesional principal", opts: ["Tecnología e Ingeniería","Medicina y Salud","Ciencia e Investigación","Negocios y Emprendimiento","Derecho y Política","Arte y Diseño","Educación y Academia","Finanzas","Otro"] },
      exp: { label: "Años de experiencia profesional", opts: ["1–3 años","4–7 años","8–15 años","15+ años"] },
      degree: { label: "Máximo grado académico", opts: ["Licenciatura","Maestría","PhD / MD / JD","Sin título"] },
      role: { label: "Rol profesional actual", opts: ["Empleado / Especialista","Gerente / Líder de equipo","Director / VP","C-Level / Fundador","Investigador independiente"] },
      awards: { label: "Premios o reconocimientos profesionales", opts: ["Ninguno","Solo interno / corporativo","Nivel regional o nacional","Nivel internacional"] },
      pubs: { label: "Publicaciones revisadas por pares", opts: ["Ninguna","1–5","6–20","20+"] },
      citations: { label: "Total de citas de su trabajo", opts: ["Ninguna / desconocido","1–50","50–200","200+"] },
      judging: { label: "Actividad de revisión o jurado", opts: ["Ninguna","Revisor de revistas","Miembro del jurado en competencias","Ambos"] },
      media: { label: "Cobertura mediática independiente sobre usted", opts: ["Ninguna","Publicaciones de industria","Medios nacionales","Medios internacionales"] },
      contrib: { label: "Trabajo original adoptado fuera de su organización", opts: ["Ninguno","Solo uso interno","Adoptado por otras organizaciones","Ampliamente adoptado en la industria"] },
      salary: { label: "Sus ingresos en comparación con colegas en su campo y región", opts: ["Promedio o por debajo","Por encima del promedio","Top 10%","Top 5% o más"] },
      niw_impact: { label: "Su trabajo impacta directamente (seleccione todo lo que aplique)", opts: ["Economía nacional","Tecnología / competitividad","Salud pública","Educación / investigación","Energía / infraestructura","Seguridad nacional","Ninguno de los anteriores"], multi: true },
      niw_positioned: { label: "¿Qué tan bien posicionado está para ejecutar su trabajo en EE.UU.?", opts: ["Débil — sin conexiones en EE.UU.","Moderado — algunas conexiones o publicaciones","Fuerte — socios, contratos o colaboraciones activas en EE.UU."] },
      niw_links: { label: "Conexiones existentes con Estados Unidos", opts: ["Ninguna","Publicaciones que citan investigación estadounidense","Colaboradores o socios en EE.UU.","Contratos, LOIs o financiamiento de organizaciones estadounidenses"] },
    },
  },
  pt: {
    title: "Avaliação Gratuita EB1A / NIW",
    subtitle: "12 perguntas. Análise objetiva do seu caminho de imigração para os EUA.",
    anonymous: "Anônimo · Sem dados pessoais · ~3 minutos",
    start: "Iniciar Avaliação",
    next: "Continuar",
    back: "Voltar",
    analyze: "Analisar Meu Perfil",
    analyzing: "Analisando...",
    result_title: "Resultado da sua Avaliação",
    eb1a: "EB1A — Habilidade Extraordinária",
    niw: "EB2-NIW — Interesse Nacional",
    strong: "Forte",
    moderate: "Moderado",
    weak: "Fraco — precisa de desenvolvimento",
    strong_criteria: "Critérios fortes",
    weak_criteria: "Critérios fracos",
    recommendation: "Recomendação",
    cta_build: "Construir Caso — $499",
    cta_expert: "Revisão de Especialista — $149",
    cta_retake: "Refazer",
    block1_title: "Perfil Profissional",
    block2_title: "Critérios EB1A",
    block3_title: "Interesse Nacional (NIW)",
    step: (s: number, t: number) => `Etapa ${s} de ${t}`,
    q: {
      field: { label: "Área profissional principal", opts: ["Tecnologia e Engenharia","Medicina e Saúde","Ciência e Pesquisa","Negócios e Empreendedorismo","Direito e Política","Arte e Design","Educação e Academia","Finanças","Outro"] },
      exp: { label: "Anos de experiência profissional", opts: ["1–3 anos","4–7 anos","8–15 anos","15+ anos"] },
      degree: { label: "Maior grau acadêmico", opts: ["Bacharelado","Mestrado","PhD / MD / JD","Sem diploma"] },
      role: { label: "Função profissional atual", opts: ["Funcionário / Especialista","Gerente / Líder de equipe","Diretor / VP","C-Level / Fundador","Pesquisador independente"] },
      awards: { label: "Prêmios ou reconhecimentos profissionais", opts: ["Nenhum","Apenas interno / corporativo","Nível regional ou nacional","Nível internacional"] },
      pubs: { label: "Publicações revisadas por pares", opts: ["Nenhuma","1–5","6–20","20+"] },
      citations: { label: "Total de citações do seu trabalho", opts: ["Nenhuma / desconhecido","1–50","50–200","200+"] },
      judging: { label: "Atividade de revisão ou júri", opts: ["Nenhuma","Revisor de periódicos","Membro do júri em competições","Ambos"] },
      media: { label: "Cobertura midiática independente sobre você", opts: ["Nenhuma","Publicações do setor","Mídia nacional","Mídia internacional"] },
      contrib: { label: "Trabalho original adotado fora da sua organização", opts: ["Nenhum","Uso interno apenas","Adotado por outras organizações","Amplamente adotado na indústria"] },
      salary: { label: "Sua renda em comparação com colegas na sua área e região", opts: ["Média ou abaixo","Acima da média","Top 10%","Top 5% ou mais"] },
      niw_impact: { label: "Seu trabalho impacta diretamente (selecione todos que se aplicam)", opts: ["Economia nacional","Tecnologia / competitividade","Saúde pública","Educação / pesquisa","Energia / infraestrutura","Segurança nacional","Nenhum dos acima"], multi: true },
      niw_positioned: { label: "Quão bem posicionado você está para executar seu trabalho nos EUA?", opts: ["Fraco — sem conexões nos EUA","Moderado — algumas conexões ou publicações","Forte — parceiros, contratos ou colaborações ativas nos EUA"] },
      niw_links: { label: "Conexões existentes com os Estados Unidos", opts: ["Nenhuma","Publicações citando pesquisas americanas","Colaboradores ou parceiros nos EUA","Contratos, LOIs ou financiamento de organizações americanas"] },
    },
  },
}

// ─── QUESTION KEYS IN ORDER ────────────────────────────────────────────────────
const BLOCK1_KEYS = ["field", "exp", "degree", "role"]
const BLOCK2_KEYS = ["awards", "pubs", "citations", "judging", "media", "contrib", "salary"]
const BLOCK3_KEYS = ["niw_impact", "niw_positioned", "niw_links"]
const ALL_KEYS = [...BLOCK1_KEYS, ...BLOCK2_KEYS, ...BLOCK3_KEYS]

// ─── SCORING ───────────────────────────────────────────────────────────────────
function computeScore(answers: Answers) {
  let eb1a = 0
  const strongEB1A: string[] = []
  const weakEB1A: string[] = []

  const award = answers.awards as string
  if (award === "3") { eb1a += 3; strongEB1A.push("Awards") }
  else if (award === "2") { eb1a += 2; strongEB1A.push("Awards") }
  else if (award === "1") { eb1a += 0.5; weakEB1A.push("Awards") }
  else weakEB1A.push("Awards")

  const pubs = answers.pubs as string
  if (pubs === "3") { eb1a += 3; strongEB1A.push("Publications") }
  else if (pubs === "2") { eb1a += 2; strongEB1A.push("Publications") }
  else if (pubs === "1") { eb1a += 1; weakEB1A.push("Publications") }
  else weakEB1A.push("Publications")

  const cit = answers.citations as string
  if (cit === "3") eb1a += 2
  else if (cit === "2") eb1a += 1.5
  else if (cit === "1") eb1a += 0.5

  const judging = answers.judging as string
  if (judging === "2" || judging === "3") { eb1a += 2; strongEB1A.push("Judging") }
  else if (judging === "1") { eb1a += 1.5; strongEB1A.push("Judging") }
  else weakEB1A.push("Judging")

  const media = answers.media as string
  if (media === "3") { eb1a += 2; strongEB1A.push("Media") }
  else if (media === "2") { eb1a += 1.5; strongEB1A.push("Media") }
  else if (media === "1") { eb1a += 0.5; weakEB1A.push("Media") }
  else weakEB1A.push("Media")

  const contrib = answers.contrib as string
  if (contrib === "3") { eb1a += 3; strongEB1A.push("Contribution") }
  else if (contrib === "2") { eb1a += 2; strongEB1A.push("Contribution") }
  else if (contrib === "1") { eb1a += 0.5; weakEB1A.push("Contribution") }
  else weakEB1A.push("Contribution")

  const salary = answers.salary as string
  if (salary === "3") { eb1a += 2; strongEB1A.push("High Salary") }
  else if (salary === "2") { eb1a += 1.5; strongEB1A.push("High Salary") }
  else if (salary === "1") { eb1a += 0.5; weakEB1A.push("High Salary") }
  else weakEB1A.push("High Salary")

  // NIW
  let niw = 0
  const impact = (answers.niw_impact as string[]) || []
  const realImpact = impact.filter(i => i !== "6")
  if (realImpact.length >= 3) niw += 3
  else if (realImpact.length === 2) niw += 2
  else if (realImpact.length === 1) niw += 1

  const pos = answers.niw_positioned as string
  if (pos === "2") niw += 3
  else if (pos === "1") niw += 2
  else niw += 0.5

  const links = answers.niw_links as string
  if (links === "3") niw += 2
  else if (links === "2") niw += 1.5
  else if (links === "1") niw += 1

  const eb1aLevel = eb1a >= 10 ? "strong" : eb1a >= 6 ? "moderate" : "weak"
  const niwLevel = niw >= 6 ? "strong" : niw >= 4 ? "moderate" : "weak"

  return { eb1aLevel, niwLevel, strongEB1A, weakEB1A, eb1aScore: eb1a, niwScore: niw }
}

function getRecommendation(eb1aLevel: string, niwLevel: string, lang: Lang): string {
  const recs: Record<Lang, Record<string, string>> = {
    en: {
      both_strong: "Both EB1A and NIW are viable for you. EB1A carries higher prestige but requires extraordinary evidence. Consider filing both simultaneously to maximize approval chances.",
      eb1a_strong: "EB1A is your primary pathway. Your profile demonstrates strong extraordinary ability evidence across multiple criteria.",
      niw_strong: "EB2-NIW is your strongest pathway. Your work has clear national importance and you are well-positioned to execute it in the US.",
      both_moderate: "Both paths are possible but need strengthening. NIW is more accessible with your current profile — focus on demonstrating national importance.",
      eb1a_moderate: "EB1A is possible but needs development. Focus on building 3 strong criteria before filing. Consider NIW as a parallel option.",
      niw_moderate: "NIW is your best current option but needs strengthening. Document your national impact more concretely.",
      weak: "Your current profile needs significant development before filing either petition. Focus on building evidence over the next 12–24 months.",
    },
    ru: {
      both_strong: "И EB1A, и NIW реально достижимы для вас. EB1A престижнее, но требует исключительных доказательств. Рассмотрите подачу обоих одновременно.",
      eb1a_strong: "EB1A — ваш основной путь. Профиль демонстрирует сильные доказательства по нескольким критериям.",
      niw_strong: "EB2-NIW — ваш сильнейший путь. Ваша работа имеет чёткое национальное значение и вы хорошо позиционированы.",
      both_moderate: "Оба пути возможны, но требуют усиления. NIW более доступен с текущим профилем.",
      eb1a_moderate: "EB1A возможен, но требует развития. Нужно усилить минимум 3 критерия перед подачей.",
      niw_moderate: "NIW — ваш лучший текущий вариант, но требует усиления доказательной базы.",
      weak: "Профиль требует существенного развития перед подачей. Сосредоточьтесь на построении доказательств в ближайшие 12–24 месяца.",
    },
    zh: {
      both_strong: "EB1A和NIW对您都是可行的。EB1A更具声望但需要非凡的证据。考虑同时申请两者以最大化批准机会。",
      eb1a_strong: "EB1A是您的主要途径。您的档案在多个标准上显示出强大的杰出能力证据。",
      niw_strong: "EB2-NIW是您最强的途径。您的工作具有明确的国家重要性，并且您在美国执行工作方面处于有利位置。",
      both_moderate: "两条路径都可能，但需要加强。NIW在您目前的档案下更容易获得。",
      eb1a_moderate: "EB1A是可能的，但需要发展。在申请前专注于建立3个强大的标准。",
      niw_moderate: "NIW是您目前最好的选择，但需要更具体地记录国家影响。",
      weak: "您目前的档案在申请任何一种申请之前需要大量发展。",
    },
    hi: {
      both_strong: "EB1A और NIW दोनों आपके लिए व्यवहार्य हैं। अनुमोदन की संभावनाओं को अधिकतम करने के लिए दोनों को एक साथ दाखिल करने पर विचार करें।",
      eb1a_strong: "EB1A आपका प्राथमिक मार्ग है। आपकी प्रोफ़ाइल कई मानदंडों में मजबूत असाधारण क्षमता साक्ष्य दर्शाती है।",
      niw_strong: "EB2-NIW आपका सबसे मजबूत मार्ग है। आपके काम का स्पष्ट राष्ट्रीय महत्व है।",
      both_moderate: "दोनों रास्ते संभव हैं लेकिन मजबूत बनाने की आवश्यकता है। NIW आपकी वर्तमान प्रोफ़ाइल के साथ अधिक सुलभ है।",
      eb1a_moderate: "EB1A संभव है लेकिन विकास की आवश्यकता है।",
      niw_moderate: "NIW आपका सबसे अच्छा विकल्प है लेकिन मजबूत करने की आवश्यकता है।",
      weak: "आवेदन करने से पहले आपकी प्रोफ़ाइल को महत्वपूर्ण विकास की आवश्यकता है।",
    },
    es: {
      both_strong: "Tanto EB1A como NIW son viables para usted. Considere presentar ambas simultáneamente para maximizar las posibilidades de aprobación.",
      eb1a_strong: "EB1A es su camino principal. Su perfil demuestra evidencia sólida de habilidad extraordinaria en múltiples criterios.",
      niw_strong: "EB2-NIW es su camino más sólido. Su trabajo tiene una clara importancia nacional.",
      both_moderate: "Ambos caminos son posibles pero necesitan fortalecimiento. NIW es más accesible con su perfil actual.",
      eb1a_moderate: "EB1A es posible pero necesita desarrollo. Enfóquese en construir 3 criterios sólidos antes de presentar.",
      niw_moderate: "NIW es su mejor opción actual pero necesita fortalecer la documentación.",
      weak: "Su perfil actual necesita un desarrollo significativo antes de presentar cualquier petición.",
    },
    pt: {
      both_strong: "Tanto EB1A quanto NIW são viáveis para você. Considere apresentar ambas simultaneamente para maximizar as chances de aprovação.",
      eb1a_strong: "EB1A é o seu caminho principal. Seu perfil demonstra forte evidência de habilidade extraordinária em múltiplos critérios.",
      niw_strong: "EB2-NIW é o seu caminho mais forte. Seu trabalho tem clara importância nacional.",
      both_moderate: "Ambos os caminhos são possíveis, mas precisam de fortalecimento. NIW é mais acessível com seu perfil atual.",
      eb1a_moderate: "EB1A é possível, mas precisa de desenvolvimento. Concentre-se em construir 3 critérios sólidos antes de apresentar.",
      niw_moderate: "NIW é sua melhor opção atual, mas precisa fortalecer a documentação.",
      weak: "Seu perfil atual precisa de desenvolvimento significativo antes de apresentar qualquer petição.",
    },
  }

  const key =
    eb1aLevel === "strong" && niwLevel === "strong" ? "both_strong" :
    eb1aLevel === "strong" ? "eb1a_strong" :
    niwLevel === "strong" ? "niw_strong" :
    eb1aLevel === "moderate" && niwLevel === "moderate" ? "both_moderate" :
    eb1aLevel === "moderate" ? "eb1a_moderate" :
    niwLevel === "moderate" ? "niw_moderate" : "weak"

  return recs[lang][key]
}

// ─── LEVEL BADGE ───────────────────────────────────────────────────────────────
function LevelBadge({ level, t }: { level: string; t: any }) {
  const styles: Record<string, string> = {
    strong: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    moderate: "bg-amber-100 text-amber-800 border border-amber-200",
    weak: "bg-red-100 text-red-700 border border-red-200",
  }
  const labels: Record<string, string> = {
    strong: t.strong,
    moderate: t.moderate,
    weak: t.weak,
  }
  return (
    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${styles[level]}`}>
      {labels[level]}
    </span>
  )
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [lang, setLang] = useState<Lang>("en")
  const [step, setStep] = useState<"intro" | "block1" | "block2" | "block3" | "loading" | "result">("intro")
  const [answers, setAnswers] = useState<Answers>({})

  const t = T[lang]

  const set = (key: string, val: string) => setAnswers(p => ({ ...p, [key]: val }))

  const toggleMulti = (key: string, idx: string) => {
    const current = (answers[key] as string[]) || []
    const updated = current.includes(idx)
      ? current.filter(v => v !== idx)
      : [...current, idx]
    setAnswers(p => ({ ...p, [key]: updated }))
  }

  const isMulti = (key: string, idx: string) =>
    ((answers[key] as string[]) || []).includes(idx)

  const blockKeys: Record<string, string[]> = {
    block1: BLOCK1_KEYS,
    block2: BLOCK2_KEYS,
    block3: BLOCK3_KEYS,
  }

  const currentBlockComplete = (block: string) => {
    return blockKeys[block]?.every(key => {
      const q = t.q[key]
      if (q?.multi) return ((answers[key] as string[]) || []).length > 0
      return !!answers[key]
    })
  }

  const handleNext = (current: string) => {
    const flow: Record<string, string> = {
      intro: "block1",
      block1: "block2",
      block2: "block3",
      block3: "loading",
    }
    const next = flow[current]
    if (next === "loading") {
      setStep("loading")
      setTimeout(() => setStep("result"), 2000)
    } else {
      setStep(next as any)
    }
  }

  const blockNum: Record<string, number> = { block1: 1, block2: 2, block3: 3 }

  const LANGS: Lang[] = ["en", "ru", "zh", "hi", "es", "pt"]
  const LANG_LABELS: Record<Lang, string> = { en: "EN", ru: "RU", zh: "中文", hi: "हिं", es: "ES", pt: "PT" }

  // ── RENDER QUESTION ──
  const renderQuestion = (key: string) => {
    const q = t.q[key]
    if (!q) return null

    if (q.multi) {
      return (
        <div key={key} className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">{q.label}</p>
          <div className="flex flex-wrap gap-2">
            {q.opts.map((opt: string, i: number) => {
              const idx = String(i)
              const selected = isMulti(key, idx)
              return (
                <button
                  key={i}
                  onClick={() => toggleMulti(key, idx)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div key={key} className="mb-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">{q.label}</p>
        <div className="grid gap-2">
          {q.opts.map((opt: string, i: number) => {
            const idx = String(i)
            const selected = answers[key] === idx
            return (
              <button
                key={i}
                onClick={() => set(key, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── RESULT ──
  const renderResult = () => {
    const { eb1aLevel, niwLevel, strongEB1A, weakEB1A } = computeScore(answers)
    const rec = getRecommendation(eb1aLevel, niwLevel, lang)

    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t.result_title}</h1>

        {/* Scores */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">EB1A</p>
              <p className="font-semibold text-slate-800 text-sm">{t.eb1a}</p>
            </div>
            <LevelBadge level={eb1aLevel} t={t} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">NIW</p>
              <p className="font-semibold text-slate-800 text-sm">{t.niw}</p>
            </div>
            <LevelBadge level={niwLevel} t={t} />
          </div>
        </div>

        {/* Criteria breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">{t.strong_criteria}</p>
            <div className="flex flex-wrap gap-2">
              {strongEB1A.length > 0
                ? strongEB1A.map(c => (
                    <span key={c} className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">{c}</span>
                  ))
                : <span className="text-slate-400 text-xs">—</span>}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">{t.weak_criteria}</p>
            <div className="flex flex-wrap gap-2">
              {weakEB1A.slice(0, 4).map(c => (
                <span key={c} className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">{t.recommendation}</p>
          <p className="text-slate-700 text-sm leading-relaxed">{rec}</p>
        </div>

        {/* CTAs */}
        <div className="grid gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-md">
            {t.cta_build}
          </button>
          <button className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-6 rounded-xl border border-slate-200 transition-colors">
            {t.cta_expert}
          </button>
          <button
            onClick={() => { setStep("intro"); setAnswers({}) }}
            className="w-full text-slate-500 text-sm py-2 hover:text-slate-700 transition-colors"
          >
            {t.cta_retake}
          </button>
        </div>
      </div>
    )
  }

  // ── LAYOUT WRAPPER ──
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800 text-sm">CaseBuilder</span>
        </div>
        {/* Language switcher */}
        <div className="flex gap-1">
          {LANGS.map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                lang === l ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* INTRO */}
      {step === "intro" && (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t.title}</h1>
          <p className="text-slate-600 mb-3">{t.subtitle}</p>
          <p className="text-slate-400 text-sm mb-10">{t.anonymous}</p>
          <button
            onClick={() => setStep("block1")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-xl transition-colors shadow-lg text-lg"
          >
            {t.start}
          </button>
        </div>
      )}

      {/* BLOCKS */}
      {(step === "block1" || step === "block2" || step === "block3") && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {["block1", "block2", "block3"].map((b, i) => (
              <div key={b} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === b ? "bg-blue-600 text-white" :
                  ["block1","block2","block3"].indexOf(step) > i ? "bg-emerald-500 text-white" :
                  "bg-slate-200 text-slate-500"
                }`}>{i + 1}</div>
                {i < 2 && <div className={`flex-1 h-0.5 w-8 ${["block1","block2","block3"].indexOf(step) > i ? "bg-emerald-400" : "bg-slate-200"}`} />}
              </div>
            ))}
            <p className="ml-auto text-xs text-slate-400">{t.step(blockNum[step], 3)}</p>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {t[`${step}_title` as keyof typeof t]}
          </h2>

          {blockKeys[step].map(key => renderQuestion(key))}

          <div className="flex gap-3 mt-8">
            {step !== "block1" && (
              <button
                onClick={() => {
                  const prev: Record<string, string> = { block2: "block1", block3: "block2" }
                  setStep(prev[step] as any)
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                {t.back}
              </button>
            )}
            <button
              onClick={() => handleNext(step)}
              disabled={!currentBlockComplete(step)}
              className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {step === "block3" ? t.analyze : t.next}
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}
      {step === "loading" && (
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
          <p className="text-slate-600 font-medium">{t.analyzing}</p>
        </div>
      )}

      {/* RESULT */}
      {step === "result" && renderResult()}
    </div>
  )
}
