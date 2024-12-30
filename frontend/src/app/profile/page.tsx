'use client';

import { Button, Checkbox, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { UserContext } from '../UserProvider';

export default function Page() {
  const router = useRouter();
  const [user, auth] = useContext(UserContext);
  const updateForm = useForm({
    mode: 'uncontrolled',
  });
  const changePasswordForm = useForm({
    mode: 'uncontrolled',
  });

  const handleUpdate = async (values: Record<string, string>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/users/${user ? user.id : 0}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user ? user.accessToken : ''}`,
        },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        auth();
      } else {
        alert(json.message);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        throw e;
      }
    }
  };

  const handleUpdatePassword = async (values: Record<string, string>) => {
    //TODO: implement
    console.log(values);
  };

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    auth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user) {
      const initialValues = { name: user.name, email: user.email };
      updateForm.setInitialValues(initialValues);
      updateForm.setValues(initialValues);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {user &&
        <>
          <form onSubmit={updateForm.onSubmit(handleUpdate)}>
            <TextInput
              required
              label="Name"
              key={updateForm.key('name')}
              {...updateForm.getInputProps('name')}
            />
            <TextInput
              required
              label="Email"
              key={updateForm.key('email')}
              {...updateForm.getInputProps('email')}
            />
            <Button type='submit' mt='xs'>Update</Button>
          </form>
          <form onSubmit={changePasswordForm.onSubmit(handleUpdatePassword)}>
            <PasswordInput
              required
              label="Old Password"
              key={changePasswordForm.key('oldPassword')}
              {...changePasswordForm.getInputProps('oldPassword')}
            />
            <PasswordInput
              required
              label="New Password"
              key={changePasswordForm.key('newPassword')}
              {...changePasswordForm.getInputProps('newPassword')}
            />
            <PasswordInput
              required
              label="Confirm New Password"
              key={changePasswordForm.key('confirmNewPassword')}
              {...changePasswordForm.getInputProps('confirmNewPassword')}
            />
            <Button type='submit' mt='xs'>Change Password</Button>
          </form>
          <form>
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
        </>
      }
    </>
  )
}
