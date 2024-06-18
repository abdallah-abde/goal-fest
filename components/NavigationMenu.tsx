import Link from "next/link";

export default function NavigationMenu() {
  return (
    <nav className='w-full mx-auto px-8 border-b-2'>
      <ul className='flex justify-between items-center py-4'>
        <li>
          <Link
            href='/'
            className='font-bold bg-background text-foreground hover:bg-secondary p-2 rounded-sm transition duration-150'
          >
            Goal Fest Logo
          </Link>
        </li>
        <li>
          <Link
            className='font-bold bg-background text-foreground hover:bg-secondary p-2 rounded-sm transition duration-150 mr-4'
            href='#'
          >
            Login
          </Link>
          <Link
            className='font-bold bg-background text-foreground hover:bg-secondary p-2 rounded-sm transition duration-150'
            href='#'
          >
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}
