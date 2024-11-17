import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
const EventForm = dynamic(() => import("src/components/postsPost"), {ssr: false})
const BasicCard = dynamic(() => import("src/components/eventos-gestion"), {ssr: false})

import dynamic from 'next/dynamic';

const Page = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false); // Define el estado y la función para abrir

  const handleClickOpen = () => {
    setOpen(true); // Cambia el estado a true al hacer clic
    // Aquí puedes manejar otros estados o lógica si es necesario
    router.push('/agregarEvento'); // Redirige a la página de agregar evento
  };

  return (
    <>
      <Head>
        <title>EventWeb</title>
      </Head>
      
      <DashboardLayout>
        <BasicCard/>
      </DashboardLayout>
    </>
  );
};

export default Page;
