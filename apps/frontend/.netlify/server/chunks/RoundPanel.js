import { e as escape_html, b as ensure_array_like, d as derived, a as attr_class, a8 as stringify, c as attr_style } from "./index.js";
import "pocketbase";
function FormVisual($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { round } = $$props;
    const fl = derived(() => round.form_labels || {});
    if (round.form === "scale") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="form-visual"><div class="scale-line"></div> <div class="scale-labels"><span>${escape_html(fl().left || "")}</span> <span>${escape_html(fl().right || "")}</span></div></div>`);
    } else if (round.form === "scale3") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="form-visual"><div class="scale-line"></div> <div class="scale-labels three"><span>${escape_html(fl().left || "")}</span> <span>${escape_html(fl().middle || "")}</span> <span>${escape_html(fl().right || "")}</span></div></div>`);
    } else if (round.form === "cross") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="form-visual cross"><div class="cross-label y">${escape_html(fl().y_top || "")}</div> <div class="cross-mid"><div class="cross-label x">${escape_html(fl().x_left || "")}</div> <div class="cross-box"><div class="axis-v"></div><div class="axis-h"></div></div> <div class="cross-label x">${escape_html(fl().x_right || "")}</div></div> <div class="cross-label y">${escape_html(fl().y_bottom || "")}</div></div>`);
    } else if (round.form === "quadrants") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div class="form-visual quadrants"><!--[-->`);
      const each_array = ensure_array_like(round.options || []);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let o = each_array[$$index];
        $$renderer2.push(`<div class="quadrant">${escape_html(o.label)}</div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else if (round.form === "rings") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div class="form-visual rings"><div class="ring outer"><div class="ring middle"><div class="ring inner"><span class="ring-center-label">${escape_html(fl().center || "")}</span></div></div></div> <div class="ring-edge-label">Rand: <b>${escape_html(fl().edge || "")}</b></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="options"><!--[-->`);
      const each_array_1 = ensure_array_like(round.options || []);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let o = each_array_1[$$index_1];
        $$renderer2.push(`<div class="option">${escape_html(o.label)}</div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function RoundPanel($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { round, reveal, yourAnswer, showPersonalResult = true } = $$props;
    let now = Date.now();
    const msLeft = derived(() => round && round.opened_at && round.duration_s > 0 ? Math.max(0, (round.opened_at + round.duration_s) * 1e3 - now) : 0);
    const secsLeft = derived(() => Math.ceil(msLeft() / 1e3));
    const pctLeft = derived(() => round && round.duration_s > 0 ? Math.min(100, msLeft() / (round.duration_s * 1e3) * 100) : 0);
    const winners = derived(() => new Set(reveal?.winning_zones || []));
    const tally = derived(() => reveal?.tally || {});
    const revealResult = derived(() => {
      if (!reveal || !showPersonalResult) return null;
      if (!yourAnswer || !yourAnswer.zone) {
        return { text: "Keine Position erfasst", cls: "absent" };
      }
      const opt = (reveal.options || []).find((o) => o.zone === yourAnswer.zone);
      return {
        text: `Erfasst: ${opt ? opt.label : yourAnswer.zone}`,
        cls: winners().has(yourAnswer.zone) ? "win" : ""
      };
    });
    $$renderer2.push(`<div class="round-panel">`);
    if (reveal && reveal.round_type !== "narration") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="question">${escape_html(reveal.question)}</div> <div class="options"><!--[-->`);
      const each_array = ensure_array_like(reveal.options || []);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let o = each_array[$$index];
        $$renderer2.push(`<div${attr_class("option", void 0, { "winner": winners().has(o.zone) })}>${escape_html(o.label)}<span class="count">${escape_html(tally()[o.zone] || 0)}</span></div>`);
      }
      $$renderer2.push(`<!--]--></div> `);
      if (revealResult()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`result ${stringify(revealResult().cls)}`)}>${escape_html(revealResult().text)}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    } else if (!round) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="phase-note">Warte auf den nächsten Schritt…</div>`);
    } else if (round.round_type === "narration") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div class="question">${escape_html(round.question)}</div> <div class="step-text narration">${escape_html(round.text || "")}</div> `);
      if (round.audio_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="replay-row"><button class="replay">↺ Nochmal hören</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="listen-note">Hör zu — es geht gleich weiter.</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="question">${escape_html(round.question)}</div> `);
      if (round.text) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="step-text">${escape_html(round.text)}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      FormVisual($$renderer2, { round });
      $$renderer2.push(`<!----> `);
      if (round.audio_url) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="replay-row"><button class="replay">↺ Nochmal hören</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="countdown-wrap">`);
      if (round.state === "active" && round.opened_at && round.duration_s > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="countdown">`);
        if (secsLeft() > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<b>${escape_html(secsLeft())}s</b> — finde deine Position`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`Die Zeit ist um!`);
        }
        $$renderer2.push(`<!--]--></div> <div class="timebar"><div${attr_class("timebar-fill", void 0, { "low": msLeft() < 5e3 })}${attr_style(`width: ${stringify(pctLeft())}%`)}></div></div>`);
      } else if (round.state === "closing") {
        $$renderer2.push("<!--[1-->");
        $$renderer2.push(`<div class="locking">Positionen werden gespeichert…</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  RoundPanel as R
};
