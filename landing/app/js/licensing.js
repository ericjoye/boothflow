// licensing.js — Freemium tier gating + license keys + Stripe checkout
var BFLicensing = (function() {
  'use strict';

  var STORAGE_KEY = 'boothflow_license_v1';

  var TIERS = {
    free: {
      id: 'free',
      label: 'Free',
      price: 0,
      priceLabel: '$0',
      limits: { clients: 3, bookings: 3, galleries: 1 },
      features: [
        'Client list (up to 3)',
        'Basic booking form',
        'Simple gallery + shareable link',
        'Manual quotes'
      ]
    },
    pro: {
      id: 'pro',
      label: 'Pro',
      price: 29,
      priceLabel: '$29/mo',
      limits: { clients: Infinity, bookings: Infinity, galleries: Infinity },
      features: [
        'Unlimited clients',
        'Instant quote builder with add-ons',
        'Branded gallery with print upsell',
        'Event checklist + follow-up prompts'
      ]
    },
    business: {
      id: 'business',
      label: 'Business',
      price: 59,
      priceLabel: '$59/mo',
      limits: { clients: Infinity, bookings: Infinity, galleries: Infinity },
      features: [
        'Everything in Pro',
        'Multi-operator scheduling',
        'Multiple booth packages',
        'Rebooking engine'
      ]
    }
  };

  var DEMO_KEYS = {
    'BOOTHFLOW-PRO-2026': 'pro',
    'BOOTHFLOW-BUSINESS-2026': 'business'
  };

  function _load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { tier: 'free', licensed: false, key: '', activatedAt: null };
  }

  function _save(lic) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lic)); } catch (e) {}
  }

  function getLicense() { return _load(); }
  function getCurrentTier() { return _load().tier; }
  function isProOrAbove() {
    var t = getCurrentTier();
    return t === 'pro' || t === 'business';
  }
  function isBusiness() { return getCurrentTier() === 'business'; }
  function getTierInfo(tierId) { return TIERS[tierId] || TIERS.free; }

  function activateKey(key) {
    key = (key || '').trim().toUpperCase();
    var tier = DEMO_KEYS[key];
    if (!tier) return { success: false, message: 'Invalid key. Try BOOTHFLOW-PRO-2026 or BOOTHFLOW-BUSINESS-2026' };
    _save({ tier: tier, licensed: true, key: key, activatedAt: new Date().toISOString() });
    return { success: true, tier: tier, message: 'Activated ' + TIERS[tier].label + '!' };
  }

  function downgradeToFree() {
    _save({ tier: 'free', licensed: false, key: '', activatedAt: null });
  }

  function canAddClient(currentCount) {
    var tier = getCurrentTier();
    var limit = TIERS[tier].limits.clients;
    return currentCount < limit;
  }

  function canAddBooking(currentCount) {
    var tier = getCurrentTier();
    var limit = TIERS[tier].limits.bookings;
    return currentCount < limit;
  }

  function canAddGallery(currentCount) {
    var tier = getCurrentTier();
    var limit = TIERS[tier].limits.galleries;
    return currentCount < limit;
  }

  function hasFeature(feature) {
    var t = getCurrentTier();
    if (t === 'business') return true;
    if (t === 'pro') {
      var proGated = ['multi_operator', 'multiple_packages', 'rebooking_engine'];
      return proGated.indexOf(feature) === -1;
    }
    var freeGated = [
      'instant_quote', 'quote_addons', 'branded_gallery', 'print_upsell',
      'event_checklist', 'followup_prompts', 'multi_operator', 'multiple_packages',
      'rebooking_engine'
    ];
    return freeGated.indexOf(feature) === -1;
  }

  function handleCheckout(tierId) {
    var tier = TIERS[tierId];
    if (!tier || tier.price === 0) return;
    var PAYMENT_LINKS = {
      pro: 'https://buy.stripe.com/test_fZubJ28z6cVj45w49WbAs0o',
      business: 'https://buy.stripe.com/test_9B6aEYaHedZnfOefSEbAs0p'
    };
    var link = PAYMENT_LINKS[tierId];
    if (link && !link.includes('{{')) {
      window.open(link + (link.indexOf('?') > -1 ? '&' : '?') + 'client_reference_id=' + tierId, '_blank');
    } else {
      App.showToast('Demo mode: activating ' + tier.label + ' locally');
      activateKey('BOOTHFLOW-' + tierId.toUpperCase() + '-2026');
      App.render();
    }
    return { tierId: tierId, name: tier.label, price: tier.priceLabel };
  }

  return {
    getCurrentTier: getCurrentTier,
    getLicense: getLicense,
    getTierInfo: getTierInfo,
    isProOrAbove: isProOrAbove,
    isBusiness: isBusiness,
    activateKey: activateKey,
    downgradeToFree: downgradeToFree,
    canAddClient: canAddClient,
    canAddBooking: canAddBooking,
    canAddGallery: canAddGallery,
    hasFeature: hasFeature,
    handleCheckout: handleCheckout,
    TIERS: TIERS
  };
})();
