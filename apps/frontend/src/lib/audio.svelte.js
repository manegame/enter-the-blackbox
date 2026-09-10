// Narration audio with the browser-gesture unlock dance, ported from
// web/player/index.html: the claim tap doubles as the unlock gesture;
// players who reconnect already-bound never tap anything, so they get the
// overlay instead.
import { gameUrl, resolveAudioStreamBase } from "$lib/config.js";
import { pbFileUrl } from "$lib/pb.js";

// 44-byte silent WAV: a playable src for the unlock gesture.
const SILENCE =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=";

/**
 * A round payload's narration audio source. Prefers the PocketBase-stored
 * file (built with the SDK's pb.files.getURL via the payload's audio_file
 * ref); falls back to the game-served /audio URL when the file isn't in
 * PocketBase or the PB connection isn't up yet.
 */
export function roundAudioSrc(round) {
  if (!round) return null;
  return pbFileUrl(round.audio_file) || round.audio_url;
}

export const audio = $state({
  unlocked: false,
  overlayVisible: false,
  pendingUrl: null,
  streamUrl: null,
  streamConnected: false,
});

let el = null; // direct MP3 fallback / listen page
let streamEl = null;
let playerId = null;
let latestFallbackUrl = null;
let reconnectTimer = null;

export function attachElement(audioEl) {
  el = audioEl;
}

export function attachStreamElement(audioEl) {
  streamEl = audioEl;
  if (!streamEl) return;
  streamEl.addEventListener("playing", () => {
    audio.streamConnected = true;
    if (el && !el.paused) el.pause();
  });
  streamEl.addEventListener("error", () => {
    audio.streamConnected = false;
    if (latestFallbackUrl) playDirect(latestFallbackUrl);
  });
  streamEl.addEventListener("ended", () => {
    audio.streamConnected = false;
  });
}

export async function configurePersonalStream(id) {
  playerId = id;
  const base = await resolveAudioStreamBase();
  if (!base || !playerId) return false;
  audio.streamUrl = `${base}/stream/${encodeURIComponent(playerId)}`;
  if (!reconnectTimer && typeof window !== "undefined") {
    reconnectTimer = window.setInterval(() => {
      if (audio.unlocked && audio.streamUrl && !audio.streamConnected) startPersonalStream();
    }, 5000);
  }
  if (audio.unlocked) startPersonalStream();
  return true;
}

function startPersonalStream() {
  if (!streamEl || !audio.streamUrl || !audio.unlocked) return;
  if (streamEl.src !== audio.streamUrl) streamEl.src = audio.streamUrl;
  streamEl.play().catch(() => {
    audio.streamConnected = false;
    audio.overlayVisible = true;
  });
  if ("mediaSession" in navigator && typeof MediaMetadata !== "undefined") {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "Blackbox",
      artist: "Personal audio channel",
    });
  }
}

export function unlockAudio() {
  if (audio.unlocked) return;
  audio.unlocked = true;
  audio.overlayVisible = false;
  if (audio.streamUrl) {
    startPersonalStream();
    return;
  }
  if (audio.pendingUrl) {
    playAudio(audio.pendingUrl);
  } else if (el) {
    el.src = SILENCE;
    el.play().catch(() => {});
  }
}

function playDirect(url) {
  if (!url || !el) return;
  if (!audio.unlocked) {
    audio.pendingUrl = url;
    audio.overlayVisible = true;
    return;
  }
  audio.pendingUrl = null;
  el.src = gameUrl(url); // audio_url is game-server-relative (/audio/x.mp3)
  el.play().catch((err) => {
    // AbortError just means a newer step's audio superseded this play()
    // mid-load — the newer one is already playing, nothing to do.
    if (err && err.name === "AbortError") return;
    // Playback was blocked after all (e.g. iOS revoked the unlock):
    // fall back to an explicit tap.
    audio.unlocked = false;
    audio.pendingUrl = url;
    audio.overlayVisible = true;
  });
}

export function playAudio(url) {
  latestFallbackUrl = url;
  // With a personal stream, the runner injects this same file server-side.
  // Keep the URL only as a degraded fallback if the stream errors.
  if (audio.streamUrl && audio.streamConnected) return;
  if (audio.streamUrl && audio.unlocked) {
    startPersonalStream();
    return;
  }
  playDirect(url);
}

export function replayAudio(url) {
  if (streamEl && !streamEl.paused) streamEl.pause();
  playDirect(url);
  if (el) el.onended = () => startPersonalStream();
}
