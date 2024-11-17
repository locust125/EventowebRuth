import React from 'react';
import Head from 'next/head';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import dynamic from 'next/dynamic';
const EventForm = dynamic(() => import("src/components/postsPost" ), {ssr: false})

const Page = () => {
  

  return (
    <>
      <Head>
        <title>EventWeb</title>
      </Head>
      
      <DashboardLayout>
        <EventForm/>
      </DashboardLayout>
    </>
  );
};

export default Page;
