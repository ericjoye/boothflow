/**
 * BoothFlow - smoke tests via Node vm sandbox
 * Run: node tests/smoke.js
 */
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var passed = 0, failed = 0;
function assert(cond, msg) { if (cond) passed++; else { failed++; console.log('  FAIL: ' + msg); } }
function assertEqual(a, b, msg) { assert(a === b, msg + ' (expected ' + JSON.stringify(b) + ', got ' + JSON.stringify(a) + ')'); }
function assertTrue(actual, message) { assert(actual === true, message + ' (got ' + JSON.stringify(actual) + ')'); }
function assertFalse(actual, message) { assert(actual === false, message + ' (got ' + JSON.stringify(actual) + ')'); }
function test(name, fn) {
  try { fn(); console.log('  PASS: ' + name); }
  catch(e) { failed++; console.log('  FAIL: ' + name + ' - ' + e.message); }
}

function createSandbox() {
  var store = {};
  var mockEl = {
    value: '', textContent: '', innerHTML: '', style: {}, options: [],
    appendChild: function(){}, setAttribute: function(){},
    getContext: function(){ return null; },
    getBoundingClientRect: function(){ return { width: 100, height: 40, left: 0, top: 0 }; },
    toDataURL: function(){ return 'data:image/png;base64,test'; },
    click: function(){}, addEventListener: function(){}, removeEventListener: function(){},
    focus: function(){}, classList: { add: function(){}, remove: function(){} },
    querySelector: function(){ return null; },
    querySelectorAll: function(){ return { forEach: function(){} }; },
    firstChild: null, parentNode: null, remove: function(){}
  };
  var elementsById = {};
  var doc = {
    getElementById: function(id) {
      if (!elementsById[id]) elementsById[id] = Object.assign({}, mockEl, { value: '' });
      return elementsById[id];
    },
    querySelector: function(){ return Object.assign({}, mockEl, { value: '' }); },
    querySelectorAll: function(){ return { forEach: function(){} }; },
    createElement: function(tag) { return Object.assign({}, mockEl, { tagName: tag, options: [] }); },
    addEventListener: function(){}, removeEventListener: function(){},
    readyState: 'complete', body: { appendChild: function(){}, innerHTML: '' }
  };
  return {
    document: doc,
    localStorage: {
      getItem: function(k){ return store[k] || null; },
      setItem: function(k,v){ store[k] = String(v); },
      removeItem: function(k){ delete store[k]; },
      clear: function(){ store = {}; }
    },
    setTimeout: function(){ return 0; }, setInterval: function(){ return 0; },
    clearTimeout: function(){}, confirm: function(){ return true; }, alert: function(){},
    open: function(){}, location: { hash: '', reload: function(){} }, scrollTo: function(){},
    URL: { createObjectURL: function(){ return 'blob:test'; }, revokeObjectURL: function(){} },
    Math: Math, JSON: JSON, Date: Date, Object: Object, Array: Array,
 String: String, Number: Number, Boolean: Boolean, isNaN: isNaN,
 parseInt: parseInt, parseFloat: parseFloat,
 navigator: { clipboard: { writeText: function(){} } },
 window: sandbox,
 addEventListener: function(){}, removeEventListener: function(){}
 };
}

var sandbox = createSandbox();
sandbox.window = sandbox;
var ctx = vm.createContext(sandbox);

function load(file) {
  var code = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  code = code.replace(/\bconst\b/g, 'var');
  vm.runInContext(code, ctx, { filename: path.basename(file) });
}

load('js/utils.js');
load('js/state.js');
load('js/licensing.js');
load('js/ui.js');
load('js/app.js');

var utils = sandbox.BFU;
var state = sandbox.BFState;
var licensing = sandbox.BFLicensing;
var ui = sandbox.BFUI;

console.log('\n=== BoothFlow v0.1 — Smoke Tests ===\n');

test('Utils module loaded', function() { assertTrue(!!utils, 'BFU should be defined'); });
test('State module loaded', function() { assertTrue(!!state, 'BFState should be defined'); });
test('Licensing module loaded', function() { assertTrue(!!licensing, 'BFLicensing should be defined'); });
test('UI module loaded', function() { assertTrue(!!ui, 'BFUI should be defined'); });
test('App module loaded', function() { assertTrue(!!sandbox.App, 'App should be defined'); });

test('Default tier is free', function() {
  state.reset();
  assertEqual(licensing.getCurrentTier(), 'free', 'Default tier should be free');
});

test('Can add client up to free limit', function() {
  state.reset();
  assertTrue(licensing.canAddClient(0), 'Should allow first client');
  assertTrue(licensing.canAddClient(2), 'Should allow third client');
  assertFalse(licensing.canAddClient(3), 'Should block fourth client on free');
});

