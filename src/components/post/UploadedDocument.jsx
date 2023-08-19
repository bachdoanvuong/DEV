import React from "react";
import { Button, Box, Flex } from "@chakra-ui/react";
import { IoTrashBin } from 'react-icons/io5';

const UploadedDocument = ({ name, onRemove }) => {
  return (
    <Flex align="center" justify="space-between" py="2">
      <Box
        maxWidth="220px" 
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        textAlign="left"
      >
        {name}
      </Box>
      <Button variant="link" color="red" onClick={onRemove}>
        <IoTrashBin size="24px"/>
      </Button>
    </Flex>
  );
};

export default UploadedDocument;
