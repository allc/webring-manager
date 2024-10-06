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
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setUsers(json);
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  }

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
    if (user === false) {
      router.push('/auth/login');
    } else if (user && !user.superuser) {
      alert('No permission!');
      router.push('/');
    } else if (user) {
      loadUsers();
    }
  }, [user]);

  return (
    <>
      <Group mt="md">
        {userList}
      </Group>
    </>
  )
}
