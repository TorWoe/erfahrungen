(function () {
    'use strict';

    // ── State ──
    const state = {
        entries: [],
        projects: [],
        categories: [],
        triggers: [],
        reportPeriod: 'day',
        reportOffset: 0,
        reportCustomStart: '',
        reportCustomEnd: '',
    };

    // ── LocalStorage ──
    function save() {
        localStorage.setItem('erf_entries', JSON.stringify(state.entries));
        localStorage.setItem('erf_projects', JSON.stringify(state.projects));
        localStorage.setItem('erf_categories', JSON.stringify(state.categories));
        localStorage.setItem('erf_triggers', JSON.stringify(state.triggers));
    }

    function load() {
        try {
            state.entries = JSON.parse(localStorage.getItem('erf_entries')) || [];
            state.projects = JSON.parse(localStorage.getItem('erf_projects')) || [];
            state.categories = JSON.parse(localStorage.getItem('erf_categories')) || [];
            state.triggers = JSON.parse(localStorage.getItem('erf_triggers')) || [];
        } catch {
            state.entries = [];
            state.projects = [];
            state.categories = [];
            state.triggers = [];
        }
        if (state.projects.length === 0) {
            state.projects = [
                { id: uid(), name: 'Familie', color: '#4a90d9' },
                { id: uid(), name: 'Freunde', color: '#27ae60' },
                { id: uid(), name: 'Arbeit', color: '#e67e22' },
            ];
        }
        if (state.categories.length === 0) {
            state.categories = [
                { id: uid(), name: 'Gespräch', color: '#9b59b6' },
                { id: uid(), name: 'Erlebnis', color: '#e74c3c' },
                { id: uid(), name: 'Begegnung', color: '#1abc9c' },
                { id: uid(), name: 'Sonstiges', color: '#95a5a6' },
            ];
        }
        if (state.triggers.length === 0) {
            state.triggers = [
                { id: uid(), name: 'Stress', color: '#e74c3c' },
                { id: uid(), name: 'Freude', color: '#27ae60' },
                { id: uid(), name: 'Angst', color: '#8e44ad' },
            ];
        }
        state.projects.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        state.categories.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        state.triggers.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
    }

    // ── Helpers ──
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    function todayStr() {
        return new Date().toISOString().slice(0, 10);
    }

    function escHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── DOM refs ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ── Navigation ──
    $$('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            $$('.nav-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            $$('.view').forEach((v) => v.classList.remove('active'));
            $(`#${btn.dataset.view}`).classList.add('active');
            if (btn.dataset.view === 'entries') renderEntries();
            if (btn.dataset.view === 'reports') renderReports();
            if (btn.dataset.view === 'search') initSearchMultiSelects();
            if (btn.dataset.view === 'settings') renderSettings();
        });
    });

    // ── Populate selects ──
    function populateSelects() {
        const projectSelects = ['#manual-project', '#filter-project'];
        const categorySelects = ['#manual-category', '#filter-category'];

        projectSelects.forEach((sel) => {
            const el = $(sel);
            const val = el.value;
            const isFilter = sel.includes('filter');
            el.innerHTML = `<option value="">${isFilter ? 'Alle Bezugsperson / Bezugsobjekt' : '-- Bezugsperson / Bezugsobjekt wählen --'}</option>`;
            state.projects.forEach((p) => {
                el.innerHTML += `<option value="${p.id}">${escHtml(p.name)}</option>`;
            });
            el.value = val;
        });

        categorySelects.forEach((sel) => {
            const el = $(sel);
            const val = el.value;
            const isFilter = sel.includes('filter');
            el.innerHTML = `<option value="">${isFilter ? 'Alle primäre Auslöser' : '-- primärer Auslöser wählen --'}</option>`;
            state.categories.forEach((c) => {
                el.innerHTML += `<option value="${c.id}">${escHtml(c.name)}</option>`;
            });
            el.value = val;
        });

        // Filter-Trigger bleibt ein normaler Select
        const filterTrigEl = $('#filter-trigger');
        const filterTrigVal = filterTrigEl.value;
        filterTrigEl.innerHTML = '<option value="">Alle Trigger</option>';
        state.triggers.forEach((t) => {
            filterTrigEl.innerHTML += `<option value="${t.id}">${escHtml(t.name)}</option>`;
        });
        filterTrigEl.value = filterTrigVal;

        // Multi-Select Trigger für Eingabe
        populateInlineTriggerSelect('manual-trigger-select', '-- meine Trigger wählen --');
    }

    function populateInlineTriggerSelect(containerId, labelDefault, selectedIds) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        const selected = selectedIds || [];

        dropdown.innerHTML = state.triggers
            .map((t) => `<label class="multi-select-option">
                <input type="checkbox" value="${t.id}"${selected.includes(t.id) ? ' checked' : ''}>
                <span class="color-dot" style="background:${t.color}"></span>
                ${escHtml(t.name)}
            </label>`)
            .join('');

        dropdown.addEventListener('click', (e) => e.stopPropagation());

        updateInlineTriggerToggle(containerId, labelDefault);

        // Remove old listeners by cloning
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.multi-select-dropdown').forEach((d) => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        dropdown.addEventListener('change', () => {
            updateInlineTriggerToggle(containerId, labelDefault);
        });
    }

    function updateInlineTriggerToggle(containerId, labelDefault) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        const checked = dropdown.querySelectorAll('input:checked');
        if (checked.length === 0) {
            toggle.textContent = labelDefault;
        } else {
            const names = Array.from(checked).map((cb) => {
                const item = state.triggers.find((t) => t.id === cb.value);
                return item ? item.name : '';
            });
            toggle.textContent = names.join(', ');
        }
    }

    function getInlineTriggerValues(containerId) {
        const checkboxes = $(`#${containerId}`).querySelectorAll('.multi-select-dropdown input:checked');
        return Array.from(checkboxes).map((cb) => cb.value);
    }

    function clearInlineTriggerSelect(containerId, labelDefault) {
        const container = $(`#${containerId}`);
        const checkboxes = container.querySelectorAll('.multi-select-dropdown input[type="checkbox"]');
        checkboxes.forEach((cb) => { cb.checked = false; });
        container.querySelector('.multi-select-toggle').textContent = labelDefault;
    }

    // Helper: normalize entry triggers (backward compat: single trigger string → array)
    function getEntryTriggers(entry) {
        if (Array.isArray(entry.triggers)) return entry.triggers;
        if (entry.trigger) return [entry.trigger];
        return [];
    }

    // ── Insights helpers ──
    function addInsightRow(containerId, value) {
        const container = $('#' + containerId);
        const row = document.createElement('div');
        row.className = 'insight-row';
        const ta = document.createElement('textarea');
        ta.placeholder = 'Erkenntnis / Antwort ...';
        ta.rows = 2;
        ta.value = value || '';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn-remove-insight';
        btn.textContent = '\u00d7';
        btn.addEventListener('click', () => row.remove());
        row.appendChild(ta);
        row.appendChild(btn);
        container.appendChild(row);
    }

    function getInsightValues(containerId) {
        const rows = $('#' + containerId).querySelectorAll('.insight-row textarea');
        return Array.from(rows).map((ta) => ta.value.trim()).filter(Boolean);
    }

    function clearInsights(containerId) {
        $('#' + containerId).innerHTML = '';
    }

    // ── Manual Entry (Eingabe) ──
    $('#manual-date').value = todayStr();
    addInsightRow('manual-insights', '');

    $('#btn-add-manual-insight').addEventListener('click', () => {
        addInsightRow('manual-insights', '');
    });

    $('#btn-manual-add').addEventListener('click', () => {
        const task = $('#manual-task').value.trim();
        if (!task) {
            alert('Bitte eine Erfahrung eingeben.');
            return;
        }

        const date = $('#manual-date').value || todayStr();

        const entry = {
            id: uid(),
            task: task,
            project: $('#manual-project').value,
            category: $('#manual-category').value,
            triggers: getInlineTriggerValues('manual-trigger-select'),
            tags: $('#manual-tags').value.split(',').map((t) => t.trim()).filter(Boolean),
            description: $('#manual-description').value.trim(),
            insights: getInsightValues('manual-insights'),
            date: date,
            timestamp: new Date().toISOString(),
        };
        state.entries.push(entry);
        save();
        $('#manual-task').value = '';
        $('#manual-tags').value = '';
        $('#manual-description').value = '';
        $('#manual-project').value = '';
        $('#manual-category').value = '';
        clearInlineTriggerSelect('manual-trigger-select', '-- meine Trigger wählen --');
        clearInsights('manual-insights');
        addInsightRow('manual-insights', '');
        $('#manual-date').value = todayStr();
        alert('Erfahrung erfolgreich erfasst!');
    });

    // ── Entries View ──
    function renderEntries() {
        const filterDate = $('#filter-date').value;
        const filterProject = $('#filter-project').value;
        const filterCategory = $('#filter-category').value;
        const filterTrigger = $('#filter-trigger').value;

        let filtered = [...state.entries];
        if (filterDate) filtered = filtered.filter((e) => e.date === filterDate);
        if (filterProject) filtered = filtered.filter((e) => e.project === filterProject);
        if (filterCategory) filtered = filtered.filter((e) => e.category === filterCategory);
        if (filterTrigger) filtered = filtered.filter((e) => getEntryTriggers(e).includes(filterTrigger));

        filtered.sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });

        const list = $('#entries-list');
        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-entries">Keine Einträge gefunden.</div>';
            return;
        }

        list.innerHTML = filtered
            .map((e) => {
                const proj = state.projects.find((p) => p.id === e.project);
                const cat = state.categories.find((c) => c.id === e.category);
                const trigIds = getEntryTriggers(e);
                const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                const trigBadges = trigIds.map((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                }).join('');
                const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                const insightsHtml = (e.insights || []).length > 0
                    ? `<div class="entry-insights"><strong>Erkenntnisse / Antworten:</strong><ul>${e.insights.map((i) => `<li>${escHtml(i)}</li>`).join('')}</ul></div>`
                    : '';

                return `<div class="entry-card">
                    <div class="entry-info">
                        <div class="entry-task">${escHtml(e.task)}</div>
                        <div class="entry-meta">
                            <span>${e.date}</span>
                            ${projBadge}${catBadge}${trigBadges}
                        </div>
                        <div style="margin-top:4px">${tagsHtml}</div>
                        ${descHtml}
                        ${insightsHtml}
                    </div>
                    <div class="entry-actions">
                        <button onclick="app.editEntry('${e.id}')">Bearbeiten</button>
                        <button onclick="app.deleteEntry('${e.id}')">Löschen</button>
                    </div>
                </div>`;
            })
            .join('');
    }

    $('#filter-date').addEventListener('change', renderEntries);
    $('#filter-project').addEventListener('change', renderEntries);
    $('#filter-category').addEventListener('change', renderEntries);
    $('#filter-trigger').addEventListener('change', renderEntries);

    $('#filter-date-prev').addEventListener('click', () => {
        const el = $('#filter-date');
        const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
        d.setDate(d.getDate() - 1);
        el.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        renderEntries();
    });

    $('#filter-date-next').addEventListener('click', () => {
        const el = $('#filter-date');
        const d = el.value ? new Date(el.value + 'T00:00:00') : new Date();
        d.setDate(d.getDate() + 1);
        el.value = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        renderEntries();
    });

    // ── CSV Export ──
    $('#btn-export').addEventListener('click', () => {
        const filterDate = $('#filter-date').value;
        const filterProject = $('#filter-project').value;
        const filterCategory = $('#filter-category').value;
        const filterTrigger = $('#filter-trigger').value;

        let filtered = [...state.entries];
        if (filterDate) filtered = filtered.filter((e) => e.date === filterDate);
        if (filterProject) filtered = filtered.filter((e) => e.project === filterProject);
        if (filterCategory) filtered = filtered.filter((e) => e.category === filterCategory);
        if (filterTrigger) filtered = filtered.filter((e) => getEntryTriggers(e).includes(filterTrigger));

        const maxInsights = filtered.reduce((max, e) => Math.max(max, (e.insights || []).length), 0);
        const headers = ['Erfassungsdatum', 'Erfahrung', 'Bezugsperson/Bezugsobjekt', 'primärer Auslöser', 'Trigger', 'Tags', 'Beschreibung'];
        for (let i = 1; i <= maxInsights; i++) headers.push(`Erkenntnis ${i}`);
        const rows = filtered.map((e) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const cat = state.categories.find((c) => c.id === e.category);
            const trigNames = getEntryTriggers(e).map((tid) => {
                const t = state.triggers.find((tr) => tr.id === tid);
                return t ? t.name : '';
            }).filter(Boolean).join('; ');
            const row = [e.date, `"${e.task}"`, proj ? proj.name : '', cat ? cat.name : '', trigNames, (e.tags || []).join('; '), `"${(e.description || '').replace(/"/g, '""')}"`];
            const ins = e.insights || [];
            for (let i = 0; i < maxInsights; i++) row.push(`"${(ins[i] || '').replace(/"/g, '""')}"`);
            return row;
        });

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erfahrungen_export_${todayStr()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    // ── Reports ──
    let chartProjects = null;
    let chartCategories = null;
    let chartTriggers = null;

    function updateReportNav() {
        const isCustom = state.reportPeriod === 'custom';
        $('.report-nav').style.display = isCustom ? 'none' : 'flex';
    }

    $$('.report-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
            $$('.report-tab').forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');
            state.reportPeriod = tab.dataset.period;
            state.reportOffset = 0;
            updateReportNav();
            renderReports();
        });
    });

    $('#report-range-apply').addEventListener('click', () => {
        const startVal = $('#report-range-start').value;
        const endVal = $('#report-range-end').value;
        if (!startVal || !endVal) {
            alert('Bitte Start- und Enddatum angeben.');
            return;
        }
        if (startVal > endVal) {
            alert('Startdatum muss vor dem Enddatum liegen.');
            return;
        }
        $$('.report-tab').forEach((t) => t.classList.remove('active'));
        state.reportPeriod = 'custom';
        state.reportCustomStart = startVal;
        state.reportCustomEnd = endVal;
        updateReportNav();
        renderReports();
    });

    $('#report-prev').addEventListener('click', () => {
        state.reportOffset--;
        renderReports();
    });

    $('#report-next').addEventListener('click', () => {
        state.reportOffset++;
        renderReports();
    });

    function localDateStr(d) {
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function getReportRange() {
        if (state.reportPeriod === 'custom') {
            return { start: state.reportCustomStart, end: state.reportCustomEnd, label: `${state.reportCustomStart} – ${state.reportCustomEnd}` };
        }

        const now = new Date();
        let start, end, label;

        if (state.reportPeriod === 'day') {
            const d = new Date(now);
            d.setDate(d.getDate() + state.reportOffset);
            const ds = localDateStr(d);
            start = ds;
            end = ds;
            label = d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } else if (state.reportPeriod === 'week') {
            const d = new Date(now);
            d.setDate(d.getDate() + state.reportOffset * 7);
            const day = d.getDay();
            const monday = new Date(d);
            monday.setDate(d.getDate() - ((day + 6) % 7));
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            start = localDateStr(monday);
            end = localDateStr(sunday);
            label = `KW ${getWeekNumber(monday)} – ${monday.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })} bis ${sunday.toLocaleDateString('de-DE', { day: 'numeric', month: 'short', year: 'numeric' })}`;
        } else if (state.reportPeriod === 'month') {
            const d = new Date(now.getFullYear(), now.getMonth() + state.reportOffset, 1);
            start = localDateStr(d);
            const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
            end = localDateStr(lastDay);
            label = d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
        } else if (state.reportPeriod === 'year') {
            const year = now.getFullYear() + state.reportOffset;
            const d = new Date(year, 0, 1);
            const lastDay = new Date(year, 11, 31);
            start = localDateStr(d);
            end = localDateStr(lastDay);
            label = String(year);
        }
        return { start, end, label };
    }

    function getWeekNumber(d) {
        const date = new Date(d);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        const week1 = new Date(date.getFullYear(), 0, 4);
        return 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    }

    function renderReports() {
        const { start, end, label } = getReportRange();
        $('#report-date-label').textContent = label;

        const entries = state.entries.filter((e) => e.date >= start && e.date <= end);

        $('#report-summary').innerHTML = `
            <div class="summary-card"><div class="label">Einträge</div><div class="value">${entries.length}</div></div>
        `;

        renderCharts(entries);
    }

    function renderCharts(entries) {
        const chartTextColor = '#333';
        const chartGridColor = '#d4c98a';

        // Bezugsperson / Bezugsobjekt chart (count)
        const projectData = {};
        entries.forEach((e) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const name = proj ? proj.name : 'Ohne Bezugsperson';
            const color = proj ? proj.color : '#999';
            if (!projectData[name]) projectData[name] = { count: 0, color };
            projectData[name].count++;
        });

        if (chartProjects) chartProjects.destroy();
        const projLabels = Object.keys(projectData);
        chartProjects = new Chart($('#chart-projects'), {
            type: 'doughnut',
            data: {
                labels: projLabels,
                datasets: [{
                    data: projLabels.map((l) => projectData[l].count),
                    backgroundColor: projLabels.map((l) => projectData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });

        // primärer Auslöser chart (count)
        const catData = {};
        entries.forEach((e) => {
            const cat = state.categories.find((c) => c.id === e.category);
            const name = cat ? cat.name : 'Ohne Auslöser';
            const color = cat ? cat.color : '#999';
            if (!catData[name]) catData[name] = { count: 0, color };
            catData[name].count++;
        });

        if (chartCategories) chartCategories.destroy();
        const catLabels = Object.keys(catData);
        chartCategories = new Chart($('#chart-categories'), {
            type: 'doughnut',
            data: {
                labels: catLabels,
                datasets: [{
                    data: catLabels.map((l) => catData[l].count),
                    backgroundColor: catLabels.map((l) => catData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });

        // Trigger chart (count) – each trigger of an entry counted separately
        const trigData = {};
        entries.forEach((e) => {
            const trigIds = getEntryTriggers(e);
            if (trigIds.length === 0) {
                if (!trigData['Ohne Trigger']) trigData['Ohne Trigger'] = { count: 0, color: '#999' };
                trigData['Ohne Trigger'].count++;
            } else {
                trigIds.forEach((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    const name = trig ? trig.name : 'Ohne Trigger';
                    const color = trig ? trig.color : '#999';
                    if (!trigData[name]) trigData[name] = { count: 0, color };
                    trigData[name].count++;
                });
            }
        });

        if (chartTriggers) chartTriggers.destroy();
        const trigLabels = Object.keys(trigData);
        chartTriggers = new Chart($('#chart-triggers'), {
            type: 'doughnut',
            data: {
                labels: trigLabels,
                datasets: [{
                    data: trigLabels.map((l) => trigData[l].count),
                    backgroundColor: trigLabels.map((l) => trigData[l].color),
                    borderWidth: 0,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: chartTextColor, padding: 12 } },
                    tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}` } },
                },
            },
        });
    }

    // ── Search ──
    function populateMultiSelect(containerId, items, labelAll) {
        const container = $(`#${containerId}`);
        const dropdown = container.querySelector('.multi-select-dropdown');
        const toggle = container.querySelector('.multi-select-toggle');
        dropdown.innerHTML = items
            .map((item) => `<label class="multi-select-option">
                <input type="checkbox" value="${item.id}">
                <span class="color-dot" style="background:${item.color}"></span>
                ${escHtml(item.name)}
            </label>`)
            .join('');

        dropdown.addEventListener('click', (e) => e.stopPropagation());

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            $$('.multi-select-dropdown').forEach((d) => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        dropdown.addEventListener('change', () => {
            const checked = dropdown.querySelectorAll('input:checked');
            if (checked.length === 0) {
                toggle.textContent = labelAll;
            } else {
                const names = Array.from(checked).map((cb) => {
                    const item = items.find((i) => i.id === cb.value);
                    return item ? item.name : '';
                });
                toggle.textContent = names.join(', ');
            }
        });
    }

    function initSearchMultiSelects() {
        populateMultiSelect('search-project-select', state.projects, 'Bezugsperson / Bezugsobjekt');
        populateMultiSelect('search-category-select', state.categories, 'primärer Auslöser');
        populateMultiSelect('search-trigger-select', state.triggers, 'Trigger');
    }

    function getMultiSelectValues(containerId) {
        const checkboxes = $(`#${containerId}`).querySelectorAll('.multi-select-dropdown input:checked');
        return Array.from(checkboxes).map((cb) => cb.value);
    }

    function getSearchFiltered() {
        const query = $('#search-text').value.trim().toLowerCase();
        const selectedProjects = getMultiSelectValues('search-project-select');
        const selectedCategories = getMultiSelectValues('search-category-select');
        const selectedTriggers = getMultiSelectValues('search-trigger-select');

        let filtered = [...state.entries];

        if (query) {
            filtered = filtered.filter((e) => {
                const taskMatch = e.task.toLowerCase().includes(query);
                const tagMatch = (e.tags || []).some((t) => t.toLowerCase().includes(query));
                const descMatch = (e.description || '').toLowerCase().includes(query);
                return taskMatch || tagMatch || descMatch;
            });
        }

        if (selectedProjects.length > 0) {
            filtered = filtered.filter((e) => selectedProjects.includes(e.project));
        }

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((e) => selectedCategories.includes(e.category));
        }

        if (selectedTriggers.length > 0) {
            filtered = filtered.filter((e) => getEntryTriggers(e).some((tid) => selectedTriggers.includes(tid)));
        }

        filtered.sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });

        return { filtered, query, selectedProjects, selectedCategories, selectedTriggers };
    }

    function renderSearch() {
        const { filtered, query, selectedProjects, selectedCategories, selectedTriggers } = getSearchFiltered();

        const countEl = $('#search-result-count');
        const list = $('#search-results');

        if (!query && selectedProjects.length === 0 && selectedCategories.length === 0 && selectedTriggers.length === 0) {
            countEl.textContent = '';
            list.innerHTML = '<div class="no-entries">Bitte Suchbegriff eingeben oder Filter wählen.</div>';
            return;
        }

        countEl.textContent = `${filtered.length} Ergebnis${filtered.length !== 1 ? 'se' : ''} gefunden`;

        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-entries">Keine Einträge gefunden.</div>';
            return;
        }

        list.innerHTML = filtered
            .map((e) => {
                const proj = state.projects.find((p) => p.id === e.project);
                const cat = state.categories.find((c) => c.id === e.category);
                const trigIds = getEntryTriggers(e);
                const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                const trigBadges = trigIds.map((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                }).join('');
                const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                const insightsHtml = (e.insights || []).length > 0
                    ? `<div class="entry-insights"><strong>Erkenntnisse / Antworten:</strong><ul>${e.insights.map((i) => `<li>${escHtml(i)}</li>`).join('')}</ul></div>`
                    : '';

                return `<div class="entry-card">
                    <div class="entry-info">
                        <div class="entry-task">${escHtml(e.task)}</div>
                        <div class="entry-meta">
                            <span>${e.date}</span>
                            ${projBadge}${catBadge}${trigBadges}
                        </div>
                        <div style="margin-top:4px">${tagsHtml}</div>
                        ${descHtml}
                        ${insightsHtml}
                    </div>
                </div>`;
            })
            .join('');
    }

    $('#btn-search-reset').addEventListener('click', () => {
        location.hash = 'search';
        location.reload();
    });

    $('#btn-search-export').addEventListener('click', () => {
        const { filtered } = getSearchFiltered();
        if (filtered.length === 0) {
            alert('Keine Einträge zum Exportieren vorhanden.');
            return;
        }

        const maxInsights = filtered.reduce((max, e) => Math.max(max, (e.insights || []).length), 0);
        const headers = ['Erfassungsdatum', 'Erfahrung', 'Bezugsperson/Bezugsobjekt', 'primärer Auslöser', 'Trigger', 'Tags', 'Beschreibung'];
        for (let i = 1; i <= maxInsights; i++) headers.push(`Erkenntnis ${i}`);
        const rows = filtered.map((e) => {
            const proj = state.projects.find((p) => p.id === e.project);
            const cat = state.categories.find((c) => c.id === e.category);
            const trigNames = getEntryTriggers(e).map((tid) => {
                const t = state.triggers.find((tr) => tr.id === tid);
                return t ? t.name : '';
            }).filter(Boolean).join('; ');
            const row = [e.date, `"${e.task}"`, proj ? proj.name : '', cat ? cat.name : '', trigNames, (e.tags || []).join('; '), `"${(e.description || '').replace(/"/g, '""')}"`];
            const ins = e.insights || [];
            for (let i = 0; i < maxInsights; i++) row.push(`"${(ins[i] || '').replace(/"/g, '""')}"`);
            return row;
        });

        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erfahrungen_suche_${todayStr()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    });

    $('#btn-show-all').addEventListener('click', () => {
        const filtered = [...state.entries].sort((a, b) => {
            const cmp = b.date.localeCompare(a.date);
            if (cmp !== 0) return cmp;
            return (b.timestamp || '').localeCompare(a.timestamp || '');
        });

        const countEl = $('#search-result-count');
        const list = $('#search-results');

        countEl.textContent = `${filtered.length} Eintr${filtered.length !== 1 ? 'äge' : 'ag'} gesamt`;

        if (filtered.length === 0) {
            list.innerHTML = '<div class="no-entries">Keine Einträge vorhanden.</div>';
            return;
        }

        list.innerHTML = filtered
            .map((e) => {
                const proj = state.projects.find((p) => p.id === e.project);
                const cat = state.categories.find((c) => c.id === e.category);
                const trigIds = getEntryTriggers(e);
                const tagsHtml = (e.tags || []).map((t) => `<span class="tag">${escHtml(t)}</span>`).join('');
                const projBadge = proj ? `<span class="project-badge" style="background:${proj.color}22;color:${proj.color}">${escHtml(proj.name)}</span>` : '';
                const catBadge = cat ? `<span class="category-badge" style="background:${cat.color}22;color:${cat.color}">${escHtml(cat.name)}</span>` : '';
                const trigBadges = trigIds.map((tid) => {
                    const trig = state.triggers.find((t) => t.id === tid);
                    return trig ? `<span class="trigger-badge" style="background:${trig.color}22;color:${trig.color}">${escHtml(trig.name)}</span>` : '';
                }).join('');
                const descHtml = e.description ? `<div class="entry-description">${escHtml(e.description)}</div>` : '';
                const insightsHtml = (e.insights || []).length > 0
                    ? `<div class="entry-insights"><strong>Erkenntnisse / Antworten:</strong><ul>${e.insights.map((i) => `<li>${escHtml(i)}</li>`).join('')}</ul></div>`
                    : '';

                return `<div class="entry-card">
                    <div class="entry-info">
                        <div class="entry-task">${escHtml(e.task)}</div>
                        <div class="entry-meta">
                            <span>${e.date}</span>
                            ${projBadge}${catBadge}${trigBadges}
                        </div>
                        <div style="margin-top:4px">${tagsHtml}</div>
                        ${descHtml}
                        ${insightsHtml}
                    </div>
                </div>`;
            })
            .join('');
    });

    $('#btn-search').addEventListener('click', renderSearch);
    $('#search-text').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') renderSearch();
    });

    document.addEventListener('click', () => {
        $$('.multi-select-dropdown').forEach((d) => d.classList.remove('open'));
    });

    // ── Settings ──
    function renderSettings() {
        renderSettingsList('project');
        renderSettingsList('category');
        renderSettingsList('trigger');
    }

    function renderSettingsList(type) {
        const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
        const listEl = $(`#${type}-list`);
        listEl.innerHTML = items
            .map(
                (item) => `<div class="settings-item" id="item-${item.id}">
                <span class="color-dot" style="background:${item.color}"></span>
                <span class="name">${escHtml(item.name)}</span>
                <div class="settings-item-actions">
                    <button onclick="app.editItem('${type}','${item.id}')">Bearbeiten</button>
                    <button onclick="app.deleteItem('${type}','${item.id}')">Löschen</button>
                </div>
            </div>`
            )
            .join('');
    }

    $('#btn-add-project').addEventListener('click', () => {
        const name = $('#new-project').value.trim();
        if (!name) return;
        state.projects.push({ id: uid(), name, color: $('#new-project-color').value });
        state.projects.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-project').value = '';
        populateSelects();
        renderSettings();
    });

    $('#btn-add-category').addEventListener('click', () => {
        const name = $('#new-category').value.trim();
        if (!name) return;
        state.categories.push({ id: uid(), name, color: $('#new-category-color').value });
        state.categories.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-category').value = '';
        populateSelects();
        renderSettings();
    });

    $('#btn-add-trigger').addEventListener('click', () => {
        const name = $('#new-trigger').value.trim();
        if (!name) return;
        state.triggers.push({ id: uid(), name, color: $('#new-trigger-color').value });
        state.triggers.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        save();
        $('#new-trigger').value = '';
        populateSelects();
        renderSettings();
    });

    // ── Data Management ──
    $('#btn-export-all').addEventListener('click', () => {
        const data = { entries: state.entries, projects: state.projects, categories: state.categories, triggers: state.triggers };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `erfahrungen_backup_${todayStr()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    $('#btn-import').addEventListener('click', () => $('#import-file').click());

    $('#import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.entries) state.entries = data.entries;
                if (data.projects) state.projects = data.projects;
                if (data.categories) state.categories = data.categories;
                if (data.triggers) state.triggers = data.triggers;
                save();
                populateSelects();
                alert('Daten erfolgreich importiert!');
            } catch {
                alert('Fehler beim Import. Ungültige Datei.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    $('#btn-clear-data').addEventListener('click', () => {
        if (confirm('Wirklich ALLE Daten löschen? Dies kann nicht rückgängig gemacht werden!')) {
            state.entries = [];
            save();
            renderEntries();
            alert('Alle Erfahrungen wurden gelöscht.');
        }
    });

    // ── Global API for inline handlers ──
    let editingEntryId = null;

    function openEditModal(entry) {
        editingEntryId = entry.id;
        const modal = $('#edit-modal');

        const projSel = $('#edit-project');
        projSel.innerHTML = '<option value="">-- Bezugsperson / Bezugsobjekt wählen --</option>';
        state.projects.forEach((p) => {
            projSel.innerHTML += `<option value="${p.id}">${escHtml(p.name)}</option>`;
        });

        const catSel = $('#edit-category');
        catSel.innerHTML = '<option value="">-- primärer Auslöser wählen --</option>';
        state.categories.forEach((c) => {
            catSel.innerHTML += `<option value="${c.id}">${escHtml(c.name)}</option>`;
        });

        populateInlineTriggerSelect('edit-trigger-select', '-- meine Trigger wählen --', getEntryTriggers(entry));

        $('#edit-task').value = entry.task;
        projSel.value = entry.project;
        catSel.value = entry.category;
        $('#edit-tags').value = (entry.tags || []).join(', ');
        $('#edit-description').value = entry.description || '';
        clearInsights('edit-insights');
        const ins = entry.insights || [];
        if (ins.length === 0) {
            addInsightRow('edit-insights', '');
        } else {
            ins.forEach((i) => addInsightRow('edit-insights', i));
        }
        $('#edit-date').value = entry.date;

        modal.hidden = false;
    }

    $('#btn-add-edit-insight').addEventListener('click', () => {
        addInsightRow('edit-insights', '');
    });

    $('#edit-save').addEventListener('click', () => {
        const task = $('#edit-task').value.trim();
        if (!task) {
            alert('Bitte eine Erfahrung eingeben.');
            return;
        }
        const date = $('#edit-date').value || todayStr();

        const entry = state.entries.find((e) => e.id === editingEntryId);
        if (!entry) return;

        entry.task = task;
        entry.project = $('#edit-project').value;
        entry.category = $('#edit-category').value;
        entry.triggers = getInlineTriggerValues('edit-trigger-select');
        delete entry.trigger;
        entry.tags = $('#edit-tags').value.split(',').map((t) => t.trim()).filter(Boolean);
        entry.description = $('#edit-description').value.trim();
        entry.insights = getInsightValues('edit-insights');
        entry.date = date;
        entry.timestamp = new Date().toISOString();

        save();
        $('#edit-modal').hidden = true;
        editingEntryId = null;
        renderEntries();
    });

    $('#edit-cancel').addEventListener('click', () => {
        $('#edit-modal').hidden = true;
        editingEntryId = null;
    });

    $('#edit-modal').addEventListener('click', (e) => {
        if (e.target === $('#edit-modal')) {
            $('#edit-modal').hidden = true;
            editingEntryId = null;
        }
    });

    window.app = {
        editEntry(id) {
            const entry = state.entries.find((e) => e.id === id);
            if (!entry) return;
            openEditModal(entry);
        },
        deleteEntry(id) {
            if (!confirm('Eintrag löschen?')) return;
            state.entries = state.entries.filter((e) => e.id !== id);
            save();
            renderEntries();
        },
        deleteItem(type, id) {
            if (!confirm('Wirklich löschen?')) return;
            if (type === 'project') {
                state.projects = state.projects.filter((p) => p.id !== id);
            } else if (type === 'category') {
                state.categories = state.categories.filter((c) => c.id !== id);
            } else {
                state.triggers = state.triggers.filter((t) => t.id !== id);
            }
            save();
            populateSelects();
            renderSettings();
        },
        editItem(type, id) {
            const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
            const item = items.find((i) => i.id === id);
            if (!item) return;
            const el = $(`#item-${id}`);
            el.classList.add('editing');
            el.innerHTML = `
                <input type="color" class="edit-color" value="${item.color}">
                <input type="text" class="edit-name" value="${escHtml(item.name)}">
                <div class="settings-item-actions">
                    <button class="btn-save" onclick="app.saveItem('${type}','${id}')">Speichern</button>
                    <button onclick="app.cancelEdit()">Abbrechen</button>
                </div>
            `;
            el.querySelector('.edit-name').focus();
            el.querySelector('.edit-name').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') app.saveItem(type, id);
                if (e.key === 'Escape') app.cancelEdit();
            });
        },
        saveItem(type, id) {
            const el = $(`#item-${id}`);
            const newName = el.querySelector('.edit-name').value.trim();
            if (!newName) return;
            const newColor = el.querySelector('.edit-color').value;
            const items = type === 'project' ? state.projects : type === 'category' ? state.categories : state.triggers;
            const item = items.find((i) => i.id === id);
            if (!item) return;
            item.name = newName;
            item.color = newColor;
            items.sort((a, b) => a.name.localeCompare(b.name, 'de'));
            save();
            populateSelects();
            renderSettings();
        },
        cancelEdit() {
            renderSettings();
        },
    };

    // ── Init ──
    load();
    populateSelects();
    $('#filter-date').value = todayStr();

    if (location.hash === '#search') {
        location.hash = '';
        $$('.nav-btn').forEach((b) => b.classList.remove('active'));
        $$('.view').forEach((v) => v.classList.remove('active'));
        $('[data-view="search"]').classList.add('active');
        $('#search').classList.add('active');
        initSearchMultiSelects();
    }
})();
