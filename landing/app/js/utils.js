// utils.js — BoothFlow shared helpers
var BFU = (function() {
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

  function uid() {
    return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function confirm(msg) {
    if (typeof window === 'undefined' || !window.confirm) return true;
    return window.confirm(msg);
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
      ('0' + d.getDate()).slice(-2);
  }

  function addDaysISO(iso, days) {
    var d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
      ('0' + d.getDate()).slice(-2);
  }

  function monthsBetween(fromISO, toISO) {
    var from = new Date(fromISO + 'T00:00:00');
    var to = new Date(toISO + 'T00:00:00');
    return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  }

  return {
    esc: esc,
    money: money,
    uid: uid,
    confirm: confirm,
    todayISO: todayISO,
    addDaysISO: addDaysISO,
    monthsBetween: monthsBetween
  };
})();
