
const DATA = window.APP_DATA;

const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n || 0));
const number = n => new Intl.NumberFormat('en-US').format(Number(n || 0));
const pct = n => `${Number(n || 0).toFixed(2)}%`;

function renderStats() {
  const items = [
    ['Customers', number(DATA.stats.customers)],
    ['Campaigns', number(DATA.stats.campaigns)],
    ['Sends', number(DATA.stats.sends)],
    ['Purchases', number(DATA.stats.purchases)],
    ['Revenue', money(DATA.stats.revenue)],
  ];
  document.getElementById('statsGrid').innerHTML = items.map(([label, value]) => `
    <article class="card stat">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    </article>
  `).join('');
}

function renderBarChart(elId, rows, labelKey, valueKey, formatter = money) {
  const host = document.getElementById(elId);
  const max = Math.max(...rows.map(r => Number(r[valueKey] || 0)), 1);
  host.innerHTML = rows.map(r => {
    const value = Number(r[valueKey] || 0);
    const width = Math.max(2, (value / max) * 100);
    return `
      <div class="bar-row">
        <div class="bar-label">${r[labelKey]}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
        <div class="bar-value">${formatter(value)}</div>
      </div>
    `;
  }).join('');
}

function tableHTML(columns, rows) {
  const head = `<thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.map(r => `<tr>${columns.map(c => `<td>${typeof c.render === 'function' ? c.render(r[c.key], r) : (r[c.key] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return head + body;
}

function renderTables(campaignRows = DATA.campaigns) {
  document.getElementById('channelTable').innerHTML = tableHTML([
    { key: 'channel', label: 'Channel' },
    { key: 'sends', label: 'Sends', render: v => number(v) },
    { key: 'clicks', label: 'Clicks', render: v => number(v) },
    { key: 'ctr', label: 'CTR', render: v => pct(v) },
    { key: 'conversion_rate', label: 'Conv.', render: v => pct(v) },
    { key: 'revenue', label: 'Revenue', render: v => money(v) },
  ], DATA.channelPerformance);

  document.getElementById('monthlyTable').innerHTML = tableHTML([
    { key: 'month', label: 'Month' },
    { key: 'orders', label: 'Orders', render: v => number(v) },
    { key: 'revenue', label: 'Revenue', render: v => money(v) },
  ], DATA.monthlyRevenue);

  document.getElementById('topCampaignsTable').innerHTML = tableHTML([
    { key: 'campaign_name', label: 'Campaign' },
    { key: 'channel', label: 'Channel' },
    { key: 'sends', label: 'Sends', render: v => number(v) },
    { key: 'purchases', label: 'Purchases', render: v => number(v) },
    { key: 'revenue', label: 'Revenue', render: v => money(v) },
    { key: 'roi', label: 'ROI', render: v => pct(v) },
  ], DATA.topCampaigns);

  document.getElementById('campaignsTable').innerHTML = tableHTML([
    { key: 'campaign_name', label: 'Campaign' },
    { key: 'channel', label: 'Channel' },
    { key: 'campaign_type', label: 'Type' },
    { key: 'offer_type', label: 'Offer' },
    { key: 'offer_value', label: 'Value' },
    { key: 'budget', label: 'Budget', render: v => money(v) },
    { key: 'sends', label: 'Sends', render: v => number(v) },
    { key: 'clicks', label: 'Clicks', render: v => number(v) },
    { key: 'purchases', label: 'Purchases', render: v => number(v) },
    { key: 'conversion_rate', label: 'Conv.', render: v => pct(v) },
    { key: 'revenue', label: 'Revenue', render: v => money(v) },
    { key: 'roi', label: 'ROI', render: v => pct(v) },
  ], campaignRows);

  document.getElementById('segmentsTable').innerHTML = tableHTML([
    { key: 'segment_name', label: 'Segment' },
    { key: 'customers', label: 'Customers', render: v => number(v) },
    { key: 'orders', label: 'Orders', render: v => number(v) },
    { key: 'revenue', label: 'Revenue', render: v => money(v) },
    { key: 'aov', label: 'AOV', render: v => money(v) },
  ], DATA.segments);

  document.getElementById('customersTable').innerHTML = tableHTML([
    { key: 'customer_id', label: 'ID' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'loyalty_status', label: 'Loyalty' },
    { key: 'orders', label: 'Orders', render: v => number(v) },
    { key: 'lifetime_value', label: 'LTV', render: v => money(v) },
    { key: 'last_order_date', label: 'Last order' },
  ], DATA.customers);
}

function setTheme(theme) {
  document.body.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('cca-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('cca-theme');
  setTheme(saved || 'light');
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
  });
}

function initSearch() {
  const input = document.getElementById('campaignSearch');
  input.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = !q ? DATA.campaigns : DATA.campaigns.filter(row =>
      row.campaign_name.toLowerCase().includes(q) ||
      row.channel.toLowerCase().includes(q) ||
      row.campaign_type.toLowerCase().includes(q) ||
      row.offer_type.toLowerCase().includes(q)
    );
    renderTables(filtered);
  });
}

renderStats();
renderBarChart('channelChart', DATA.channelPerformance, 'channel', 'revenue', money);
renderBarChart('monthlyChart', DATA.monthlyRevenue.slice(-8), 'month', 'revenue', money);
renderBarChart('segmentChart', DATA.segments, 'segment_name', 'revenue', money);
renderTables();
initTheme();
initSearch();
