'use client';

import { UserContext } from '@/app/UserProvider';
import { Button, Checkbox, Group, PasswordInput, TextInput, UnstyledButton } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

export default function Page() {
  const router = useRouter();
  const [user, auth] = useContext(UserContext);
  const form = useForm({
    mode: 'uncontrolled',
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        alert('Logged in');
        localStorage.setItem('access_token', json.access_token);
        auth();
        router.push('/');
      } else {
        alert(json.message);
      }
    } catch(e: any) {
      alert(e.message);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput
        required
        type='email'
        label="Email"
        placeholder="email@example.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Password"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Group justify="center" mt="md">
        <Button type="submit">Login</Button>
        <UnstyledButton c="dimmed" onClick={() => alert('Try remember better')}>Forgot password?</UnstyledButton>
      </Group>
    </form>
  )
}
