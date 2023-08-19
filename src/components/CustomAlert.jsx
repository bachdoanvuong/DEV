import { Alert, AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function CustomAlert({ status, title, description, visible, handleClose }) {
  const alertVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
    hiddenAgain: { opacity: 0, height: 0 }
  };

  const animationDuration = 0.5; // Duration for each animation step in seconds
  const cssDuration = 2.5; // CSS duration for visible state in seconds
  const exitAnimationDuration = 0.5; // Duration for exit animation in seconds

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    setTimeout(() => {
        handleClose();
    }, 3000);
    setTimeout(() => {
      setIsVisible(false);
    }, 2500)
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="alert"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={alertVariants}
          transition={{
            opacity: { duration: animationDuration },
            height: { duration: exitAnimationDuration },
            ease: "easeInOut",
            when: "beforeChildren",
            staggerChildren: animationDuration,
          }}
        >
          <Alert
            status={status}
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            overflow="hidden"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {title}
            </AlertTitle>
            <AlertDescription maxWidth="sm">{description}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CustomAlert;
