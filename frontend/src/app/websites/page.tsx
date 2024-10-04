'use client';

import { Accordion, Button, Card, Checkbox, Group, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter();
  const access_token = localStorage.getItem('access_token');
  const auth = async () => {
    if (!access_token) {
      router.push('/auth/login');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`,
      }
    });
    if (!response.ok) {
      localStorage.removeItem('access_token');
      router.push('/auth/login');
    }
  }
  auth();

  const [websites, setWebsites] = useState<any[]>([]);
  const loadWebsites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setWebsites(json);
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

  const [opened, { open, close }] = useDisclosure(false);
  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        loadWebsites();
        close();
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const form = useForm({
    mode: 'uncontrolled',
  });

  useEffect(() => {
    loadWebsites();
  }, []);
  const websiteList = websites.map(website => (
    <Card w='100%' withBorder>
      <Text fw={500}>
        {website.title}
      </Text>
      <Text size="sm" c="dimmed">
        {website.description}
      </Text>
      <Text size="sm" c="dimmed">
        Added at: {website.addedAt}
      </Text>
      {website.requestedAt &&
        < Text size="sm" c="dimmed">
          Last requested at: {website.requestedAt}
        </Text>
      }
    </Card >
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add Website">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            type='url'
            label="URL"
            placeholder="https://example.com/"
            key={form.key('url')}
            {...form.getInputProps('url')}
          />
          <TextInput
            required
            label="Title"
            placeholder="My Website"
            key={form.key('title')}
            {...form.getInputProps('title')}
          />
          <TextInput
            label="Description"
            placeholder="Website description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <Group justify="center" mt="md">
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>
      <Group mt="md">
        <Button leftSection={<IconPlus />} onClick={open}>Add Website</Button>
      </Group>
      <Group mt="md">
        {websiteList}
      </Group>
    </>
  )
}
