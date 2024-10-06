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

  const loadWebsites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
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
        <Text size="sm" c="dimmed">
          Last API requested at: {website.requestedAt || 'Never'}
        </Text>
      </Group>
      <Text size="sm" c="dimmed">
        Owner: {website.owner.name} ({website.owner.email})
      </Text>
    </Card>
  ));

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    } else if (user && !user.superuser) {
      alert('No permission!');
      router.push('/');
    } else if (user) {
      loadWebsites();
    }
  }, [user]);

  return (
    <>
      <Group mt="md">
        {websiteList}
      </Group>
    </>
  )
}
