'use client';

import { ActionIcon, Button, Card, Code, CopyButton, Group, Modal, Tabs, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconApi, IconBrandJavascript, IconBrandReact, IconEdit, IconFileInfo, IconHtml, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserProvider';
import { Website } from '@/types/Website';

export default function Page() {
  const router = useRouter();
  const [user] = useContext(UserContext);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [currentEditingWebsiteId, setCurrentEditingWebsiteId] = useState<number>();
  const [currentInstructionWebsite, setCurrentInstructionWebsite] = useState<Website>();
  const [currentInstructionNeighbours, setCurrentInstructionNeighbours] = useState<{prev: Website | undefined | null, next: Website | undefined | null}>({prev: undefined, next: undefined});
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/users/${user ? user.id : 0}/websites`, {
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

  const handleAdd = async (values: Record<string, string>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user ? user.accessToken : ''}`,
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        throw e;
      }
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
        <Text size="sm" c="dimmed">
          Your website will be pending approval before being added to the webring.
        </Text>
        <Group justify="center" mt="md">
          <Button variant='light' type="submit">Add</Button>
        </Group>
      </form>
    </Modal>
  )

  const initialiseEditWebsiteForm = (website: Website) => {
    setCurrentEditingWebsiteId(website.id);
    const initialFormData = { url: website.url, title: website.title, description: website.description };
    editWebsiteForm.setInitialValues(initialFormData);
    editWebsiteForm.setValues(initialFormData);
    openEditWebsite();
  }

  const handleEdit = async (values: Record<string, string>) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/${currentEditingWebsiteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user ? user.accessToken : ''}`,
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        throw e;
      }
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Do you want to delete?");
    if (!confirm) {
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/${currentEditingWebsiteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user ? user.accessToken : ''}`,
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
    } catch (e: unknown) {
      if (e instanceof Error) {
        alert(e.message);
      } else {
        throw e;
      }
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

  const instructionNeighboursApiUrl_ = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/neighbours`);
  if (currentInstructionWebsite) {
    instructionNeighboursApiUrl_.search = new URLSearchParams({current: currentInstructionWebsite.url}).toString();
  }
  const instructionNeighboursApiUrl = instructionNeighboursApiUrl_.toString();

  const instructionRandomUrl_ = new URL(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites/random`);
  if (currentInstructionWebsite) {
    instructionRandomUrl_.search = new URLSearchParams({current: currentInstructionWebsite.url}).toString();
  }
  const instructionRandomUrl = instructionRandomUrl_.toString();

  const instructionHtmlCode = `<link rel="stylesheet" href="http://localhost:3000/api/webring.css">
<webring>
  <a href="${currentInstructionNeighbours.prev ? currentInstructionNeighbours.prev.url : 'url-for-previous-neighbour'}" target="_blank">&lt;- ${currentInstructionNeighbours.prev? currentInstructionNeighbours.prev.title : 'Title for Previous Neighbour'}</a>
  <a href="${instructionRandomUrl}" target="_blank">RANDOM</a>
  <a href="${currentInstructionNeighbours.next ? currentInstructionNeighbours.next.url : 'url-for-next-neighbour'}" target="_blank">&lt;- ${currentInstructionNeighbours.next? currentInstructionNeighbours.next.title : 'Title for Next Neighbour'}</a>
</webring>
`;

  const instructionJsCode = `<!-- TODO: add subsource integrity -->
<link rel="stylesheet" href="${process.env.NEXT_PUBLIC_API_SERVER}/api/webring.css">
<webring inject id="webring" api-server="${process.env.NEXT_PUBLIC_API_SERVER}" url="${currentInstructionWebsite ? currentInstructionWebsite.url : 'url'}">
</webring>
<script src="${process.env.NEXT_PUBLIC_API_SERVER}/api/webring.js"></script>`;

  const instructionReactCode = `//TODO`;

  const instructionModal = (
    <Modal size='xl' opened={instructionOpened} onClose={closeInstruction} title={`Add Webring to ${currentInstructionWebsite ? currentInstructionWebsite.title : ''}`}>
      <Tabs defaultValue="api">
        <Tabs.List>
          <Tabs.Tab value="api" leftSection={<IconApi />}>
            API
          </Tabs.Tab>
          <Tabs.Tab value="html" leftSection={<IconHtml />}>
            HTML
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
            <Text>Neighbours API endpoint</Text>
            <CopyButton value={instructionNeighboursApiUrl}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied URL' : 'Copy URL'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionNeighboursApiUrl}</Code>
          <Group justify='space-between' mt='xs'>
            <Text>Redirect to another random website on the ring</Text>
            <CopyButton value={instructionRandomUrl}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied URL' : 'Copy URL'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionRandomUrl}</Code>
        </Tabs.Panel>

        <Tabs.Panel value="html">
          <Group justify='space-between' mt='xs'>
            <Text>HTML code example</Text>
            <CopyButton value={instructionHtmlCode}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied URL' : 'Copy code'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionHtmlCode}</Code>
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
            <CopyButton value={instructionReactCode}>
              {({ copied, copy }) => (
                <Button variant='light' color={copied ? 'teal' : 'blue'} onClick={copy}>
                  {copied ? 'Copied code' : 'Copy code'}
                </Button>
              )}
            </CopyButton>
          </Group>
          <Code block mt='xs'>{instructionReactCode}</Code>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  )

  useEffect(() => {
    const loadNeighbours = async () => {
      try {
        const response = await fetch(instructionNeighboursApiUrl_, {
          method: 'GET',
        });
        const json = await response.json();
        if (response.ok) {
          setCurrentInstructionNeighbours(json);
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
    if (!instructionNeighboursApiUrl_.search) {
      return;
    }
    loadNeighbours();
  }, [currentInstructionWebsite]);

  const websiteList = websites.filter(website => website.approved).map(website => (
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

  const pendingWebsiteList = websites.filter(website => !website.approved).map(website => (
    <Card key={website.id} w='100%' withBorder>
      <Group justify='space-between'>
        <Text fw={500} component={Link} href={website.url} target='_blank'>
          {website.title}
        </Text>
        <Group>
          <ActionIcon variant="light" aria-label="Edit" onClick={() => { initialiseEditWebsiteForm(website) }}>
            <IconEdit />
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
          Requested adding at: {website.requestAddAt}
        </Text >
      </Group>
    </Card>
  ));

  useEffect(() => {
    if (user === false) {
      router.push('/auth/login');
    } else if (user) {
      loadWebsites();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

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
      { pendingWebsiteList.length > 0 &&
        <>
          <Text size="xl" mt="lg">Pending Approval</Text>
          <Group mt="md">
            {pendingWebsiteList}
          </Group>
        </>
      }
    </>
  )
}
