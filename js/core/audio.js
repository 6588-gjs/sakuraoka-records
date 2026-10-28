/* ==========================================================================
 * core/audio.js — WebAudio 合成音效（无音频文件、无网络请求）
 * - 浏览器策略：必须在用户首次交互后才能创建/恢复 AudioContext
 * - 全部音效由振荡器与噪声缓冲实时合成
 * ========================================================================== */
(function () {
  'use strict';

  let ctx = null;
  let master = null;
  let unlocked = false;
  let enabled = true;

  function settings() {
    return SK.core.state.getSettings();
  }

  function ensureContext() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try {
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = 0.28;
      master.connect(ctx.destination);
    } catch (err) {
      ctx = null;
    }
    return ctx;
  }

  /* 用户首次交互后调用：创建并恢复上下文 */
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    enabled = !!settings().sound;
    const c = ensureContext();
    if (c && c.state === 'suspended') {
      c.resume().catch(function () { /* 忽略 */ });
    }
  }

  function setEnabled(value) {
    enabled = !!value;
    /* 只有用户已经交互过才允许真正创建音频上下文 */
    if (enabled && unlocked) unlock();
  }

  function isEnabled() {
    return enabled && !!settings().sound;
  }

  function now() {
    return ctx ? ctx.currentTime : 0;
  }

  /* 基础音：正弦/方波，带包络 */
  function tone(freq, duration, opts) {
    if (!isEnabled()) return;
    const c = ensureContext();
    if (!c || c.state !== 'running') return;
    const o = c.createOscillator();
    const g = c.createGain();
    const o2 = opts || {};
    o.type = o2.type || 'square';
    o.frequency.setValueAtTime(freq, now());
    if (o2.slideTo) {
      o.frequency.exponentialRampToValueAtTime(Math.max(20, o2.slideTo), now() + duration);
    }
    g.gain.setValueAtTime(0.0001, now());
    g.gain.exponentialRampToValueAtTime(o2.gain || 0.12, now() + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, now() + duration);
    o.connect(g);
    g.connect(master);
    o.start(now());
    o.stop(now() + duration + 0.02);
  }

  /* 白噪声：用于静电 / 翻页 */
  function noise(duration, opts) {
    if (!isEnabled()) return;
    const c = ensureContext();
    if (!c || c.state !== 'running') return;
    const frames = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, frames, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = (opts && opts.freq) || 1800;
    filter.Q.value = 0.8;
    const g = c.createGain();
    g.gain.value = (opts && opts.gain) || 0.05;
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(now());
  }

  /* 对外音效 */
  function click() {
    tone(760, 0.05, { type: 'square', gain: 0.06, slideTo: 520 });
  }

  function page() {
    noise(0.09, { freq: 2400, gain: 0.035 });
    tone(320, 0.05, { type: 'triangle', gain: 0.03 });
  }

  function evidence() {
    tone(660, 0.08, { type: 'triangle', gain: 0.1 });
    setTimeout(function () {
      tone(990, 0.14, { type: 'triangle', gain: 0.1 });
    }, 70);
  }

  function combine() {
    tone(392, 0.1, { type: 'square', gain: 0.08 });
    setTimeout(function () {
      tone(587, 0.1, { type: 'square', gain: 0.08 });
    }, 90);
    setTimeout(function () {
      tone(784, 0.2, { type: 'triangle', gain: 0.09 });
    }, 180);
  }

  function error() {
    tone(180, 0.16, { type: 'sawtooth', gain: 0.07, slideTo: 110 });
  }

  function success() {
    tone(523, 0.09, { type: 'triangle', gain: 0.09 });
    setTimeout(function () {
      tone(659, 0.09, { type: 'triangle', gain: 0.09 });
    }, 80);
    setTimeout(function () {
      tone(784, 0.18, { type: 'triangle', gain: 0.1 });
    }, 160);
  }

  function staticNoise() {
    noise(0.35, { freq: 900, gain: 0.06 });
  }

  function pageFlip() {
    noise(0.12, { freq: 1200, gain: 0.04 });
    tone(240, 0.06, { type: 'triangle', gain: 0.04 });
  }

  SK.core.audio = {
    unlock: unlock,
    setEnabled: setEnabled,
    isEnabled: isEnabled,
    click: click,
    page: page,
    evidence: evidence,
    combine: combine,
    error: error,
    success: success,
    static: staticNoise,
    flip: pageFlip
  };
})();
