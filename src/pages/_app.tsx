// pages/_app.js
import '@/sass/globals.css'
import type { AppProps } from 'next/app'
import DashboardLayout from '@/components/layout'
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDataFromCookies = Cookies.get('user');
      if (userDataFromCookies) {
        const parsedUser = JSON.parse(userDataFromCookies);
        setLoggedInUser(parsedUser);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout loggedInUser={loggedInUser}>
      <Component {...pageProps} />
    </DashboardLayout>
  );
}

export default MyApp;
