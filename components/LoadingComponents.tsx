"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingComponents() {
  return (
    <div>
      <Skeleton className='h-[50px] w-[100px] rounded-xl mb-3' />
      <div className='flex items-center justify-start gap-2'>
        <Skeleton className='w-1/3 h-[180px] rounded-xl' />
        <Skeleton className='w-1/3 h-[180px] rounded-xl' />
        <Skeleton className='w-1/3 h-[180px] rounded-xl' />
      </div>
    </div>
  );
}

export function MatchesSkeleton() {
  function renderFirstAndLastLine() {
    return (
      <div className='flex justify-between'>
        <Skeleton className='h-[25px] w-[75px] rounded-xl mb-2 bg-primary/25' />
        <Skeleton className='h-[25px] w-[75px] rounded-xl mb-2 bg-primary/25' />
      </div>
    );
  }

  const teamNameStyles = "h-[25px] w-[100px] rounded-xl mb-2 bg-primary/25";
  const teamFlagStyles = "h-[30px] w-[30px] rounded-xl mb-2 bg-primary/25";

  return (
    <div className='md:overflow-auto grow md:pr-2 space-y-8'>
      {Array.from({ length: 2 }).map((a) => (
        <div className='flex flex-col gap-4'>
          <Skeleton className='h-[39px] w-[122px] rounded-xl mb-2 bg-primary/20 flex items-center justify-center'>
            <Skeleton className='h-[24px] w-[102px] rounded-xl bg-primary/25' />
          </Skeleton>
          <div className='flex flex-col items-center justify-start gap-2'>
            {Array.from({ length: 2 }).map((b) => (
              <Skeleton className='w-full h-[166px] rounded-xl bg-primary/20 space-y-4 p-6'>
                {renderFirstAndLastLine()}
                <div className='flex justify-center items-center'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className={teamNameStyles} />
                    <Skeleton className={teamFlagStyles} />
                    <Skeleton className='h-[30px] w-[100px] rounded-xl mb-2 bg-primary/30 mx-1 sm:mx-2 md:mx-4' />
                    <Skeleton className={teamFlagStyles} />
                    <Skeleton className={teamNameStyles} />
                  </div>
                </div>
                {renderFirstAndLastLine()}
              </Skeleton>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TournamentsSkeleton() {
  return (
    <div className='flex flex-col md:flex-wrap md:flex-row gap-4 py-24 '>
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
      <Skeleton className='h-[250px] w-full md:w-[200px] rounded-xl bg-primary/5' />
    </div>
  );
}

export function EditionHomeSkeleton() {
  return (
    <div className='md:overflow-auto grow md:pr-2 space-y-8'>
      <div className='flex flex-col md:flex-row md:flex-wrap gap-2 justify-between'>
        <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
        <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
        <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
        <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
      </div>
      <div>
        <Skeleton className='h-[50px] w-[125px] rounded-xl bg-primary/5 mb-4' />
        <div className='flex flex-col md:flex-row md:flex-wrap gap-2 justify-between'>
          <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
        </div>
      </div>
      <div>
        <Skeleton className='h-[50px] w-[125px] rounded-xl bg-primary/5 mb-4' />
        <div className='flex flex-col md:flex-row md:flex-wrap gap-2 justify-between'>
          <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='hidden md:block h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
          <Skeleton className='h-[125px] w-full md:w-[225px] rounded-xl bg-primary/5' />
        </div>
      </div>
    </div>
  );
}

export function GroupsSkeleton() {
  return (
    <div className='md:overflow-auto grow md:pr-2 space-y-8'>
      <div className=''>
        <Skeleton className='h-[40px] w-full rounded-none bg-primary/10 flex items-center justify-center'>
          <Skeleton className='h-[25px] w-[70px]' />
        </Skeleton>
        <Skeleton className='h-[60px] w-full rounded-none bg-primary/15 flex items-center justify-around'>
          <Skeleton className='h-[25px] w-[70px]' />
          <Skeleton className='h-[25px] w-[75%]' />
        </Skeleton>
        <Skeleton className='h-[240px] w-full rounded-none bg-primary/25 flex flex-col justify-evenly items-center gap-2'>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
        </Skeleton>
      </div>
      <div className=''>
        <Skeleton className='h-[40px] w-full rounded-none bg-primary/10 flex items-center justify-center'>
          <Skeleton className='h-[25px] w-[70px]' />
        </Skeleton>
        <Skeleton className='h-[60px] w-full rounded-none bg-primary/15 flex items-center justify-around'>
          <Skeleton className='h-[25px] w-[70px]' />
          <Skeleton className='h-[25px] w-[75%]' />
        </Skeleton>
        <Skeleton className='h-[240px] w-full rounded-none bg-primary/25 flex flex-col justify-evenly items-center gap-2'>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
          <div className='flex items-center justify-around w-full'>
            <Skeleton className='h-[25px] w-[70px]' />
            <Skeleton className='h-[25px] w-[75%]' />
          </div>
        </Skeleton>
      </div>
    </div>
  );
}
