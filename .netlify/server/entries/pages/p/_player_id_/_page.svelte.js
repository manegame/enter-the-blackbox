import { e as escape_html, f as attr, d as derived } from "../../../../chunks/index.js";
import { p as page } from "../../../../chunks/index2.js";
import { R as RoundPanel } from "../../../../chunks/RoundPanel.js";
import "pocketbase";
function ClaimForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { playerId } = $$props;
    let gidText = "";
    let error = "";
    let busy = false;
    $$renderer2.push(`<div id="claim-form"><h1>Willkommen in der KI-Blackbox</h1> <div class="player-id">Gerät ${escape_html(playerId)}</div> <p class="phase-note" style="margin:0">Gib die Nummer auf deinem Punkt ein</p> <input id="gid" inputmode="numeric" pattern="[0-9]*" maxlength="5" autocomplete="off"${attr("value", gidText)}/> <div class="error">${escape_html(error)}</div> <button class="claim" id="submit"${attr("disabled", busy, true)}>Verbinden</button></div>`);
  });
}
function Player($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { playerId } = $$props;
    let player = null;
    let round = null;
    let reveal = null;
    let yourAnswer = null;
    const bound = derived(() => player?.state === "bound");
    const lostOrOrphaned = derived(() => player?.state === "orphaned");
    const ritual = derived(() => player?.state === "orphaned");
    if (bound()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="topbar"><span class="gid-chip">#${escape_html(player.gid)}</span> <span class="conn bound">Verbunden</span> `);
      {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <main>`);
    if (ritual() && !bound()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="banner ritual">Geh zur leuchtenden Ecke ✦</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (lostOrOrphaned()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="banner lost">Wir haben dich verloren — gib deine neue Nummer ein oder warte auf das Personal</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!bound()) {
      $$renderer2.push("<!--[0-->");
      ClaimForm($$renderer2, { playerId });
    } else {
      $$renderer2.push("<!--[-1-->");
      RoundPanel($$renderer2, { round, reveal, yourAnswer });
    }
    $$renderer2.push(`<!--]--></main> <audio id="narration" preload="auto"></audio>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const playerId = derived(() => decodeURIComponent(page.params.player_id));
    $$renderer2.push(`<!---->`);
    {
      Player($$renderer2, { playerId: playerId() });
    }
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
