// ===== 猫村OECM - 游戏数据 =====

// 六维状态定义
const STAT_DEFS = {
    CW: { name: '猫群福利', fullName: 'Cat Welfare', lowDesc: '猫群超载、疾病风险', highDesc: '绝育、医疗、领养完善' },
    ES: { name: '生态安全', fullName: 'Ecological Safety', lowDesc: '猫外溢、捕食风险', highDesc: '防逃逸、无猫斑块' },
    CT: { name: '社区信任', fullName: 'Community Trust', lowDesc: '村民旁观、反感', highDesc: '共管、巡护、收益返还' },
    FS: { name: '资金稳定', fullName: 'Financial Stability', lowDesc: '依赖打赏、压力大', highDesc: '多元资金、透明基金' },
    PH: { name: '公众热度', fullName: 'Public Heat', lowDesc: '无人关注', highDesc: '传播强、志愿者多' },
    OE: { name: 'OECM证据', fullName: 'OECM Evidence', lowDesc: '只有故事无证据', highDesc: '边界、治理、监测、报告' }
};

// 五模块定义
const MODULE_DEFS = {
    M1: { name: '猫群风险控制', max: 20 },
    M2: { name: '本土生物多样性恢复', max: 20 },
    M3: { name: '社区共管网络', max: 20 },
    M4: { name: '公益研学与公众参与', max: 20 },
    M5: { name: 'ESG与透明治理', max: 20 }
};