test('Invalid license rejected', function() {
  state.reset();
  var result = licensing.activateKey('FAKE-KEY');
  assertFalse(result.success, 'Invalid key should fail');
  assertEqual(licensing.getCurrentTier(), 'free', 'Tier should remain free');
});

test('License activation upgrades tier', function() {
  state.reset();
  var result = licensing.activateKey('BOOTHFLOW-PRO-2026');
  assertTrue(result.success, 'Pro activation should succeed');
  assertEqual(state.getState().clients.length, 0, 'State should persist after activation');
  assertEqual(licensing.getCurrentTier(), 'pro', 'Tier should be pro');
});

test('Clients CRUD', function() {
  state.reset();
  var c = state.addClient({ name: 'Test Bride', email: 'bride@example.com' });
  assertTrue(!!c.id, 'Client should have id');
  assertEqual(c.name, 'Test Bride', 'Name should match');
  assertEqual(state.getClients().length, 1, 'Should have 1 client');
});

test('Bookings CRUD', function() {
  state.reset();
  var b = state.addBooking({ clientName: 'Wedding Test', eventDate: '2026-09-20', packageName: 'Wedding 4-Hour', total: 1500, deposit: 500 });
  assertTrue(!!b.id, 'Booking should have id');
  assertEqual(b.balance, 1000, 'Balance should equal total minus deposit');
  assertEqual(state.getBookings().length, 1, 'Should have 1 booking');
});

test('Quotes + share tokens', function() {
  state.reset();
  var q = state.createQuote({ clientName: 'Quote Test', packageName: '360 Spin', total: 1600, travelFee: 100, discount: 50, addons: [{name:'Prints', price:150}] });
  assertTrue(!!q.token, 'Quote should have token');
  var byToken = state.getQuoteByToken(q.token);
  assertTrue(!!byToken, 'Should find quote by token');
  assertEqual(byToken.total, 1600, 'Found quote should match stored total');
});

test('Gallery with follow-up flag', function() {
  state.reset();
  var g = state.createGallery({ title: 'Wedding Gallery', photos: ['https://example.com/1.jpg'] });
  assertTrue(!!g.token, 'Gallery should have token');
  assertFalse(g.followUpSent, 'Follow-up should not be sent initially');
  state.updateGallery(g.id, { followUpSent: true, followUpSentAt: '2026-07-02' });
  var updated = state.getGalleries()[0];
  assertTrue(updated.followUpSent, 'Follow-up should be sent after update');
});

test('Checklist item toggle persists', function() {
  state.reset();
  var list = state.addChecklist({ name: 'Test', eventType: 'wedding', items: [
    { text: 'Pack tape', done: false },
    { text: 'Bring adapter', done: false }
  ] });
  assertEqual(list.items.length, 2, 'Should start with 2 items');
  assertFalse(list.items[0].done, 'First item should start undone');
  var itemId = list.items[0].id;
  var found = state.getChecklists().find(function(x) { return x.id === list.id; });
  assertTrue(!!found, 'Should find saved checklist');
  state.toggleChecklistItem(list.id, itemId, true);
  var refreshed = state.getChecklists().find(function(x) { return x.id === list.id; });
  assertTrue(!!refreshed, 'Checklist should still exist after toggle');
  assertEqual(refreshed.items.length, 2, 'Items count should not change');
  var item = refreshed.items.find(function(i) { return i.id === itemId; });
  assertTrue(!!item && item.done === true, 'Toggled item should be done');
});

test('Rebook prompt CRUD', function() {
  state.reset();
  var r = state.addRebookPrompt({ clientName: 'Repeat Client', originalEventDate: '2025-09-20', suggestedDate: '2026-09-20' });
  assertTrue(!!r.id, 'Rebook prompt should have id');
  assertEqual(r.status, 'pending', 'Default status should be pending');
  state.updateRebookPrompt(r.id, { status: 'booked' });
  assertEqual(state.getRebookPrompts()[0].status, 'booked', 'Status should update');
});

test('Public quote lookup works', function() {
  state.reset();
  var q = state.createQuote({ clientName: 'Public Test', total: 900 });
  var found = state.getQuoteByToken(q.token);
  assertTrue(!!found, 'Public token lookup should work');
  assertEqual(found.clientName, 'Public Test', 'Found quote should match client');
});

console.log('\n=== Results ===');
console.log('Passed: ' + passed);
console.log('Failed: ' + failed);
if (failed > 0) {
  console.log('SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED (' + passed + '/' + (passed + failed) + ')');
}
