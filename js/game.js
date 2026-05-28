// ===== 猫村OECM - 游戏核心逻辑 =====

const Game = {
    /* ========== 状态定义 ========== */
    state: {
        week: 0,
        stats:            { CW: 70, ES: 55, CT: 55, FS: 80, PH: 50, OE: 45 },
        modules:          { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 },
        modulesFirstCount: { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 },
        doneCards:        [],
        doneCardsThisWeek: [],
        doneCardsByName:  {},
        temptationCount:  0,
        heatGovernance:   0,
        triggeredBranches: [],
        tags:             [],
        selectedCards:    [],
        branchTriggered:  null,
        branchActive:     false,
        gameOver:         false,
        ending:           null,
        log:              [],
        currentPhase:     'init'   // init | action_select | branch | ending
    },

    /* ========== 初始化 ========== */
    init() {
        this.resetState();
        UI.showGameScreen();
        this.log('游戏开始 — 猫村共生记');
        this.advanceWeek();
    },

    resetState() {
        this.state = {
            week: 0,
            stats:            { CW: 70, ES: 55, CT: 55, FS: 80, PH: 50, OE: 45 },
            modules:          { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 },
            modulesFirstCount: { M1: 0, M2: 0, M3: 0, M4: 0, M5: 0 },
            doneCards:        [],
            doneCardsThisWeek: [],
            doneCardsByName:  {},
            temptationCount:  0,
            heatGovernance:   0,
            triggeredBranches: [],
            tags:             [],
            selectedCards:    [],
            branchTriggered:  null,
            branchActive:     false,
            gameOver:         false,
            ending:           null,
            log:              [],
            currentPhase:     'init'
        };
    },

    /* ========== 周推进 ========== */
    advanceWeek() {
        const s = this.state;

        // 保存本周状态（供结算页对比）
        s._prevStats = { ...s.stats };

        s.week++;
        s.selectedCards     = [];
        s.doneCardsThisWeek = [];
        s.branchTriggered  = null;
        s.branchActive     = false;
        s.currentPhase     = 'event';

        this.log(`\n===== 第 ${s.week} 周 =====`);

        // 提前结局检查
        if (this.checkEarlyEnding()) return;

        const event = MAIN_EVENTS.find(e => e.week === s.week);
        if (!event) { this.endGame(); return; }

        // 应用主线事件效果
        this.applyEffects(event.effects);
        this.log(`主线事件：${event.name}`);

        // 渲染主线剧情全屏舞台
        UI.renderEvent(event);
        UI.renderWeek();
        UI.renderStats();
    },

    /* ========== 主线剧情点击"继续"后的回调 ========== */
    onEventDone() {
        const s = this.state;
        s.currentPhase = 'action_select';
        // 切换到行动卡舞台并渲染卡牌
        UI._showStage('stageAction');
        UI.renderActionCards(this.getAvailableCards());
        UI._updateCardCounter();
    },

    /* ========== 行动卡 ========== */
    getAvailableCards() {
        const s = this.state;
        const available = [];

        for (const card of ACTION_CARDS) {
            // 只显示当周可见的卡
            if (!card.visibleWeeks.includes(s.week)) continue;

            // 基础卡始终可用
            if (card.type === 'basic') {
                available.push({ ...card });
            }
            // 解锁卡：满足条件才显示（且解锁后永久可见）
            else if (this.checkUnlock(card)) {
                available.push({ ...card, locked: false });
            }
        }
        return available;
    },

    checkUnlock(card) {
        const s = this.state;
        // 辅助函数供 eval 使用
        function hasDone(names) {
            if (typeof names === 'string') names = [names];
            return names.some(n => s.doneCardsByName[n]);
        }
        function checkModule(m) { return s.modules[m] || 0; }
        if (!card.unlockLogic) return true;
        try { return eval(card.unlockLogic); }
        catch { return true; }
    },

    selectCard(cardId) {
        const s = this.state;
        if (s.currentPhase !== 'action_select') return;

        // 已选中：取消选择
        if (s.selectedCards.includes(cardId)) {
            s.selectedCards = s.selectedCards.filter(id => id !== cardId);
            UI.renderActionCards(this.getAvailableCards());
            UI._updateCardCounter();
            return;
        }

        if (s.selectedCards.length >= 2) return;

        s.selectedCards.push(cardId);
        UI.renderActionCards(this.getAvailableCards());
        UI._updateCardCounter();

        // 选满2张 → 立即结算，进入支线或下一周
        if (s.selectedCards.length === 2) {
            UI._hideCardTooltip(); // 防止 tooltip 残留在结算页面
            this.resolveActionPhase();
        }
    },

    /* ========== 行动阶段结算 ========== */
    resolveActionPhase() {
        const s = this.state;
        s._newlyUnlocked = [];   // 重置本周新解锁列表

        for (const cardId of s.selectedCards) {
            const card = ACTION_CARDS.find(c => c.id === cardId);
            if (!card) continue;

            this.log(`使用行动卡：${card.name}`);
            this.applyEffects(card.effects);

            // 模块有效卡种（首次计数）
            if (!s.doneCardsByName[card.name]) {
                s.modulesFirstCount[card.module] = (s.modulesFirstCount[card.module] || 0) + 1;
            }
            s.modules[card.module] = (s.modules[card.module] || 0) + 1;

            s.doneCardsByName[card.name] = (s.doneCardsByName[card.name] || 0) + 1;
            s.doneCards.push(card.name);

            if (card.type === 'temptation') {
                s.temptationCount++;
                this.log(`⚠️ 诱惑卡使用次数 +1（累计: ${s.temptationCount}）`);
            }
            if (HEAT_GOVERNANCE_ITEMS.includes(card.name) && card.type !== 'temptation') {
                s.heatGovernance++;
            }
            if (card.tags) {
                for (const tag of card.tags) {
                    if (!s.tags.includes(tag)) s.tags.push(tag);
                }
            }
        }

        // 检测本周新解锁的卡（解锁卡从不可见到可见）
        for (const card of ACTION_CARDS) {
            if (card.type === 'basic') continue;
            if (card.type === 'temptation') continue;
            if (this.checkUnlock(card) && !s.doneCardsByName[card.name]) {
                if (!s._newlyUnlocked.includes(card.name)) {
                    s._newlyUnlocked.push(card.name);
                }
            }
        }

        // 写入右侧记录栏：本周行动卡
        const cardNames = s.selectedCards.map(id => {
            const c = ACTION_CARDS.find(x => x.id === id);
            return c ? c.name : String(id);
        });
        UI.addLogEntry({ type: 'cards', week: s.week, cards: cardNames });

        // 检查支线触发；若有支线则 UI.renderBranch 会切换舞台
        this.checkBranchTrigger();
    },

    /* ========== 支线触发 ========== */
    checkBranchTrigger() {
        const s = this.state;

        const checks = [
            { dim: 'CW', ok: () => s.stats.CW > 100 },
            { dim: 'ES', ok: () => s.stats.ES > 125 },
            { dim: 'CT', ok: () => s.stats.CT < 52 },
            { dim: 'FS', ok: () => s.stats.FS < 55 },
            { dim: 'PH', ok: () => s.stats.PH > 100 },
            { dim: 'OE', ok: () => s.stats.OE < 42 || s.stats.OE > 120 }
        ];

        for (const b of checks) {
            if (b.ok() && !s.triggeredBranches.includes(b.dim)) {
                s.branchTriggered = b.dim;
                s.branchActive    = true;
                s.triggeredBranches.push(b.dim);
                s.currentPhase   = 'branch';

                this.log(`触发支线：${BRANCH_EVENTS[b.dim].title}`);
                UI.renderBranch(BRANCH_EVENTS[b.dim]);
                return;   // 等待玩家选择支线选项
            }
        }

        // 无支线 → 直接进入下一周检查
        this.checkEndOfWeek();
    },

    /* ========== 支线结束后统一继续 ========== */
    continueGame() {
        // 支线选完后显示结算页面
        if (this.checkEarlyEnding()) return;
        const s = this.state;
        if (s.week >= 12) {
            this.endGame();
        } else {
            UI.showWeeklySummary();
        }
    },

    /* ========== 周结束检查 ========== */
    checkEndOfWeek() {
        if (this.checkEarlyEnding()) return;

        const s = this.state;
        if (s.week >= 12) {
            this.endGame();
        } else {
            // 无支线：显示每周结算页面
            UI.showWeeklySummary();
        }
    },

    /* ========== 提前结局 ========== */
    checkEarlyEnding() {
        const s = this.state;
        for (const ending of ENDING_DEFS) {
            if (ending.checkEarly && s.week >= ending.checkEarly) {
                if (ending.condition(s)) {
                    this.triggerEnding(ending);
                    return true;
                }
            }
        }
        return false;
    },

    /* ========== 终局判定 ========== */
    endGame() {
        const s = this.state;
        for (const ending of ENDING_DEFS) {
            if (ending.condition(s)) {
                this.triggerEnding(ending);
                return;
            }
        }
        // 兜底
        this.triggerEnding(ENDING_DEFS[ENDING_DEFS.length - 1]);
    },

    triggerEnding(ending) {
        this.state.gameOver    = true;
        this.state.ending     = ending;
        this.state.currentPhase = 'ending';
        this.log(`结局：${ending.id} ${ending.name}`);
        UI.renderEnding(ending);
    },

    /* ========== 工具 ========== */
    applyEffects(effects) {
        const s = this.state;
        for (const [dim, val] of Object.entries(effects)) {
            if (dim in s.stats) {
                s.stats[dim] = Math.max(0, Math.min(180, s.stats[dim] + val));
            }
        }
    },

    log(msg) {
        this.state.log.push({ time: Date.now(), msg });
    }
};
