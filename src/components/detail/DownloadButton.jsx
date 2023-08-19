import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Flex } from "@chakra-ui/react";
import { MdCloudDownload } from "react-icons/md"; // Import the download icon from react-icons library

const DownloadButton = ({ item }) => {
  return (
    <Link title={item.name} key={item.name} to={item.url} target="_blank" rel="noopener noreferrer" download={item.name}>
      <Flex align="center" justify="flex-end">
        <Button
          leftIcon={<MdCloudDownload />}
          variant="solid"
          ml="1"
        >
          <Box
            width="135px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            textAlign="left"
            fontWeight="medium"
            fontSize="14px"
          >
            {item.name}
          </Box>
        </Button>
      </Flex>
    </Link>
  );
};

export default DownloadButton;
