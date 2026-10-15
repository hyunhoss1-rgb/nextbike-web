let state = {
  keywords: [],
  snapshots: [],
  activeSnapshot: null,
  compareSnapshot: null,
  selectedCategory: 'ALL',
  selectedStatus: 'ALL',
  searchQuery: '',
  eventSource: null
};

// Initialize
async function init() {
  await loadData();
  renderComparisonButtons();
  renderCategoryPills();
  updateView();
  lucide.createIcons();
}

// Fetch all data from server
async function loadData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    state.keywords = data.keywords || [];
    state.snapshots = data.history?.snapshots || [];

    // Default active is latest snapshot
    state.activeSnapshot = state.snapshots[0] || null;
    
    // Default compare is yesterday (index 1), or second item
    state.compareSnapshot = state.snapshots[1] || state.snapshots[0] || null;
  } catch (err) {
    console.error('데이터 로드 실패:', err);
  }
}

// Render Comparison Preset Buttons
function renderComparisonButtons() {
  const container = document.getElementById('comparisonButtonGroup');
  if (!container) return;

  const presets = [
    { label: '어제 (10월 14일)와 비교', matchDaysAgo: 1, dateStr: '2026-10-14' },
    { label: '그제 (10월 13일)와 비교', matchDaysAgo: 2, dateStr: '2026-10-13' },
    { label: '2주 전 (10월 1일)과 비교', matchDaysAgo: 14, dateStr: '2026-10-01' },
    { label: '한 달 전 (9월 15일)과 비교', matchDaysAgo: 30, dateStr: '2026-09-15' }
  ];

  container.innerHTML = presets.map((p, idx) => {
    const isSelected = state.compareSnapshot?.date === p.dateStr || (!state.compareSnapshot && idx === 0);
    return `
      <button 
        onclick="setCompareDate('${p.dateStr}')" 
        class="compare-pill px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
          isSelected 
            ? 'bg-brand-cyan text-black shadow-md shadow-brand-cyan/20 ring-2 ring-brand-cyan/40' 
            : 'bg-brand-card hover:bg-brand-border text-gray-300 border border-brand-border'
        }"
      >
        <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
        <span>${p.label}</span>
      </button>
    `;
  }).join('');

  lucide.createIcons();
}

function setCompareDate(dateStr) {
  const target = state.snapshots.find(s => s.date === dateStr);
  if (target) {
    state.compareSnapshot = target;
    renderComparisonButtons();
    updateView();
  }
}

// Render Category Filter Pills
function renderCategoryPills() {
  const container = document.getElementById('categoryFilterPills');
  if (!container) return;

  const categories = ['전체', ...new Set(state.keywords.map(k => k.category))];

  container.innerHTML = categories.map(cat => {
    const isSelected = (cat === '전체' && state.selectedCategory === 'ALL') || state.selectedCategory === cat;
    return `
      <button 
        onclick="setCategoryFilter('${cat}')" 
        class="cat-pill px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
          isSelected 
            ? 'bg-brand-border text-brand-cyan font-bold border border-brand-cyan/40' 
            : 'text-gray-400 hover:text-gray-200'
        }"
      >
        ${cat}
      </button>
    `;
  }).join('');
}

function setCategoryFilter(cat) {
  state.selectedCategory = cat === '전체' ? 'ALL' : cat;
  renderCategoryPills();
  renderTable();
}

function setStatusFilter(status) {
  state.selectedStatus = status;
  document.querySelectorAll('.status-pill').forEach(btn => {
    if (btn.dataset.status === status) {
      btn.className = 'status-pill px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-cyan text-black';
    } else {
      btn.className = 'status-pill px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-card text-gray-300 hover:text-white border border-brand-border';
    }
  });
  renderTable();
}

// Update Entire Dashboard View
function updateView() {
  renderKPIs();
  renderTable();

  // Last Updated Time
  const lastTimeElem = document.getElementById('lastUpdatedTime');
  if (lastTimeElem && state.activeSnapshot) {
    lastTimeElem.textContent = state.activeSnapshot.label || state.activeSnapshot.date;
  }

  // Table header compare date
  const thCompare = document.getElementById('thCompareDate');
  if (thCompare && state.compareSnapshot) {
    thCompare.textContent = `${state.compareSnapshot.label.split(' ')[0]} 순위`;
  }
}

