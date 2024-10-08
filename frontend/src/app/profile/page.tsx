'use client';

import { Button, Checkbox, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserProvider';

export default function Page() {
  const router = useRouter();
  const [user, auth] = useContext(UserContext);

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    }
  }, [user]);

  useEffect(() => {
    auth();
  }, []);

  return (
    <>
      {user &&
        <form>
          <TextInput
            readOnly
            label="Name"
            value={user.name}
          />
          <TextInput
            readOnly
            label="Email"
            value={user.email}
          />
          <TextInput
            readOnly
            label="Created at"
            value={user.createdAt}
          />
          <TextInput
            readOnly
            label="Active at"
            value={user.activeAt || 'Never'}
          />
          <Checkbox
            readOnly
            label="Superuser"
            checked={user.superuser}
            mt='xs'
          />
        </form>
      }
    </>
  )
}
