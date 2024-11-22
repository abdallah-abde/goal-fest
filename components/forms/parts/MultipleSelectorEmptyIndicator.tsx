export default function MultipleSelectorEmptyIndicator({
  label,
}: {
  label: string;
}) {
  return <p className="empty-indicator">{label}</p>;
}
