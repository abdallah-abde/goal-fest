export default function CardsSectionContainer({
  label,
  children,
  className,
}: {
  label?: string | null;
  children: React.ReactNode;
  className?: string | null;
}) {
  return (
    <div>
      {label && <h2 className="font-bold mb-2">{label}</h2>}
      <div
        className={`flex flex-wrap justify-between gap-2 *:w-full *:xs:w-[calc((100%/2)-4px)] *:md:w-[calc((100%/3)-6px)] *:bg-primary/10 ${
          className || ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
