// ui.js — BoothFlow view renderers and helpers
var BFUI = (function() {
  'use strict';

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function money(n) {
    var v = parseFloat(n, 10);
    if (isNaN(v)) return '$0.00';
    return '$' + v.toFixed(2);
  }

  function toastContainer() {
    var c = document.getElementById('toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  function showToast(message, type) {
    type = type || 'info';
    var el = document.createElement('div');
    el.className = 'toast ' + type;
    el.textContent = message;
    toastContainer().appendChild(el);
    setTimeout(function() { el.remove(); }, 3200);
  }

  function openModal(title, bodyHtml, footerHtml) {
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<div class="modal"><div class="modal-header"><div class="modal-title">' + esc(title) + '</div><button class="modal-close" onclick="BFUI.closeModal()">Close</button></div><div class="modal-body">' + bodyHtml + '</div>' + (footerHtml ? '<div class="modal-footer">' + footerHtml + '</div>' : '') + '</div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
  }

  function closeModal() {
    var el = document.querySelector('.modal-overlay');
    if (el) el.remove();
  }

  function showConfirm(msg) {
    return BFU.confirm(msg);
  }

  function formatDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function tierBadge() {
    var tier = BFLicensing.getCurrentTier();
    return '<span class="tier-badge tier-' + tier + '">' + BFLicensing.getTierInfo(tier).label + '</span>';
  }

  function navHtml(route) {
    var items = [
      { key: 'clients', label: 'Clients' },
      { key: 'bookings', label: 'Bookings' },
      { key: 'quotes', label: 'Quotes' },
      { key: 'gallery', label: 'Gallery' },
      { key: 'checklist', label: 'Checklist' },
      { key: 'rebook', label: 'Rebook' }
    ];
    var html = '<nav class="bottom-nav">';
    items.forEach(function(it) {
      html += '<button class="nav-item ' + (route === it.key ? 'active' : '') + '" onclick="App.navigateTo(\'' + it.key + '\')">' + it.label + '</button>';
    });
    html += '<button class="nav-item ' + (route === 'upgrade' ? 'active' : '') + '" onclick="App.navigateTo(\'upgrade\')">Upgrade</button>';
    html += '</nav>';
    return html;
  }

  function renderLanding() {
    var html = '<div class="landing">';
    html += '<div class="hero"><h1>BoothFlow</h1><p class="lead">Instant photo booth quotes, bookings, galleries, and follow-ups.</p><p class="sub">Built for 1–3 booth operators who need speed, not software training.</p>';
    html += '<div class="hero-actions"><button class="btn btn-primary btn-lg" onclick="App.navigateTo(\'app\')">Open BoothFlow</button><button class="btn btn-secondary btn-lg" onclick="App.navigateTo(\'app\', \'quotes\')">Try the Quote Builder</button></div>';
    html += '<p class="hint">Free tier: 3 clients, basic bookings, simple gallery.</p></div>';

    html += '<section class="section"><h2>Instant Quote Calculator</h2><p class="muted">Estimate a package in 60 seconds. No account required.</p>';
    html += '<div class="calculator">';
    html += '<div class="form-row"><div class="form-group"><label class="form-label">Package</label><select id="calc-package" class="form-select" onchange="App.recalcCalc()">';
    var packages = BFState.getPackages();
    packages.forEach(function(pkg) {
      html += '<option value="' + pkg.id + '" data-base="' + pkg.basePrice + '" data-hours="' + pkg.hours + '">' + esc(pkg.name) + '</option>';
    });
    html += '</select></div>';
    html += '<div class="form-group"><label class="form-label">Extra Hours</label><input id="calc-hours" class="form-input" type="number" min="0" step="1" value="0" oninput="App.recalcCalc()"></div></div>';
    html += '<div class="form-row"><div class="form-group"><label class="form-label">Travel Fee ($)</label><input id="calc-travel" class="form-input" type="number" min="0" step="1" value="0" oninput="App.recalcCalc()"></div>';
    html += '<div class="form-group"><label class="form-label">Discount ($)</label><input id="calc-discount" class="form-input" type="number" min="0" step="1" value="0" oninput="App.recalcCalc()"></div></div>';
    html += '<div class="form-row"><div class="form-group"><label class="form-label">Add-ons</label>';
    var addons = [
      { name: '2x2 Prints + 1 strip', price: 150 },
      { name: 'Framed photo print', price: 220 },
      { name: 'Guest book compilation', price: 180 },
      { name: 'Custom backdrop', price: 120 },
      { name: 'Attendant service', price: 200 },
      { name: '360 instant video', price: 250 }
    ];
    addons.forEach(function(a, idx) {
      html += '<label class="chip"><input type="checkbox" value="' + a.price + '" onchange="App.recalcCalc()" data-addon="' + esc(a.name) + '"> ' + esc(a.name) + ' — ' + money(a.price) + '</label>';
    });
    html += '</div></div>';
    html += '<div class="calc-result"><div class="calc-total" id="calc-total">' + money(0) + '</div><div class="calc-label">Estimated total</div></div>';
    html += '<div class="form-row"><div class="form-group"><label class="form-label">Your email</label><input id="calc-email" class="form-input" type="email" placeholder="you@boothco.com"></div></div>';
    html += '<button class="btn btn-primary btn-block" onclick="App.submitLead()">Get My Exact Quote + Bonus Pricing Tips</button>';
    html += '</div>';
    html += '</section>';

    html += '<section class="section"><h2>Built for booth operators</h2><div class="feature-grid">';
    var features = [
      { title: '60-second quote builder', body: 'Package, add-ons, and travel fees in one tap.' },
      { title: 'Booking + client CRM', body: 'Track inquiries, deposits, and event details in one list.' },
      { title: 'Branded gallery delivery', body: 'Upload photos, share a link, and prompt print orders.' },
      { title: 'Event checklist', body: 'Never forget power strips, backdrops, or spare tape again.' },
      { title: 'Rebooking engine', body: 'Follow up at 11 months for anniversaries, birthdays, and holidays.' },
      { title: 'Pricing tiers that fit', body: 'Free for your first 3 bookings. Pro and Business as you grow.' }
    ];
    features.forEach(function(f) {
      html += '<div class="feature-card"><div class="feature-title">' + esc(f.title) + '</div><p>' + esc(f.body) + '</p></div>';
    });
    html += '</div></section>';

    html += '<footer class="footer">BoothFlow v0.1 — photo booth operator OS.</footer>';
    html += '</div>';
    return html;
  }

  function renderClients() {
    var clients = BFState.getClients();
    var html = '<div class="page"><div class="page-header"><h2>Clients</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddClient()">+ Add Client</button></div></div>';
    if (clients.length === 0) {
      html += '<div class="empty"><div class="empty-icon">👤</div><p>No clients yet.</p></div>';
    } else {
      clients.forEach(function(c) {
        html += '<div class="item-row" onclick="App.showClientDetail(\'' + c.id + '\')">';
        html += '<div class="item-row-info"><div class="item-row-title">' + esc(c.name || 'Unnamed') + '</div>';
        html += '<div class="item-row-sub">' + esc(c.email || '') + (c.phone ? ' · ' + esc(c.phone) : '') + '</div></div>';
        html += '<span class="badge">Client</span></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderBookings() {
    var bookings = BFState.getBookings();
    var html = '<div class="page"><div class="page-header"><h2>Bookings</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddBooking()">+ New Booking</button></div></div>';
    if (bookings.length === 0) {
      html += '<div class="empty"><div class="empty-icon">📅</div><p>No bookings yet.</p></div>';
    } else {
      bookings.forEach(function(b) {
        html += '<div class="item-row" onclick="App.showBookingDetail(\'' + b.id + '\')">';
        html += '<div class="item-row-info"><div class="item-row-title">' + esc(b.clientName || 'Unnamed') + '</div>';
        html += '<div class="item-row-sub">' + esc(b.eventDate || '') + ' · ' + esc(b.packageName || '') + ' · ' + money(b.total) + '</div></div>';
        html += '<span class="badge badge-' + (b.status || 'inquiry') + '">' + esc((b.status || 'inquiry').toUpperCase()) + '</span></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderQuotes() {
    var quotes = BFState.getQuotes();
    var html = '<div class="page"><div class="page-header"><h2>Quotes</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddQuote()">+ New Quote</button></div></div>';
    if (quotes.length === 0) {
      html += '<div class="empty"><div class="empty-icon">🧾</div><p>No quotes yet. Build one in under 60 seconds.</p></div>';
    } else {
      quotes.slice().reverse().forEach(function(q) {
        html += '<div class="item-row" onclick="App.showQuoteDetail(\'' + q.id + '\')">';
        html += '<div class="item-row-info"><div class="item-row-title">' + esc(q.clientName || 'Unnamed') + '</div>';
        html += '<div class="item-row-sub">' + esc(q.packageName || '') + ' · ' + money(q.total) + '</div></div>';
        html += '<span class="badge badge-draft">' + esc((q.status || 'draft').toUpperCase()) + '</span></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderGallery() {
    var galleries = BFState.getGalleries();
    var html = '<div class="page"><div class="page-header"><h2>Gallery</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddGallery()">+ New Gallery</button></div></div>';
    if (galleries.length === 0) {
      html += '<div class="empty"><div class="empty-icon">🖼️</div><p>No galleries yet. Create one from a booking.</p></div>';
    } else {
      galleries.slice().reverse().forEach(function(g) {
        var cover = g.coverPhoto || '';
        html += '<div class="item-row" onclick="App.showGalleryDetail(\'' + g.id + '\')">';
        html += '<div class="item-row-info"><div class="item-row-title">' + esc(g.title || 'Untitled Gallery') + '</div>';
        html += '<div class="item-row-sub">' + (g.photos ? g.photos.length + ' photos' : '') + '</div></div>';
        html += '<span class="badge">Gallery</span></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderChecklist() {
    var lists = BFState.getChecklists();
    var html = '<div class="page"><div class="page-header"><h2>Event Checklist</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddChecklist()">+ New Checklist</button></div></div>';
    if (lists.length === 0) {
      html += '<div class="empty"><div class="empty-icon">✅</div><p>No checklists yet.</p></div>';
    } else {
      lists.forEach(function(list) {
        var done = list.items.filter(function(i) { return i.done; }).length;
        html += '<div class="card" onclick="App.showChecklistDetail(\'' + list.id + '\')">';
        html += '<div class="card-title">' + esc(list.name) + '</div>';
        html += '<div class="muted">' + done + '/' + list.items.length + ' completed</div></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderRebook() {
    var prompts = BFState.getRebookPrompts();
    var html = '<div class="page"><div class="page-header"><h2>Rebooking</h2>';
    html += '<div class="page-actions"><button class="btn btn-primary btn-sm" onclick="App.showAddRebook()">+ New Prompt</button></div></div>';
    if (prompts.length === 0) {
      html += '<div class="empty"><div class="empty-icon">🔁</div><p>No rebooking prompts yet.</p></div>';
    } else {
      prompts.slice().reverse().forEach(function(r) {
        html += '<div class="item-row" onclick="App.showRebookDetail(\'' + r.id + '\')">';
        html += '<div class="item-row-info"><div class="item-row-title">' + esc(r.clientName || '') + '</div>';
        html += '<div class="item-row-sub">Original: ' + esc(r.originalEventDate) + ' · Suggested: ' + esc(r.suggestedDate) + '</div></div>';
        html += '<span class="badge badge-' + (r.status === 'contacted' ? 'booked' : 'draft') + '">' + esc((r.status || 'pending').toUpperCase()) + '</span></div>';
      });
    }
    html += '</div>';
    return html;
  }

  function renderUpgrade() {
    var lic = BFLicensing.getLicense();
    var tier = BFLicensing.getCurrentTier();
    var html = '<div class="page"><h2>Plan & License</h2>';
    html += '<div class="card"><div class="card-title">Current Plan</div>';
    html += '<div class="plan-row"><span>Plan</span><span>' + BFLicensing.getTierInfo(tier).label + '</span></div>';
    html += '<div class="plan-row"><span>License</span><span>' + (lic.licensed ? 'Active (' + esc(lic.key) + ')' : 'Inactive') + '</span></div>';
    if (lic.activatedAt) {
      html += '<div class="plan-row"><span>Activated</span><span>' + esc(lic.activatedAt) + '</span></div>';
    }
    html += '</div>';

    var plans = [
      { id: 'free', name: 'Free', price: '$0', features: BFLicensing.TIERS.free.features },
      { id: 'pro', name: 'Pro', price: '$29/mo', features: BFLicensing.TIERS.pro.features },
      { id: 'business', name: 'Business', price: '$59/mo', features: BFLicensing.TIERS.business.features }
    ];
    html += '<div class="plan-grid">';
    plans.forEach(function(plan) {
      html += '<div class="plan-card ' + (tier === plan.id ? 'plan-current' : '') + '">';
      html += '<div class="plan-name">' + esc(plan.name) + '</div>';
      html += '<div class="plan-price">' + esc(plan.price) + '</div>';
      html += '<ul class="plan-features">' + plan.features.map(function(f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
      if (tier !== plan.id) {
        html += '<button class="btn btn-primary btn-block" onclick="App.upgradePlan(\'' + plan.id + '\')">Upgrade to ' + esc(plan.name) + '</button>';
      } else {
        html += '<button class="btn btn-secondary btn-block" disabled>Current plan</button>';
      }
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="card"><div class="card-title">Activate License Key</div>';
    html += '<div class="form-group"><label class="form-label">Key</label><input id="licenseKey" class="form-input" placeholder="BOOTHFLOW-PRO-2026"></div>';
    html += '<button class="btn btn-primary btn-block" onclick="App.activateLicense()">Activate</button>';
    html += '<button class="btn btn-secondary btn-block" onclick="App.deactivateLicense()">Remove License</button></div>';

    html += '</div>';
    return html;
  }

  function renderSettings() {
    var html = '<div class="page"><h2>Settings</h2>';
    html += '<div class="card"><div class="card-title">Data</div>';
    html += '<button class="btn btn-danger btn-block" onclick="App.resetData()">Reset All Data</button>';
    html += '<p class="muted">This clears clients, bookings, quotes, galleries, and license state.</p></div>';
    html += '</div>';
    return html;
  }

  function renderPublicQuote(token) {
    var q = BFState.getQuoteByToken(token);
    var html = '<div class="public-quote">';
    if (!q) {
      html += '<div class="card"><div class="card-title">Quote not found</div><p>This link may be expired or incorrect.</p></div>';
      html += '</div>';
      return html;
    }
    html += '<div class="card"><div class="card-title">Quote for ' + esc(q.clientName || 'Client') + '</div>';
    html += '<div class="quote-meta">' + esc(q.packageName || '') + ' · ' + esc(q.eventDate || '') + '</div>';
    html += '<div class="quote-lines">';
    html += '<div class="quote-line"><span>Package</span><span>' + money(q.subtotal) + '</span></div>';
    if (q.travelFee) html += '<div class="quote-line"><span>Travel</span><span>' + money(q.travelFee) + '</span></div>';
    if (q.discount) html += '<div class="quote-line"><span>Discount</span><span>-' + money(q.discount) + '</span></div>';
    if (q.addons && q.addons.length) {
      q.addons.forEach(function(a) {
        html += '<div class="quote-line"><span>' + esc(a.name) + '</span><span>' + money(a.price) + '</span></div>';
      });
    }
    html += '<div class="quote-line"><span>Subtotal</span><span>' + money(q.subtotal) + '</span></div>';
    html += '<div class="quote-line"><span>Tax</span><span>' + money(q.tax) + '</span></div>';
    html += '<div class="quote-line quote-total"><span>Total</span><span>' + money(q.total) + '</span></div>';
    html += '</div>';
    html += '<button class="btn btn-primary btn-block" onclick="App.convertQuoteToBooking(\'' + q.id + '\')">Convert to Booking</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  return {
    esc: esc,
    money: money,
    toast: showToast,
    openModal: openModal,
    closeModal: closeModal,
    confirm: showConfirm,
    tierBadge: tierBadge,
    formatDateTime: formatDateTime,
    navHtml: navHtml,
    renderLanding: renderLanding,
    renderClients: renderClients,
    renderBookings: renderBookings,
    renderQuotes: renderQuotes,
    renderGallery: renderGallery,
    renderChecklist: renderChecklist,
    renderRebook: renderRebook,
    renderUpgrade: renderUpgrade,
    renderSettings: renderSettings,
    renderPublicQuote: renderPublicQuote
  };
})();
