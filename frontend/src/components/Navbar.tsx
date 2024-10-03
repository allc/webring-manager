'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const Title = () => (
  <Link href='/'>
    Webring
  </Link>
)

const NavLink = ({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) => (
  <Link
    href={`${href}`}
    className={`hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-50'}`}
  >
    {label}
  </Link>
)

const NavBar = () => {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-[100]  p-0 w-screen border-b-border border-b-2">
      <div className="container max-w-5xl mx-auto flex justify-between items-center py-4 px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <Title />
        </div>
        <div className="flex space-x-8 px-2">
          {[
            { href: '/auth/login', label: 'Login' },
            { href: '/auth/signup', label: 'Sign-up' },
          ].map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
