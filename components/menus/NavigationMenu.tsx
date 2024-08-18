import Link from "next/link";
import { ModeToggle } from "@/components/theme/ModeToggle";
import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { LogIn, LogOut, CircleUserRound, Settings } from "lucide-react";

export default async function NavigationMenu() {
  const session = await auth();

  const linkStyles =
    "font-bold bg-foreground text-background hover:bg-foreground/75 p-2 rounded-sm transition duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-outline";

  return (
    <nav className='mx-auto px-4 md:container'>
      <ul className='flex items-center space-x-2'>
        <li className='mr-auto py-6 '>
          <Link href='/' className={linkStyles}>
            Goal Fest
          </Link>
        </li>

        <li className='h-10 w-10'>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='m-0 rounded-full dark:hover:bg-muted-foreground/10'
                >
                  <Avatar>
                    {session?.user?.image && (
                      <AvatarImage
                        src={session?.user?.image}
                        className='object-cover'
                      />
                    )}
                    <AvatarFallback className='text-lg font-normal'>
                      {session?.user?.name?.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='min-w-40 cursor-pointer'>
                <DropdownMenuLabel className='flex flex-col gap-1'>
                  <span>{session?.user?.name}</span>
                  <span>Email</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='w-full'>
                  <Link
                    href='#'
                    className='cursor-pointer flex items-center justify-start'
                  >
                    <CircleUserRound className='h-4 w-4 mr-2' />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='w-full'>
                  <Link
                    href='/dashboard'
                    className='cursor-pointer flex items-center justify-start'
                  >
                    <Settings className='h-4 w-4 mr-2' />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='w-full'>
                  <form
                    action={async () => {
                      "use server";

                      await signOut();
                    }}
                  >
                    <Button
                      type='submit'
                      variant='ghost'
                      className='justify-start p-0 px-1'
                    >
                      <LogOut className='h-4 w-4 mr-2' />
                      Logout
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              className='m-0 rounded-full bg-background hover:bg-muted border dark:hover:bg-muted-foreground/10'
            >
              <Link href='/auth/login'>
                <LogIn className='h-[1.2rem] w-[1.2rem] ' />
              </Link>
            </Button>
          )}
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
