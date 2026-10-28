/* ==========================================================================
 * core/storage.js — localStorage 封装
 * - 统一键名（BRIEF 指定）：sakuraoka.save.v1 / endings.v1 / settings.v1
 * - file:// 或隐私模式下 localStorage 可能不可写：自动降级为内存存储，
 *   游戏仍可完整游玩，只是刷新后无法继续。
 * ========================================================================== */
(function () {
  'use strict';

  const KEYS = {
    save: 'sakuraoka.save.v1',
    endings: 'sakuraoka.endings.v1',
    settings: 'sakuraoka.settings.v1'
  };

  /* 内存降级存储 */
  const memory = {};

  /* null = 尚未检测；true/false = 检测结果 */
  let available = null;

  function detect() {
    try {
      const testKey = 'sakuraoka.__probe__.v1';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      available = true;
    } catch (err) {
      available = false;
    }
    return available;
  }

  function isAvailable() {
    if (available === null) detect();
    return available;
  }

  function readRaw(key) {
    if (!isAvailable()) {
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : null;
    }
  }

  function writeRaw(key, value) {
    memory[key] = value;
    if (!isAvailable()) return false;
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (err) {
      /* 配额满或权限受限：保留内存副本 */
      return false;
    }
  }

  function remove(key) {
    delete memory[key];
    if (!isAvailable()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
  }

  function readJSON(key, fallback) {
    const raw = readRaw(key);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
      return fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      return writeRaw(key, JSON.stringify(value));
    } catch (err) {
      return false;
    }
  }

  SK.core.storage = {
    KEYS: KEYS,
    isAvailable: isAvailable,
    readRaw: readRaw,
    writeRaw: writeRaw,
    remove: remove,
    readJSON: readJSON,
    writeJSON: writeJSON
  };
})();
