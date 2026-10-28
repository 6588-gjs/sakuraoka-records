/* ==========================================================================
 * core/board.js — 推理板逻辑
 * 合成规则沿用原版 RECIPES。两种操作方式：
 *   1. 触屏 / 键盘：点选两张证据卡 → 「推理」按钮 → 合成
 *   2. 桌面：HTML5 拖拽，把证据拖到板面生成节点，把节点拖到节点上合成
 * ========================================================================== */
(function () {
  'use strict';

  const state = SK.core.state;

  /* 节点自动摆放位置（百分比），避免手机端重叠 */
  const SLOTS = [
    { x: 20, y: 20 }, { x: 50, y: 18 }, { x: 80, y: 22 },
    { x: 20, y: 50 }, { x: 50, y: 48 }, { x: 80, y: 52 },
    { x: 20, y: 78 }, { x: 50, y: 78 }, { x: 80, y: 78 },
    { x: 35, y: 34 }, { x: 65, y: 34 }, { x: 35, y: 65 }, { x: 65, y: 65 }
  ];

  function uid() {
    return 'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function getNodes() {
    return state.get().nodes;
  }

  function nodeById(nodeUid) {
    const nodes = getNodes();
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].uid === nodeUid) return nodes[i];
    }
    return null;
  }

  /* 找一个不与现有节点过近的位置 */
  function autoSlot() {
    const nodes = getNodes();
    for (let i = 0; i < SLOTS.length; i += 1) {
      const slot = SLOTS[i];
      const clash = nodes.some(function (n) {
        return Math.abs(n.x - slot.x) < 12 && Math.abs(n.y - slot.y) < 14;
      });
      if (!clash) return { x: slot.x, y: slot.y };
    }
    return {
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    };
  }

  function addNode(clueId, x, y) {
    const slot = (typeof x === 'number' && typeof y === 'number') ? { x: x, y: y } : autoSlot();
    const node = {
      uid: uid(),
      clueId: clueId,
      x: Math.max(8, Math.min(92, slot.x)),
      y: Math.max(10, Math.min(90, slot.y))
    };
    getNodes().push(node);
    return node;
  }

  function removeNodesByClueIds(ids) {
    const nodes = getNodes();
    state.patch({
      nodes: nodes.filter(function (n) {
        return ids.indexOf(n.clueId) < 0;
      })
    });
  }

  /* ------------------------------------------------------------------------
   * 选择（触屏合成流程）
   * ---------------------------------------------------------------------- */
  function getSelection() {
    return state.get().boardSel || [];
  }

  function selectedClueIds() {
    return getSelection().map(function (item) {
      if (item.kind === 'clue') return item.id;
      const node = nodeById(item.id);
      return node ? node.clueId : null;
    }).filter(Boolean);
  }

  function selectItem(kind, id) {
    const st = state.get();
    let sel = (st.boardSel || []).slice();
    const clueId = kind === 'clue' ? id : (nodeById(id) || {}).clueId;
    if (!clueId) return false;

    /* 同一条证据已通过另一种方式选中 → 取消 */
    const existingIdx = sel.findIndex(function (item) {
      const itemClue = item.kind === 'clue' ? item.id : (nodeById(item.id) || {}).clueId;
      return itemClue === clueId;
    });
    if (existingIdx >= 0) {
      sel.splice(existingIdx, 1);
    } else {
      sel.push({ kind: kind, id: id });
      if (sel.length > 2) sel = sel.slice(sel.length - 2);
    }
    state.patch({ boardSel: sel });
    if (SK.core.audio) SK.core.audio.click();
    SK.core.router.render({ keepScroll: true });
    return true;
  }

  function clearSelection() {
    state.patch({ boardSel: [] });
    SK.core.router.render({ keepScroll: true });
  }

  /* ------------------------------------------------------------------------
   * 合成
   * ---------------------------------------------------------------------- */
  function findRecipe(a, b) {
    return SK.data.clues.RECIPES.find(function (r) {
      return (r.a === a && r.b === b) || (r.a === b && r.b === a);
    }) || null;
  }

  function tryCombine(clueA, clueB) {
    const st = state.get();
    if (!clueA || !clueB || clueA === clueB) {
      SK.ui.toast.show(SK.data.ui.board.noRecipe, { type: 'error' });
      return { ok: false, reason: 'invalid' };
    }
    const recipe = findRecipe(clueA, clueB);
    if (!recipe) {
      if (SK.core.audio) SK.core.audio.error();
      SK.ui.toast.show(SK.data.ui.board.noRecipe, { type: 'error' });
      return { ok: false, reason: 'no_recipe' };
    }
    if (state.has(recipe.result) || getNodes().some(function (n) {
      return n.clueId === recipe.result;
    })) {
      SK.ui.toast.show(SK.data.ui.board.exists, { type: 'error' });
      return { ok: false, reason: 'exists' };
    }

    /* 记录位置：若两张证据都已作为节点在板上，取中点 */
    const nodeA = getNodes().find(function (n) {
      return n.clueId === clueA;
    });
    const nodeB = getNodes().find(function (n) {
      return n.clueId === clueB;
    });
    let x;
    let y;
    if (nodeA && nodeB) {
      x = (nodeA.x + nodeB.x) / 2;
      y = (nodeA.y + nodeB.y) / 2;
    } else {
      const slot = autoSlot();
      x = slot.x;
      y = slot.y;
    }

    /* 移除被合成的父节点，加入结果节点 */
    removeNodesByClueIds([clueA, clueB]);
    state.addEvidence(recipe.result, { silent: true });
    addNode(recipe.result, x, y);
    state.patch({ boardSel: [] });

    if (SK.core.audio) SK.core.audio.combine();
    const clue = SK.data.clues.get(recipe.result);
    const name = st.translation === 'ja' ? clue.name : clue.nameZh;
    SK.ui.toast.show(SK.data.ui.board.combined.replace('{name}', name), { type: 'ok' });
    SK.core.router.render({ keepScroll: true });

    if (typeof window.SK.onEvidenceChange === 'function') {
      window.SK.onEvidenceChange(recipe.result);
    }
    return { ok: true, result: recipe.result };
  }

  function combineSelected() {
    const ids = selectedClueIds();
    if (ids.length < 2) {
      SK.ui.toast.show(SK.data.ui.board.selectedNone, { type: 'error' });
      return { ok: false, reason: 'not_enough' };
    }
    return tryCombine(ids[0], ids[1]);
  }

  function resetBoard() {
    state.patch({ nodes: [], boardSel: [] });
    SK.ui.toast.show(SK.data.ui.board.resetBoard);
    SK.core.router.render({ keepScroll: true });
  }

  /* ------------------------------------------------------------------------
   * 桌面拖拽（HTML5 drag & drop）
   * ---------------------------------------------------------------------- */
  function bindDrag() {
    const board = document.getElementById('memoBoard');
    if (!board) return;

    board.addEventListener('dragover', function (e) {
      e.preventDefault();
      board.classList.add('drag-over');
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    });
    board.addEventListener('dragleave', function () {
      board.classList.remove('drag-over');
    });
    board.addEventListener('drop', function (e) {
      e.preventDefault();
      board.classList.remove('drag-over');
      const raw = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
      if (!raw) return;
      let data;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        return;
      }
      const rect = board.getBoundingClientRect();
      const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
      if (data.type === 'clue' && SK.data.clues.CLUES[data.clueId]) {
        if (getNodes().some(function (n) {
          return n.clueId === data.clueId;
        })) {
          SK.ui.toast.show(SK.data.ui.board.exists, { type: 'error' });
          return;
        }
        addNode(data.clueId, x, y);
        SK.core.router.render({ keepScroll: true });
      } else if (data.type === 'node') {
        const node = nodeById(data.uid);
        if (!node) return;
        node.x = x;
        node.y = y;
        SK.core.router.render({ keepScroll: true });
      }
    });

    /* 证据卡拖拽 */
    const cards = document.querySelectorAll('.clue-card');
    Array.prototype.forEach.call(cards, function (card) {
      card.addEventListener('dragstart', function (e) {
        const payload = JSON.stringify({ type: 'clue', clueId: card.getAttribute('data-clue') });
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', payload);
          e.dataTransfer.effectAllowed = 'copy';
        }
      });
    });

    /* 节点拖拽 & 节点间合成 */
    const nodes = document.querySelectorAll('.memo-node');
    Array.prototype.forEach.call(nodes, function (nodeEl) {
      const nodeUid = nodeEl.getAttribute('data-uid');

      nodeEl.addEventListener('dragstart', function (e) {
        e.stopPropagation();
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'node', uid: nodeUid }));
          e.dataTransfer.effectAllowed = 'move';
        }
      });

      nodeEl.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      nodeEl.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const raw = e.dataTransfer ? e.dataTransfer.getData('text/plain') : '';
        if (!raw) return;
        let data;
        try {
          data = JSON.parse(raw);
        } catch (err) {
          return;
        }
        if (data.type !== 'node' || data.uid === nodeUid) return;
        const a = nodeById(data.uid);
        const b = nodeById(nodeUid);
        if (a && b) tryCombine(a.clueId, b.clueId);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 调试用：直接合成指定证据（E2E / 截图）
   * ---------------------------------------------------------------------- */
  function forceCombine(a, b) {
    const recipe = findRecipe(a, b);
    if (!recipe) return null;
    if (!state.has(recipe.result)) state.addEvidence(recipe.result, { silent: true });
    return recipe.result;
  }

  SK.core.board = {
    SLOTS: SLOTS,
    autoSlot: autoSlot,
    addNode: addNode,
    nodeById: nodeById,
    getSelection: getSelection,
    selectedClueIds: selectedClueIds,
    selectItem: selectItem,
    clearSelection: clearSelection,
    tryCombine: tryCombine,
    combineSelected: combineSelected,
    resetBoard: resetBoard,
    bindDrag: bindDrag,
    forceCombine: forceCombine,
    findRecipe: findRecipe
  };
})();
