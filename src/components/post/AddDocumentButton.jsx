import React from "react";
import { Button, Box, Flex, Tooltip, Input } from "@chakra-ui/react";
import { MdCloudUpload, MdClose } from "react-icons/md"; // Import icons from react-icons library

const AddDocumentButton = ({ onClick }) => {
  return (
    <Tooltip
      label="Upload PDF, TXT, DOC, XLSX, PPTX, ZIP files"
      aria-label="A tooltip"
      borderRadius="3px"
    >
      <Button
        as="label"
        leftIcon={<MdCloudUpload />}
        cursor="pointer"
        fontWeight="light"
        width="220px"
      >
        <Input
          display="none"
          type="file"
          accept=".pdf,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx,application/zip"
          onChange={onClick}
        />
        Upload Document
      </Button>
    </Tooltip>
  );
};

export default AddDocumentButton;