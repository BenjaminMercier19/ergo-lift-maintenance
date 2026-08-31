// Local-only tool: drag/zoom the SkiErg by hand, dial in exposure/shadow/
// background per "moment" of the homepage story, and read out exact values
// to paste back into hero-story.ts's `keyframes` array. Never linked from
// the site nav, not meant to ship - see plan notes to delete before merge.
import { withBase } from '../utils/url';

type Slot = {
  azimuth: number;
  polar: number;
  radius: number;
  exposure: number;
  shadowIntensity: number;
  bgLightness: number;
};

const MODEL_SRC = '/models/skierg.glb';

const mount = document.querySelector<HTMLElement>('[data-mount]')!;
const wrap = document.querySelector<HTMLElement>('#viewer-wrap')!;
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-slot]'));
const exposureInput = document.querySelector<HTMLInputElement>('#exposure')!;
const shadowInput = document.querySelector<HTMLInputElement>('#shadow')!;
const bgInput = document.querySelector<HTMLInputElement>('#bg')!;
const readout = document.querySelector<HTMLElement>('#readout')!;
const liveReadout = document.querySelector<HTMLElement>('#live-readout')!;
const output = document.querySelector<HTMLTextAreaElement>('#output')!;
const captureBtn = document.querySelector<HTMLButtonElement>('#capture')!;
const copyBtn = document.querySelector<HTMLButtonElement>('#copy')!;

const slots: Slot[] = [
  { azimuth: -20, polar: 74, radius: 2.2, exposure: 0.6, shadowIntensity: 0.7, bgLightness: 2 },
  { azimuth: 110, polar: 74, radius: 1.75, exposure: 0.95, shadowIntensity: 1, bgLightness: 7 },
  { azimuth: 250, polar: 74, radius: 1.3, exposure: 1.2, shadowIntensity: 1.3, bgLightness: 11 },
  { azimuth: 340, polar: 74, radius: 1.05, exposure: 1.35, shadowIntensity: 1.5, bgLightness: 14 },
];
let active = 0;

const script = document.createElement('script');
script.type = 'module';
script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
document.head.appendChild(script);

const viewer = document.createElement('model-viewer') as HTMLElement & {
  exposure: number;
  getCameraOrbit: () => { theta: number; phi: number; radius: number };
};
viewer.setAttribute('src', withBase(MODEL_SRC));
viewer.setAttribute('alt', 'SkiErg');
viewer.setAttribute('camera-controls', '');
viewer.setAttribute('touch-action', 'pan-y');
viewer.setAttribute('environment-image', 'neutral');
viewer.setAttribute('interaction-prompt', 'none');
mount.appendChild(viewer);

function applySlot(i: number) {
  const s = slots[i];
  viewer.setAttribute('camera-orbit', `${s.azimuth}deg ${s.polar}deg ${s.radius}m`);
  viewer.exposure = s.exposure;
  viewer.setAttribute('shadow-intensity', String(s.shadowIntensity));
  wrap.style.backgroundColor = `hsl(0 0% ${s.bgLightness}%)`;
  exposureInput.value = String(s.exposure);
  shadowInput.value = String(s.shadowIntensity);
  bgInput.value = String(s.bgLightness);
  updateReadout();
}

function updateReadout() {
  const s = slots[active];
  readout.textContent =
    `azimuth ${s.azimuth.toFixed(1)}deg · polar ${s.polar.toFixed(1)}deg · radius ${s.radius.toFixed(2)}m\n` +
    `exposure ${s.exposure.toFixed(2)} · ombre ${s.shadowIntensity.toFixed(2)} · fond ${s.bgLightness}%`;
  updateOutput();
}

function updateOutput() {
  const lines = slots.map(
    (s) =>
      `  { azimuth: ${round(s.azimuth)}, radius: ${round(s.radius, 2)}, exposure: ${round(s.exposure, 2)}, shadowIntensity: ${round(s.shadowIntensity, 2)}, bgLightness: ${round(s.bgLightness)} },`
  );
  output.value = `const keyframes = [\n${lines.join('\n')}\n];\n// polar (tilt) captured: ${slots.map((s) => round(s.polar)).join(', ')}deg`;
}

function round(n: number, decimals = 1) {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    active = i;
    tabs.forEach((t, j) => t.classList.toggle('active', j === i));
    applySlot(i);
  });
});

let liveOrbit = { theta: (-20 * Math.PI) / 180, phi: (74 * Math.PI) / 180, radius: 2.2 };

viewer.addEventListener('camera-change', () => {
  liveOrbit = viewer.getCameraOrbit();
  liveReadout.textContent =
    `azimuth ${((liveOrbit.theta * 180) / Math.PI).toFixed(1)}deg · ` +
    `polar ${((liveOrbit.phi * 180) / Math.PI).toFixed(1)}deg · ` +
    `radius ${liveOrbit.radius.toFixed(2)}m`;
});

captureBtn.addEventListener('click', () => {
  const s = slots[active];
  s.azimuth = (liveOrbit.theta * 180) / Math.PI;
  s.polar = (liveOrbit.phi * 180) / Math.PI;
  s.radius = liveOrbit.radius;
  updateReadout();
});

exposureInput.addEventListener('input', () => {
  slots[active].exposure = parseFloat(exposureInput.value);
  viewer.exposure = slots[active].exposure;
  updateReadout();
});
shadowInput.addEventListener('input', () => {
  slots[active].shadowIntensity = parseFloat(shadowInput.value);
  viewer.setAttribute('shadow-intensity', shadowInput.value);
  updateReadout();
});
bgInput.addEventListener('input', () => {
  slots[active].bgLightness = parseFloat(bgInput.value);
  wrap.style.backgroundColor = `hsl(0 0% ${bgInput.value}%)`;
  updateReadout();
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(output.value).then(() => {
    copyBtn.textContent = 'Copié !';
    setTimeout(() => (copyBtn.textContent = 'Copier dans le presse-papiers'), 1500);
  });
});

viewer.addEventListener('load', () => applySlot(0), { once: true });
