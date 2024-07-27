import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export default function NavigationMenu() {
  const linkStyles =
    "font-bold bg-foreground text-background hover:bg-foreground/75 p-2 rounded-sm transition duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-outline";

  return (
    <nav className='mx-auto px-4 md:container'>
      <ul className='flex items-center'>
        <li className='mr-auto py-6 '>
          <Link href='/' className={linkStyles}>
            Goal Fest
          </Link>
        </li>
        <li className='py-6'>
          <Link className={linkStyles + " mr-4"} href='#'>
            Login
          </Link>
          <Link className={linkStyles + " mr-4"} href='#'>
            Register
          </Link>
        </li>
        <li>
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
}
