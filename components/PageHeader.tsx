export default function PageHeader({ label }: { label: string }) {
  return (
    <h3 className='mb-4 font-semibold bg-primary/10 p-2 rounded-sm text-center'>
      {label}
    </h3>
  );
}
