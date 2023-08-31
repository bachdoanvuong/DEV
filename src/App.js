import React, { Suspense, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import useTransformData from "./hooks/useTransformData";
import LoginAlert from "./components/LoginAlert";
import FallbackSpinner from "./utils/FallbackSpinner";
import ConfigRoute from "./layout/ConfigRoute";
import SupportChat from "./components/SupportChat";
import "highlight.js/styles/tokyo-night-dark.css";
import { useAuth } from "./context/auth";

const timeoutInMs = 30 * 60 * 1000;
const App = () => {
  useTransformData();
  const [userActive, setUserActive] = useState(true);
  const user = useAuth();

  useEffect(() => {
    let activityTimer;

    const resetActivityTimer = () => {
      setUserActive(true);

      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        if (user !== null && !userActive) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }, timeoutInMs);
    };

    const handleUserActivity = () => {
      if (!userActive) {
        resetActivityTimer();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserActive(false);
      } else {
        resetActivityTimer();
      }
    };

    const handleScroll = () => {
      resetActivityTimer();
    };

    resetActivityTimer();

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('scroll', handleScroll);
      clearTimeout(activityTimer);
    };
  }, [timeoutInMs, userActive, user]);

  return (
    <Box>
      <Suspense fallback={<FallbackSpinner />}>
        <ConfigRoute />
      </Suspense>
      {/* <SupportChat /> */}
      <LoginAlert />
    </Box>
  );
};

export default App;