// Render KPI Cards
function renderKPIs() {
  if (!state.activeSnapshot) return;

  const activeItems = state.activeSnapshot.items || {};
  const compareItems = state.compareSnapshot?.items || {};

  const total = state.keywords.length;
  let exposed = 0;
  let gold = 0; // 1~3 rank
  let google = 0;
  let up = 0;
  let down = 0;
  let newEntrants = 0;

  state.keywords.forEach(k => {
    const act = activeItems[k.kw];
    const comp = compareItems[k.kw];

    if (act?.naverMobileRank) {
      exposed++;
      if (act.naverMobileRank <= 3) gold++;
    }
    if (act?.googleRank && act.googleRank <= 10) google++;

    // Calculate Delta vs Compare Snapshot
    const actRank = act?.naverMobileRank;
    const compRank = comp?.naverMobileRank;

    if (actRank && !compRank) {
      newEntrants++;
    } else if (actRank && compRank) {
      if (actRank < compRank) up++; // Rank number decreased = position climbed
      else if (actRank > compRank) down++;
    }
  });

  const rate = total > 0 ? ((exposed / total) * 100).toFixed(1) : '0';

  document.getElementById('kpiExposedRate').textContent = `${rate}%`;
  document.getElementById('kpiExposedCount').textContent = `(${exposed} / ${total}개)`;
  document.getElementById('kpiGoldCount').textContent = gold;
  document.getElementById('kpiGoogleCount').textContent = google;
  document.getElementById('kpiUpCount').textContent = up;
  document.getElementById('kpiDownCount').textContent = down;
  document.getElementById('kpiNewCount').textContent = newEntrants;

  if (state.compareSnapshot) {
    document.getElementById('kpiDeltaLabel').textContent = `${state.compareSnapshot.label.split(' ')[0]} 대비 변동`;
  }
}

