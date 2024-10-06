'use client';

import { Accordion, Badge, Button, Card, Checkbox, Group, Modal, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserProvider';

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useContext(UserContext);
  const [websites, setWebsites] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    mode: 'uncontrolled',
  });

  const loadWebsites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/users/${user.id}/websites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
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

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        loadWebsites();
        form.reset();
        close();
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const websiteList = websites.map(website => (
    <Card key={website.id} w='100%' withBorder>
      <Text fw={500}>
        {website.title}
      </Text>
      <Text size="sm" c="dimmed">
        {website.url}
      </Text>
      <Text size="sm">
        {website.description}
      </Text>
      <Group>
        <Text size="sm" c="dimmed">
          Added at: {website.addedAt}
        </Text >
        {website.requestedAt &&
          <Text size="sm" c="dimmed">
            Last requested at: {website.requestedAt}
          </Text>
        }
      </Group>
    </Card>
  ));

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    } else if (user) {
      loadWebsites();
    }
  }, [user]);

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
