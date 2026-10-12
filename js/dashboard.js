/**
 * Dashboard Module - SaaS Analytics & Live Metrics
 */

const DashboardModule = (() => {
  const chartDataSets = {
    '7D': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      revenue: [12400, 14200, 18500, 16800, 22400, 26800, 29400],
      expenses: [5200, 6100, 7800, 6900, 8400, 9200, 10100]
    },
    '30D': {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      revenue: [68400, 78200, 92500, 108400],
      expenses: [28000, 31500, 34200, 38100]
    },
    '90D': {
      labels: ['Month 1', 'Month 2', 'Month 3'],
      revenue: [210000, 265000, 318000],
      expenses: [84000, 92000, 105000]
    },
    '1Y': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      revenue: [620000, 740000, 890000, 1050000],
      expenses: [260000, 295000, 330000, 375000]
    }
  };

  let activeRange = '7D';

  function init() {
    renderChart(activeRange);
    setupRangePills();
    setupSearchFilter();
    startLiveTicker();
  }

  function setupRangePills() {
    const pills = document.querySelectorAll('.chart-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeRange = pill.dataset.range;
        renderChart(activeRange);
        if (window.App) window.App.showToast(`Updated analytics view to ${activeRange}`);
      });
    });
  }

  function renderChart(range) {
    const svg = document.getElementById('analyticsChartSvg');
    if (!svg) return;

    const data = chartDataSets[range];
    const width = 800;
    const height = 260;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };

    const maxVal = Math.max(...data.revenue) * 1.15;
    const minVal = 0;

    const getX = (index) => padding.left + (index / (data.labels.length - 1)) * (width - padding.left - padding.right);
    const getY = (val) => height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

    // Build paths
    let revPathD = '';
    let expPathD = '';
    let revAreaD = '';

    data.revenue.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) {
        revPathD += `M ${x} ${y}`;
        revAreaD += `M ${x} ${height - padding.bottom} L ${x} ${y}`;
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(data.revenue[i - 1]);
        const cpX1 = prevX + (x - prevX) / 2;
        const cpX2 = prevX + (x - prevX) / 2;
        revPathD += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
        revAreaD += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
      }
    });
    revAreaD += ` L ${getX(data.labels.length - 1)} ${height - padding.bottom} Z`;

    data.expenses.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) {
        expPathD += `M ${x} ${y}`;
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(data.expenses[i - 1]);
        const cpX1 = prevX + (x - prevX) / 2;
        const cpX2 = prevX + (x - prevX) / 2;
        expPathD += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
      }
    });

    // Build grid & labels
    let gridLines = '';
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = minVal + (maxVal - minVal) * (i / gridSteps);
      const yPos = getY(yVal);
      gridLines += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="var(--border-subtle)" stroke-dasharray="4" />
        <text x="${padding.left - 10}" y="${yPos + 4}" fill="var(--text-subtle)" font-size="11" text-anchor="end">$${Math.round(yVal / 1000)}k</text>
      `;
    }

    let xLabels = '';
    data.labels.forEach((label, i) => {
      const xPos = getX(i);
      xLabels += `
        <text x="${xPos}" y="${height - 10}" fill="var(--text-muted)" font-size="12" text-anchor="middle" font-weight="500">${label}</text>
      `;
    });

    // Revenue dots
    let dots = '';
    data.revenue.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      dots += `
        <circle cx="${x}" cy="${y}" r="5" fill="#6366f1" stroke="#ffffff" stroke-width="2" class="chart-point" data-val="$${val.toLocaleString()}" />
      `;
    });

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.innerHTML = `
      <defs>
        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#6366f1" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${revAreaD}" fill="url(#revenueGrad)" />
      <path d="${revPathD}" fill="none" stroke="#6366f1" stroke-width="3.5" stroke-linecap="round" />
      <path d="${expPathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6 4" />
      ${xLabels}
      ${dots}
    `;
  }

  function setupSearchFilter() {
    const input = document.getElementById('transactionSearch');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#transactionTableBody tr');
      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  function startLiveTicker() {
    // Subtle real-time simulation updates to revenue KPI
    setInterval(() => {
      const revElem = document.getElementById('kpiLiveRevenue');
      if (!revElem) return;
      const current = parseInt(revElem.innerText.replace(/[^0-9]/g, ''));
      const delta = Math.floor(Math.random() * 80) + 20;
      const updated = current + delta;
      revElem.innerText = '$' + updated.toLocaleString();
    }, 6000);
  }

  return { init, renderChart };
})();
