"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Skeletons() {
  return (
    <div>
      <Skeleton className="h-[50px] w-[100px] rounded-xl mb-3" />
      <div className="flex items-center justify-start gap-2">
        {Array.from({ length: 3 }).map((a, _) => (
          <Skeleton key={_} className="w-1/3 h-[180px] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function PopularMatchesSkeleton({ text }: { text: string }) {
  return (
    <div>
      <p className="pb-2 text-muted-foreground text-sm">{text}</p>
      <Skeleton className="rounded-none w-auto h-[210px] bg-primary/20 flex flex-col gap-1">
        <div className="flex items-center justify-between mx-2 my-2 h-[50px]">
          <div className="flex items-center justify-start gap-2">
            <Skeleton className="w-20 h-[40px] bg-primary/30" />
            <div className="flex flex-col items-start justify-center gap-2">
              <Skeleton className="w-20 h-[15px] bg-primary/30" />
              <Skeleton className="w-16 h-[12px] bg-primary/30" />
            </div>
          </div>

          <Skeleton className="w-20 h-[15px] bg-primary/30" />
        </div>
        <div className="h-[160px] mx-2 space-y-2">
          {Array.from({ length: 3 }).map((a, _) => (
            <div
              key={_}
              className="flex items-center justify-center gap-8 h-[40px]"
            >
              <Skeleton className="w-14 h-[15px] bg-primary/30" />
              <Skeleton className="w-10 h-[30px] bg-primary/30" />

              <Skeleton className="w-10 h-[30px] bg-primary/30" />
              <Skeleton className="w-14 h-[15px] bg-primary/30" />
            </div>
          ))}
        </div>
      </Skeleton>
    </div>
  );
}

export function MultipleSelectorLoadingIndicator() {
  return (
    <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
      Loading...
    </p>
  );
}

export function LoadingSpinner({
  className = "",
}: {
  className?: string | null;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function MatchesSkeleton() {
  function _renderFirstAndLastLine() {
    return (
      <div className="flex justify-between">
        {Array.from({ length: 2 }).map((a, _) => (
          <Skeleton
            key={_}
            className="h-[25px] w-[75px] rounded-xl mb-2 bg-primary/25"
          />
        ))}
      </div>
    );
  }

  const _teamNameStyles = "h-[25px] w-[100px] rounded-xl mb-2 bg-primary/25";
  const _teamFlagStyles = "h-[30px] w-[30px] rounded-xl mb-2 bg-primary/25";

  return (
    <div className="md:overflow-auto grow md:pr-2 space-y-8">
      {Array.from({ length: 2 }).map((a, _) => (
        <div key={_} className="flex flex-col gap-4">
          <Skeleton className="h-[39px] w-[122px] rounded-xl mb-2 bg-primary/20 flex items-center justify-center">
            <Skeleton className="h-[24px] w-[102px] rounded-xl bg-primary/25" />
          </Skeleton>
          <div className="flex flex-col items-center justify-start gap-2">
            {Array.from({ length: 2 }).map((b, _) => (
              <Skeleton
                key={_}
                className="w-full h-[166px] rounded-xl bg-primary/20 space-y-4 p-6"
              >
                {_renderFirstAndLastLine()}
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-2">
                    <Skeleton className={_teamNameStyles} />
                    <Skeleton className={_teamFlagStyles} />
                    <Skeleton className="h-[30px] w-[100px] rounded-xl mb-2 bg-primary/30 mx-1 sm:mx-2 md:mx-4" />
                    <Skeleton className={_teamFlagStyles} />
                    <Skeleton className={_teamNameStyles} />
                  </div>
                </div>
                {_renderFirstAndLastLine()}
              </Skeleton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeaguesSkeleton() {
  return (
    <div className="flex flex-col md:flex-wrap md:flex-row gap-4 py-24">
      {Array.from({ length: 6 }).map((a, _) => (
        <Skeleton
          key={_}
          className="h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5"
        />
      ))}
    </div>
  );
}

export function EditionHomeSkeleton() {
  const _Field = ({ hidden }: { hidden: boolean }) => (
    <Skeleton
      className={cn(
        hidden ? "hidden md:block" : "",
        "h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5"
      )}
    />
  );

  return (
    <div className="md:overflow-auto grow md:pr-2 space-y-8">
      {Array.from({ length: 3 }).map((a, _) => (
        <div
          key={_}
          className="flex flex-col md:flex-row md:flex-wrap gap-2 justify-between"
        >
          <_Field hidden={true} />
          <_Field hidden={true} />
          <_Field hidden={false} />
          <_Field hidden={false} />
        </div>
      ))}
    </div>
  );
}

export function GroupsSkeleton({
  text,
  numberOfTables = 2,
}: {
  text?: string;
  numberOfTables?: number;
}) {
  const _SmallField = () => <Skeleton className="h-[25px] w-[70px]" />;
  const _BigField = () => <Skeleton className="h-[25px] w-[75%]" />;

  return (
    <div>
      <p className="pb-2 text-muted-foreground text-sm">{text}</p>
      <div className="md:overflow-auto grow md:pr-2 space-y-8">
        {Array.from({ length: numberOfTables }).map((a, _) => (
          <div key={_}>
            <Skeleton className="h-[40px] w-full rounded-none bg-primary/10 flex items-center justify-center">
              <_SmallField />
            </Skeleton>
            <Skeleton className="h-[60px] w-full rounded-none bg-primary/15 flex items-center justify-around">
              <_SmallField />
              <_BigField />
            </Skeleton>
            <Skeleton className="h-[240px] w-full rounded-none bg-primary/25 flex flex-col justify-evenly items-center gap-2">
              {Array.from({ length: 4 }).map((a, _) => (
                <div
                  key={_}
                  className="flex items-center justify-around w-full"
                >
                  <_SmallField />
                  <_BigField />
                </div>
              ))}
            </Skeleton>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardTableSkeleton() {
  const _SmallField = () => (
    <Skeleton className="h-[25px] w-[60px] xs:w-[75px] sm:w-[90px]" />
  );
  function _BigField({ bg = "" }: { bg?: string | "" }) {
    return (
      <Skeleton className={cn(bg, "h-[25px] w-[50%] xs:w-[60%] sm:w-[75%]")} />
    );
  }

  return (
    <div className="space-y-4">
      <Skeleton className="h-[40px] w-full rounded-none bg-primary/10 flex items-center justify-center">
        <_SmallField />
      </Skeleton>
      <div className="w-full space-y-2 md:space-y-0 md:flex flex-row-reverse items-center justify-between gap-4">
        <Skeleton className="h-[38px] w-[200px] bg-primary/10 ml-auto md:ml-0" />
        <Skeleton className="h-[38px] w-full md:w-[75%] bg-primary/10" />
      </div>
      <div>
        <div className="flex items-center justify-around w-full h-[50px] bg-primary/10">
          <_SmallField />
          <_BigField bg="bg-transparent" />
          <div className="w-1 flex flex-col gap-1">
            {Array.from({ length: 3 }).map((a, _) => (
              <Skeleton
                key={_}
                className="w-1 h-1 rounded-full bg-transparent"
              />
            ))}
          </div>
        </div>
        <Skeleton className="h-[200px] w-full rounded-none bg-primary/25 flex flex-col justify-evenly items-center gap-1">
          {Array.from({ length: 5 }).map((a, _) => (
            <div key={_} className="flex items-center justify-around w-full">
              <_SmallField />
              <_BigField />
              <div className="w-1 flex flex-col gap-1">
                {Array.from({ length: 3 }).map((a, _) => (
                  <Skeleton key={_} className="w-1 h-1 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </Skeleton>
      </div>
      <div className="w-full flex items-center justify-center gap-3">
        {Array.from({ length: 5 }).map((a, _) => (
          <Skeleton
            key={_}
            className="w-[30px] h-[30px] rounded-sm bg-primary/10"
          />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <>
      <Skeleton className="h-[40px] w-full rounded-md bg-primary/20 mb-6 flex items-center justify-center">
        <Skeleton className="h-[25px] w-[60px]" />
      </Skeleton>
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((a, _) => (
          <div
            key={_}
            className="space-y-8 lg:space-y-0 lg:grid grid-cols-2 gap-4"
          >
            {Array.from({ length: 2 }).map((a, _) => (
              <div key={_} className="flex flex-col gap-4">
                <Skeleton className="h-[25px] w-[70px] bg-primary/10" />
                <Skeleton className="h-[40px] w-full rounded-md bg-primary/10 " />
              </div>
            ))}
          </div>
        ))}
        <Skeleton className="h-[40px] w-[80px] rounded-md bg-primary/20" />
      </div>
    </>
  );
}

export function HistorySkeleton() {
  return (
    <>
      <Skeleton className="h-[40px] w-full rounded-md bg-primary/20 mb-6 flex items-center justify-center">
        <Skeleton className="h-[25px] w-[60px]" />
      </Skeleton>
      <div className="w-full space-y-4">
        {Array.from({ length: 2 }).map((a, _) => (
          <div key={_} className="flex items-end gap-2 ">
            <div className="hidden sm:block">
              <Skeleton className="w-[90px] h-[120px] bg-primary/20" />
            </div>
            <div className="flex flex-col gap-2 ">
              {Array.from({ length: 3 }).map((a, _) => (
                <Skeleton key={_} className="w-[80px] h-[25px] bg-primary/20" />
              ))}
            </div>
            <div className="flex flex-col gap-2 ">
              {Array.from({ length: 2 }).map((a, _) => (
                <Skeleton key={_} className="w-[80px] h-[25px] bg-primary/20" />
              ))}
            </div>
            <Skeleton className="hidden xs:block w-[80px] h-[25px] bg-primary/20" />
          </div>
        ))}
      </div>
    </>
  );
}
