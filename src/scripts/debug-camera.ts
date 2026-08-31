// Local-only tool: for each of the 3 models, drag/zoom by hand to dial in
// its entry / optimal / exit framing (9 shots total) and read out exact
// values to paste back into hero-story.ts's PANEL_SHOTS array. Lighting
// sliders are a live preview aid only (not captured - the site's light
// mood is driven separately, shared across all 3 models). Never linked
// from the site nav, not meant to ship - see plan notes to delete before
// merge.
import { withBase } from '../utils/url';

type CameraShot = { azimuth: number; polar: number; radius: number };
type ModelKey = 'skierg' | 'bikeerg' | 'rowerg';
type PositionKey = 'entry' | 'optimal' | 'exit';

const MODELS: { key: ModelKey; src: string; label: string }[] = [
  { key: 'skierg', src: '/models/skierg.glb', label: 'SkiErg' },
  { key: 'bikeerg', src: '/models/bikeerg.glb', label: 'BikeErg' },
  { key: 'rowerg', src: '/models/rowerg.glb', label: 'RowErg' },
];
const POSITIONS: PositionKey[] = ['entry', 'optimal', 'exit'];

const mount = document.querySelector<HTMLElement>('[data-mount]')!;
const wrap = document.querySelector<HTMLElement>('#viewer-wrap')!;
const modelTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#model-tabs [data-model]'));
const slotTabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#slot-tabs [data-slot]'));
const exposureInput = document.querySelector<HTMLInputElement>('#exposure')!;
const shadowInput = document.querySelector<HTMLInputElement>('#shadow')!;
const bgInput = document.querySelector<HTMLInputElement>('#bg')!;
const readout = document.querySelector<HTMLElement>('#readout')!;
const liveReadout = document.querySelector<HTMLElement>('#live-readout')!;
const output = document.querySelector<HTMLTextAreaElement>('#output')!;
const captureBtn = document.querySelector<HTMLButtonElement>('#capture')!;
const copyBtn = document.querySelector<HTMLButtonElement>('#copy')!;

// Seeded from the previous shared boundary keyframes - a reasonable
// starting point, re-capture for real per-model framing.
const shots: Record<ModelKey, Record<PositionKey, CameraShot>> = {
  skierg: {
    entry: { azimuth: -2.9, polar: 85.7, radius: 4.58 },
    optimal: { azimuth: -2.9, polar: 85.7, radius: 4.58 },
    exit: { azimuth: 71.8, polar: 96, radius: 2.48 },
  },
  bikeerg: {
    entry: { azimuth: 71.8, polar: 96, radius: 2.48 },
    optimal: { azimuth: 71.8, polar: 96, radius: 2.48 },
    exit: { azimuth: 250, polar: 74, radius: 3.72 },
  },
  rowerg: {
    entry: { azimuth: 250, polar: 74, radius: 3.72 },
    optimal: { azimuth: 250, polar: 74, radius: 3.72 },
    exit: { azimuth: 340, polar: 74, radius: 3.32 },
  },
};
let activeModel: ModelKey = 'skierg';
let activePosition: PositionKey = 'entry';
let exposure = 1;
let shadowIntensity = 1;
let bgLightness = 6;

const script = document.createElement('script');
script.type = 'module';
script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
document.head.appendChild(script);

const viewer = document.createElement('model-viewer') as HTMLElement & {
  exposure: number;
  getCameraOrbit: () => { theta: number; phi: number; radius: number };
};
viewer.setAttribute('camera-controls', '');
viewer.setAttribute('touch-action', 'pan-y');
viewer.setAttribute('environment-image', 'neutral');
viewer.setAttribute('interaction-prompt', 'none');
mount.appendChild(viewer);

function currentShot() {
  return shots[activeModel][activePosition];
}

function applyLighting() {
  viewer.exposure = exposure;
  viewer.setAttribute('shadow-intensity', String(shadowIntensity));
  wrap.style.backgroundColor = `hsl(0 0% ${bgLightness}%)`;
  exposureInput.value = String(exposure);
  shadowInput.value = String(shadowIntensity);
  bgInput.value = String(bgLightness);
}

