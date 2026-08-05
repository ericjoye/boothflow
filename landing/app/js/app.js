// app.js — BoothFlow main controller
var App = (function() {
  'use strict';

  var currentRoute = 'landing';
  var routeParam = null;

  function init() {
    parseHash();
    if (!BFState.getState().initialized) {
      BFState.init();
    }
    render();
  }

  function parseHash() {
    var hash = '';
    try { hash = window.location.hash; } catch(e) {}
    if (hash && hash.indexOf('#') === 0) {
      var parts = hash.substring(1).split('/');
      currentRoute = parts[0] || 'landing';
      routeParam = parts[1] || null;
    } else {
      currentRoute = 'landing';
      routeParam = null;
    }
  }

  function navigateTo(route, param) {
    currentRoute = route;
    routeParam = param || null;
    try {
      window.location.hash = route + (routeParam ? '/' + routeParam : '');
    } catch(e) {}
    render();
  }

  function render() {
    var main = document.getElementById('app-main');
    var navWrap = document.getElementById('app-nav-wrap');
    if (!main) return;
    var tier = BFLicensing.getCurrentTier();
    var showTierBadge = tier !== 'free';

    if (currentRoute === 'landing') {
      main.innerHTML = BFUI.renderLanding();
      if (navWrap) navWrap.innerHTML = '<div class="top-actions"><button class="btn btn-secondary btn-sm" onclick="App.navigateTo(\'app\')">Open App</button></div>';
    } else if (currentRoute === 'public-quote') {
      main.innerHTML = BFUI.renderPublicQuote(routeParam);
      if (navWrap) navWrap.innerHTML = '';
    } else {
      if (navWrap) navWrap.innerHTML = BFUI.navHtml(currentRoute) + '<div class="top-bar">' + BFUI.tierBadge() + '</div>';
      switch (currentRoute) {
        case 'clients': main.innerHTML = renderClientsApp(); break;
        case 'bookings': main.innerHTML = renderBookingsApp(); break;
        case 'quotes': main.innerHTML = renderQuotesApp(); break;
        case 'gallery': main.innerHTML = renderGalleryApp(); break;
        case 'checklist': main.innerHTML = renderChecklistApp(); break;
        case 'rebook': main.innerHTML = renderRebookApp(); break;
        case 'upgrade': main.innerHTML = BFUI.renderUpgrade(); break;
        case 'settings': main.innerHTML = BFUI.renderSettings(); break;
        default: main.innerHTML = BFUI.renderLanding(); currentRoute = 'landing'; break;
      }
    }
  }

  function renderClientsApp() {
    var html = BFUI.renderClients();
    html += BFUI.navHtml('clients');
    return html;
  }

  function renderBookingsApp() {
    var html = BFUI.renderBookings();
    html += BFUI.navHtml('bookings');
    return html;
  }

  function renderQuotesApp() {
    var html = BFUI.renderQuotes();
    html += BFUI.navHtml('quotes');
    return html;
  }

  function renderGalleryApp() {
    var html = BFUI.renderGallery();
    html += BFUI.navHtml('gallery');
    return html;
  }

  function renderChecklistApp() {
    var html = BFUI.renderChecklist();
    html += BFUI.navHtml('checklist');
    return html;
  }

  function renderRebookApp() {
    var html = BFUI.renderRebook();
    html += BFUI.navHtml('rebook');
    return html;
  }

  // ============ CLIENTS ============
  function showAddClient() {
    if (!BFLicensing.canAddClient(BFState.getState().clients.length)) {
      BFUI.toast('Client limit reached. Upgrade to add more.', 'warning');
      return;
    }
    var body = '<label>Name</label><input id="c-name" placeholder="Client name">' +
      '<label>Email</label><input id="c-email" type="email" placeholder="email@example.com">' +
      '<label>Phone</label><input id="c-phone" placeholder="(555) 123-4567">' +
      '<label>Source</label><input id="c-source" placeholder="Instagram / Referral / Facebook">' +
      '<label>Notes</label><textarea id="c-notes" rows="3" placeholder="Event type, budget, timing..."></textarea>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveClient()">Save Client</button>';
    BFUI.openModal('Add Client', body, footer);
  }

  function saveClient() {
    var name = document.getElementById('c-name').value;
    if (!name.trim()) { BFUI.toast('Name is required', 'error'); return; }
    var data = {
      name: name,
      email: document.getElementById('c-email').value,
      phone: document.getElementById('c-phone').value,
      source: document.getElementById('c-source').value,
      notes: document.getElementById('c-notes').value
    };
    BFState.addClient(data);
    BFUI.closeModal();
    BFUI.toast('Client added');
    render();
  }

  function showClientDetail(id) {
    var c = BFState.getClients().find(function(x) { return x.id === id; });
    if (!c) return;
    var body = '<p><strong>Name:</strong> ' + BFUI.esc(c.name) + '</p>' +
      '<p><strong>Email:</strong> ' + BFUI.esc(c.email) + '</p>' +
      '<p><strong>Phone:</strong> ' + BFUI.esc(c.phone) + '</p>' +
      '<p><strong>Source:</strong> ' + BFUI.esc(c.source) + '</p>' +
      '<p><strong>Notes:</strong> ' + BFUI.esc(c.notes) + '</p>' +
      '<p><strong>Added:</strong> ' + BFUI.formatDateTime(c.createdAt) + '</p>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Close</button>' +
      '<button class="btn btn-danger" onclick="App.deleteClient(\'' + id + '\')">Delete</button>';
    BFUI.openModal('Client Detail', body, footer);
  }

  function deleteClient(id) {
    if (!BFUI.confirm('Delete this client?')) return;
    BFState.deleteClient(id);
    BFUI.closeModal();
    BFUI.toast('Client deleted');
    render();
  }

  // ============ BOOKINGS ============
  function showAddBooking() {
    if (!BFLicensing.canAddBooking(BFState.getState().bookings.length)) {
      BFUI.toast('Booking limit reached. Upgrade to continue.', 'warning');
      return;
    }
    var clients = BFState.getClients();
    var packages = BFState.getPackages();
    var operators = BFState.getOperators();
    var clientOptions = clients.map(function(c) { return '<option value="' + c.id + '">' + BFUI.esc(c.name || 'Unnamed') + '</option>'; }).join('');
    var pkgOptions = packages.map(function(p) { return '<option value="' + p.id + '">' + BFUI.esc(p.name) + ' — ' + BFUI.money(p.basePrice) + '</option>'; }).join('');
    var opOptions = operators.map(function(o) { return '<option value="' + o.id + '">' + BFUI.esc(o.name) + '</option>'; }).join('');

    var body = '<label>Client</label><select id="b-clientId"><option value="">--</option>' + clientOptions + '</select>' +
      '<label>Event Name</label><input id="b-clientName" placeholder="Wedding / Corporate / Birthday">' +
      '<label>Event Date</label><input id="b-eventDate" type="date">' +
      '<label>Event Type</label><input id="b-eventType" placeholder="wedding, corporate">' +
      '<label>Venue</label><input id="b-venue" placeholder="Venue name / address">' +
      '<label>Package</label><select id="b-packageId">' + pkgOptions + '</select>' +
      '<label>Operator</label><select id="b-operatorId"><option value="">--</option>' + opOptions + '</select>' +
      '<label>Subtotal ($)</label><input id="b-subtotal" type="number" value="0" oninput="App.recalcBookingCalc()">' +
      '<label>Tax ($)</label><input id="b-tax" type="number" value="0" oninput="App.recalcBookingCalc()">' +
      '<label>Travel Fee ($)</label><input id="b-travel" type="number" value="0" oninput="App.recalcBookingCalc()">' +
      '<label>Discount ($)</label><input id="b-discount" type="number" value="0" oninput="App.recalcBookingCalc()">' +
      '<div class="calc-result"><div class="calc-total" id="booking-total">' + BFUI.money(0) + '</div></div>' +
      '<label>Deposit ($)</label><input id="b-deposit" type="number" value="0">' +
      '<label>Status</label><select id="b-status"><option>inquiry</option><option>booked</option><option>completed</option><option>canceled</option></select>';

    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveBooking()">Save Booking</button>';
    BFUI.openModal('New Booking', body, footer);
  }

  function recalcBookingCalc() {
    var subtotal = parseFloat(document.getElementById('b-subtotal').value || '0', 10);
    var tax = parseFloat(document.getElementById('b-tax').value || '0', 10);
    var travel = parseFloat(document.getElementById('b-travel').value || '0', 10);
    var discount = parseFloat(document.getElementById('b-discount').value || '0', 10);
    var total = Math.max(subtotal + tax + travel - discount, 0);
    var el = document.getElementById('booking-total');
    if (el) el.textContent = BFUI.money(total);
  }

  function saveBooking() {
    var packageId = document.getElementById('b-packageId').value;
    var packages = BFState.getPackages();
    var pkg = packages.find(function(p) { return p.id === packageId; }) || { name: '', basePrice: 0 };
    var subtotal = parseFloat(document.getElementById('b-subtotal').value || '0', 10) || pkg.basePrice || 0;
    var tax = parseFloat(document.getElementById('b-tax').value || '0', 10);
    var travel = parseFloat(document.getElementById('b-travel').value || '0', 10);
    var discount = parseFloat(document.getElementById('b-discount').value || '0', 10);
    var total = Math.max(subtotal + tax + travel - discount, 0);
    var deposit = parseFloat(document.getElementById('b-deposit').value || '0', 10);
    var data = {
      clientId: document.getElementById('b-clientId').value,
      clientName: document.getElementById('b-clientName').value,
      eventDate: document.getElementById('b-eventDate').value,
      eventType: document.getElementById('b-eventType').value,
      venue: document.getElementById('b-venue').value,
      packageId: packageId,
      packageName: pkg.name,
      operatorId: document.getElementById('b-operatorId').value,
      subtotal: subtotal,
      tax: tax,
      travelFee: travel,
      discount: discount,
      total: total,
      deposit: deposit,
      balance: Math.max(total - deposit, 0),
      status: document.getElementById('b-status').value
    };
    if (!data.clientName.trim()) { BFUI.toast('Event name is required', 'error'); return; }
    BFState.addBooking(data);
    BFUI.closeModal();
    BFUI.toast('Booking saved');
    render();
  }

  function showBookingDetail(id) {
    var b = BFState.getBookings().find(function(x) { return x.id === id; });
    if (!b) return;
    var body = '<p><strong>Client:</strong> ' + BFUI.esc(b.clientName) + '</p>' +
      '<p><strong>Date:</strong> ' + BFUI.esc(b.eventDate) + '</p>' +
      '<p><strong>Type:</strong> ' + BFUI.esc(b.eventType) + '</p>' +
      '<p><strong>Venue:</strong> ' + BFUI.esc(b.venue) + '</p>' +
      '<p><strong>Package:</strong> ' + BFUI.esc(b.packageName) + '</p>' +
      '<p><strong>Total:</strong> ' + BFUI.money(b.total) + '</p>' +
      '<p><strong>Deposit:</strong> ' + BFUI.money(b.deposit) + '</p>' +
      '<p><strong>Balance:</strong> ' + BFUI.money(b.balance) + '</p>' +
      '<p><strong>Status:</strong> ' + BFUI.esc(b.status) + '</p>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Close</button>' +
      '<button class="btn btn-success" onclick="App.createGalleryFromBooking(\'' + id + '\')">Create Gallery</button>' +
      '<button class="btn btn-danger" onclick="App.deleteBooking(\'' + id + '\')">Delete</button>';
    BFUI.openModal('Booking Detail', body, footer);
  }

  function deleteBooking(id) {
    if (!BFUI.confirm('Delete this booking?')) return;
    BFState.deleteBooking(id);
    BFUI.closeModal();
    BFUI.toast('Booking deleted');
    render();
  }

  // ============ QUOTES ============
  function showAddQuote() {
    if (!BFLicensing.hasFeature('instant_quote')) {
      BFUI.toast('Upgrade to Pro for the instant quote builder.', 'warning');
      return;
    }
    var packages = BFState.getPackages();
    var pkgOptions = packages.map(function(p) { return '<option value="' + p.id + '" data-base="' + p.basePrice + '" data-hours="' + p.hours + '">' + BFUI.esc(p.name) + '</option>'; }).join('');
    var body = '<label>Client</label><input id="q-clientName" placeholder="Client name">' +
      '<label>Email</label><input id="q-email" type="email" placeholder="client@example.com">' +
      '<label>Event Date</label><input id="q-eventDate" type="date">' +
      '<label>Event Type</label><input id="q-eventType" placeholder="wedding, corporate">' +
      '<label>Package</label><select id="q-packageId" onchange="App.recalcQuoteCalc()">' + pkgOptions + '</select>' +
      '<label>Hours</label><input id="q-hours" type="number" min="0" step="1" value="4" oninput="App.recalcQuoteCalc()">' +
      '<label>Travel Fee ($)</label><input id="q-travel" type="number" min="0" step="1" value="0" oninput="App.recalcQuoteCalc()">' +
      '<label>Discount ($)</label><input id="q-discount" type="number" min="0" step="1" value="0" oninput="App.recalcQuoteCalc()">' +
      '<label class="form-label">Add-ons</label>' +
      '<label class="chip"><input type="checkbox" value="150" onchange="App.recalcQuoteCalc()" data-addon="2x2 Prints + 1 strip"> 2x2 Prints + 1 strip — $150</label>' +
      '<label class="chip"><input type="checkbox" value="220" onchange="App.recalcQuoteCalc()" data-addon="Framed photo print"> Framed photo print — $220</label>' +
      '<label class="chip"><input type="checkbox" value="180" onchange="App.recalcQuoteCalc()" data-addon="Guest book compilation"> Guest book compilation — $180</label>' +
      '<label class="chip"><input type="checkbox" value="120" onchange="App.recalcQuoteCalc()" data-addon="Custom backdrop"> Custom backdrop — $120</label>' +
      '<label class="chip"><input type="checkbox" value="200" onchange="App.recalcQuoteCalc()" data-addon="Attendant service"> Attendant service — $200</label>' +
      '<div id="addon-list"></div>' +
      '<div class="calc-result"><div class="calc-total" id="quote-total">' + BFUI.money(0) + '</div></div>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveQuote()">Save Quote</button>';
    BFUI.openModal('New Quote', body, footer);
  }

  function recalcCalc() {
    recalcQuoteCalc();
    recalcPublicCalc();
  }

  function recalcQuoteCalc() {
    var pkgEl = document.getElementById('q-packageId');
    var base = pkgEl ? (parseFloat(pkgEl.options[pkgEl.selectedIndex].getAttribute('data-base')) || 0) : 0;
    var hours = parseFloat(document.getElementById('q-hours').value || '1', 10);
    var rate = hours > 0 ? base / (pkgEl ? parseFloat(pkgEl.options[pkgEl.selectedIndex].getAttribute('data-hours')) || 1 : 1) : base;
    var subtotal = Math.max(base + rate * Math.max(hours - (pkgEl ? parseFloat(pkgEl.options[pkgEl.selectedIndex].getAttribute('data-hours')) || hours : 0), 0), 0);
    var travel = parseFloat(document.getElementById('q-travel').value || '0', 10);
    var discount = parseFloat(document.getElementById('q-discount').value || '0', 10);
    var addons = [];
    document.querySelectorAll('#addon-list input[type=checkbox]').forEach(function(cb) {
      if (cb.checked) addons.push({ name: cb.getAttribute('data-addon'), price: parseFloat(cb.value) });
    });
    var addonTotal = addons.reduce(function(sum, a) { return sum + (a.price || 0); }, 0);
    var tax = 0; // leave tax manual for quote
    var total = Math.max(subtotal + addonTotal + travel - discount, 0);
    var el = document.getElementById('quote-total');
    if (el) el.textContent = BFUI.money(total);
  }

  function recalcPublicCalc() {
    var pkgEl = document.getElementById('calc-package');
    var base = pkgEl ? (parseFloat(pkgEl.options[pkgEl.selectedIndex].getAttribute('data-base')) || 0) : 0;
    var includedHours = pkgEl ? (parseFloat(pkgEl.options[pkgEl.selectedIndex].getAttribute('data-hours')) || 1) : 1;
    var extraHours = parseFloat(document.getElementById('calc-hours').value || '0', 10);
    var hourly = includedHours > 0 ? base / includedHours : base;
    var subtotal = Math.max(base + hourly * Math.max(extraHours, 0), 0);
    var travel = parseFloat(document.getElementById('calc-travel').value || '0', 10);
    var discount = parseFloat(document.getElementById('calc-discount').value || '0', 10);
    var addons = [];
    document.querySelectorAll('.calculator input[type=checkbox]').forEach(function(cb) {
      if (cb.checked) addons.push({ name: cb.getAttribute('data-addon'), price: parseFloat(cb.value) });
    });
    var addonTotal = addons.reduce(function(sum, a) { return sum + (a.price || 0); }, 0);
    var total = Math.max(subtotal + addonTotal + travel - discount, 0);
    var el = document.getElementById('calc-total');
    if (el) el.textContent = BFUI.money(total);
  }

  function saveQuote() {
    var packageId = document.getElementById('q-packageId').value;
    var packages = BFState.getPackages();
    var pkg = packages.find(function(p) { return p.id === packageId; }) || { name: '', basePrice: 0 };
    var hours = parseFloat(document.getElementById('q-hours').value || '0', 10);
    var travel = parseFloat(document.getElementById('q-travel').value || '0', 10);
    var discount = parseFloat(document.getElementById('q-discount').value || '0', 10);
    var addons = [];
    document.querySelectorAll('#addon-list input[type=checkbox]').forEach(function(cb) {
      if (cb.checked) addons.push({ name: cb.getAttribute('data-addon'), price: parseFloat(cb.value) });
    });
    var subtotal = parseFloat(pkg.basePrice || 0);
    var tax = 0;
    var total = Math.max(subtotal + travel + addons.reduce(function(s,a){return s+(a.price||0);},0) - discount, 0);
    var data = {
      clientName: document.getElementById('q-clientName').value,
      email: document.getElementById('q-email').value,
      eventDate: document.getElementById('q-eventDate').value,
      eventType: document.getElementById('q-eventType').value,
      packageId: packageId,
      packageName: pkg.name,
      hours: hours,
      boothType: pkg.boothType || '',
      addons: addons,
      subtotal: subtotal,
      tax: tax,
      total: total,
      travelFee: travel,
      discount: discount,
      status: 'draft'
    };
    if (!data.clientName.trim()) { BFUI.toast('Client name is required', 'error'); return; }
    var q = BFState.createQuote(data);
    BFUI.closeModal();
    BFUI.toast('Quote created. Share link copied.', 'success');
    copyText(window.location.origin + window.location.pathname + '#public-quote/' + q.token);
    render();
  }

  function showQuoteDetail(id) {
    var q = BFState.getQuotes().find(function(x) { return x.id === id; });
    if (!q) return;
    var body = '<p><strong>Client:</strong> ' + BFUI.esc(q.clientName) + '</p>' +
      '<p><strong>Email:</strong> ' + BFUI.esc(q.email) + '</p>' +
      '<p><strong>Event:</strong> ' + BFUI.esc(q.eventDate) + ' · ' + BFUI.esc(q.eventType) + '</p>' +
      '<p><strong>Package:</strong> ' + BFUI.esc(q.packageName) + '</p>' +
      '<p><strong>Total:</strong> ' + BFUI.money(q.total) + '</p>' +
      '<p><strong>Share:</strong> <code>' + BFUI.esc(window.location.origin + window.location.pathname + '#public-quote/' + q.token) + '</code></p>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Close</button>' +
      '<button class="btn btn-primary" onclick="App.convertQuoteToBooking(\'' + q.id + '\')">Convert to Booking</button>';
    BFUI.openModal('Quote Detail', body, footer);
  }

  function convertQuoteToBooking(quoteId) {
    var q = BFState.getQuotes().find(function(x) { return x.id === quoteId; });
    if (!q) return;
    var booking = {
      clientId: '',
      clientName: q.clientName,
      eventDate: q.eventDate,
      eventType: q.eventType,
      venue: '',
      packageId: q.packageId,
      packageName: q.packageName,
      operatorId: '',
      subtotal: q.subtotal,
      tax: q.tax,
      travelFee: q.travelFee || 0,
      discount: q.discount || 0,
      total: q.total,
      deposit: 0,
      balance: q.total,
      status: 'booked',
      sourceQuoteId: q.id
    };
    BFState.addBooking(booking);
    BFUI.toast('Converted to booking');
    BFUI.closeModal();
    navigateTo('bookings');
  }

  function submitLead() {
    var email = document.getElementById('calc-email').value;
    if (!email.trim()) { BFUI.toast('Enter your email to receive the quote.', 'warning'); return; }
    BFUI.toast('Thanks! We\'ll send your exact quote + pricing tips.', 'success');
    document.getElementById('calc-email').value = '';
  }

  // ============ GALLERY ============
  function showAddGallery() {
    if (!BFLicensing.canAddGallery(BFState.getState().galleries.length)) {
      BFUI.toast('Gallery limit reached. Upgrade for unlimited galleries.', 'warning');
      return;
    }
    var bookings = BFState.getBookings();
    var bookingOptions = bookings.map(function(b) { return '<option value="' + b.id + '">' + BFUI.esc(b.clientName || 'Unnamed') + '</option>'; }).join('');
    var body = '<label>Title</label><input id="g-title" placeholder="Wedding photos / Gallery name">' +
      '<label>Booking</label><select id="g-bookingId"><option value="">--</option>' + bookingOptions + '</select>' +
      '<label>Photo URL</label><input id="g-photo" placeholder="https://example.com/photo.jpg">' +
      '<p class="muted">Paste URLs one at a time. For real uploads, attach your own storage links.</p>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveGallery()">Save Gallery</button>';
    BFUI.openModal('New Gallery', body, footer);
  }

  function saveGallery() {
    var title = document.getElementById('g-title').value;
    var photo = document.getElementById('g-photo').value;
    var data = {
      bookingId: document.getElementById('g-bookingId').value,
      title: title || 'Untitled Gallery',
      photos: photo ? [photo] : [],
      coverPhoto: photo || ''
    };
    var g = BFState.createGallery(data);
    BFUI.closeModal();
    BFUI.toast('Gallery created. Link copied.', 'success');
    copyText(window.location.origin + window.location.pathname + '#public-gallery/' + g.token);
    render();
  }

  function showGalleryDetail(id) {
    var g = BFState.getGalleries().find(function(x) { return x.id === id; });
    if (!g) return;
    var body = '<p><strong>Title:</strong> ' + BFUI.esc(g.title) + '</p>' +
      '<p><strong>Photos:</strong> ' + (g.photos ? g.photos.length : 0) + '</p>' +
      '<p><strong>Follow-up sent:</strong> ' + (g.followUpSent ? 'Yes' : 'No') + '</p>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Close</button>' +
      '<button class="btn btn-primary" onclick="App.sendFollowUp(\'' + id + '\')">Send Follow-Up</button>';
    BFUI.openModal('Gallery Detail', body, footer);
  }

  function sendFollowUp(id) {
    var g = BFState.getGalleries().find(function(x) { return x.id === id; });
    if (!g) return;
    BFState.updateGallery(id, { followUpSent: true, followUpSentAt: BFU.todayISO() });
    BFUI.closeModal();
    BFUI.toast('Follow-up prompt queued for ' + BFUI.esc(g.title), 'success');
    render();
  }

  // ============ CHECKLIST ============
  function showAddChecklist() {
    if (!BFLicensing.hasFeature('event_checklist')) {
      BFUI.toast('Upgrade to Pro for event checklists.', 'warning');
      return;
    }
    var body = '<label>Name</label><input id="cl-name" placeholder="Wedding day checklist">' +
      '<label>Event type</label><input id="cl-eventType" placeholder="wedding, corporate">' +
      '<label>Items</label><textarea id="cl-items" rows="4" placeholder="One item per line"></textarea>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveChecklist()">Save Checklist</button>';
    BFUI.openModal('New Checklist', body, footer);
  }

  function saveChecklist() {
    var name = document.getElementById('cl-name').value;
    var raw = document.getElementById('cl-items').value;
    if (!name.trim()) { BFUI.toast('Name is required', 'error'); return; }
    var items = raw.split(/\n/).filter(Boolean).map(function(line, idx) { return { id: BFU.uid(), text: line.trim(), done: false }; });
    BFState.addChecklist({ name: name, eventType: document.getElementById('cl-eventType').value, items: items });
    BFUI.closeModal();
    BFUI.toast('Checklist saved');
    render();
  }

  function showChecklistDetail(id) {
    var list = BFState.getChecklists().find(function(x) { return x.id === id; });
    if (!list) return;
    var body = '<div class="checklist-items">' + list.items.map(function(item) {
      return '<label class="chip"><input type="checkbox" ' + (item.done ? 'checked' : '') + ' onchange="App.toggleChecklistItem(\'' + id + '\',\'' + item.id + '\', this.checked)"> ' + BFUI.esc(item.text) + '</label>';
    }).join('') + '</div>';
    BFUI.openModal(list.name, body);
  }

  function toggleChecklistItem(checklistId, itemId, done) {
    BFState.toggleChecklistItem(checklistId, itemId, done);
  }

  // ============ REBOOKING ============
  function showAddRebook() {
    if (!BFLicensing.hasFeature('rebooking_engine')) {
      BFUI.toast('Upgrade to Business for the rebooking engine.', 'warning');
      return;
    }
    var body = '<label>Client</label><input id="r-clientName" placeholder="Client name">' +
      '<label>Original Event Date</label><input id="r-originalEventDate" type="date">' +
      '<label>Suggested Date</label><input id="r-suggestedDate" type="date">' +
      '<label>Note</label><textarea id="r-note" rows="3" placeholder="Anniversary / birthday / corporate holiday"></textarea>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Cancel</button>' +
      '<button class="btn btn-primary" onclick="App.saveRebook()">Save Prompt</button>';
    BFUI.openModal('New Rebooking Prompt', body, footer);
  }

  function saveRebook() {
    var clientName = document.getElementById('r-clientName').value;
    if (!clientName.trim()) { BFUI.toast('Client name is required', 'error'); return; }
    BFState.addRebookPrompt({
      clientName: clientName,
      originalEventDate: document.getElementById('r-originalEventDate').value,
      suggestedDate: document.getElementById('r-suggestedDate').value,
      note: document.getElementById('r-note').value,
      status: 'pending'
    });
    BFUI.closeModal();
    BFUI.toast('Rebooking prompt saved');
    render();
  }

  function showRebookDetail(id) {
    var r = BFState.getRebookPrompts().find(function(x) { return x.id === id; });
    if (!r) return;
    var body = '<p><strong>Client:</strong> ' + BFUI.esc(r.clientName) + '</p>' +
      '<p><strong>Original:</strong> ' + BFUI.esc(r.originalEventDate) + '</p>' +
      '<p><strong>Suggested:</strong> ' + BFUI.esc(r.suggestedDate) + '</p>' +
      '<p><strong>Note:</strong> ' + BFUI.esc(r.note) + '</p>' +
      '<label>Status</label><select id="r-status"><option>pending</option><option>contacted</option><option>booked</option><option>lost</option></select>';
    var footer = '<button class="btn btn-secondary" onclick="BFUI.closeModal()">Close</button>' +
      '<button class="btn btn-primary" onclick="App.saveRebookStatus(\'' + id + '\')">Save Status</button>';
    BFUI.openModal('Rebooking Detail', body, footer);
  }

  function saveRebookStatus(id) {
    var status = document.getElementById('r-status').value;
    BFState.updateRebookPrompt(id, { status: status });
    BFUI.closeModal();
    BFUI.toast('Rebooking status updated');
    render();
  }

  // ============ UPGRADE / LICENSE ============
  function upgradePlan(tierId) {
    BFLicensing.handleCheckout(tierId);
  }

  function activateLicense() {
    var key = document.getElementById('licenseKey').value;
    var result = BFLicensing.activateKey(key);
    if (result.success) {
      BFUI.toast(result.message, 'success');
    } else {
      BFUI.toast(result.message, 'error');
    }
    render();
  }

  function deactivateLicense() {
    BFLicensing.downgradeToFree();
    BFUI.toast('License removed. Free tier active.', 'info');
    render();
  }

  function resetData() {
    if (!BFUI.confirm('Reset all BoothFlow data? This cannot be undone.')) return;
    BFState.reset();
    BFLicensing.downgradeToFree();
    BFUI.toast('Data reset');
    render();
  }

  function createGalleryFromBooking(bookingId) {
    var bookings = BFState.getBookings();
    var b = bookings.find(function(x) { return x.id === bookingId; });
    if (!b) return;
    var g = BFState.createGallery({
      bookingId: b.id,
      title: (b.clientName || 'Event') + ' gallery',
      photos: [],
      coverPhoto: ''
    });
    BFUI.closeModal();
    BFUI.toast('Gallery created. Share link copied.', 'success');
    copyText(window.location.origin + window.location.pathname + '#public-gallery/' + g.token);
    render();
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function() {});
    }
  }

  window.addEventListener('hashchange', init);

  return {
    init: init,
    navigateTo: navigateTo,
    render: render,
    recalcCalc: recalcCalc,
    submitLead: submitLead,
    showAddClient: showAddClient,
    saveClient: saveClient,
    showClientDetail: showClientDetail,
    deleteClient: deleteClient,
    showAddBooking: showAddBooking,
    recalcBookingCalc: recalcBookingCalc,
    saveBooking: saveBooking,
    showBookingDetail: showBookingDetail,
    deleteBooking: deleteBooking,
    showAddQuote: showAddQuote,
    recalcQuoteCalc: recalcQuoteCalc,
    saveQuote: saveQuote,
    showQuoteDetail: showQuoteDetail,
    convertQuoteToBooking: convertQuoteToBooking,
    showAddGallery: showAddGallery,
    saveGallery: saveGallery,
    showGalleryDetail: showGalleryDetail,
    sendFollowUp: sendFollowUp,
    createGalleryFromBooking: createGalleryFromBooking,
    showAddChecklist: showAddChecklist,
    saveChecklist: saveChecklist,
    showChecklistDetail: showChecklistDetail,
    toggleChecklistItem: toggleChecklistItem,
    showAddRebook: showAddRebook,
    saveRebook: saveRebook,
    showRebookDetail: showRebookDetail,
    saveRebookStatus: saveRebookStatus,
    upgradePlan: upgradePlan,
    activateLicense: activateLicense,
    deactivateLicense: deactivateLicense,
    resetData: resetData
  };
})();
