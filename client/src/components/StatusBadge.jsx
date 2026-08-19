const LABELS = {
  REPORTED: 'Reported',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

const CLASS = {
  REPORTED: 'badge badge-neutral',
  ASSIGNED: 'badge badge-warning',
  IN_PROGRESS: 'badge badge-primary',
  RESOLVED: 'badge badge-success',
};

export default function StatusBadge({ status }) {
  return <span className={CLASS[status] || 'badge badge-neutral'}>{LABELS[status] || status}</span>;
}
