'use client';

import { Accordion, ActionIcon, Badge, Button, Card, Checkbox, Code, CopyButton, Group, Modal, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconApi, IconBrandJavascript, IconBrandNextjs, IconBrandReact, IconCopy, IconEdit, IconEye, IconFileDescription, IconFileInfo, IconPlus, IconTool } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserProvider';

export default function Page() {
  const router = useRouter();
  const [user, auth] = useContext(UserContext);
  const [websites, setWebsites] = useState<any[]>([]);
  const [currentEditingWebsiteId, setCurrentEditingWebsiteId] = useState<any>();
  const [currentInstructionWebsite, setCurrentInstructionWebsite] = useState<any>({});
  const [addWebsiteOpened, { open: openAddWebsite, close: closeAddWebsite }] = useDisclosure(false);
  const [editWebsiteOpened, { open: openEditWebsite, close: closeEditWebsite }] = useDisclosure(false);
  const [instructionOpened, { open: openInstruction, close: closeInstruction }] = useDisclosure(false);
  const addWebsiteForm = useForm({
    mode: 'uncontrolled',
  });
  const editWebsiteForm = useForm({
    mode: 'controlled',
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

  const handleAdd = async (values: any) => {
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
        addWebsiteForm.reset();
        closeAddWebsite();
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const addWebsiteModal = (
    <Modal opened={addWebsiteOpened} onClose={closeAddWebsite} title="Add Website">
      <form onSubmit={addWebsiteForm.onSubmit(handleAdd)}>
        <TextInput
          required
          type='url'
          label="URL"
          placeholder="https://example.com/"
          key={addWebsiteForm.key('url')}
          {...addWebsiteForm.getInputProps('url')}
        />
        <TextInput
          required
          label="Title"
          placeholder="My Website"
          key={addWebsiteForm.key('title')}
          {...addWebsiteForm.getInputProps('title')}
        />
        <TextInput
          label="Description"
          placeholder="Website description"
          key={addWebsiteForm.key('description')}
          {...addWebsiteForm.getInputProps('description')}
        />
        <Group justify="center" mt="md">
          <Button variant='light' type="submit">Add</Button>
        </Group>
      </form>
    </Modal>
  )

  const initialiseEditWebsiteForm = (website: any) => {
    setCurrentEditingWebsiteId(website.id);
    const initialFormData = { url: website.url, title: website.title, description: website.description };
    editWebsiteForm.setInitialValues(initialFormData);
    editWebsiteForm.setValues(initialFormData);
    openEditWebsite();
  }

  const handleEdit = async (values: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/${currentEditingWebsiteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(values),
      });
      const json = await response.json();
      if (response.ok) {
        loadWebsites();
        editWebsiteForm.reset();
        closeEditWebsite();
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/${currentEditingWebsiteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });
      const json = await response.json();
      if (response.ok) {
        loadWebsites();
        editWebsiteForm.reset();
        closeEditWebsite();
      } else {
        alert(json.message);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const editWebsiteModal = (
    <Modal opened={editWebsiteOpened} onClose={closeEditWebsite} title="Edit Website">
      <form onSubmit={editWebsiteForm.onSubmit(handleEdit)}>
        <TextInput
          required
          type='url'
          label="URL"
          key={editWebsiteForm.key('url')}
          {...editWebsiteForm.getInputProps('url')}
        />
        <TextInput
          required
          label="Title"
          key={editWebsiteForm.key('title')}
          {...editWebsiteForm.getInputProps('title')}
        />
        <TextInput
          label="Description"
          key={editWebsiteForm.key('description')}
          {...editWebsiteForm.getInputProps('description')}
        />
        <Group justify="center" mt="md">
          <Button variant='light' type="submit" value='update'>Update</Button>
          <Button variant='filled' color="red" value='delete' onClick={() => handleDelete()}>Delete</Button>
        </Group>
      </form>
    </Modal>
  )

  const instructionJsCode = `<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_API_SERVER}/api/webring.css">
<webring inject id="webring" api-server="${process.env.NEXT_PUBLIC_API_SERVER}" url="${currentInstructionWebsite.url}">
</webring>
<!-- TODO: add integrity -->
<script src="${process.env.NEXT_PUBLIC_API_SERVER}/api/webring.js"></script>`;
  const instructionApiUrl_ = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/neighbours`);
  instructionApiUrl_.search = new URLSearchParams({currentUrl: currentInstructionWebsite.url}).toString();
  const instructionApiUrl = instructionApiUrl_.toString();

  const instructionModal = (
    <Modal size='xl' opened={instructionOpened} onClose={closeInstruction} title={`Add Webring to ${currentInstructionWebsite.title}`}>
      <Tabs defaultValue="api">
        <Tabs.List>
          <Tabs.Tab value="api" leftSection={<IconApi />}>
            API
          </Tabs.Tab>
          <Tabs.Tab value="js" leftSection={<IconBrandJavascript />}>
            Javascript
          </Tabs.Tab>
          <Tabs.Tab value="react" leftSection={<IconBrandReact />}>
            React
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="api">
          <Group justify='space-between' mt='xs'>
            <Text>API endpoint</Text>
            <CopyButton value={instructionApiUrl}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied URL' : 'Copy URL'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionApiUrl}</Code>
        </Tabs.Panel>

        <Tabs.Panel value="js">
          <Group justify='space-between' mt='xs'>
            <Text>HTML code example</Text>
            <CopyButton value={instructionJsCode}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied code' : 'Copy code'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionJsCode}</Code>
        </Tabs.Panel>
        <Tabs.Panel value="react">
          <Group justify='space-between' mt='xs'>
            <Text>React code example</Text>
            <CopyButton value='//TODO'>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied code' : 'Copy code'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>//TODO</Code>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )

  const websiteList = websites.map(website => (
    <Card key={website.id} w='100%' withBorder>
      <Group justify='space-between'>
        <Text fw={500} component={Link} href={website.url} target='_blank'>
          {website.title}
        </Text>
        <Group>
          <ActionIcon variant="light" aria-label="Edit" onClick={() => { initialiseEditWebsiteForm(website) }}>
            <IconEdit />
          </ActionIcon>
          <ActionIcon variant="light" aria-label="View Instructions" onClick={() => { setCurrentInstructionWebsite(website); openInstruction() }}>
            <IconFileInfo />
          </ActionIcon>
        </Group>
      </Group>
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
      {addWebsiteModal}
      {editWebsiteModal}
      {instructionModal}
      <Group mt="md">
        <Button variant='light' leftSection={<IconPlus />} onClick={openAddWebsite}>Add Website</Button>
      </Group>
      <Group mt="md">
        {websiteList}
      </Group>
    </>
  )
}
