'use client';

import { Website } from "@/types/Website";
import { Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [websites, setWebsites] = useState<Website[]>([]);

  const loadWebsites = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/api/websites`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  const websiteList = websites.map(website => (
    <Card key={website.id} w='100%' withBorder component={Link} href={website.url} target="_blank">
      <Text fw={500}>
        {website.title}
      </Text>
      <Text size="sm">
        {website.description}
      </Text>
    </Card>
  ));

  useEffect(() => {
      loadWebsites();
  }, []);

  if (websites.length === 0) {
    return (
      <Text ta="center">
        No websites.
      </Text>
    );
  }

  return (
    <>
      <Group mt="md">
        {websiteList}
      </Group>
    </>
  )
}
