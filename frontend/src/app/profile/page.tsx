'use client';

import { Button, Checkbox, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserProvider';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    }
  }, [user]);

  return (
    <>
      {user &&
        <form>
          <TextInput
            disabled
            label="Name"
            value={user.name}
          />
          <TextInput
            disabled
            label="Email"
            value={user.email}
          />
          <TextInput
            disabled
            label="Created at"
            value={user.createdAt}
          />
          <TextInput
            disabled
            label="Active at"
            value={user.activeAt || 'Never'}
          />
        </form>
      }
    </>
  )
}
