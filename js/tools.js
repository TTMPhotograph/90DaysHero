        const TARGET_DAYS = 90;
        const TARGET_MS = TARGET_DAYS * 24 * 60 * 60 * 1000;

        const RANKS = [
            { day: 0, title: "足軽 (Lv.1)", msg: "最初の一歩を踏み出しました。ここからすべてが始まります。" },
            { day: 3, title: "足軽大将 (Lv.2)", msg: "最初の壁である3日を突破！脳のクリーニングが始まっています。" },
            { day: 7, title: "侍 (Lv.3)", msg: "1週間達成！テストステロンが満ち、集中力が高まり始めています。" },
            { day: 14, title: "旗本 (Lv.4)", msg: "2週間突破。習慣が変わり始め、目つきに力が戻ってきます。" },
            { day: 30, title: "家老 (Lv.5)", msg: "1ヶ月達成！あなたはもう常人ではありません。自信を持ちましょう。" },
            { day: 60, title: "大名 (Lv.6)", msg: "2ヶ月突破。強力な自制心が宿りました。ゴールは目の前です。" },
            { day: 90, title: "将軍 (Lv.MAX)", msg: "90日達成！あなたは己の欲望を完全に支配した本物の覇者です。" }
        ];

        const MOTIVATION_QUOTES = [
            "「偉大な成果は、日々の小さな選択の積み重ねである。」",
            "「最も強い人間とは、己の欲望に打ち勝つ者だ。」",
            "「1秒前の自分を超えろ。未来の自分が今のあなたに感謝する。」",
            "「エネルギーを無駄にするな。それをすべて己の成長へ変よ。」",
            "「一瞬の快楽のために、一生の誇りを捨てるな。」",
            "「戦うべき相手は他人ではない、怠惰になろうとする己の心だ。」",
            "「苦しい時こそ、脳が新しく生まれ変わっているサインである。」"
        ];

        const FLAME_SVG_TEMPLATE = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z"></path>
            </svg>
        `;

        let startTime = localStorage.getItem('nofap_start_time') || Date.now();
        localStorage.setItem('nofap_start_time', startTime);

        let myTasks = JSON.parse(localStorage.getItem('nofap_tasks')) || ["筋トレをする", "瞑想をする", "冷水シャワーを浴びる"];
        let checkedHistory = JSON.parse(localStorage.getItem('nofap_checked_history')) || {};

        let selectedDateStr = getTodayString();

        const elDays = document.getElementById('days');
        const elHours = document.getElementById('hours');
        const elMinutes = document.getElementById('minutes');
        const elSeconds = document.getElementById('seconds');
        const elProgressBar = document.getElementById('progress-bar');
        const elProgressPercent = document.getElementById('progress-percent');
        const elRankBadge = document.getElementById('rank-badge');
        const elMessage = document.getElementById('motivate-message');
        const elQuote = document.getElementById('random-quote');
        const taskInput = document.getElementById('task-input');
        const btnAddTask = document.getElementById('btn-add-task');
        const taskList = document.getElementById('task-list');
        const elSelectedDateBadge = document.getElementById('selected-date-badge');

        const btnViewCal = document.getElementById('btn-view-cal');
        const btnViewList = document.getElementById('btn-view-list');
        const calendarView = document.getElementById('calendar-view');
        const timelineView = document.getElementById('timeline-view');
        const viewTitle = document.getElementById('view-title');
        const calendarGrid = document.getElementById('calendar-grid');
        const calendarMonthYear = document.getElementById('calendar-month-year');
        const timelineList = document.getElementById('timeline-list');
        const btnReset = document.getElementById('btn-reset');
        const elHtml = document.getElementById('theme-html');
        const themeToggle = document.getElementById('theme-toggle');

        function getTodayString() {
            const d = new Date();
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        }

        function initTheme() {
            const savedTheme = localStorage.getItem('nofap_theme') || 'dark';
            elHtml.setAttribute('data-theme', savedTheme);
            themeToggle.checked = (savedTheme === 'light');
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                elHtml.setAttribute('data-theme', 'light');
                localStorage.setItem('nofap_theme', 'light');
            } else {
                elHtml.setAttribute('data-theme', 'dark');
                localStorage.setItem('nofap_theme', 'dark');
            }
        });

        function displayRandomQuote() {
            const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
            elQuote.innerText = MOTIVATION_QUOTES[randomIndex];
        }

        function updateCounter() {
            const now = Date.now();
            const diff = now - startTime;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (elDays) elDays.innerText = String(days).padStart(2, '0');
            if (elHours) elHours.innerText = String(hours).padStart(2, '0');
            if (elMinutes) elMinutes.innerText = String(minutes).padStart(2, '0');
            if (elSeconds) elSeconds.innerText = String(seconds).padStart(2, '0');

            const progressPercent = Math.min((diff / TARGET_MS) * 100, 100).toFixed(1);
            if (elProgressBar) elProgressBar.value = progressPercent;
            if (elProgressPercent) elProgressPercent.innerText = `進捗: ${progressPercent}%`;

            let currentRank = RANKS[0];
            for (let i = RANKS.length - 1; i >= 0; i--) {
                if (days >= RANKS[i].day) { currentRank = RANKS[i]; break; }
            }
            if (elRankBadge) elRankBadge.innerText = currentRank.title;
            if (elMessage) elMessage.innerText = currentRank.msg;
        }

        // ＝★＝ 【修正】タスクの描画関数にドラッグ＆ドロップイベントを追加 ＝★＝
        function renderTasks() {
            taskList.innerHTML = '';
            const todayStr = getTodayString();
            elSelectedDateBadge.innerText = `編集日: ${selectedDateStr}${selectedDateStr === todayStr ? ' (今日)' : ''}`;
            if (selectedDateStr === todayStr) {
                elSelectedDateBadge.className = "badge badge-info font-bold p-3 gap-1 shadow text-xs";
            } else {
                elSelectedDateBadge.className = "badge badge-warning font-bold p-3 gap-1 shadow text-xs";
            }

            const targetDayHistory = checkedHistory[selectedDateStr] || [];

            myTasks.forEach((task, index) => {
                const isChecked = targetDayHistory.includes(task);
                const item = document.createElement('div');
                // draggable="true" を追加。PCでもスマホ(一部ブラウザ対応)でも掴めるように。
                item.className = "flex items-center justify-between bg-base-200 p-2 rounded-lg border border-base-300 gap-2 cursor-grab active:cursor-grabbing select-none transition-all duration-150";
                item.setAttribute('draggable', 'true');
                item.setAttribute('data-index', index);

                item.innerHTML = `
                    <div class="flex items-center gap-2 flex-grow min-w-0 pointer-events-none-inside">
                        <div class="text-base-content/30 cursor-grab shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="19" r="1"></circle>
                                <circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="19" r="1"></circle>
                            </svg>
                        </div>
                        <button class="btn btn-xs sm:btn-sm ${isChecked ? 'btn-success' : 'btn-outline btn-neutral'} font-bold btn-check shrink-0 pointer-events-auto" data-index="${index}">
                            ${isChecked ? '✓ クリア' : 'チェック'}
                        </button>
                        <span class="text-xs sm:text-sm font-semibold truncate ${isChecked ? 'line-through opacity-50' : ''}">${task}</span>
                    </div>
                    <button class="btn btn-ghost btn-xs text-error btn-delete font-bold shrink-0 pointer-events-auto" data-index="${index}">削除</button>
                `;
                taskList.appendChild(item);

                // --- ドラッグ＆ドロップ用イベントリスナーの登録 ---
                item.addEventListener('dragstart', (e) => {
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    saveReorderedTasks(); // 順序が確定したら保存
                });
            });

            // コンテナ側のドラッグ制御
            taskList.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingItem = document.querySelector('.dragging');
                if (!draggingItem) return;

                // マウス位置の直下にある「自分以外のタスク要素」を取得
                const afterElement = getDragAfterElement(taskList, e.clientY);
                if (afterElement == null) {
                    taskList.appendChild(draggingItem);
                } else {
                    taskList.insertBefore(draggingItem, afterElement);
                }
            });

            document.querySelectorAll('.btn-check').forEach(btn => {
                btn.addEventListener('click', (e) => toggleCheck(e.target.dataset.index));
            });
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => deleteTask(e.target.dataset.index));
            });
        }

        // ドラッグされた位置の判定用補助関数
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        // DOMの並び順から新しい配列を作ってLocalStorageに保存する関数
        function saveReorderedTasks() {
            const currentElements = [...taskList.querySelectorAll('[draggable="true"]')];
            const newTasksArray = [];

            currentElements.forEach(el => {
                const origIndex = el.getAttribute('data-index');
                newTasksArray.push(myTasks[origIndex]);
            });

            myTasks = newTasksArray;
            localStorage.setItem('nofap_tasks', JSON.stringify(myTasks));

            // data-indexの整合性を整えるために再レンダリング
            renderTasks();
        }

        if (btnAddTask) {
            btnAddTask.addEventListener('click', () => {
                const text = taskInput.value.trim();
                if (text) {
                    myTasks.push(text);
                    localStorage.setItem('nofap_tasks', JSON.stringify(myTasks));
                    taskInput.value = '';
                    renderTasks();
                }
            });
        }

        function deleteTask(index) {
            myTasks.splice(index, 1);
            localStorage.setItem('nofap_tasks', JSON.stringify(myTasks));
            renderTasks();
        }

        function toggleCheck(index) {
            const taskName = myTasks[index];
            if (!checkedHistory[selectedDateStr]) checkedHistory[selectedDateStr] = [];

            const tIndex = checkedHistory[selectedDateStr].indexOf(taskName);
            if (tIndex > -1) {
                checkedHistory[selectedDateStr].splice(tIndex, 1);
                if (checkedHistory[selectedDateStr].length === 0) delete checkedHistory[selectedDateStr];
            } else {
                checkedHistory[selectedDateStr].push(taskName);
            }

            localStorage.setItem('nofap_checked_history', JSON.stringify(checkedHistory));
            renderTasks();
            renderCalendar();
            renderTimeline();
        }

        function renderCalendar() {
            calendarGrid.innerHTML = '';
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            calendarMonthYear.innerText = `${year}年 ${month + 1}月`;

            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                calendarGrid.appendChild(empty);
            }

            for (let date = 1; date <= lastDate; date++) {
                const currentDateObj = new Date(year, month, date);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                const hasDone = checkedHistory[dateStr] && checkedHistory[dateStr].length > 0;
                const isSelected = (dateStr === selectedDateStr);
                const isFuture = currentDateObj > today;

                const dayCell = document.createElement('div');

                if (isFuture) {
                    dayCell.className = `p-1 rounded-md min-h-[38px] sm:min-h-[44px] flex flex-col items-center justify-between border border-neutral/5 opacity-40 cursor-not-allowed bg-base-300`;
                } else {
                    dayCell.className = `p-0.5 sm:p-1 rounded-md min-h-[38px] sm:min-h-[44px] flex flex-col items-center justify-between border cursor-pointer transition-all duration-150 active:scale-95 hover:bg-neutral/20 
                        ${isSelected ? 'border-2 border-info bg-base-100 shadow-md scale-105 z-10' : 'border-neutral/10 bg-base-200'} 
                        ${hasDone ? 'bg-success/10 text-success font-bold' : ''}`;

                    dayCell.setAttribute('data-date', dateStr);
                }

                let microFlame = FLAME_SVG_TEMPLATE.replace('<svg', '<svg class="w-3.5 h-3.5 mx-auto text-orange-500"');

                dayCell.innerHTML = `
                    <span class="text-[10px] sm:text-xs ${isSelected ? 'text-info font-black' : 'opacity-80'}">${date}</span>
                    <span class="text-xs h-3.5 flex items-center">${hasDone ? microFlame : ''}</span>
                `;
                calendarGrid.appendChild(dayCell);
            }

            document.querySelectorAll('#calendar-grid [data-date]').forEach(cell => {
                cell.addEventListener('click', (e) => {
                    selectedDateStr = e.currentTarget.getAttribute('data-date');
                    renderCalendar();
                    renderTasks();
                });
            });
        }

        function renderTimeline() {
            timelineList.innerHTML = '';
            const sortedDates = Object.keys(checkedHistory).sort((a, b) => new Date(b) - new Date(a));

            if (sortedDates.length === 0) {
                timelineList.innerHTML = '<p class="text-xs opacity-50 text-center mt-4">履歴がまだありません</p>';
                return;
            }

            sortedDates.forEach((dateStr) => {
                const tasks = checkedHistory[dateStr];
                const item = document.createElement('li');
                let timelineFlame = FLAME_SVG_TEMPLATE.replace('<svg', '<svg class="w-4 h-4 mr-1 inline-block align-text-bottom text-orange-500"');

                item.innerHTML = `
                    <hr class="bg-neutral"/>
                    <div class="timeline-start font-mono text-[10px] sm:text-xs opacity-70">${dateStr}</div>
                    <div class="timeline-middle"><div class="badge badge-success badge-xs"></div></div>
                    <div class="timeline-end timeline-box p-2 bg-neutral text-neutral-content text-xs max-w-full">
                        <div class="font-bold mb-1">${timelineFlame} 達成項目:</div>
                        <ul class="list-disc list-inside opacity-80">
                            ${tasks.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    <hr class="bg-neutral"/>
                `;
                timelineList.appendChild(item);
            });
        }

        btnViewCal.addEventListener('click', () => {
            btnViewCal.classList.add('btn-active');
            btnViewList.classList.remove('btn-active');
            calendarView.classList.remove('hidden');
            timelineView.classList.add('hidden');
            viewTitle.innerText = "履歴カレンダー";
        });

        btnViewList.addEventListener('click', () => {
            btnViewList.classList.add('btn-active');
            btnViewCal.classList.remove('btn-active');
            timelineView.classList.remove('hidden');
            calendarView.classList.add('hidden');
            viewTitle.innerText = "達成タイムライン";
        });

        btnReset.addEventListener('click', () => {
            if (confirm('警告: 90日カウンターをリセットしますか？（※設定した目的やこれまでのカレンダー履歴は保持されます）')) {
                startTime = Date.now();
                localStorage.setItem('nofap_start_time', startTime);
                updateCounter();
            }
        });

        const settingsDropdown = document.querySelector('details.dropdown');
        document.getElementById('btn-export-csv').addEventListener('click', () => {
            settingsDropdown.removeAttribute('open');
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Date,Completed_Tasks\n";

            const dates = Object.keys(checkedHistory).sort();
            // if (dates.length === 0) {
            //     alert("エクスポートする履歴データがまだありません。");
            //     return;
            // }

            dates.forEach(date => {
                const tasks = checkedHistory[date].join(" | ");
                csvContent += `${date},"${tasks}"\n`;
            });

            csvContent += `__META_START_TIME__,${startTime}\n`;
            csvContent += `__META_MY_TASKS__,"${myTasks.join(" | ")}"\n`;

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `90days_hero_backup_${getTodayString()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

        document.addEventListener('click', (e) => {
            if (!settingsDropdown.contains(e.target)) {
                settingsDropdown.removeAttribute('open');
            }
        });

        document.getElementById('csv-file-input').addEventListener('change', (e) => {
            settingsDropdown.removeAttribute('open');
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                const text = event.target.result;
                const lines = text.split("\n");

                let importedHistory = {};
                let importedStartTime = null;
                let importedTasks = null;

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const firstComma = line.indexOf(",");
                    if (firstComma === -1) continue;

                    const key = line.substring(0, firstComma).trim();
                    let val = line.substring(firstComma + 1).trim();

                    if (val.startsWith('"') && val.endsWith('"')) {
                        val = val.substring(1, val.length - 1);
                    }

                    if (key === "__META_START_TIME__") {
                        importedStartTime = val;
                    } else if (key === "__META_MY_TASKS__") {
                        importedTasks = val.split(" | ").filter(t => t.trim() !== "");
                    } else if (key !== "Date" && key !== "") {
                        const tasksArray = val.split(" | ").filter(t => t.trim() !== "");
                        if (tasksArray.length > 0) {
                            importedHistory[key] = tasksArray;
                        }
                    }
                }

                if (Object.keys(importedHistory).length === 0 && !importedStartTime) {
                    alert("有効なバックアップデータがCSVから見つかりませんでした。");
                    return;
                }

                if (confirm("CSVからデータを復元しますか？（現在のブラウザ内の記録はすべて上書きされます）")) {
                    if (importedHistory) {
                        checkedHistory = importedHistory;
                        localStorage.setItem('nofap_checked_history', JSON.stringify(checkedHistory));
                    }
                    if (importedStartTime) {
                        startTime = importedStartTime;
                        localStorage.setItem('nofap_start_time', startTime);
                    }
                    if (importedTasks) {
                        myTasks = importedTasks;
                        localStorage.setItem('nofap_tasks', JSON.stringify(myTasks));
                    }

                    selectedDateStr = getTodayString();
                    updateCounter();
                    renderTasks();
                    renderCalendar();
                    renderTimeline();
                    alert("CSVバックアップファイルからデータを正常に復元しました！");
                }
            };
            reader.readAsText(file, "UTF-8");
            e.target.value = "";
        });

        initTheme();
        setInterval(updateCounter, 1000);
        renderTasks();
        renderCalendar();
        renderTimeline();
        displayRandomQuote();