"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingComponent() {
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
  return (
    <div className='flex flex-col gap-8 mb-24'>
      <div>
        <Skeleton className='h-[39px] w-[122px] rounded-xl mb-2' />
        <div className='flex items-center justify-start gap-2'>
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
        </div>
      </div>
      <div>
        <Skeleton className='h-[39px] w-[122px] rounded-xl mb-2' />
        <div className='flex items-center justify-start gap-2'>
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
          <Skeleton className='w-1/3 h-[166px] rounded-xl' />
        </div>
      </div>
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
