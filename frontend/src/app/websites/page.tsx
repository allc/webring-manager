'use client';

import { Card, Group, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserProvider';
import { Website } from '@/types/Website';

export default function Page() {
  const router = useRouter();
  const [user] = useContext(UserContext);
  const [websites, setWebsites] = useState<Website[]>([]);

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
    const loadWebsites = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user ? user.accessToken : ''}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          setWebsites(json);
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
    }

    if (user === false) {
      router.push('/auth/login');
    } else if (user && !user.superuser) {
      alert('No permission!');
      router.push('/');
    } else if (user) {
      loadWebsites();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Group mt="md">
        {websiteList}
      </Group>
    </>
  )
}
