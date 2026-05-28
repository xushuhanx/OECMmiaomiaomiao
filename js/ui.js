
// ===== 猫村OECM - UI渲染 =====

const UI = {
    /* ========== 页面初始化 ========== */

    // 创建/显示游戏主界面（全屏三舞台结构）
    /* ========== 音频控制方法 ========== */

    // 播放 NPC 对话配音（仅支线NPC对话使用）
    playNpcAudio(npc) {
        if (!npc || !npc.audio) return;
        if (this._npcAudio) {
            this._npcAudio.pause();
            this._npcAudio.currentTime = 0;
        }
        const audio = new Audio(npc.audio);
        audio.volume = 0.85;
        audio.play().catch(() => {});  // 文件不存在时静默失败
        this._npcAudio = audio;
    },

    // 停止 NPC 配音
    stopNpcAudio() {
        if (this._npcAudio) {
            this._npcAudio.pause();
            this._npcAudio.currentTime = 0;
            this._npcAudio = null;
        }
    },

    // 启动主 BGM（循环）
    startBGM() {
        if (this._bgm) {
            this._bgm.pause();
            this._bgm = null;
        }
        const bgm = new Audio('assets/audio/bgm_main.mp3');
        bgm.volume = 0.35;
        bgm.loop = true;
        bgm.play().catch(() => {});
        this._bgm = bgm;
    },

    // 切换到谢幕 BGM
    startEndingBGM() {
        if (this._bgm) {
            this._bgm.pause();
            this._bgm = null;
        }
        const bgm = new Audio('assets/audio/bgm_ending.mp3');
        bgm.volume = 0.35;
        bgm.loop = true;
        bgm.play().catch(() => {});
        this._bgm = bgm;
    },

    // 停止 BGM
    stopBGM() {
        if (this._bgm) {
            this._bgm.pause();
            this._bgm.currentTime = 0;
            this._bgm = null;
        }
    },

    showGameScreen() {
        // 恢复主题（优先使用全局变量 _pickedTheme）
        const savedTheme = (typeof _pickedTheme !== 'undefined' ? _pickedTheme : localStorage.getItem('catvillage-theme')) || 'dark';
        document.getElementById('titleScreen').style.display = 'none';

        let container = document.getElementById('gameContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gameContainer';
            container.className = 'game-container';
            document.body.appendChild(container);
        }
        container.setAttribute('data-theme', savedTheme);
        container.style.display = 'block';

        container.innerHTML = `
            <!-- 左上：周次 + 主题切换 -->
            <div class="hud-week" id="hudWeek">
                <span id="weekLabel">第1周</span>
                <button class="theme-toggle" id="btnThemeToggle" onclick="UI.toggleTheme()" title="切换主题">${savedTheme === 'dark' ? '🌙' : '☀️'}</button>
                <button class="btn-secondary" onclick="location.reload()" style="font-size:0.75rem;padding:0.25rem 0.6rem;">返回标题</button>
            </div>

            <!-- 右上：六维状态 -->
            <div class="hud-stats" id="hudStats"></div>

            <!-- 右侧：选择记录栏 -->
            <div class="log-panel" id="logPanel">
                <div class="log-panel-title">📋 选择记录</div>
                <div class="log-list" id="logList"></div>
            </div>

            <!-- 舞台区（为记录栏让位） -->
            <div class="stage-area" id="stageArea">

                <!-- 舞台1：主线剧情（全屏背景 + 打字机效果） -->
                <div class="stage stage-event" id="stageEvent">
                    <img class="event-bg" id="eventImg" src="" alt="">
                    <div class="event-overlay"></div>
                    <div class="event-content">
                        <div class="event-title" id="eventTitle"></div>
                        <div class="event-line"></div>
                        <div class="event-desc" id="eventDesc"></div>
                        <div class="event-effects" id="eventEffects"></div>
                        <button class="btn-primary hidden" id="btnEventContinue" onclick="UI.onEventContinue()">继续 →</button>
                    </div>
                </div>

                <!-- 舞台2：行动卡选择 -->
                <div class="stage stage-action hidden" id="stageAction">
                    <div class="action-header">
                        <div class="panel-title">🎴 选择2张行动卡 <span style="font-size:0.85rem;color:var(--color-text-dim);" id="cardCounter">（已选: 0/2）</span></div>
                    </div>
                    <div class="card-grid" id="cardGrid"></div>
                </div>

                <!-- 舞台3：支线剧情（全屏大图 + 剧情介绍 + 底部对话层） -->
                <div class="stage stage-branch hidden" id="stageBranch">
                    <img class="event-bg" id="branchImg" src="" alt="">
                    <div class="event-overlay"></div>
                    <div class="dialogue-layer" id="dialogueLayer">
                        <!-- 剧情介绍（居中打字机） -->
                        <div class="branch-intro hidden" id="branchIntro">
                            <div class="branch-intro-title" id="branchIntroTitle"></div>
                            <div class="branch-intro-line"></div>
                            <div class="branch-intro-desc" id="branchIntroDesc"></div>
                        </div>
                        <!-- NPC对话区 -->
                        <div class="dialogue-box" id="dialogueBox"></div>
                        <div class="dialogue-nav">
                            <button class="btn-primary hidden" id="btnDialogueContinue" onclick="UI._branchContinue()">继续 →</button>
                        </div>
                        <div class="branch-options-overlay hidden" id="branchOptionsOverlay"></div>
                    </div>
                </div>

                <!-- 舞台4：每周结算 -->
                <div class="stage stage-summary hidden" id="stageSummary"></div>

                <!-- 舞台5：序章（开篇五页故事） -->
                <div class="stage stage-prologue hidden" id="stagePrologue">
                    <img class="event-bg" id="prologueImg" src="" alt="">
                    <div class="event-overlay"></div>
                    <div class="event-content">
                        <div class="event-desc" id="prologueDesc"></div>
                        <button class="btn-primary hidden" id="btnPrologueContinue" onclick="UI._prologueContinue()">继续 →</button>
                    </div>
                </div>

            </div>

            <!-- 结局画面（由 renderEnding 接管） -->
        `;
    },

    /* ========== 序章：开篇五页故事 ========== */

    showPrologue() {
        // 序章期间隐藏 HUD（安全取值，防止元素未就绪时报错）
        const el = (id) => document.getElementById(id);
        if (el('hudWeek')) el('hudWeek').style.display = 'none';
        if (el('hudStats')) el('hudStats').style.display = 'none';
        if (el('logPanel')) el('logPanel').style.display = 'none';

        // 硬编码序章数据（5页，对应 prologue_01 ~ prologue_05）
        this._prologuePages = [
            {
                img: 'assets/images/prologue_01.jpg',
                text: '太行山深处，有一个因为流浪猫而被重新看见的村庄。'
            },
            {
                img: 'assets/images/prologue_02.jpg',
                text: '这里曾经逐渐空心化，后来一批无处可去的猫被带到这里，废弃院落变成猫的庇护所，志愿者、游客和捐赠也随之而来。猫村救助流浪猫，推动绝育、医疗、领养和公益研学，也让这个安静的山村重新有了人气。但问题也越来越明显：猫群数量、游客打卡、粪污处理、资金压力和周边生态风险都让猫村站在了新的十字路口。'
            },
            {
                img: 'assets/images/prologue_03.jpg',
                text: '猫村收到了一份 OECM 初审意见。OECM 是"其他有效的保护措施"，指的是在自然保护地之外、通过长期治理和管理，同样能够实现生物多样性就地保护成效的区域。评审组认为：猫村的动物福利和公益价值值得肯定，但如果想成为潜力 OECM，猫村必须从"流浪猫救助地"转型成为一个真正具备生态保护价值的社区共管单元。'
            },
            {
                img: 'assets/images/prologue_04.jpg',
                text: '你是一名公益组织的 OECM 项目组成员，被派到猫村协助推进潜力案例建设。每一周，你都需要做出行动选择，在照顾猫群、保护本土生态、协调社区利益、维持资金和公众关注之间寻找平衡。你的选择会影响六项核心状态：猫群福利、生态安全、社区信任、资金稳定、公众热度和 OECM 证据。'
            },
            {
                img: 'assets/images/prologue_05.jpg',
                text: '12周后，评审组将来到猫村。猫村的未来，将由你的选择决定。'
            }
        ];

        // 启动主 BGM
        this.startBGM();

        this._prologueIdx = 0;
        this._showProloguePage();
    },

    _showProloguePage() {
        this._showStage('stagePrologue');
        const page = this._prologuePages[this._prologueIdx];
        document.getElementById('prologueImg').src = page.img;
        const descEl = document.getElementById('prologueDesc');
        const btnEl  = document.getElementById('btnPrologueContinue');
        btnEl.classList.remove('hidden');

        // 第5页（最后一页）不显示暗色渐变遮罩
        const overlayEl = document.querySelector('#stagePrologue .event-overlay');
        if (overlayEl) {
            overlayEl.style.display = (this._prologueIdx === 4) ? 'none' : '';
        }

        // 清除上一次的打字计时器
        if (this._typewriterTimer) clearTimeout(this._typewriterTimer);

        descEl.textContent = '';
        const fullText = page.text;
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                descEl.textContent += fullText[i];
                i++;
                this._typewriterTimer = setTimeout(type, 35);
            } else {
                this._typewriterTimer = null;
            }
        };
        type();
    },

    _prologueContinue() {
        // 如果打字机还在跑 → 快进到完整文字，然后直接推进
        if (this._typewriterTimer) {
            clearTimeout(this._typewriterTimer);
            this._typewriterTimer = null;
            document.getElementById('prologueDesc').textContent = this._prologuePages[this._prologueIdx].text;
            // 快进后直接推进到下一页，不等待再次点击
            this._prologueIdx++;
        } else {
            this._prologueIdx++;
        }

        if (this._prologueIdx < this._prologuePages.length) {
            this._showProloguePage();
        } else {
            // 序章结束，恢复 HUD 并进入游戏
            document.getElementById('hudWeek').style.display = 'flex';
            document.getElementById('hudStats').style.display = 'flex';
            document.getElementById('logPanel').style.display = 'flex';
            Game.init();
        }
    },

    /* ========== 主线剧情阶段 ========== */

    // 渲染主线事件（全屏背景 + 打字机逐字显示）
    renderEvent(event) {
        this._showStage('stageEvent');
        document.getElementById('eventImg').src  = `assets/images/${event.img}.jpg`;
        document.getElementById('eventTitle').textContent = `第${event.week}周：${event.name}`;
        document.getElementById('eventEffects').innerHTML = this.renderEffectTags(event.effects);

        const descEl = document.getElementById('eventDesc');
        const btnEl  = document.getElementById('btnEventContinue');
        btnEl.classList.add('hidden');

        // 清除上一次的打字计时器
        if (this._typewriterTimer) clearTimeout(this._typewriterTimer);

        const fullText = event.desc;
        descEl.textContent = '';
        let i = 0;

        const type = () => {
            if (i < fullText.length) {
                descEl.textContent += fullText[i];
                i++;
                this._typewriterTimer = setTimeout(type, 40);
            } else {
                btnEl.classList.remove('hidden');
            }
        };
        type();
    },

    // 点击"继续"→ 进入行动卡选择舞台
    onEventContinue() {
        Game.onEventDone();
    },

    /* ========== 六维 HUD（右上角） ========== */

    renderStats() {
        const el = document.getElementById('hudStats');
        if (!el) return;
        el.innerHTML = '';
        const s  = Game.state;
        const dims = ['CW','ES','CT','FS','PH','OE'];
        for (const dim of dims) {
            const def   = STAT_DEFS[dim];
            const value = s.stats[dim];
            const pct   = Math.round(value / 180 * 100);  // 满分180
            const color = value < 60 ? 'var(--color-accent)' : value > 120 ? 'var(--color-success)' : 'var(--color-text)';
            const barColor = value < 60 ? 'var(--color-accent)' : value > 120 ? 'var(--color-success)' : 'var(--color-info)';
            el.innerHTML += `
                <div class="hud-stat-item fade-in">
                    <div class="hud-stat-icon"><img src="assets/images/icon_${dim.toLowerCase()}.jpg" alt="${def.name}"></div>
                    <div class="hud-stat-info">
                        <div class="hud-stat-name">${def.name}</div>
                        <div class="hud-stat-value" style="color:${color}">${value}</div>
                    </div>
                    <div style="width:40px;height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;flex-shrink:0;">
                        <div style="width:${pct}%;height:100%;border-radius:3px;background:${barColor};transition:width 0.5s ease;"></div>
                    </div>
                </div>`;
        }
    },

    // 更新周次 HUD
    renderWeek() {
        const el = document.getElementById('weekLabel');
        if (el) el.textContent = `第${Game.state.week}周`;
    },

    /* ========== 模块进度（可选：在支线/结局时显示） ========== */

    renderModules() {
        // 模块进度暂不需要常驻 HUD；如需显示可在此扩展
    },

    /* ========== 行动卡选择阶段 ========== */

    renderActionCards(cards) {
        UI._hideCardTooltip(); // 切换周次/重新渲染时隐藏残留 tooltip
        const grid = document.getElementById('cardGrid');
        if (!grid) return;
        grid.innerHTML = '';
        const s = Game.state;

        // 按模块分组显示
        const moduleOrder = ['M1','M2','M3','M4','M5'];
        const cardByName = {};
        for (const c of cards) cardByName[c.name] = c;

        for (const mod of moduleOrder) {
            const modCards = cards.filter(c => c.module === mod);
            if (modCards.length === 0) continue;

            // 模块标题行
            const modHeader = document.createElement('div');
            modHeader.className = 'card-module-header';
            modHeader.textContent = MODULE_DEFS[mod].name;
            modHeader.style.cssText = 'grid-column:1/-1;font-size:0.85rem;color:var(--color-text-dim);padding:0.5rem 0 0.2rem;border-bottom:1px solid var(--color-border);margin-top:0.5rem;';
            grid.appendChild(modHeader);

            for (const card of modCards) {
                const isSelected = s.selectedCards.includes(card.id);
                const typeClass  = card.type === 'temptation' ? ' temptation' : '';
                const intro = (typeof CARD_INTROS !== 'undefined' && CARD_INTROS[card.name]) ? CARD_INTROS[card.name] : '';
                const div = document.createElement('div');
                div.className = `action-card fade-in${isSelected ? ' selected' : ''}${typeClass}`;
                div.innerHTML = `
                    <div class="card-name">${card.name}</div>
                    <div class="card-type">
                        <span class="effect-tag">${card.type === 'basic' ? '基础卡' : '解锁卡'}</span>
                    </div>`;
                div.addEventListener('click', () => {
                    if (Game.state.currentPhase !== 'action_select') return;
                    Game.selectCard(card.id);
                });
                // 悬浮科普 tooltip
                if (intro) {
                    div.addEventListener('mouseenter', (e) => { UI._showCardTooltip(e.currentTarget, intro); });
                    div.addEventListener('mouseleave', () => { UI._hideCardTooltip(); });
                }
                grid.appendChild(div);
            }
        }
        this._updateCardCounter();
    },

    _updateCardCounter() {
        const el = document.getElementById('cardCounter');
        if (el) el.textContent = `（已选: ${Game.state.selectedCards.length}/2）`;
    },

    // 行动卡悬浮科普 tooltip
    _showCardTooltip(cardEl, text) {
        let tip = document.getElementById('cardTooltip');
        if (!tip) {
            tip = document.createElement('div');
            tip.id = 'cardTooltip';
            tip.className = 'card-tooltip';
            document.body.appendChild(tip);
        }
        tip.textContent = text;

        // 根据当前主题动态设置 tooltip 颜色
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            tip.style.background = 'rgba(60,30,15,0.94)';
            tip.style.color = 'rgba(255,255,255,0.92)';
            tip.style.borderColor = 'rgba(180,140,100,0.2)';
            tip.style.setProperty('--tip-arrow', 'rgba(60,30,15,0.94)');
        } else {
            tip.style.background = 'rgba(22,33,62,0.96)';
            tip.style.color = 'rgba(255,255,255,0.92)';
            tip.style.borderColor = 'rgba(255,255,255,0.15)';
            tip.style.setProperty('--tip-arrow', 'rgba(22,33,62,0.96)');
        }

        tip.style.display = 'block';
        // 强制 reflow 后添加 show 类触发过渡动画
        void tip.offsetWidth;
        tip.classList.add('show');

        // 定位：在卡片上方居中，防止超出屏幕边缘
        const rect = cardEl.getBoundingClientRect();
        const tipW = 320; // 与 CSS 中 width 一致
        let left = rect.left + rect.width / 2;
        // 左边界：tooltip 左边缘不超出屏幕
        const minLeft = tipW / 2 + 8;
        if (left < minLeft) left = minLeft;
        // 右边界：tooltip 右边缘不超出屏幕
        const maxLeft = window.innerWidth - tipW / 2 - 8;
        if (left > maxLeft) left = maxLeft;
        tip.style.left = left + 'px';
        tip.style.top = (rect.top - 12) + 'px';
    },

    _hideCardTooltip() {
        const tip = document.getElementById('cardTooltip');
        if (tip) {
            tip.classList.remove('show');
            tip.style.display = 'none';
        }
    },

    /* ========== 无支线时：显示"进入下一周"按钮 ========== */
    showNextWeekButton() {
        this._showStage('stageAction');

        const grid = document.getElementById('cardGrid');
        if (!grid) return;

        let btnArea = document.getElementById('nextWeekBtnArea');
        if (!btnArea) {
            btnArea = document.createElement('div');
            btnArea.id = 'nextWeekBtnArea';
            btnArea.style.cssText = 'text-align:center;margin-top:1.5rem;padding-bottom:2rem;';
            grid.parentNode.appendChild(btnArea);
        }
        btnArea.innerHTML = `
            <button class="btn-primary" onclick="Game.showWeeklySummary();" style="font-size:1.05rem;padding:0.8rem 2.5rem;">
                查看本周结算 →
            </button>`;
    },

    /* ========== 每周结算页面 ========== */
    showWeeklySummary() {
        const s    = Game.state;
        const prev = s._prevStats || { ...s.stats };
        const changes = {};
        let changeHtml = '';
        for (const dim of ['CW','ES','CT','FS','PH','OE']) {
            const diff = s.stats[dim] - prev[dim];
            changes[dim] = diff;
            const sign = diff >= 0 ? '+' : '';
            const cls  = diff > 0 ? 'effect-positive' : diff < 0 ? 'effect-negative' : '';
            changeHtml += `<div style="padding:0.3rem 0;"><span style="display:inline-block;width:2.5rem;color:var(--color-text-dim);">${STAT_DEFS[dim].name}</span> <span class="${cls}" style="font-weight:bold;">${sign}${diff}</span> <span style="color:var(--color-text-dim);">→ ${s.stats[dim]}</span></div>`;
        }

        // 本周解锁的卡
        let unlockHtml = '';
        if (s._newlyUnlocked && s._newlyUnlocked.length) {
            unlockHtml = `<div style="margin-top:1rem;"><div style="color:var(--color-success);margin-bottom:0.3rem;">🔓 本周解锁：</div>${s._newlyUnlocked.map(n => `<span class="effect-tag">${n}</span>`).join(' ')}</div>`;
        }

        // 渲染到舞台
        this._showStage('stageSummary');
        const summaryEl = document.getElementById('stageSummary');
        if (!summaryEl) return;
        summaryEl.innerHTML = `
            <div style="max-width:520px;width:100%;text-align:center;">
                <div style="font-size:1.6rem;color:var(--color-accent);margin-bottom:1rem;">📊 第 ${s.week} 周结算</div>
                <div style="background:var(--color-card-bg);border:1px solid var(--color-border);border-radius:12px;padding:1.2rem;text-align:left;margin-bottom:1.2rem;">
                    <div style="font-weight:bold;margin-bottom:0.5rem;color:var(--color-text-dim);">六维变化</div>
                    ${changeHtml}
                </div>
                ${unlockHtml}
                <button class="btn-primary" onclick="Game.advanceWeek();" style="font-size:1.05rem;padding:0.8rem 2.5rem;margin-top:0.5rem;">
                    进入第${s.week < 12 ? s.week + 1 : '终'}周 →
                </button>
            </div>`;
    },

    /* ========== 支线剧情阶段 ========== */

    renderBranch(branch) {
        this._showStage('stageBranch');

        // 大图全屏背景
        document.getElementById('branchImg').src = `assets/images/${branch.img}.jpg`;

        // 重置对话层
        document.getElementById('dialogueBox').innerHTML = '';
        document.getElementById('branchOptionsOverlay').classList.add('hidden');
        document.getElementById('branchOptionsOverlay').innerHTML = '';
        document.getElementById('btnDialogueContinue').classList.add('hidden');

        // 清除上一次打字机
        if (this._branchTypewriterTimer) clearTimeout(this._branchTypewriterTimer);
        this._branchTypewriterTimer = null;

        // 存储支线数据
        this._branchPhase = 'intro';
        this._branchNpcs   = branch.npc;
        this._branchDialogueIdx = 0;

        // 显示剧情介绍 + 打字机打出描述
        const intro = document.getElementById('branchIntro');
        intro.classList.remove('hidden');
        document.getElementById('branchIntroTitle').textContent = branch.title;

        const descEl = document.getElementById('branchIntroDesc');
        descEl.textContent = '';
        const fullDesc = branch.desc;

        this._branchTypewriterTarget = descEl;
        this._branchTypewriterFullText = fullDesc;

        let i = 0;
        const type = () => {
            if (i < fullDesc.length) {
                descEl.textContent += fullDesc[i];
                i++;
                this._branchTypewriterTimer = setTimeout(type, 35);
            } else {
                this._branchTypewriterTimer = null;
                document.getElementById('btnDialogueContinue').classList.remove('hidden');
            }
        };
        type();
    },

    // 渲染指定索引的NPC对话（带打字机）
    _branchRenderDialogue(idx) {
        const npc  = this._branchNpcs[idx];
        const box  = document.getElementById('dialogueBox');
        const isRight = idx % 2 !== 0;

        const item = document.createElement('div');
        item.className = `dialogue-item ${isRight ? 'right' : 'left'} fade-in`;
        const avatarSrc = npc.avatar ? `assets/images/${npc.avatar}.jpg` : 'assets/images/npc_catface.png';
        item.innerHTML = `
            <div class="dialogue-avatar-ring">
                <div class="dialogue-avatar-outer"></div>
                <div class="dialogue-avatar-inner">
                    <img class="dialogue-avatar-img" src="${avatarSrc}" alt="${npc.name}">
                </div>
            </div>
            <div class="dialogue-bubble">
                <div class="dialogue-name">${npc.name}</div>
                <div class="dialogue-text"></div>
                <img class="dialogue-paw" src="assets/images/paw_print.png" alt="">
            </div>`;
        box.appendChild(item);
        box.scrollTop = box.scrollHeight;

        // 播放 NPC 配音
        this.playNpcAudio(npc);

        // 启动打字机
        const textEl   = item.querySelector('.dialogue-text');
        const fullText = npc.text;
        document.getElementById('btnDialogueContinue').classList.add('hidden');

        this._branchTypewriterTarget = textEl;
        this._branchTypewriterFullText = fullText;
        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                textEl.textContent += fullText[i];
                i++;
                box.scrollTop = box.scrollHeight;
                this._branchTypewriterTimer = setTimeout(type, 35);
            } else {
                this._branchTypewriterTimer = null;
                document.getElementById('btnDialogueContinue').classList.remove('hidden');
            }
        };
        type();
    },

    // 点"继续"：快进打字机 or 推进阶段
    _branchContinue() {
        const box = document.getElementById('dialogueBox');

        // 如果打字机还在跑 → 快进到完整文字
        if (this._branchTypewriterTimer) {
            clearTimeout(this._branchTypewriterTimer);
            this._branchTypewriterTimer = null;
            if (this._branchTypewriterTarget) {
                this._branchTypewriterTarget.textContent = this._branchTypewriterFullText;
                if (box) box.scrollTop = box.scrollHeight;
            }
            document.getElementById('btnDialogueContinue').classList.remove('hidden');
            return;
        }

        // 打字机已完成，推进阶段
        if (this._branchPhase === 'intro') {
            // 剧情介绍结束 → 开始对话
            document.getElementById('branchIntro').classList.add('hidden');
            this._branchPhase = 'dialogue';
            this._branchDialogueIdx = 0;
            this._branchRenderDialogue(0);
        } else if (this._branchPhase === 'dialogue') {
            this._branchDialogueIdx++;
            if (this._branchDialogueIdx < this._branchNpcs.length) {
                this._branchRenderDialogue(this._branchDialogueIdx);
            } else {
                // 对话结束 → 选项
                this._branchPhase = 'options';
                this._branchShowOptions();
            }
        }
    },

    // 对话全部结束后显示选项覆盖层
    _branchShowOptions() {
        const s = Game.state;
        const branch = BRANCH_EVENTS[s.branchTriggered];
        const overlay = document.getElementById('branchOptionsOverlay');
        overlay.classList.remove('hidden');

        let html = '<div class="branch-options-title">请做出选择：</div><div class="branch-options-list">';
        for (let i = 0; i < 3; i++) {
            let label, text;
            if (i < 2) { label = branch.options[i].label; text = branch.options[i].text; }
            else       { label = 'C'; text = '自然语言输入（自定义选项）'; }
            html += `<button class="btn-option" onclick="UI.chooseBranch(${i})">
                         <span class="option-label">${label}</span>${text}
                     </button>`;
        }
        html += '</div>';
        overlay.innerHTML = html;

        // 隐藏继续按钮
        document.getElementById('btnDialogueContinue').classList.add('hidden');
    },

    // 选择支线选项
    chooseBranch(idx) {
        const s = Game.state;
        const branch = BRANCH_EVENTS[s.branchTriggered];

        if (idx === 2) {
            // C 选项：自然语言输入 → Agent NPC 回应 + 判断偏向
            this._branchShowCInput();
            return;
        }

        const option = branch.options[idx];
        Game.log(`支线选择：${option.label} - ${option.text}`);
        Game.applyEffects(option.effects);
        Game.log(`支线结果：${option.result}`);

        if (s.branchTriggered === 'PH' && idx === 0) s.heatGovernance++;

        // 写入右侧记录栏：支线选择
        this.addLogEntry({
            type: 'branch',
            week: s.week,
            branchTitle: branch.title,
            choice: `${option.label}：${option.text}`,
            result: option.result
        });

        // 在对话层下方展示选择结果
        const overlay = document.getElementById('branchOptionsOverlay');
        overlay.innerHTML = `
            <div class="branch-result-inline fade-in">
                <div class="result-label">选择 ${option.label}：</div>
                <div style="line-height:1.8;margin:0.3rem 0;">${option.result}</div>
                <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.4rem;">${this.renderEffectTags(option.effects)}</div>
                <div style="text-align:center;margin-top:1rem;">
                    <button class="btn-primary btn-branch-result-continue" onclick="UI._branchResultContinue()" style="font-size:0.9rem;padding:0.5rem 1.8rem;">继续 →</button>
                </div>
            </div>`;

        // 确保底部导航按钮隐藏
        document.getElementById('btnDialogueContinue').classList.add('hidden');

        this.renderStats();
        s.branchActive = false;
        s.branchOptionChosen = true;
    },

    /* ========== C 选项：Agent NPC 处理 ========== */

    // 弹出 C 选项输入界面（替换选项覆盖层）
    _branchShowCInput() {
        const overlay = document.getElementById('branchOptionsOverlay');
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
            <div class="c-input-area fade-in">
                <div class="c-input-title">💬 自由输入你的选择</div>
                <textarea class="c-input-textarea" id="cInputText" placeholder="输入你想说的话或行动..." rows="3"></textarea>
                <div class="c-input-actions">
                    <button class="btn-secondary" onclick="UI._branchCancelC()">返回选项</button>
                    <button class="btn-primary" id="btnCSubmit" onclick="UI._branchSubmitC()">提交</button>
                </div>
                <div class="c-loading hidden" id="cLoading">
                    <span class="c-loading-dot"></span> NPC 正在思考...
                </div>
                <div class="c-npc-reply hidden" id="cNpcReply"></div>
                <div class="c-judge-result hidden" id="cJudgeResult"></div>
            </div>`;
    },

    // 支线结果看完后点击"继续"
    _branchResultContinue() {
        Game.continueGame();
    },

    // 返回选项（重新显示 A/B/C）
    _branchCancelC() {
        this._branchShowOptions();
    },

    // 提交 C 选项 → 调用 Agent API
    async _branchSubmitC() {
        const textarea = document.getElementById('cInputText');
        const btnSubmit = document.getElementById('btnCSubmit');
        const loadingEl = document.getElementById('cLoading');
        const userInput = textarea.value.trim();

        if (!userInput) {
            textarea.style.borderColor = 'var(--color-accent)';
            setTimeout(() => textarea.style.borderColor = '', 800);
            return;
        }

        // 显示 loading
        btnSubmit.disabled = true;
        loadingEl.classList.remove('hidden');

        const s = Game.state;
        const branch = BRANCH_EVENTS[s.branchTriggered];

        try {
            const result = await this._callAgentAPI(branch, userInput);

            // 显示 NPC 回应
            loadingEl.classList.add('hidden');
            const replyEl = document.getElementById('cNpcReply');
            replyEl.classList.remove('hidden');
            replyEl.innerHTML = `
                <div class="c-npc-avatar-line">
                    <span class="c-npc-label">NPC回应：</span>
                </div>
                <div class="c-npc-dialogue">${this._escapeHtml(result.reply)}</div>`;

            // 应用效果 + 显示判断结果
            const judge = result.judge;  // 'A' | 'B' | 'none'
            let effects, resultText, choiceLabel;

            if (judge === 'A') {
                effects = branch.options[0].effects;
                resultText = branch.options[0].result;
                choiceLabel = `C → A：${branch.options[0].text}`;
            } else if (judge === 'B') {
                effects = branch.options[1].effects;
                resultText = branch.options[1].result;
                choiceLabel = `C → B：${branch.options[1].text}`;
            } else {
                effects = { CW: 0, ES: 0, CT: 0, FS: 0, PH: 0, OE: 0 };
                resultText = '你的选择独特而独立，不偏向任何一方，维持现状。';
                choiceLabel = 'C（独立选择，无加减分）';
            }

            Game.log(`支线选择（C）：${userInput}`);
            Game.log(`判定结果：${judge === 'none' ? '不偏向' : '偏向' + judge}`);
            Game.applyEffects(effects);
            Game.log(`支线结果：${resultText}`);

            if (s.branchTriggered === 'PH' && judge === 'A') s.heatGovernance++;

            // 写入记录栏
            this.addLogEntry({
                type: 'branch',
                week: s.week,
                branchTitle: branch.title,
                choice: choiceLabel,
                result: resultText
            });

            // 显示判定结果
            const judgeEl = document.getElementById('cJudgeResult');
            judgeEl.classList.remove('hidden');
            judgeEl.innerHTML = `
                <div class="branch-result-inline" style="margin-top:0.6rem;">
                    <div class="result-label">判定：偏向 ${judge === 'none' ? '独立' : judge}</div>
                    <div style="line-height:1.8;margin:0.3rem 0;">${resultText}</div>
                    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.4rem;">${this.renderEffectTags(effects)}</div>
                    <div style="text-align:center;margin-top:1rem;">
                        <button class="btn-primary btn-branch-result-continue" onclick="UI._branchResultContinue()" style="font-size:0.9rem;padding:0.5rem 1.8rem;">继续 →</button>
                    </div>
                </div>`;

            // 确保底部导航按钮隐藏
            document.getElementById('btnDialogueContinue').classList.add('hidden');

            this.renderStats();
            s.branchActive = false;
            s.branchOptionChosen = true;

        } catch (err) {
            loadingEl.classList.add('hidden');
            const replyEl = document.getElementById('cNpcReply');
            replyEl.classList.remove('hidden');
            replyEl.innerHTML = `
                <div class="c-npc-dialogue" style="color:var(--color-accent);">
                    NPC暂时无法回应...（网络问题，请重试或选择 A/B）
                </div>`;
            // 恢复提交按钮
            btnSubmit.disabled = false;
            console.error('Agent API error:', err);
        }
    },

    // 调用阿里百炼 Agent API
    async _callAgentAPI(branch, userInput) {
        const API_KEY = 'sk-4a22714c6c124df28ce26395790f3c34';
        const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

        // 构建系统提示词：先回应，再判断
        const optionA = branch.options[0];
        const optionB = branch.options[1];

        const systemPrompt = `你是一个文字冒险游戏的NPC。玩家正面临一个支线剧情场景：${branch.title}

背景：${branch.desc}

选项A：${optionA.text}
选项B：${optionB.text}

玩家没有选择A或B，而是自由输入了他们的想法。请你完成两件事：

1. 以NPC的口吻，用1-2句简短的话回应玩家。语气要自然，像在对话中。不要重复玩家的原话。
2. 判断玩家的输入更接近选项A还是B，或者都不接近。如果接近A则输出"A"，接近B则输出"B"，都不接近则输出"none"。

请严格按照以下JSON格式输出，不要输出其他任何内容：
{"reply": "你的NPC回应（1-2句）", "judge": "A"|"B"|"none"}`;

        const userPrompt = `玩家输入：${userInput}\n\n请按照JSON格式输出回应和判断。`;

        const resp = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen-plus',
                input: {
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                },
                parameters: {
                    result_format: 'message',
                    temperature: 0.7,
                    max_tokens: 300
                }
            })
        });

        if (!resp.ok) {
            throw new Error(`API error: ${resp.status} ${resp.statusText}`);
        }

        const data = await resp.json();
        const content = data?.output?.choices?.[0]?.message?.content || '';

        // 解析 JSON 回复
        let parsed;
        try {
            // 尝试提取 JSON（可能被 markdown 包裹）
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No JSON found in response');
            }
        } catch (e) {
            // 降级处理：尝试从文本中推断
            console.warn('JSON parse failed, falling back:', content);
            parsed = {
                reply: content.slice(0, 200) || '嗯...你的想法很有意思。',
                judge: 'none'
            };
        }

        // 规范化 judge
        const judge = (parsed.judge || '').toUpperCase();
        if (judge !== 'A' && judge !== 'B') {
            parsed.judge = 'none';
        } else {
            parsed.judge = judge;
        }

        return parsed;
    },

    // 简单 HTML 转义
    _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /* ========== 结局 ========== */

    renderEnding(ending) {
        // 通关即解锁 OECM 知识档案（仅首次通关时写入）
        if (!this.isOecmUnlocked()) {
            try { sessionStorage.setItem('oecmUnlocked', '1'); } catch(e) {}
        }
        // 停止 NPC 配音和 BGM，启动谢幕 BGM
        this.stopNpcAudio();
        this.stopBGM();
        setTimeout(() => this.startEndingBGM(), 2000);

        // 保存当前主题，结局页跟随
        var currentTheme = (typeof _pickedTheme !== 'undefined' ? _pickedTheme : localStorage.getItem('catvillage-theme')) || 'dark';

        // 隐藏所有舞台
        this._showStage(null);

        // 隐藏 HUD 元素
        document.getElementById('hudWeek').style.display = 'none';
        document.getElementById('hudStats').style.display = 'none';
        document.getElementById('logPanel').style.display = 'none';

        let container = document.getElementById('endingScreen');
        if (!container) {
            container = document.createElement('div');
            container.id = 'endingScreen';
            container.className = 'ending-screen';
            document.body.appendChild(container);
        }
        container.setAttribute('data-theme', currentTheme);
        container.style.display = 'flex';
        container.style.overflow = 'hidden';

        const s = Game.state;
        // 结局名称去掉"T几型"，只保留类型名；去掉"(兜底)"后缀
        const displayName = ending.name.replace(/\(兜底\)$/, '');
        // 结局描述
        const displayDesc = ending.desc;

        // 六维数据
        let statsHtml1 = '', statsHtml2 = '';
        const dims1 = ['CW','ES','CT'];
        const dims2 = ['FS','PH','OE'];
        for (const dim of dims1) {
            const def = STAT_DEFS[dim];
            statsHtml1 += `<div class="ending-final-stat"><span class="efs-label">${def.name}</span><span class="efs-value">${s.stats[dim]}</span></div>`;
        }
        for (const dim of dims2) {
            const def = STAT_DEFS[dim];
            statsHtml2 += `<div class="ending-final-stat"><span class="efs-label">${def.name}</span><span class="efs-value">${s.stats[dim]}</span></div>`;
        }

        // 模块数据
        let modHtml1 = '', modHtml2 = '';
        const mods1 = [['M1','M2'],['M3','M4','M5']];
        for (const m of mods1[0]) {
            modHtml1 += `<div class="ending-final-stat"><span class="efs-label">${MODULE_DEFS[m].name}</span><span class="efs-value">${s.modules[m]}/${MODULE_DEFS[m].max}</span></div>`;
        }
        for (const m of mods1[1]) {
            modHtml2 += `<div class="ending-final-stat"><span class="efs-label">${MODULE_DEFS[m].name}</span><span class="efs-value">${s.modules[m]}/${MODULE_DEFS[m].max}</span></div>`;
        }

        container.innerHTML = `
            <img class="ending-bg" src="assets/images/ending_${ending.id.toLowerCase()}.jpg" alt="${ending.name}">

            <div class="ending-overlay">

                <!-- ===== 第一页：结局名称 + 描述（打字机） ===== -->
                <div class="ending-page" id="endingPage1">
                    <div class="ending-name-reveal show">
                        <div class="ending-name-text">${displayName}</div>
                        <div class="ending-name-line"></div>
                    </div>
                    <div class="ending-desc-stage" id="endingDescStage">
                        <div class="ending-desc-text" id="endingDescText"></div>
                    </div>
                    <div style="text-align:center;margin-top:1.5rem;">
                        <button class="btn-primary ending-fade-btn hidden" id="btnEndingPage1Continue" onclick="UI._showEndingPage2()">继续 →</button>
                    </div>
                </div>

                <!-- ===== 第二页：结局名称 + 数据框 ===== -->
                <div class="ending-page hidden" id="endingPage2">
                    <div class="ending-name-reveal show">
                        <div class="ending-name-text">${displayName}</div>
                        <div class="ending-name-line"></div>
                    </div>
                    <div class="ending-boxes" id="endingBoxes">
                        <div class="ending-box">
                            <div class="ending-box-title">结局</div>
                            <div class="ending-box-desc">${displayDesc}</div>
                        </div>
                        <div class="ending-box ending-box-stats">
                            <div class="ending-box-title">最终六维状态</div>
                            <div class="ending-stats-row">
                                <div class="ending-stats-col">${statsHtml1}</div>
                                <div class="ending-stats-col">${statsHtml2}</div>
                            </div>
                        </div>
                        <div class="ending-box">
                            <div class="ending-box-title">模块完成度</div>
                            <div class="ending-stats-row">
                                <div class="ending-stats-col">${modHtml1}</div>
                                <div class="ending-stats-col">${modHtml2}</div>
                            </div>
                        </div>
                        <div class="ending-box ending-box-meta">
                            <div class="ending-meta-item">诱惑卡使用次数：<strong>${s.temptationCount}</strong></div>
                            <div class="ending-meta-item">热度治理证据：<strong>${s.heatGovernance}</strong></div>
                            <div class="ending-meta-item">触发支线：${s.triggeredBranches.join('、') || '无'}</div>
                        </div>
                        <div style="text-align:center;margin-top:0.8rem;">
                            <button class="btn-primary ending-fade-btn hidden" id="btnEndingPage2Continue" onclick="UI._showEpilogue()">继续 →</button>
                        </div>
                    </div>
                </div>

                <!-- ===== 第三层：黑幕动画 + 背景文字 ===== -->
                <div class="ending-epilogue hidden" id="endingEpilogue">
                    <div class="epilogue-scroll">
                        <div class="epilogue-text" id="epilogueText"></div>
                        <div class="epilogue-btn-wrap hidden" id="epilogueBtnWrap">
                            <div style="display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;align-items:center;">
                                <button class="btn-primary" onclick="UI._handleRestart()" style="font-size:1.05rem;padding:0.8rem 2.5rem;">重新挑战</button>
                                <button class="btn-secondary" id="btnOecmKnowledge" onclick="UI.openOecmPage()" style="font-size:1.05rem;padding:0.8rem 2.5rem;">了解更多 OECM 知识 →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 第一页：标题立即显示，然后打字机展示描述
        var descEl = document.getElementById('endingDescText');
        var fullText = displayDesc;
        descEl.textContent = '';
        var j = 0;
        var typeDesc = function() {
            if (j < fullText.length) {
                descEl.textContent += fullText[j];
                j++;
                setTimeout(typeDesc, 35);
            } else {
                // 打字完成，显示"继续"按钮
                var btn = document.getElementById('btnEndingPage1Continue');
                if (btn) btn.classList.remove('hidden');
            }
        };
        setTimeout(typeDesc, 400);

        // 第二页的框先隐藏，等切换到第二页时再逐个跳出
        // （动画由 _showEndingPage2 处理）
    },

    // 结局第一页 → 第二页：隐藏第一页，显示第二页并逐个跳出数据框
    _showEndingPage2() {
        var page1 = document.getElementById('endingPage1');
        var page2 = document.getElementById('endingPage2');
        if (page1) page1.classList.add('hidden');
        if (page2) page2.classList.remove('hidden');

        // 第二页的框逐个跳出动画
        setTimeout(function() {
            var boxes = document.querySelectorAll('#endingBoxes .ending-box');
            boxes.forEach(function(item, i) {
                setTimeout(function() { item.classList.add('show'); }, i * 600);
            });
            // "继续"按钮最后出现
            setTimeout(function() {
                var btn = document.getElementById('btnEndingPage2Continue');
                if (btn) btn.classList.remove('hidden');
            }, boxes.length * 600 + 400);
        }, 200);
    },

    // 点击结局"继续" → 黑幕动画 + OECM背景文字
    _showEpilogue() {
        const epilogue = document.getElementById('endingEpilogue');
        if (!epilogue) return;
        epilogue.classList.remove('hidden');

        // 打字机效果展示背景文字
        const textEl = document.getElementById('epilogueText');
        const fullText = `2018年，《生物多样性公约》第14/8号决议正式明确 OECM 的定义：它不是传统自然保护地，而是在自然保护地之外，通过有效治理和管理，实现生物多样性长期就地保护成效的地理区域。

2022年，《昆明—蒙特利尔全球生物多样性框架》将 OECM 纳入全球"3030目标"，即到2030年有效保护至少30%的陆地、内陆水域、沿海和海洋区域。

2023—2030年，中国在《中国生物多样性保护战略与行动计划》中，将 OECM 作为实现生物多样性保护目标的重要路径之一。

2024年起，中国开始推进 OECMs 潜力案例征集与本土化探索，社会组织、科研机构、企业和地方社区等多元主体逐渐进入区域保护实践。

本游戏的现实原型，是位于河北省保定市阜平县太行山深处的"猫村"。

在真实的猫村中，流浪猫救助、志愿服务、公益传播、乡村振兴和外界关注已经交织在一起。它既承载着人们对流浪动物保护的善意，也面临着资金、人手、卫生、游客管理和周边生态风险等现实问题。

游戏中的事件虽然经过了剧情化处理，但并不是凭空虚构。游客弃猫、志愿者管理、网红化反噬、企业合作争议、公众质疑等情节，都来源于猫村这类现实公益项目在发展过程中可能真实发生的治理困境。

猫村的故事提醒我们，保护不只发生在遥远的自然保护区，也可能发生在一个被重新看见的山村里；而真正的保护，往往不是一句口号，而是一连串关于生命、社区、资金、边界和证据的艰难选择。`;

        textEl.textContent = '';
        if (this._typewriterTimer) clearTimeout(this._typewriterTimer);

        let i = 0;
        const type = () => {
            if (i < fullText.length) {
                textEl.textContent += fullText[i];
                i++;
                // 自动滚动
                const scrollEl = document.querySelector('.epilogue-scroll');
                if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
                this._typewriterTimer = setTimeout(type, 25);
            } else {
                // 打字完成，显示"重新挑战"按钮
                const btnWrap = document.getElementById('epilogueBtnWrap');
                if (btnWrap) btnWrap.classList.remove('hidden');
            }
        };
        type();
    },

    // 重新开始：标记OECM解锁状态，然后刷新
    _handleRestart() {
        try { sessionStorage.setItem('oecmUnlocked', '1'); } catch(e) {}
        location.reload();
    },

    // 打开OECM知识档案（内嵌 overlay）
    openOecmPage() {
        var overlay = document.getElementById('oecmOverlay');
        if (!overlay) { console.error('[OECM] overlay element not found!'); return; }
        var theme = (typeof _pickedTheme !== 'undefined' ? _pickedTheme : localStorage.getItem('catvillage-theme')) || 'dark';
        overlay.setAttribute('data-theme', theme);
        if (typeof updateOecmThemeBtn === 'function') updateOecmThemeBtn(theme);
        overlay.classList.add('open');
        overlay.scrollTop = 0;
        if (typeof renderOecmCases === 'function') renderOecmCases();
        if (typeof renderOecmFaqs === 'function') renderOecmFaqs();
    },

    // 检查OECM是否已解锁（通关后解锁）
    isOecmUnlocked() {
        try { return sessionStorage.getItem('oecmUnlocked') === '1'; } catch(e) { return false; }
    },

    /* ========== 工具方法 ========== */

    // 显示指定舞台，隐藏其余
    _showStage(id) {
        const ids = ['stageEvent','stageAction','stageBranch','stageSummary','stagePrologue'];
        for (const i of ids) {
            const el = document.getElementById(i);
            if (!el) continue;
            el.classList.toggle('hidden', i !== id);
        }
        // 切换支线舞台时确保对话层可见
        if (id === 'stageBranch') {
            const dlg = document.getElementById('dialogueLayer');
            if (dlg) dlg.classList.remove('hidden');
        }
    },

    /* ========== 右侧选择记录栏 ========== */

    // 添加一条记录（type: 'cards' | 'branch'）
    addLogEntry(entry) {
        const list = document.getElementById('logList');
        if (!list) return;

        const item = document.createElement('div');
        item.className = 'log-entry fade-in';

        if (entry.type === 'cards') {
            item.innerHTML = `
                <div class="log-week">第 ${entry.week} 周</div>
                <div class="log-row"><span class="log-label">行动卡</span></div>
                ${entry.cards.map(c => `<div class="log-card-name">· ${c}</div>`).join('')}`;
        } else if (entry.type === 'branch') {
            item.innerHTML = `
                <div class="log-branch-title">⚡ ${entry.branchTitle}</div>
                <div class="log-choice">${entry.choice}</div>`;
        }

        list.appendChild(item);
        list.scrollTop = list.scrollHeight;
    },

    renderEffectTags(effects) {
        return Object.entries(effects).map(([dim, val]) => {
            const cls = val > 0 ? 'effect-positive' : val < 0 ? 'effect-negative' : '';
            const sign = val > 0 ? '+' : '';
            return `<span class="effect-tag ${cls}">${dim} ${sign}${val}</span>`;
        }).join('');
    },

    showModal(title, content, onClose) {
        let overlay = document.getElementById('modalOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'modalOverlay';
            overlay.className = 'modal-overlay';
            document.body.appendChild(overlay);
        }
        // 同步主题（从标题画面或 localStorage 读取）
        var theme = (typeof _pickedTheme !== 'undefined' ? _pickedTheme : localStorage.getItem('catvillage-theme')) || 'dark';
        overlay.setAttribute('data-theme', theme);
        // 保存关闭回调
        overlay._onClose = onClose || null;
        overlay.innerHTML = `
            <div class="modal-content fade-in">
                <div class="modal-header">
                    <div class="modal-title">${title}</div>
                    <button class="modal-close" onclick="UI.closeModal()">✕</button>
                </div>
                <div>${content}</div>
            </div>`;
        overlay.classList.add('active');
    },

    closeModal() {
        const overlay = document.getElementById('modalOverlay');
        if (!overlay) return;
        overlay.classList.remove('active');
        // 触发关闭回调
        if (typeof overlay._onClose === 'function') {
            var cb = overlay._onClose;
            overlay._onClose = null;
            setTimeout(cb, 50);
        }
    },

    /* ========== 主题切换 ========== */

    toggleTheme() {
        const container = document.getElementById('gameContainer');
        if (!container) return;
        const current = container.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        container.setAttribute('data-theme', next);
        localStorage.setItem('catvillage-theme', next);

        // 更新按钮图标
        const btn = document.getElementById('btnThemeToggle');
        if (btn) {
            btn.textContent = next === 'dark' ? '🌙' : '☀️';
        }
    }
};
