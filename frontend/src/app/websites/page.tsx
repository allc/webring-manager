'use client';

import { Button, Checkbox, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const auth = async () => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      router.push('/auth/login');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    if (!response.ok) {
      localStorage.removeItem('access_token');
      router.push('/auth/login');
    }
  }
  auth();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Website">
        {/* Modal content */}
      </Modal>
      <Group mt="md">
        <Button leftSection={<IconPlus />} onClick={open}>Add Website</Button>
      </Group>
    </>
  )
}
