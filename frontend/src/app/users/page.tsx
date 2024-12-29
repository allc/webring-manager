'use client';

import { Badge, Card, Group, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserProvider';
import { Website } from '@/types/Website';

export default function Page() {
  interface User {
    id: number;
    name: string;
    email: string;
    superuser: boolean;
    website: Website[];
    createdAt: string;
    activeAt: string;
  }

  const router = useRouter();
  const [user] = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);

  const userList = users.map(user => (
    <Card key={user.id} w='100%' withBorder>
      <Group>
        <Text fw={500}>
          {user.name}
        </Text>
        {user.superuser &&
          <Badge color="red">Superuser</Badge>
        }
      </Group>
      <Text size="sm" c="dimmed">
        {user.email}
      </Text>
      <Text size="sm" c="dimmed">
        Number of websites: {user.website.length}
      </Text>
      <Text size="sm" c="dimmed">
        Created at: {user.createdAt}
      </Text>
      <Text size="sm" c="dimmed">
        Active at: {user.activeAt || 'Never'}
      </Text >
    </Card>
  ));

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user ? user.accessToken : ''}`,
          },
        });
        const json = await response.json();
        if (response.ok) {
          setUsers(json);
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
      loadUsers();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Group mt="md">
        {userList}
      </Group>
    </>
  )
}
