'use client';

import { Button, Checkbox, Group, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const form = useForm({
    mode: 'uncontrolled',
  });

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        alert('User registered');
        router.push('/auth/login');
      } else {
        const json = await response.json();
        alert(json.message);
      }
    } catch(e: any) {
      alert(e.message);
    }
  }

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
      <TextInput
        required
        label="Name"
        placeholder="Name"
        key={form.key('name')}
        {...form.getInputProps('name')}
      />
      <PasswordInput
        required
        label="Password"
        placeholder="Password"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Group justify="center" mt="md">
        <Button type="submit">Sign Up</Button>
      </Group>
    </form>
  )
}
