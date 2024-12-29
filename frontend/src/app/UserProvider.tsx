'use client'

import { User } from '@/types/User';
import { createContext, useEffect, useState } from 'react'

export const UserContext = createContext<[User | undefined | false, () => Promise<void>]>([undefined, async () => {}]);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | undefined | false>(undefined);
  const auth = async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setUser(false);
      return;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    if (!response.ok) {
      localStorage.removeItem('access_token');
      setUser(false);
    } else {
      const user = await response.json();
      user.accessToken = accessToken;
      setUser(user);
    }
  }
  useEffect(() => {
    auth();
  }, []);

  return <UserContext.Provider value={[user, auth]}>{children}</UserContext.Provider>
}