function applyShot() {
  const s = currentShot();
  viewer.setAttribute('camera-orbit', `${s.azimuth}deg ${s.polar}deg ${s.radius}m`);
  // Sync the live readout/capture baseline to the shot we just applied,
  // rather than leaving it stale from before a model/slot switch - a
  // capture before the user drags again must not write garbage.
  liveOrbit = { theta: (s.azimuth * Math.PI) / 180, phi: (s.polar * Math.PI) / 180, radius: s.radius };
  liveReadout.textContent = `azimuth ${s.azimuth.toFixed(1)}deg · polar ${s.polar.toFixed(1)}deg · radius ${s.radius.toFixed(2)}m`;
  updateReadout();
}

function loadModel(key: ModelKey) {
  const model = MODELS.find((m) => m.key === key)!;
  viewer.setAttribute('src', withBase(model.src));
  viewer.setAttribute('alt', model.label);
}

function updateReadout() {
  const s = currentShot();
  readout.textContent =
    `${activeModel} / ${activePosition}\n` +
    `azimuth ${s.azimuth.toFixed(1)}deg · polar ${s.polar.toFixed(1)}deg · radius ${s.radius.toFixed(2)}m`;
  updateOutput();
}

function formatShot(s: CameraShot) {
  return `{ azimuth: ${round(s.azimuth)}, polar: ${round(s.polar)}, radius: ${round(s.radius, 2)} }`;
}

function updateOutput() {
  const blocks = MODELS.map(
    (m) =>
      `  {\n` +
      `    entry: ${formatShot(shots[m.key].entry)},\n` +
      `    optimal: ${formatShot(shots[m.key].optimal)},\n` +
      `    exit: ${formatShot(shots[m.key].exit)},\n` +
      `  }, // ${m.label}`
  );
  output.value = `const PANEL_SHOTS: PanelShots[] = [\n${blocks.join('\n')}\n];`;
}

function round(n: number, decimals = 1) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

modelTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activeModel = tab.dataset.model as ModelKey;
    modelTabs.forEach((t) => t.classList.toggle('active', t === tab));
    loadModel(activeModel);
    // camera-orbit set now is buffered by model-viewer until the new
    // model finishes loading.
    applyShot();
  });
});

slotTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activePosition = tab.dataset.slot as PositionKey;
    slotTabs.forEach((t) => t.classList.toggle('active', t === tab));
    applyShot();
  });
});

let liveOrbit = { theta: (-2.9 * Math.PI) / 180, phi: (85.7 * Math.PI) / 180, radius: 4.58 };

viewer.addEventListener('camera-change', () => {
  liveOrbit = viewer.getCameraOrbit();
  liveReadout.textContent =
    `azimuth ${((liveOrbit.theta * 180) / Math.PI).toFixed(1)}deg · ` +
    `polar ${((liveOrbit.phi * 180) / Math.PI).toFixed(1)}deg · ` +
    `radius ${liveOrbit.radius.toFixed(2)}m`;
});

captureBtn.addEventListener('click', () => {
  const s = currentShot();
  s.azimuth = (liveOrbit.theta * 180) / Math.PI;
  s.polar = (liveOrbit.phi * 180) / Math.PI;
  s.radius = liveOrbit.radius;
  updateReadout();
});

exposureInput.addEventListener('input', () => {
  exposure = parseFloat(exposureInput.value);
  applyLighting();
});
shadowInput.addEventListener('input', () => {
  shadowIntensity = parseFloat(shadowInput.value);
  applyLighting();
});
bgInput.addEventListener('input', () => {
  bgLightness = parseFloat(bgInput.value);
  applyLighting();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = 'Copié !';
    setTimeout(() => (copyBtn.textContent = 'Copier dans le presse-papiers'), 1500);
  });
});

viewer.addEventListener(
  'load',
  () => {
    applyLighting();
    applyShot();
  },
  { once: true }
);
loadModel(activeModel);