// Render Main Data Table
function renderTable() {
  const tbody = document.getElementById('rankingTableBody');
  if (!tbody || !state.activeSnapshot) return;

  const activeItems = state.activeSnapshot.items || {};
  const compareItems = state.compareSnapshot?.items || {};

  const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();

  let filtered = state.keywords.filter(k => {
    // Category Filter
    if (state.selectedCategory !== 'ALL' && k.category !== state.selectedCategory) return false;

    // Search query
    if (search && !k.kw.toLowerCase().includes(search) && !k.category.toLowerCase().includes(search)) return false;

    const act = activeItems[k.kw];
    const comp = compareItems[k.kw];
    const actRank = act?.naverMobileRank;
    const compRank = comp?.naverMobileRank;

    // Status Filter
    if (state.selectedStatus === 'GOLD') return actRank && actRank <= 3;
    if (state.selectedStatus === 'PAGE1') return !!actRank;
    if (state.selectedStatus === 'UP') return actRank && compRank && actRank < compRank;
    if (state.selectedStatus === 'DOWN') return actRank && compRank && actRank > compRank;
    if (state.selectedStatus === 'OUT') return !actRank;

    return true;
  });

  document.getElementById('filteredCount').textContent = filtered.length;
  document.getElementById('totalKeywordsCount').textContent = state.keywords.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" class="py-12 text-center text-gray-500">
          <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
          조건에 일치하는 키워드가 없습니다.
        </td>
      </tr>
    `;
    lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map((k, idx) => {
    const act = activeItems[k.kw];
    const comp = compareItems[k.kw];

    const actRank = act?.naverMobileRank;
    const compRank = comp?.naverMobileRank;

    // Naver Mobile Badge (실질 순위: 파워링크 광고 제외, 100% 팩트 순위)
    let naverBadge = `<span class="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-800 text-gray-400">순위밖</span>`;
    if (actRank) {
      const comps = (act.competitorsBefore || []).slice(0, 2).map(c => c.replace('.com','').replace('.kr','').replace('xn--9i1br4kwvav7u81sd9bjl','트리니티')).join(', ');
      const compCount = act.competitorsBefore?.length || (actRank - 1);

      if (actRank === 1) {
        const subLabel = act.hasPlaceAbove ? '지도 하단 1위' : '파워링크 직하단';
        naverBadge = `
          <div class="inline-flex flex-col items-center">
            <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1 mx-auto">
              <i data-lucide="crown" class="w-3.5 h-3.5 text-amber-400 fill-amber-400"></i> 1위
            </span>
            <span class="text-[10px] text-amber-400/90 font-bold tracking-tight mt-0.5">${subLabel}</span>
          </div>
        `;
      } else {
        const badgeColor = actRank <= 3 
          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
          : 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30';
        
        const compTip = (act.competitorsBefore || []).join(', ');
        const subText = compCount > 0 ? `웹사이트 ${actRank}위 (상위 ${compCount}개사)` : `웹사이트 ${actRank}위`;

        naverBadge = `
          <div class="inline-flex flex-col items-center max-w-[130px] mx-auto text-center" title="상위 경쟁사: ${compTip}">
            <span class="px-2.5 py-0.5 rounded-lg text-xs font-extrabold ${badgeColor}">
              ${actRank}위
            </span>
            <span class="text-[10px] text-gray-400 mt-0.5 leading-tight truncate w-full" title="${compTip}">
              ${subText}
            </span>
          </div>
        `;
      }
    }

    // Naver PC Badge
    let naverPcBadge = `<span class="text-xs text-gray-500">-</span>`;
    if (act?.naverPcRank) {
      naverPcBadge = `<span class="text-xs font-bold text-gray-300">${act.naverPcRank}위</span>`;
    }

    // Google Badge
    let googleBadge = `<span class="text-xs text-gray-500">-</span>`;
    if (act?.googleRank) {
      googleBadge = `<span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
        ${act.googleRank}위
      </span>`;
    }

    // Compare Badge
    let compBadge = `<span class="text-xs text-gray-500">순위밖</span>`;
    if (compRank) {
      compBadge = `<span class="text-xs font-bold text-gray-300">${compRank}위</span>`;
    }

    // Delta Badge
    let deltaBadge = `<span class="text-gray-500 font-mono text-xs">─</span>`;
    if (actRank && !compRank) {
      deltaBadge = `<span class="px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan text-[11px] font-extrabold">NEW</span>`;
    } else if (actRank && compRank) {
      const diff = compRank - actRank;
      if (diff > 0) {
        deltaBadge = `<span class="text-emerald-400 font-bold text-xs flex items-center justify-center gap-0.5">▲ +${diff}</span>`;
      } else if (diff < 0) {
        deltaBadge = `<span class="text-rose-400 font-bold text-xs flex items-center justify-center gap-0.5">▼ ${diff}</span>`;
      } else {
        deltaBadge = `<span class="text-gray-400 text-xs">유지</span>`;
      }
    } else if (!actRank && compRank) {
      deltaBadge = `<span class="text-rose-500 text-[11px] font-bold">이탈</span>`;
    }

    // Landing Link
    const link = act?.link || `https://www.전국중고오토바이매입.kr/`;
    const displayLink = link.replace('https://www.', '').replace('https://', '');

    const naverSearchUrl = `https://m.search.naver.com/search.naver?query=${encodeURIComponent(k.kw)}`;

    return `
      <tr class="hover:bg-brand-card/50 transition-colors">
        <td class="py-3 px-3.5 text-center text-gray-500 font-mono text-xs">${idx + 1}</td>
        <td class="py-3 px-3.5">
          <span class="text-[11px] px-2 py-0.5 rounded bg-brand-card border border-brand-border text-gray-400">${k.category}</span>
        </td>
        <td class="py-3 px-4">
          <a href="${naverSearchUrl}" target="_blank" class="font-bold text-white hover:text-brand-cyan transition-colors flex items-center gap-1.5 group">
            <span>${k.kw}</span>
            <i data-lucide="external-link" class="w-3 h-3 text-gray-500 group-hover:text-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </a>
        </td>
        <td class="py-3 px-3.5 text-center">${naverBadge}</td>
        <td class="py-3 px-3.5 text-center">${naverPcBadge}</td>
        <td class="py-3 px-3.5 text-center">${googleBadge}</td>
        <td class="py-3 px-3.5 text-center">${compBadge}</td>
        <td class="py-3 px-3.5 text-center">${deltaBadge}</td>
        <td class="py-3 px-4">
          <a href="${link}" target="_blank" class="text-xs text-gray-400 hover:text-brand-cyan font-mono truncate max-w-[220px] block transition-colors" title="${link}">
            ${displayLink}
          </a>
        </td>
        <td class="py-3 px-3 text-center">
          <button onclick="deleteKeyword('${k.kw}')" class="text-gray-500 hover:text-rose-400 p-1 rounded hover:bg-brand-card transition-colors" title="키워드 삭제">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// Start Live Real-time Scan via SSE
function startScan() {
  const btnStart = document.getElementById('btnStartScan');
  const btnAbort = document.getElementById('btnAbortScan');
  const progressArea = document.getElementById('scanProgressArea');
  const progressBar = document.getElementById('scanProgressBar');
  const countText = document.getElementById('scanCountText');
  const percentText = document.getElementById('scanPercentText');
  const ticker = document.getElementById('scanCurrentTicker');

  btnStart.classList.add('hidden');
  btnAbort.classList.remove('hidden');
  progressArea.classList.remove('hidden');

  progressBar.style.width = '0%';
  countText.textContent = `0 / ${state.keywords.length}`;
  percentText.textContent = '0%';
  ticker.textContent = '조회 연결 중...';

  state.eventSource = new EventSource('/api/scan');

  state.eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);

      if (data.type === 'start') {
        ticker.textContent = `전수조사 시작 (총 ${data.total}개 키워드)...`;
      } else if (data.type === 'progress') {
        const percent = data.percent;
        progressBar.style.width = `${percent}%`;
        countText.textContent = `${data.current} / ${data.total}`;
        percentText.textContent = `${percent}%`;

        const rankText = data.item.naverMobileRank ? `[네이버 ${data.item.naverMobileRank}위]` : `[미노출]`;
        const googleText = data.item.googleRank ? `[구글 ${data.item.googleRank}위]` : '';
        ticker.textContent = `▶ [${data.current}/${data.total}] "${data.item.kw}" -> ${rankText} ${googleText}`;

        // Live update in-memory active snapshot item
        if (state.activeSnapshot && state.activeSnapshot.items) {
          state.activeSnapshot.items[data.item.kw] = data.item;
          renderKPIs();
          renderTable();
        }
      } else if (data.type === 'complete') {
        ticker.textContent = `✅ 전수조사 완료! 총 ${data.snapshot.totalKeywords}개 중 ${data.snapshot.exposedCount}개(${data.snapshot.exposedRate}) 1페이지 노출 확인!`;
        finishScan();
        loadData().then(() => updateView());
      } else if (data.type === 'aborted') {
        ticker.textContent = `⏹ 조회가 중지되었습니다.`;
        finishScan();
      }
    } catch (err) {
      console.error('SSE Error:', err);
    }
  };

  state.eventSource.onerror = () => {
    finishScan();
  };
}

function finishScan() {
  const btnStart = document.getElementById('btnStartScan');
  const btnAbort = document.getElementById('btnAbortScan');
  btnStart.classList.remove('hidden');
  btnAbort.classList.add('hidden');

  if (state.eventSource) {
    state.eventSource.close();
    state.eventSource = null;
  }
}

// Abort scan
async function abortScan() {
  await fetch('/api/scan/abort', { method: 'POST' });
}

// Modal handling
function openAddModal() {
  document.getElementById('addModal').classList.remove('hidden');
  document.getElementById('newKeywordInput').focus();
}

function closeAddModal() {
  document.getElementById('addModal').classList.add('hidden');
}

async function submitNewKeyword() {
  const kw = document.getElementById('newKeywordInput').value.trim();
  const category = document.getElementById('newKeywordCategory').value;

  if (!kw) {
    alert('키워드를 입력해 주세요.');
    return;
  }

  await fetch('/api/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kw, category })
  });

  closeAddModal();
  document.getElementById('newKeywordInput').value = '';
  await loadData();
  renderCategoryPills();
  updateView();
}

async function deleteKeyword(kw) {
  if (!confirm(`'${kw}' 키워드를 추적 목록에서 삭제하시겠습니까?`)) return;

  await fetch('/api/keywords', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'delete', kw })
  });

  await loadData();
  renderCategoryPills();
  updateView();
}

// Download CSV
function downloadCSV() {
  const dateStr = state.activeSnapshot?.date || 'latest';
  window.location.href = `/api/export-csv?date=${dateStr}`;
}

// Start on load
window.addEventListener('DOMContentLoaded', init);
