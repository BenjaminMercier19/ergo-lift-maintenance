// Entretien/Réparation tab switcher on the merged /services page. Plain
// show/hide + aria-selected, no animation library needed for a toggle this
// simple. Hash-based so each tab is deep-linkable (e.g. /services#reparation).
const triggers = document.querySelectorAll<HTMLButtonElement>('[data-tab-trigger]');
const panels = document.querySelectorAll<HTMLElement>('[data-tab-panel]');

function activate(id: string) {
  let matched = false;
  triggers.forEach((trigger) => {
    const isActive = trigger.dataset.tabTrigger === id;
    if (isActive) matched = true;
    trigger.setAttribute('aria-selected', String(isActive));
    trigger.style.background = isActive ? 'var(--ink)' : 'transparent';
    trigger.style.color = isActive ? '#fff' : 'var(--ink)';
  });
  if (!matched) return;
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== id;
  });
}

triggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const id = trigger.dataset.tabTrigger;
    if (!id) return;
    activate(id);
    history.replaceState(null, '', `#${id}`);
  });
});

const initialId = window.location.hash.replace('#', '');
if (initialId) activate(initialId);
