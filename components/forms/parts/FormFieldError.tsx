export default function FormFieldError({
  error,
}: {
  error: string | undefined;
}) {
  return <>{error && <div className="text-destructive">{error}</div>}</>;
}