// 行动卡数据
const ACTION_CARDS = [
    { id: 1,  name: 'TNR绝育计划', module: 'M1', type: 'basic', subtype: '控猫', 
      effects: { CW: 4, ES: 3, CT: 0, FS: -2, PH: 0, OE: 2 }, tags: ['控猫','动物福利','证据基础'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 2,  name: '防逃逸设施', module: 'M1', type: 'basic', subtype: '控猫',
      effects: { CW: 3, ES: 5, CT: 0, FS: -3, PH: 0, OE: 3 }, tags: ['控猫','生态风险控制'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 3,  name: '医疗检疫', module: 'M1', type: 'basic', subtype: '控猫',
      effects: { CW: 5, ES: 2, CT: 0, FS: -2, PH: 0, OE: 1 }, tags: ['动物福利','公共卫生'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 4,  name: '粪污无害化处理', module: 'M1', type: 'basic', subtype: '控猫',
      effects: { CW: 2, ES: 4, CT: 1, FS: -2, PH: 0, OE: 2 }, tags: ['控猫','环境治理'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 5,  name: '禁止游客投喂', module: 'M1', type: 'basic', subtype: '控猫',
      effects: { CW: 1, ES: 3, CT: -1, FS: 0, PH: -2, OE: 1 }, tags: ['控猫','游客约束'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 6,  name: '控制新增流浪猫接收', module: 'M1', type: 'unlock', subtype: '控猫',
      effects: { CW: -2, ES: 5, CT: 0, FS: 2, PH: -2, OE: 2 }, tags: ['控猫','规模控制'],
      visibleWeeks: [2,3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["TNR绝育计划","防逃逸设施"]) || ES<50 || CW>=70' },
    { id: 7,  name: '鸟类调查', module: 'M2', type: 'basic', subtype: '生态监测',
      effects: { CW: 0, ES: 4, CT: 0, FS: 0, PH: 1, OE: 4 }, tags: ['生态证据','鸟类'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 8,  name: '红外相机监测', module: 'M2', type: 'unlock', subtype: '生态监测',
      effects: { CW: 0, ES: 5, CT: 0, FS: -1, PH: 1, OE: 4 }, tags: ['生态证据','红外'],
      visibleWeeks: [3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["鸟类调查"]) || checkModule("M2")>=1 || ES<55' },
    { id: 9,  name: '无猫生态恢复斑块', module: 'M2', type: 'unlock', subtype: '生态修复',
      effects: { CW: 0, ES: 6, CT: 1, FS: -2, PH: 1, OE: 4 }, tags: ['生态修复','空间管控'],
      visibleWeeks: [5,6,7,8,9,10,11,12],
      unlockLogic: 'checkModule("M2")>=2 && checkModule("M1")>=2 && CT>=40' },
    { id: 10, name: '本土灌木恢复', module: 'M2', type: 'unlock', subtype: '生态修复',
      effects: { CW: 0, ES: 4, CT: 1, FS: -1, PH: 1, OE: 3 }, tags: ['生态修复','栖息地'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["鸟类调查","红外相机监测"]) || isUnlocked("无猫生态恢复斑块") || ES<60' },
    { id: 11, name: '小型兽类/两爬监测', module: 'M2', type: 'unlock', subtype: '生态监测',
      effects: { CW: 0, ES: 4, CT: 0, FS: 0, PH: 0, OE: 3 }, tags: ['生态证据','本土物种'],
      visibleWeeks: [3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["鸟类调查"]) || hasDone(["红外相机监测"])' },
    { id: 12, name: '监测—响应机制', module: 'M2', type: 'unlock', subtype: '生态治理',
      effects: { CW: 0, ES: 5, CT: 1, FS: -1, PH: 1, OE: 4 }, tags: ['生态证据','响应闭环'],
      visibleWeeks: [6,7,8,9,10,11,12],
      unlockLogic: 'checkModule("M2")>=3 && OE>=55' },
    { id: 13, name: '村民共识会', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 1, CT: 4, FS: 0, PH: 0, OE: 2 }, tags: ['社区协商','共管'],
      visibleWeeks: [2,3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'CT<55' },
    { id: 14, name: '村民巡护岗位', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 3, CT: 4, FS: -1, PH: 1, OE: 3 }, tags: ['社区巡护','共管'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["村民共识会","村规民约"]) && CT>=45' },
    { id: 15, name: '生态契约农田', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 4, CT: 4, FS: -1, PH: 1, OE: 4 }, tags: ['社区外扩','生态契约'],
      visibleWeeks: [5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["村民共识会"]) && CT>=50 && checkModule("M2")>=1' },
    { id: 16, name: '收益返还机制', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 1, CT: 4, FS: -1, PH: 1, OE: 2 }, tags: ['社区收益','信任'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["预约制研学"]) || CT<60' },
    { id: 17, name: '共管委员会', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 2, CT: 4, FS: 0, PH: 0, OE: 4 }, tags: ['制度共管','治理证据'],
      visibleWeeks: [6,7,8,9,10,11,12],
      unlockLogic: 'checkModule("M3")>=2 && CT>=55 && OE>=50' },
    { id: 18, name: '村规民约', module: 'M3', type: 'unlock', subtype: '社区共管',
      effects: { CW: 0, ES: 3, CT: 4, FS: 0, PH: 0, OE: 3 }, tags: ['规则约束','社区治理'],
      visibleWeeks: [3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'CT<60 && PH>=55' },
    { id: 19, name: '预约制研学', module: 'M4', type: 'basic', subtype: '公众参与',
      effects: { CW: 1, ES: 2, CT: 2, FS: 5, PH: 3, OE: 2 }, tags: ['可控传播','资金'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 20, name: 'OECM科普展陈', module: 'M4', type: 'basic', subtype: '公众参与',
      effects: { CW: 0, ES: 1, CT: 1, FS: -1, PH: 4, OE: 1 }, tags: ['科普传播','治理证据'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 21, name: '志愿者培训', module: 'M4', type: 'basic', subtype: '公众参与',
      effects: { CW: 2, ES: 2, CT: 2, FS: 0, PH: 3, OE: 2 }, tags: ['公众参与','能力建设'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { id: 22, name: '公民科学监测', module: 'M4', type: 'unlock', subtype: '公众参与',
      effects: { CW: 0, ES: 3, CT: 2, FS: 0, PH: 3, OE: 4 }, tags: ['公众参与','生态证据'],
      visibleWeeks: [3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["志愿者培训"]) && checkModule("M2")>=1 && PH>=45' },
    { id: 23, name: '游客动线分区', module: 'M4', type: 'unlock', subtype: '公众管控',
      effects: { CW: 1, ES: 4, CT: 1, FS: -1, PH: -2, OE: 3 }, tags: ['游客约束','风险下降'],
      visibleWeeks: [3,4,5,6,7,8,9,10,11,12],
      unlockLogic: 'PH>=60' },
    { id: 24, name: '开放自由吸猫打卡', module: 'M4', type: 'temptation', subtype: '诱惑卡',
      effects: { CW: 1, ES: -8, CT: -5, FS: 7, PH: 11, OE: -9 }, tags: ['诱惑','网红化','风险'],
      visibleWeeks: [5,6,7,8,9,10,11,12],
      unlockLogic: 'FS<35 || PH<45' },
    { id: 25, name: 'ESG资金投向防逃逸', module: 'M5', type: 'unlock', subtype: '资金治理',
      effects: { CW: 2, ES: 5, CT: 0, FS: 6, PH: 1, OE: 4 }, tags: ['真实投入','控猫'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["防逃逸设施"]) || checkModule("M1")>=2 && OE>=45' },
    { id: 26, name: 'ESG资金投向生态监测', module: 'M5', type: 'unlock', subtype: '资金治理',
      effects: { CW: 0, ES: 5, CT: 1, FS: 6, PH: 1, OE: 4 }, tags: ['真实投入','生态证据'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'checkModule("M2")>=1 && OE>=45' },
    { id: 27, name: 'ESG资金投向宣传片', module: 'M5', type: 'temptation', subtype: '诱惑卡',
      effects: { CW: 0, ES: -4, CT: -3, FS: 6, PH: 9, OE: -9 }, tags: ['诱惑','漂绿','风险'],
      visibleWeeks: [4,5,6,7,8,9,10,11,12],
      unlockLogic: 'FS<40 || PH<50' },
    { id: 28, name: '第三方审计', module: 'M5', type: 'unlock', subtype: '透明治理',
      effects: { CW: 0, ES: 1, CT: 3, FS: 0, PH: 1, OE: 4 }, tags: ['透明治理','审计'],
      visibleWeeks: [5,6,7,8,9,10,11,12],
      unlockLogic: 'hasDone(["透明财务公示"]) && OE>=45' },
    { id: 29, name: '数据公开平台', module: 'M5', type: 'unlock', subtype: '透明治理',
      effects: { CW: 0, ES: 2, CT: 3, FS: 0, PH: 2, OE: 4 }, tags: ['透明治理','公开'],
      visibleWeeks: [6,7,8,9,10,11,12],
      unlockLogic: 'OE>=55 && multiDone(["第三方审计","鸟类调查","红外相机监测","公民科学监测"], 2)' },
    { id: 30, name: '生态补偿基金', module: 'M5', type: 'unlock', subtype: '资金治理',
      effects: { CW: 0, ES: 3, CT: 5, FS: -2, PH: 1, OE: 4 }, tags: ['社区补偿','外扩治理'],
      visibleWeeks: [6,7,8,9,10,11,12],
      unlockLogic: 'CT>=50 && FS>=35 && hasDone(["村民共识会","收益返还机制"])' },
    { id: 31, name: '透明财务公示', module: 'M5', type: 'basic', subtype: '透明治理',
      effects: { CW: 0, ES: 0, CT: 4, FS: 2, PH: 2, OE: 2 }, tags: ['透明治理','信任'],
      visibleWeeks: [1,2,3,4,5,6,7,8,9,10,11,12] }
];

// 行动卡科普介绍（悬浮显示）
const CARD_INTROS = {
    'TNR绝育计划': 'TNR是"捕捉—绝育—放归"的流浪猫管理方式。它不以清除猫为目标，而是通过控制繁殖，逐步稳定猫群数量，减少疾病、争斗和幼猫激增带来的压力，是兼顾动物福利与生态风险的基础措施。',
    '防逃逸设施': '防逃逸设施不是把猫完全关起来，而是在猫活动区设置围栏、缓冲门、封闭边界等，让猫更难进入鸟类栖息地、农田或保护区边缘。它能减少捕食、扰动和走失风险，是"猫村"走向可控管理的重要基础。',
    '医疗检疫': '医疗检疫用于检查猫群健康状况，包括疫苗、传染病、寄生虫和伤病处理。健康管理不仅能减少猫之间的传播风险，也能降低人与猫接触时的公共卫生隐患，让猫村从"自发收养"变成更负责任的照护系统。',
    '粪污无害化处理': '猫粪如果随意堆积，可能带来气味、病原和水体污染问题。粪污无害化处理通过集中收集、消毒、堆肥或规范清运，减少对村庄环境和周边生态的影响，让"爱猫"不变成新的环境负担。',
    '禁止游客投喂': '游客随意投喂会让猫群聚集、争抢，也可能吸引更多流浪猫进入村庄。禁止投喂不是不友好，而是把食物管理交回专业人员和村内规则，避免猫群失控，也减少游客与猫、鸟类栖息地之间的冲突。',
    '控制新增流浪猫接收': '如果不断接收新的流浪猫，绝育和管理效果会被迅速抵消。控制新增接收并不是放弃救助，而是先明确猫村承载量、检疫条件和转介机制，避免猫村从保护示范变成无边界的流浪猫聚集点。',
    '鸟类调查': '鸟类调查是了解周边生态状况的第一步。通过记录鸟类种类、数量、活动时间和栖息位置，玩家能判断猫村是否影响到本土鸟类，也能为后续分区、控猫和修复行动提供依据。',
    '红外相机监测': '红外相机能在无人干扰的情况下记录夜间或隐蔽动物活动。它可以帮助发现本土小兽、鸟类、猫的活动路径和冲突区域，让生态判断不只依赖人的观察，而是有更连续、更客观的现场证据。',
    '无猫生态恢复斑块': '无猫生态恢复斑块是在关键区域划出猫不能进入的小型生态空间，让鸟类、小兽、两栖爬行动物和本土植物有相对安全的恢复环境。它不是否定猫村，而是在村庄内部建立"猫与野生动物各有边界"的空间规则。',
    '本土灌木恢复': '本土灌木能为鸟类、小型动物和昆虫提供隐蔽、筑巢和取食空间。恢复灌木不是简单"种绿化"，而是用适合当地环境的植物修补栖息地，让猫村周边重新具备支持本土生命的基础条件。',
    '小型兽类/两爬监测': '除了鸟类，小型兽类、两栖和爬行动物也能反映生态环境是否健康。监测这些物种，可以帮助玩家看到更完整的生态关系，避免只凭"有没有猫、有没有鸟"来判断村庄治理是否有效。',
    '监测—响应机制': '监测本身不是终点，关键是发现问题后能及时调整。监测—响应机制会把调查结果转化为行动，例如调整猫活动范围、加强游客管理或修复栖息地，让生态治理从"记录数据"变成持续改进。',
    '村民共识会': '村民共识会让不同利益相关者坐下来讨论猫村未来：谁受益、谁承担成本、哪些区域要保护、哪些行为要限制。它能减少误解和抵触，让治理不只是外部专家或玩家的决定，而是村庄共同参与的过程。',
    '村民巡护岗位': '村民巡护岗位把日常管理交给熟悉地方的人。村民可以观察猫群、游客、鸟类和环境变化，及时发现投喂、扰动或设施损坏等问题。它既提供社区参与机会，也让保护工作更接近日常生活。',
    '生态契约农田': '生态契约农田通过协商，让周边农田在生产之外承担一定生态功能，比如减少干扰、保留边界植被、配合监测或保护鸟类活动空间。它把保护从猫村内部延伸到村庄周边，形成更完整的生态网络。',
    '收益返还机制': '如果猫村带来研学、文创或游客收入，收益如何分配会直接影响村民态度。收益返还机制通过公开规则，把部分收入用于村民、巡护、生态修复或公共服务，避免保护变成少数人获利、多数人承担成本。',
    '共管委员会': '共管委员会把村民、管理者、专家、企业和公益组织纳入同一个协商平台。它的作用不是开会走形式，而是让猫群管理、生态监测、资金使用和游客规则都有稳定的讨论与决策渠道。',
    '村规民约': '村规民约把"大家默认知道"的规则写清楚，比如禁止投喂、限制进入敏感区域、猫只管理、游客行为和环境维护。它用村庄内部能理解、能执行的方式，把保护要求转化为日常生活规则。',
    '预约制研学': '预约制研学通过控制人数、时间和路线，让公众了解猫村、OECM和生态保护，同时避免游客突然涌入造成扰动。它比自由打卡更可控，也能为村庄带来稳定收入，是兼顾传播和管理的方式。',
    'OECM科普展陈': 'OECM科普展陈用于解释猫村为什么不只是"网红猫点"，而是一个需要兼顾动物福利、社区生活和生态保护的治理空间。它能帮助游客理解规则背后的原因，减少误解和随意行为。',
    '志愿者培训': '志愿者培训让公众参与不只是"来帮忙"，而是先学习基本规则、记录方法和安全边界。经过培训的志愿者可以协助监测、科普和秩序维护，减少好心办坏事的风险。',
    '公民科学监测': '公民科学监测让普通公众在培训后参与鸟类、猫群、游客行为或环境变化记录。它能扩大观察范围，也能增强公众对保护的理解。但数据需要规范方法和专业校验，不能只靠热情。',
    '游客动线分区': '游客动线分区通过设置参观路线、停留点和禁止进入区，减少游客对猫群和野生动物的干扰。它不是降低体验，而是让"看猫、学习、保护"各有空间，避免人流把猫村推向失控打卡。',
    '开放自由吸猫打卡': '自由吸猫打卡能快速带来人气和收入，但也容易造成投喂、追逐、噪音和猫群聚集。如果没有分区、限流和生态监测，它会让猫村从保护示范滑向流量消费，是一张高收益但高风险的诱惑卡。',
    'ESG资金投向防逃逸': 'ESG资金如果投向防逃逸设施，能把企业支持转化为真实的猫群管理能力。相比只做宣传，修建边界、缓冲门和安全设施更能减少生态风险，也更容易证明资金确实用于解决问题。',
    'ESG资金投向生态监测': '将ESG资金用于生态监测，可以支持鸟类调查、红外相机、数据整理和专业评估。这样的投入能帮助猫村建立真实证据，判断保护是否有效，而不是只用好看的故事证明项目成功。',
    'ESG资金投向宣传片': '宣传片能提升关注度，也可能带来资金和游客。但如果没有生态监测、透明治理和实际投入，宣传会变成"先包装、后治理"，容易引发漂绿质疑。它适合辅助传播，不适合作为核心保护行动。',
    '第三方审计': '第三方审计由相对独立的机构检查资金、项目执行和结果，帮助判断承诺是否真正落地。它能增强外界信任，减少"企业只是做形象工程"的质疑，但审计不能替代生态监测本身。',
    '数据公开平台': '数据公开平台把猫群管理、监测结果、资金使用和行动进展持续展示出来。公开不是为了堆数据，而是让村民、游客、企业和管理方都能看到治理过程，形成可被监督、可被改进的保护机制。',
    '生态补偿基金': '生态补偿基金用于补偿因保护而承担成本的人或区域，例如限制开发、配合巡护、保留生态空间的村民。它能让保护不只是口号，而是把生态责任和实际利益重新分配，减少社区阻力。',
    '透明财务公示': '透明财务公示把收入、支出、捐赠和企业资金用途公开说明。它能提升村民和公众信任，减少利益分配争议。透明财务不能直接改善生态，但能为长期共管和外部合作打下基础。'
};

// 主线事件数据
const MAIN_EVENTS = [
    { week: 1,  name: '猫村爆火，收到第一波捐赠',
      effects: { CW: 2, ES: 0, CT: 0, FS: -3, PH: -2, OE: 0 },
      desc: '一条"太行山深处的猫村"视频突然爆火。几天内，猫粮、药品和第一笔线上捐赠涌入猫村，志愿者报名人数也明显增加。村里人第一次觉得，这些被遗弃的猫真的让村子重新被看见了。但与此同时，游客私自前往、随意投喂和拍照打卡的情况也开始出现。',        img: 'event_week1' },
    { week: 2,  name: '基础调查，记录猫群分布与空间使用',
      effects: { CW: 0, ES: 2, CT: 0, FS: -3, PH: 3, OE: 0 },
      desc: '项目组开始对猫村进行第一次基础调查。你和志愿者拿着记录表，在村道、猫舍、废弃院落和林地边缘逐一标记猫群出现的位置、活动时间和停留行为。大家原本以为猫主要集中在猫舍附近，但调查发现，有些猫会沿着村路活动，甚至靠近林地边缘。',        img: 'event_week2' },
    { week: 3,  name: '村民大会吵翻，共管机制迟迟定不下来',
      effects: { CW: 3, ES: 0, CT: 0, FS: -2, PH: 2, OE: 0 },
      desc: '村委组织猫村共管会议。志愿者希望优先保障猫的救助和医疗，经营户希望抓住流量发展民宿和文创，生态顾问则要求控制猫的活动范围。会议越吵越激烈，最后没有形成任何有效决议。猫村第一次发现：没有共管机制，所有好意都会变成互相指责。',        img: 'event_week3' },
    { week: 4,  name: '社区沟通，讨论猫村规则与边界',
      effects: { CW: 0, ES: 3, CT: 2, FS: -2, PH: 0, OE: 2 },
      desc: '你组织了一场社区沟通会，希望和村民、志愿者、返乡经营者一起讨论猫村的规则与边界。会上，有人支持限制游客和投喂，也有人担心规则太多会影响收入；有村民提出，猫村不能只管猫，也要管游客停车、卫生和村道秩序。',        img: 'event_week4' },
    { week: 5,  name: '围栏破损，猫进入林地边缘',
      effects: { CW: 2, ES: 0, CT: 0, FS: -3, PH: 4, OE: 0 },
      desc: '暴雨后的旧围栏出现破洞，几只猫跑到林地边缘。志愿者连夜寻找，生态顾问却更担心另一件事：如果猫可以自由进入周边山林，猫村就无法证明自己没有对鸟类、小型兽类等本土动物造成压力。OECM 评审组要求猫村说明猫群边界如何被控制。',        img: 'event_week5' },
    { week: 6,  name: '小学低扰动研学合作',
      effects: { CW: 0, ES: 2, CT: 3, FS: -2, PH: 0, OE: 3 },
      desc: '一所小学来到猫村开展低扰动研学。学生没有随意投喂，而是学习猫群救助、本土动物识别和"为什么不能让猫进山"。活动结束后，学校提出希望建立长期合作。猫村第一次证明：传播不一定等于网红打卡，也可以变成真正的生态教育。',        img: 'event_week6' },
    { week: 7,  name: '红外相机拍到豹猫，本土生态价值浮现',
      effects: { CW: 3, ES: 0, CT: 0, FS: -3, PH: 3, OE: 0 },
      desc: '设置在村外林缘的红外相机拍到了豹猫的身影。生态顾问非常激动，因为这说明猫村周边并不是普通荒地，而是存在需要被保护的本土生态价值。但短视频团队也想马上公开视频制造热点。现在的问题是：生态证据应该成为保护依据，还是成为新的流量素材？',        img: 'event_week7' },
    { week: 8,  name: '猫村文创爆单，被质疑"拿保护做营销"',
      effects: { CW: 0, ES: 3, CT: 0, FS: -2, PH: 5, OE: 2 },
      desc: '"猫村限定文创"突然爆单，猫爪糕、猫咪明信片和豹猫元素周边卖得很好，猫粮和医疗经费压力暂时缓解。但很快有人质疑：猫村是不是把生态保护包装成生意？尤其是豹猫元素被用于营销后，生态顾问提醒大家：野生动物证据不能被随意消费。',        img: 'event_week8' },
    { week: 9,  name: '主播闯入限制区直播，网红化风险爆发',
      effects: { CW: 2, ES: 0, CT: 2, FS: -3, PH: 0, OE: 0 },
      desc: '一名主播未经预约进入限制区，用猫粮引猫制造直播效果。直播间人气很高，村口摊位当天收入增加，但猫群争抢、游客聚集，并干扰了正在进行的鸟类监测。环保博主发文质疑："猫村到底是在做保护，还是在制造流量？"',        img: 'event_week9' },
    { week: 10, name: '生态契约农田试点谈成，社区共管出现突破',
      effects: { CW: 0, ES: 4, CT: 0, FS: -2, PH: 4, OE: 3 },
      desc: '经过多轮协商，一户村民同意将村边一块农田作为生态契约农田试点：减少农药使用、保留田埂草带、参与鸟类和昆虫记录。作为交换，猫村承诺用文创收益设立小额补偿，并优先采购生态农产品。村民第一次不是被动配合，而是成为共管的一部分。',        img: 'event_week10' },
    { week: 11, name: '冲刺阶段，深夜加班修订方案',
      effects: { CW: 3, ES: 0, CT: 3, FS: -2, PH: 0, OE: 0 },
      desc: '最终评审前夜，项目组办公室的灯一直亮着。桌上摊着猫群分布图、红外相机记录、生态契约农田协议、资金公开表和游客管理规则。大家一遍遍检查材料：哪些数据可以提交，哪些表述还不够准确，哪些行动还缺少证据支撑。志愿者送来热水时，大家才发现已经是凌晨。',        img: 'event_week11' },
    { week: 12, name: '终局时刻',
      effects: { CW: 0, ES: 3, CT: 0, FS: -2, PH: 5, OE: 2 },
      desc: '清晨，太阳从太行山的山脊后升起。猫村是否能成为潜力 OECM，还要等待评审结果；但至少，它已经不再只是一个被看见的猫村，而是一个正在学习如何与山林、村庄和本土生命共同生活的地方。',        img: 'event_week12' }
];

// 支线剧情数据
const BRANCH_EVENTS = {
    CW: { threshold: 100, dim: 'CW',
        title: '猫村被曝"只救好看的猫"',
        desc: '一条匿名帖在网上发酵：有人质疑猫村在宣传中只展示漂亮、亲人的猫，却很少公开老猫、病猫和残疾猫的真实处境。"猫村是不是只救好看的猫？"争议迅速扩散。',        img: 'branch_cw',
        npc: [
{ name: '陈姨', text: '"我们救了那么多病猫、老猫，怎么能说我们只救好看的猫？"', avatar: 'npc_chenyi', audio: 'assets/audio/branch_CW_chenyi.mp3' },
            { name: '小鹿', text: '"可是我们发出去的内容，确实大多是好看的猫。太沉重的内容没人看，大家更愿意捐给可爱的小猫。"', avatar: 'npc_xiaolu', audio: 'assets/audio/branch_CW_xiaolu.mp3' },
        ],
        options: [
            { label: 'A', text: '公开猫群真实结构，让老猫、病猫和残疾猫也被看见。', effects: { CW: 7, ES: 0, CT: 4, FS: -4, PH: -7, OE: 5 },
              result: '玩家发布"被留下的猫"专题，公开老猫、病猫、残疾猫的救助情况和长期照护成本。短期热度下降，但公众开始理解猫群福利不是"挑好看的救"。' },
            { label: 'B', text: '先调整宣传口径，避免继续扩大争议。', effects: { CW: -5, ES: 0, CT: -4, FS: 0, PH: 4, OE: -4 },
              result: '玩家暂时不公开沉重内容，只发布声明解释猫村没有选择性救助。争议短期被压下，但网友觉得回应空泛。' }
        ]
    },
    ES: { threshold: 125, dim: 'ES',
        title: '老村民要拆掉"无猫恢复斑块"',
        desc: '红外相机拍到的鸟类和小型兽类活动明显增加。可是一天清晨，老村民老赵带着工具来到斑块边，准备拆掉围挡。生态恢复和村民日常使用发生了冲突。',        img: 'branch_es',
        npc: [
{ name: '老赵', text: '"你们说保护生态，我不反对。但不能保护到最后，村里人连自己的路都不能走了吧？"', avatar: 'npc_laozhao', audio: 'assets/audio/branch_ES_laozhao.mp3' },
            { name: '周野', text: '"如果无猫斑块随便进出，猫、人和干扰都会回来，生态恢复就没有意义了。"', avatar: 'npc_zhouye', audio: 'assets/audio/branch_ES_zhouye.mp3' },
        ],
        options: [
            { label: 'A', text: '保留斑块，但调整边界，给村民留出通行和使用路径。', effects: { CW: 0, ES: -5, CT: 11, FS: -2, PH: 2, OE: 5 },
              result: '玩家组织现场协商，微调斑块边界，设置村民通行小路和说明牌。社区接受度明显提高。' },
            { label: 'B', text: '恢复斑块不能拆，先把这里封闭管理。', effects: { CW: 0, ES: 5, CT: -11, FS: -2, PH: -2, OE: 4 },
              result: '玩家坚持保护优先，但老村民觉得猫村"用生态名义占地"，社区信任下降。' }
        ]
    },
    CT: { threshold: 52, dim: 'CT', isLow: true,
        title: '村民的赔偿单',
        desc: '村民老赵拿着一张手写赔偿单来到猫村办公室。他说自家鸡被猫咬伤了，村道也因为游客停车被堵了好几次。小满提醒玩家：如果这件事处理不好，后面的生态契约农田、村民巡护员和社区共管都会谈不下去。',        img: 'branch_ct',
        npc: [
{ name: '老赵', text: '"你们不能一说公益就有理，一说保护就让我们忍着。"', avatar: 'npc_laozhao', audio: 'assets/audio/branch_CT_laozhao.mp3' },
            { name: '小满', text: '"现在村民不是反对猫村，是觉得自己没有被放进猫村的规则里。"', avatar: 'npc_xiaoman', audio: 'assets/audio/branch_CT_xiaoman.mp3' },
        ],
        options: [
            { label: 'A', text: '建立猫扰民补偿和纠纷登记机制，这次先按流程处理。', effects: { CW: 0, ES: 4, CT: 14, FS: -7, PH: 0, OE: 7 },
              result: '玩家设立小额补偿与纠纷登记表，并邀请村民加入共管委员会。村民第一次觉得自己不是被牺牲的一方。' },
            { label: 'B', text: '没有证据证明是猫村的猫，不能随便赔。', effects: { CW: 0, ES: -2, CT: -13, FS: 2, PH: -2, OE: -5 },
              result: '短期避免资金支出，但村民认为猫村推卸责任。后续村民不愿配合巡护和生态农田。' }
        ]
    },
    FS: { threshold: 55, dim: 'FS', isLow: true, altTrigger: '企业资金介入',
        title: '企业想冠名"豹猫守护计划"',
        desc: '一家企业提出赞助猫村半年运营费用，但条件是：把本土生态监测项目命名为"XX 豹猫守护计划"。阿强觉得这是救命钱，周野则担心豹猫从本土生态证据变成商业 IP。',        img: 'branch_fs',
        npc: [
{ name: '企业代表', text: '"我们不是干涉你们做保护，只是希望公众知道，是我们支持了这件事。"', avatar: 'npc_aqiang', audio: 'assets/audio/branch_FS_aqiang.mp3' },
            { name: '周野', text: '"支持可以被看见，但不能让保护对象变成品牌素材。"', avatar: 'npc_zhouye', audio: 'assets/audio/branch_FS_zhouye.mp3' },
        ],
        options: [
            { label: 'A', text: '接受赞助，但改为"生态监测合作伙伴"，不允许冠名豹猫。', effects: { CW: 4, ES: 4, CT: 4, FS: 9, PH: 2, OE: 7 },
              result: '玩家与企业重新谈判，限制品牌露出。资助金额减少，但项目独立性和OECM可信度得到维护。' },
            { label: 'B', text: '接受冠名，先解决猫村的资金危机。', effects: { CW: 5, ES: 0, CT: -4, FS: 18, PH: 9, OE: -11 },
              result: '短期资金大幅改善，但环保博主质疑"消费野生动物""漂绿营销"。' }
        ]
    },
    PH: { threshold: 100, dim: 'PH',
        title: '猫村来了"假志愿者"',
        desc: '有人冒充猫村志愿者，在网上发布"猫村猫粮告急"的募捐链接。几天后，有网友来质问猫村：自己给"猫村"捐了钱，为什么官方说没有收到？',        img: 'branch_ph',
        npc: [
{ name: '小鹿', text: '"这不是普通蹭热度了，他在用猫村的名义骗钱。"', avatar: 'npc_xiaolu', audio: 'assets/audio/branch_PH_xiaolu.mp3' },
            { name: '陈姨', text: '"志愿者不能只靠一腔热情，猫村也不能谁来了都让进。"', avatar: 'npc_chenyi', audio: 'assets/audio/branch_PH_chenyi.mp3' },
        ],
        options: [
            { label: 'A', text: '建立志愿者认证制度和官方捐赠渠道，暂停临时报名。', effects: { CW: 5, ES: 4, CT: 5, FS: -2, PH: -11, OE: 9 },
              result: '玩家公开假志愿者事件，建立志愿者培训、认证和排班制度。短期热度下降，但管理秩序明显改善。' },
            { label: 'B', text: '先不要把事情闹大，私下联系对方删除内容。', effects: { CW: -4, ES: 0, CT: -5, FS: -7, PH: 4, OE: -5 },
              result: '假链接暂时删除，但公众不知道官方渠道，类似事件可能继续出现。' }
        ]
    },
    OE: { threshold: 42, dim: 'OE', isLow: true, altThreshold: 120, altTrigger: '审查前',
        title: '猫村内部出现"真假数据"争议',
        desc: '最终评审前，猫村正在整理OECM证据材料。小满发现一份鸟类监测表里，有几次记录时间对不上；红外相机数据里，也有一张照片被重复用于两次汇报。',        img: 'branch_oe',
        npc: [
{ name: '小满', text: '"如果现在承认数据有问题，评审会不会直接不通过？"', avatar: 'npc_xiaoman', audio: 'assets/audio/branch_OE_xiaoman.mp3' },
            { name: '周野', text: '"如果不承认，等别人查出来，就不是数据错误，是诚信问题。"', avatar: 'npc_zhouye', audio: 'assets/audio/branch_OE_zhouye.mp3' },
        ],
        options: [
            { label: 'A', text: '主动标注可疑数据，补充原始记录，宁可少报也不虚报。', effects: { CW: 0, ES: 2, CT: 4, FS: -2, PH: -4, OE: 13 },
              result: '玩家重新核验所有证据，把无法确认的数据标注为无效。证据数量减少，但可信度提升，评审组认可猫村的透明态度。' },
            { label: 'B', text: '先按完整版本提交，等评审问到再解释。', effects: { CW: 0, ES: 0, CT: -5, FS: 0, PH: 2, OE: -14 },
              result: '内部志愿者开始不安，一旦被外部质疑，猫村会陷入数据造假的危机。' }
        ]
    }
};

// 结局判定数据
const ENDING_DEFS = [
    { id: 'T5', name: '网红化失控型', priority: 1, priorityLabel: '最高优先',
      checkEarly: 7,
      condition: function(s) {
        if (s.week >= 7 && s.stats.PH >= 110 && s.modules.M2 <= 3 && s.temptationCount >= 2 && s.heatGovernance < 3) return true;
        if (s.week >= 12 && s.stats.PH >= 130 && s.temptationCount >= 1 && s.heatGovernance < 3) return true;
        return false;
      },
      desc: '猫村沦为网红打卡地，流量和争议并存，但未能完成向OECM保护地的转型。热度治理不足，诱惑卡选择了短期流量而非长期保护。' },
    { id: 'T0', name: '动物福利延续型', priority: 2,
      checkEarly: 8,
      condition: function(s) {
        return s.stats.CW >= 75 && s.modules.M2 <= 3 && s.modules.M3 <= 2 && s.stats.PH < 110 && (s.stats.OE < 80 || s.stats.ES < 90) && s.temptationCount <= 1;
      },
      desc: '猫村在猫群救助上做得很好，猫们得到了妥善的医疗、绝育和安置。但距离OECM保护地的标准仍有距离，猫群福利是唯一达标的维度。' },
    { id: 'T6', name: '综合推荐型', priority: 3,
      condition: function(s) {
        if (s.modules.M1 >= 3 && s.modules.M2 >= 3 && s.modules.M3 >= 3 && s.modules.M5 >= 3 &&
            s.stats.CW >= 80 && s.stats.ES >= 90 && s.stats.CT >= 85 && s.stats.FS >= 40 && s.stats.OE >= 120 &&
            s.temptationCount <= 1 && s.heatGovernance < 3) {
          if (s.stats.PH <= 125) return true;
          if (s.stats.PH > 125 && s.heatGovernance >= 3) return true;
        }
        return false;
      },
      desc: '猫村成功转型为OECM保护地！猫群风险得到控制，本土生物多样性开始恢复，社区积极参与共管，资金透明治理。评审组一致推荐将猫村纳入OECM保护地体系。这是最好的结局——公益与生态保护的真正融合。' },
    { id: 'T4', name: '生态经济主导型', priority: 4,
      condition: function(s) {
        return s.modules.M4 >= 3 && s.modules.M5 >= 3 && s.stats.PH >= 100 && s.stats.FS >= 50 && s.stats.ES >= 75 && s.stats.OE >= 90 && s.stats.CT >= 65 && s.temptationCount <= 2;
      },
      desc: '猫村找到了一条可持续的生态经济路径：研学、文创、ESG资金和透明治理构建了稳定的运营模式。虽然生态修复深度不如T6，但证明了公益可以与商业良性共处。' },
    { id: 'T3', name: '社区共管扩展型', priority: 5,
      condition: function(s) {
        return s.modules.M3 >= 3 && s.stats.CT >= 100 && s.stats.OE >= 85 && s.stats.ES >= 75;
      },
      desc: '猫村的核心成就是建立了真正的社区共管网络。村民从旁观者变成了共管参与者，生态契约农田和巡护机制让保护不再是外来的要求，而是村民自己的事。' },
    { id: 'T2', name: '生态修复优先型', priority: 6,
      condition: function(s) {
        return s.modules.M2 >= 3 && s.stats.ES >= 100 && s.stats.OE >= 95 && (s.modules.M3 < 3 || s.stats.FS < 60 || s.stats.CT < 90);
      },
      desc: '猫村在生态修复上取得了显著成果，本土物种开始回归，无猫斑块成为有效的保护空间。但社区共管和经济可持续性方面仍有不足，是一份偏科的生态答卷。' },
    { id: 'T1', name: '控猫孤岛型', priority: 7,
      condition: function(s) {
        return s.modules.M1 >= 4 && s.modules.M2 <= 2 && s.modules.M3 <= 2 && s.stats.CW >= 90 && s.stats.ES >= 75 && s.stats.OE >= 60;
      },
      desc: '猫村把猫群控制做得很好，绝育、防疫、防逃逸体系完善。但对于OECM保护地来说，控猫只是基础而非终点——生态监测和社区共管尚未跟上。' },
    { id: 'T0', name: '动物福利延续型(兜底)', priority: 8,
      condition: function(s) {
        return s.stats.CW >= 80 && s.modules.M2 <= 3 && s.modules.M3 <= 2 && s.modules.M1 < 4 && s.modules.M4 < 3 && s.modules.M5 < 3 && s.stats.PH < 115 && s.temptationCount <= 1;
      },
      desc: '猫村在救助猫这件事上做得很好，但其他维度未能达标。猫村仍然是救助站而非OECM保护地。' },
    { id: 'T5', name: '网红化失控型(兜底)', priority: 9,
      condition: function() { return true; },
      desc: '猫村始终未能建立清晰的管理画像。或许是在不同方向间反复摇摆，或许是没有在任何一个维度上做出足够扎实的成绩。猫村作为网红存在，但OECM目标未能实现。' }
];

// 热度治理证据项
const HEAT_GOVERNANCE_ITEMS = [
    '游客动线分区', '禁止游客投喂', '志愿者培训', '预约制研学', '公民科学监测', '透明财务公示', 'PH支线A'
];
