import { TbBallFootballOff } from "react-icons/tb";

export default function NoDataToShow({ message }: { message: string }) {
  return (
    <div className="bg-primary/10 border h-32 md:h-48 lg:h-32 xl:h-48 flex flex-col items-center justify-center gap-2 md:gap-4 lg:gap-2 xl:gap-4">
      <TbBallFootballOff className="size-14 md:size-20 lg:size-14 xl:size-20 text-muted-foreground" />
      <p className="text-lg md:text-2xl lg:text-lg xl:text-2xl text-muted-foreground font-semibold">
        {message}
      </p>
    </div>
  );
}
