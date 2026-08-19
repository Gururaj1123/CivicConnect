const STEPS = [
  { key: 'REPORTED', label: 'Reported' },
  { key: 'ASSIGNED', label: 'Assigned to Department' },
  { key: 'IN_PROGRESS', label: 'Work In Progress' },
  { key: 'RESOLVED', label: 'Resolved' },
];

const ORDER = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

export default function ProgressTimeline({ status }) {
  const currentIndex = ORDER.indexOf(status);

  return (
    <ol className="timeline">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step.key} className={done ? 'timeline-step done' : 'timeline-step'}>
            <span className="timeline-marker">{done ? '✓' : '○'}</span>
            <span className="timeline-label">{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
