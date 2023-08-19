import React, { useState } from 'react';
import {
   Button,
   Flex,
   Input,
   Spinner,
   Text,
   Tooltip,
   useColorModeValue,
   Box,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addDocumentToStore, removeDocumentFromStore } from '../store/post/postData'; // Import addDocumentToStore and removeDocumentFromStore
import { uploadDocument, removeDocument } from '../lib/api'; // Import Firebase functions
import { SecondaryBtn } from '../utils/Buttons';
import UploadedDocument from './post/UploadedDocument';
import AddDocumentButton from './post/AddDocumentButton';
import { MdCloudUpload } from 'react-icons/md';

const allowedFileTypes = [
   'application/pdf',
   'text/plain',
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
   'application/msword',
   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   'application/vnd.ms-excel',
   'application/vnd.openxmlformats-officedocument.presentationml.presentation',
   'application/vnd.ms-powerpoint',
   'application/zip',
];

const AddDoc = ({ documentsFromLocalStorage, setUploadingDoc }) => {
   const [documents, setDocuments] = useState(documentsFromLocalStorage || []);

   const [uploading, setUploading] = useState(false);

   const dispatch = useDispatch();

   const handleDocumentUpload = (e) => {
      const selectedFiles = Array.from(e.target.files);

      const validFiles = selectedFiles.filter((file) =>
         allowedFileTypes.includes(file.type)
      );

      if (validFiles.length === 0) {
         return;
      }

      setUploading(true);
      setUploadingDoc(true);

      const uploadPromises = validFiles.map((file) => {
         const selectedDocPath = `documents/${file.name}${nanoid()}`;
         return uploadDocument(file, selectedDocPath)
            .then((url) => {
               const newDocument = { name: file.name, url };
               dispatch(addDocumentToStore(newDocument));
               return newDocument;
            })
            .catch((err) => console.log(err));
      });

      Promise.all(uploadPromises)
         .then((newDocuments) => {
            setUploading(false);
            setUploadingDoc(false);
            setDocuments([...documents, ...newDocuments]);
         })
         .catch((err) => console.log(err));
   };


   const handleDocumentRemove = (url) => {
      removeDocument(url)
         .then(() => {
            dispatch(removeDocumentFromStore(url));
            const updatedDocuments = documents.filter((doc) => doc.url !== url);
            setDocuments(updatedDocuments);
         })
         .catch((err) => console.log(err));
   };

   const borderColor = useColorModeValue('#d6d6d7', '#3d3d3d');
   const spinnerColor = useColorModeValue('light.headingHover', 'dark.headingHover');

   return (
      <Flex mb="1rem" justify="flex-start" align="center" flexWrap="wrap">
         {uploading && (
            <Flex align="center" width="220px">
               <Spinner color={spinnerColor} size="md" />
               <Text letterSpacing="1px">Uploading...</Text>
            </Flex>
         )}

         {!uploading && documents.length === 0 && (
            <Flex mt="1" mr="1" width="100%">
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
                        onChange={handleDocumentUpload}
                     />
                     Upload Document
                  </Button>
               </Tooltip>
            </Flex>
         )}

         {!uploading && documents.length > 0 && (
            <Flex gap="2" width="100%" flexWrap="wrap">
               <Flex width="100%" justify="space-between" align="center" py="2">
                  <AddDocumentButton onClick={handleDocumentUpload} />
               </Flex>
               {documents.map((doc) => (
                  <UploadedDocument key={doc.url} name={doc.name} onRemove={() => handleDocumentRemove(doc.url)} />
               ))}
            </Flex>
         )}
      </Flex>
   );
};

export default React.memo(AddDoc);
