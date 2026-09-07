/**
 * Music box — emotion-matched melodies synthesized with the Web Audio API.
 * No audio files, no licensing, no network: each emotion resolves to a short
 * looping phrase played on a soft triangle tone with a gentle echo.
 *
 * Happy Birthday is the classic public-domain melody, matched to the
 * "birthday" emotion; the other emotions get small original phrases built
 * from the same idea — the emotion is the key, the phrase is the feeling.
 */

export type MusicPhrase = Array<[midiOrNull: number | null, beats: number]>;

const BPM = 108;
const BEAT_SEC = 60 / BPM;
const DELAY_TIME = 0.32;
const DELAY_FEEDBACK = 0.34;
const DELAY_WET = 0.18;
const MASTER_GAIN = 0.16;

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Happy Birthday ("Happy birthday to you / happy birthday dear … / happy birthday to you"). */
export const HAPPY_BIRTHDAY: MusicPhrase = [
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, 0.75], [67, 0.25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, 0.75], [77, 0.25], [76, 1], [72, 1], [74, 1], [72, 2],
];

export const EMOTION_TUNES: Record<string, MusicPhrase> = {
  love: [
    [64, 1], [67, 1], [71, 1], [76, 1], [79, 1.5], [76, 0.5], [71, 1], [67, 1],
    [64, 2], [62, 1], [64, 1], [67, 1], [72, 1], [76, 1.5], [74, 0.5], [72, 1], [67, 1], [64, 2],
  ],
  miss_you: [
    [69, 1.5], [67, 0.5], [64, 1], [62, 1], [64, 1], [67, 1.5], [64, 0.5], [62, 1],
    [60, 2], [64, 1], [62, 1], [60, 1], [57, 1], [60, 1.5], [62, 0.5], [64, 1], [62, 1], [60, 2],
  ],
  thank_you: [
    [60, 0.5], [64, 0.5], [67, 1], [72, 1.5], [67, 0.5], [64, 1], [62, 1],
    [64, 0.5], [67, 0.5], [69, 1], [74, 1.5], [72, 0.5], [69, 1], [67, 1], [64, 2],
  ],
  proud: [
    [72, 0.5], [74, 0.5], [76, 1], [79, 1.5], [76, 0.5], [74, 1], [72, 1], [69, 1],
    [72, 2], [67, 0.5], [69, 0.5], [72, 1], [76, 1.5], [74, 0.5], [72, 1], [69, 1], [67, 1], [69, 2],
  ],
  birthday: HAPPY_BIRTHDAY,
  sorry: [
    [69, 1.5], [67, 0.5], [64, 1], [65, 1], [67, 1], [64, 1.5], [65, 0.5], [62, 1],
    [60, 2], [62, 0.75], [64, 0.5], [65, 0.75], [64, 1], [62, 1], [60, 2],
  ],
  just_because: [
    [64, 0.5], [67, 0.5], [69, 0.5], [72, 1], [74, 0.5], [72, 0.5], [69, 0.5], [67, 1],
    [64, 0.5], [67, 0.5], [69, 0.5], [72, 1], [76, 1], [74, 1], [72, 1], [69, 2],
  ],
  get_well: [
    [64, 1.5], [67, 0.5], [69, 1], [67, 1], [64, 2],
    [62, 1], [64, 1.5], [67, 0.5], [69, 1], [71, 1], [69, 2],
    [67, 1], [69, 1.5], [72, 0.5], [71, 1], [67, 1], [64, 2],
  ],
};

const DEFAULT_TUNE: MusicPhrase = [
  [64, 1], [67, 1], [71, 1], [72, 1.5], [71, 0.5], [67, 1], [62, 1], [64, 2],
];

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let loopTimer: number | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function scheduleNote(c: AudioContext, out: GainNode, midi: number, time: number, duration: number, peak: number) {
  if (midi <= 0) return;
  const freq = midiToFreq(midi);
  const osc = c.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, time);
  osc.frequency.exponentialRampToValueAtTime(freq, time + duration);

  const amp = c.createGain();
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.linearRampToValueAtTime(peak, time + 0.03);
  amp.gain.setValueAtTime(peak, time + duration * 0.72);
  amp.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(amp).connect(out);
  osc.start(time);
  osc.stop(time + duration + 0.05);

  // Warmth: the same note one octave below, sine, much quieter.
  const sub = c.createOscillator();
  sub.type = "sine";
  sub.frequency.setValueAtTime(freq / 2, time);
  const subAmp = c.createGain();
  subAmp.gain.setValueAtTime(0.0001, time);
  subAmp.gain.linearRampToValueAtTime(peak * 0.35, time + 0.04);
  subAmp.gain.exponentialRampToValueAtTime(0.001, time + duration);
  sub.connect(subAmp).connect(out);
  sub.start(time);
  sub.stop(time + duration + 0.05);
}

function playPhrase(c: AudioContext, out: GainNode, phrase: MusicPhrase) {
  let t = c.currentTime + 0.08;
  for (const [midi, beats] of phrase) {
    const duration = beats * BEAT_SEC;
    if (midi !== null) {
      scheduleNote(c, out, midi, t, Math.max(duration - 0.04, 0.12), 0.4);
    }
    t += duration;
  }
  return t;
}

/**
 * Starts (or restarts with a new emotion) the looping melody for an emotion.
 * Safe to call from any click handler — the AudioContext is created lazily and
 * autoplay-suspended contexts are resumed by the user gesture in progress.
 */
export function playEmotionMusic(emotionId?: string | null) {
  const c = ensureContext();
  if (!c) return;
  try {
    if (loopTimer !== null) {
      window.clearTimeout(loopTimer);
      loopTimer = null;
    }
    if (master) {
      try { master.disconnect(); } catch { /* noop */ }
    }
    master = c.createGain();
    master.gain.setValueAtTime(0.0001, c.currentTime);
    master.gain.exponentialRampToValueAtTime(MASTER_GAIN, c.currentTime + 0.5);
    master.connect(c.destination);

    const echo = c.createDelay(1);
    const feedback = c.createGain();
    const wet = c.createGain();
    echo.delayTime.setValueAtTime(DELAY_TIME, c.currentTime);
    feedback.gain.setValueAtTime(DELAY_FEEDBACK, c.currentTime);
    wet.gain.setValueAtTime(DELAY_WET, c.currentTime);
    master.connect(echo);
    echo.connect(feedback).connect(echo);
    echo.connect(wet).connect(c.destination);

    const phrase = EMOTION_TUNES[emotionId ?? ""] ?? DEFAULT_TUNE;
    const repeat = () => {
      if (!c || !master) return;
      const end = playPhrase(c, master, phrase);
      loopTimer = window.setTimeout(repeat, (end - c.currentTime) * 1000 + 350);
    };
    repeat();
  } catch {
    // Audio is a bonus; never let it break the reveal.
    loopTimer = null;
    ctx = null;
  }
}

/** Fades the music out and disposes the audio graph. */
export function stopEmotionMusic() {
  if (loopTimer !== null && typeof window !== "undefined") {
    window.clearTimeout(loopTimer);
    loopTimer = null;
  }
  if (ctx && master) {
    try {
      const c = ctx;
      master.gain.cancelScheduledValues(c.currentTime);
      master.gain.setValueAtTime(MASTER_GAIN, c.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.4);
      window.setTimeout(() => {
        void c.close().catch(() => undefined);
      }, 500);
    } catch { /* noop */ }
    master = null;
    ctx = null;
  }
}