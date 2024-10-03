'use client';

import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Page() {
  const form = useForm({
    mode: 'uncontrolled',
  });

  return (
    <form>
      <TextInput
        required
        label="Email"
        placeholder="email@example.com"
      />
      <TextInput
        required
        label="Name"
        placeholder="Name"
      />
      <TextInput
        required
        type='password'
        label="Password"
        placeholder="Password"
      />
      <Group justify="center" mt="md">
        <Button type="submit">Register</Button>
      </Group>
    </form>
  )
}
