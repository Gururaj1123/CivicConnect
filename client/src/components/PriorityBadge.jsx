const CLASS = {
  P1: 'badge badge-critical',
  P2: 'badge badge-warning',
  P3: 'badge badge-primary',
  P4: 'badge badge-neutral',
};

const LABEL = {
  P1: 'P1 — Critical',
  P2: 'P2 — High',
  P3: 'P3 — Medium',
  P4: 'P4 — Low',
};

export default function PriorityBadge({ level }) {
  return <span className={CLASS[level] || 'badge badge-neutral'}>{LABEL[level] || level}</span>;
}
