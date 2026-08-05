// state.js — localStorage persistence and CRUD for BoothFlow
var BFState = (function() {
  'use strict';

  var KEY = 'boothflow_state_v1';

  var _store = null;

  function defaults() {
    return {
      initialized: false,
      clients: [],
      bookings: [],
      quotes: [],
      galleries: [],
      checklists: [],
      rebookPrompts: [],
      operators: [],
      packages: []
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        var def = defaults();
        Object.keys(def).forEach(function(k) {
          if (!(k in parsed)) parsed[k] = def[k];
        });
        return parsed;
      }
    } catch (e) {}
    return defaults();
  }

  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function init() {
    if (!_store) {
      _store = load();
      if (!_store.initialized) {
        seed();
        _store.initialized = true;
        save(_store);
      }
    }
  }

  function seed() {
    var s = _store || defaults();
    s.packages = [
      { id: 'pkg_wedding', name: 'Wedding 4-Hour', hours: 4, basePrice: 1200, boothType: 'enclosed', includes: 'Booth, attendant, 2x2 prints' },
      { id: 'pkg_corporate', name: 'Corporate Event', hours: 4, basePrice: 900, boothType: 'open', includes: 'Selfie station, branded backdrop' },
      { id: 'pkg_360', name: '360 Spin Experience', hours: 3, basePrice: 1400, boothType: '360', includes: '360 booth, instant video share' }
    ];
    s.operators = [
      { id: 'op_1', name: 'Alex', color: '#0ea5e9' },
      { id: 'op_2', name: 'Jordan', color: '#10b981' }
    ];
    s.checklists = [
      { id: BFU.uid(), name: 'Default Event Checklist', eventType: 'default', items: [
        { id: BFU.uid(), text: 'Confirm booth load-in time', done: false },
        { id: BFU.uid(), text: 'Print client contract', done: false },
        { id: BFU.uid(), text: 'Pack backdrop, stand, tape', done: false },
        { id: BFU.uid(), text: 'Charge camera/printer batteries', done: false },
        { id: BFU.uid(), text: 'Bring power strips and adapter', done: false }
      ]},
      { id: BFU.uid(), name: 'Wedding Checklist', eventType: 'wedding', items: [
        { id: BFU.uid(), text: 'Confirm ceremony end time with planner', done: false },
        { id: BFU.uid(), text: 'Bring guest book template', done: false },
        { id: BFU.uid(), text: 'Pack extra dress tape', done: false }
      ]}
    ];
    save(s);
    _store = s;
  }

  function getState() { init(); return _store; }
  function persist() { save(_store); }

  function reset() {
    _store = defaults();
    seed();
    try { localStorage.removeItem('boothflow_license_v1'); } catch (e) {}
    persist();
  }

  // Clients
  function addClient(data) {
    init();
    var c = {
      id: BFU.uid(),
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      source: data.source || '',
      notes: data.notes || '',
      createdAt: BFU.todayISO()
    };
    _store.clients.push(c);
    persist();
    return c;
  }

  function updateClient(id, data) {
    init();
    var list = _store.clients;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function deleteClient(id) {
    init();
    _store.clients = _store.clients.filter(function(c) { return c.id !== id; });
    persist();
  }

  function getClients() { init(); return _store.clients.slice(); }

  // Bookings
  function addBooking(data) {
    init();
    var b = {
      id: BFU.uid(),
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      eventDate: data.eventDate || '',
      eventType: data.eventType || '',
      venue: data.venue || '',
      packageId: data.packageId || '',
      packageName: data.packageName || '',
      operatorId: data.operatorId || '',
      addons: data.addons || [],
      subtotal: parseFloat(data.subtotal || 0),
      tax: parseFloat(data.tax || 0),
      total: parseFloat(data.total || 0),
      deposit: parseFloat(data.deposit || 0),
      balance: ('balance' in data ? parseFloat(data.balance) : Math.max(parseFloat(data.total || 0) - parseFloat(data.deposit || 0), 0)),
      status: data.status || 'inquiry',
      sourceQuoteId: data.sourceQuoteId || '',
      createdAt: BFU.todayISO()
    };
    _store.bookings.push(b);
    persist();
    return b;
  }

  function updateBooking(id, data) {
    init();
    var list = _store.bookings;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function deleteBooking(id) {
    init();
    _store.bookings = _store.bookings.filter(function(b) { return b.id !== id; });
    persist();
  }

  function getBookings() { init(); return _store.bookings.slice(); }

  // Quotes
  function createQuote(data) {
    init();
    var q = {
      id: BFU.uid(),
      clientName: data.clientName || '',
      email: data.email || '',
      eventDate: data.eventDate || '',
      eventType: data.eventType || '',
      packageId: data.packageId || '',
      packageName: data.packageName || '',
      hours: parseFloat(data.hours || 0),
      boothType: data.boothType || '',
      addons: data.addons || [],
      subtotal: parseFloat(data.subtotal || 0),
      tax: parseFloat(data.tax || 0),
      total: parseFloat(data.total || 0),
      travelFee: parseFloat(data.travelFee || 0),
      discount: parseFloat(data.discount || 0),
      status: data.status || 'draft',
      token: BFU.uid(),
      createdAt: BFU.todayISO()
    };
    _store.quotes.push(q);
    persist();
    return q;
  }

  function updateQuote(id, data) {
    init();
    var list = _store.quotes;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function getQuoteByToken(token) {
    init();
    var list = _store.quotes;
    for (var i = 0; i < list.length; i++) {
      if (list[i].token === token) return list[i];
    }
    return null;
  }

  function getQuotes() { init(); return _store.quotes.slice(); }

  // Galleries
  function createGallery(data) {
    init();
    var g = {
      id: BFU.uid(),
      bookingId: data.bookingId || '',
      title: data.title || '',
      photos: data.photos || [],
      coverPhoto: data.coverPhoto || '',
      token: BFU.uid(),
      followUpSent: false,
      followUpSentAt: null,
      createdAt: BFU.todayISO()
    };
    _store.galleries.push(g);
    persist();
    return g;
  }

  function updateGallery(id, data) {
    init();
    var list = _store.galleries;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function getGalleries() { init(); return _store.galleries.slice(); }

  function getGalleryByToken(token) {
    init();
    var list = _store.galleries;
    for (var i = 0; i < list.length; i++) {
      if (list[i].token === token) return list[i];
    }
    return null;
  }

  // Checklists
  function addChecklist(data) {
    init();
    var c = {
      id: BFU.uid(),
      name: data.name || '',
      eventType: data.eventType || 'default',
      items: (data.items || []).map(function(item) {
        return { id: item.id || BFU.uid(), text: item.text || '', done: !!item.done };
      }),
      createdAt: BFU.todayISO()
    };
    _store.checklists.push(c);
    persist();
    return c;
  }

  function updateChecklist(id, data) {
    init();
    var list = _store.checklists;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function toggleChecklistItem(checklistId, itemId, done) {
    init();
    var list = _store.checklists;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === checklistId) {
        var items = list[i].items;
        for (var j = 0; j < items.length; j++) {
          if (items[j].id === itemId) {
            items[j].done = done;
            persist();
            return true;
          }
        }
      }
    }
    return false;
  }

  function getChecklists() { init(); return _store.checklists.slice(); }

  // Rebooking prompts
  function addRebookPrompt(data) {
    init();
    var r = {
      id: BFU.uid(),
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      originalEventDate: data.originalEventDate || '',
      suggestedDate: data.suggestedDate || '',
      note: data.note || '',
      status: data.status || 'pending',
      createdAt: BFU.todayISO()
    };
    _store.rebookPrompts.push(r);
    persist();
    return r;
  }

  function updateRebookPrompt(id, data) {
    init();
    var list = _store.rebookPrompts;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        Object.keys(data).forEach(function(k) { list[i][k] = data[k]; });
        persist();
        return list[i];
      }
    }
    return null;
  }

  function getRebookPrompts() { init(); return _store.rebookPrompts.slice(); }

  // Packages/operators
  function getPackages() { init(); return _store.packages.slice(); }
  function getOperators() { init(); return _store.operators.slice(); }

  return {
    init: init,
    getState: getState,
    reset: reset,
    addClient: addClient,
    updateClient: updateClient,
    deleteClient: deleteClient,
    getClients: getClients,
    addBooking: addBooking,
    updateBooking: updateBooking,
    deleteBooking: deleteBooking,
    getBookings: getBookings,
    createQuote: createQuote,
    updateQuote: updateQuote,
    getQuoteByToken: getQuoteByToken,
    getQuotes: getQuotes,
    createGallery: createGallery,
    updateGallery: updateGallery,
    getGalleries: getGalleries,
    getGalleryByToken: getGalleryByToken,
    addChecklist: addChecklist,
    updateChecklist: updateChecklist,
    toggleChecklistItem: toggleChecklistItem,
    getChecklists: getChecklists,
    addRebookPrompt: addRebookPrompt,
    updateRebookPrompt: updateRebookPrompt,
    getRebookPrompts: getRebookPrompts,
    getPackages: getPackages,
    getOperators: getOperators
  };
})();
