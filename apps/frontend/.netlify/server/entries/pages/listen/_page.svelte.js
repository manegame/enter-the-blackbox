import { a as attr_class, e as escape_html, b as ensure_array_like, c as attr_style, d as derived } from "../../../chunks/index.js";
import { R as RoundPanel } from "../../../chunks/RoundPanel.js";
import "pocketbase";
const audio = { unlocked: false, overlayVisible: false };
function TaskListener($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let round = null;
    let reveal = null;
    let zoneCounts = {};
    let scores = {};
    let connected = false;
    let lastCue = "waiting";
    let lastUpdatedAt = null;
    const winningZones = derived(() => /* @__PURE__ */ new Set([]));
    const zoneRows = derived(() => [].map((opt) => {
      const count = zoneCounts[opt.zone] || 0;
      return {
        zone: opt.zone,
        label: opt.label,
        count,
        winner: winningZones().has(opt.zone)
      };
    }));
    const maxZoneCount = derived(() => Math.max(1, ...zoneRows().map((row) => row.count)));
    const scoreRows = derived(() => Object.entries(scores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 8));
    const summaryRows = derived(() => {
      const rows = [
        {
          label: "Connection",
          value: "Connecting"
        },
        { label: "Last cue", value: lastCue },
        {
          label: "Round",
          value: "Waiting for a round"
        },
        { label: "State", value: "idle" },
        { label: "Type", value: "n/a" },
        { label: "Step", value: "—" },
        {
          label: "Duration",
          value: "—"
        },
        {
          label: "Grace",
          value: "—"
        },
        { label: "Opened", value: formatClock(round?.opened_at) },
        { label: "Closed", value: formatClock(round?.closed_at) }
      ];
      return rows;
    });
    const debugState = derived(() => ({
      connected,
      lastCue,
      lastUpdatedAt: formatClock(lastUpdatedAt),
      audioUnlocked: audio.unlocked,
      audioOverlayVisible: audio.overlayVisible,
      round,
      reveal,
      zoneCounts,
      scores
    }));
    function formatClock(ts) {
      if (ts === null || ts === void 0) return "—";
      return new Date(ts * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    }
    $$renderer2.push(`<main class="listener-page svelte-12d3d8q"><header class="hero svelte-12d3d8q"><div><div class="eyebrow svelte-12d3d8q">Debug route</div> <h1 class="svelte-12d3d8q">Current task listener</h1> <p class="lede svelte-12d3d8q">Live round stream without a player seat. Use this to watch the show state, hear audio,
        and verify round transitions while the phone flow is offline.</p></div> <div class="chips svelte-12d3d8q"><span${attr_class("chip svelte-12d3d8q", void 0, { "live": connected })}>${escape_html("Reconnecting")}</span> <span class="chip svelte-12d3d8q">${escape_html(lastCue)}</span> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></header> <section class="layout svelte-12d3d8q"><article class="panel stage svelte-12d3d8q">`);
    RoundPanel($$renderer2, { round, reveal, showPersonalResult: false });
    $$renderer2.push(`<!----></article> <aside class="stack svelte-12d3d8q"><article class="panel svelte-12d3d8q"><div class="panel-title svelte-12d3d8q">Playback</div> <div class="meta-grid svelte-12d3d8q"><!--[-->`);
    const each_array = ensure_array_like(summaryRows().slice(0, 6));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let row = each_array[$$index];
      $$renderer2.push(`<div class="meta svelte-12d3d8q"><div class="meta-label svelte-12d3d8q">${escape_html(row.label)}</div> <div class="meta-value svelte-12d3d8q">${escape_html(row.value)}</div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <audio id="narration" class="audio-player svelte-12d3d8q" controls="" preload="auto"></audio> <div class="button-row svelte-12d3d8q"><button class="ghost svelte-12d3d8q">Enable audio</button> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="hint svelte-12d3d8q">Audio starts by itself when a round opens. If the browser blocks autoplay, click
          anywhere on the page (or "Enable audio") once. The native player stays visible so you
          can pause, scrub, and confirm the loaded source.</div></article> <article class="panel svelte-12d3d8q"><div class="panel-title svelte-12d3d8q">Live state</div> <div class="meta-grid svelte-12d3d8q"><!--[-->`);
    const each_array_1 = ensure_array_like(summaryRows().slice(6));
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let row = each_array_1[$$index_1];
      $$renderer2.push(`<div class="meta svelte-12d3d8q"><div class="meta-label svelte-12d3d8q">${escape_html(row.label)}</div> <div class="meta-value svelte-12d3d8q">${escape_html(row.value)}</div></div>`);
    }
    $$renderer2.push(`<!--]--> <div class="meta svelte-12d3d8q"><div class="meta-label svelte-12d3d8q">Audio source</div> <div class="meta-value svelte-12d3d8q">${escape_html("none")}</div></div></div> <div class="subsection-title svelte-12d3d8q">Zone counts</div> `);
    if (zoneRows().length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bars svelte-12d3d8q"><!--[-->`);
      const each_array_2 = ensure_array_like(zoneRows());
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let row = each_array_2[$$index_2];
        $$renderer2.push(`<div class="bar-row svelte-12d3d8q"><div class="bar-info svelte-12d3d8q"><div class="bar-label svelte-12d3d8q">${escape_html(row.label)}</div> <div class="bar-zone svelte-12d3d8q">${escape_html(row.zone)}</div></div> <div class="bar-count svelte-12d3d8q">${escape_html(row.count)}</div> <div class="bar-track svelte-12d3d8q"><div${attr_class("bar-fill svelte-12d3d8q", void 0, { "winner": row.winner })}${attr_style(`width: ${row.count / maxZoneCount() * 100}%`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-note svelte-12d3d8q">Zone counts appear here once a non-narration round is active.</div>`);
    }
    $$renderer2.push(`<!--]--></article> <article class="panel svelte-12d3d8q"><div class="panel-title svelte-12d3d8q">Scores</div> `);
    if (scoreRows().length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="scores svelte-12d3d8q"><!--[-->`);
      const each_array_3 = ensure_array_like(scoreRows());
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let [playerId, points] = each_array_3[$$index_3];
        $$renderer2.push(`<div class="score-row svelte-12d3d8q"><div class="score-id svelte-12d3d8q">${escape_html(playerId)}</div> <div class="score-points svelte-12d3d8q">${escape_html(points)}</div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-note svelte-12d3d8q">No score events yet.</div>`);
    }
    $$renderer2.push(`<!--]--></article> <details class="panel raw svelte-12d3d8q"><summary class="svelte-12d3d8q"><div class="panel-title svelte-12d3d8q">Raw state</div> <div class="empty-note svelte-12d3d8q">Expand to inspect the live payloads.</div></summary> <div class="raw-body svelte-12d3d8q"><pre class="svelte-12d3d8q">${escape_html(JSON.stringify(debugState(), null, 2))}</pre></div></details></aside></section></main> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer) {
  TaskListener($$renderer);
}
export {
  _page as default
};
