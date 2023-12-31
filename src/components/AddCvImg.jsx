import {
   Box,
   Button,
   Flex,
   HStack,
   Image,
   Input,
   Spinner,
   Text,
   Tooltip,
   useColorModeValue,
} from '@chakra-ui/react';
import { IoIosImage } from 'react-icons/io';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeImage, uploadImage } from '../lib/api';
import { setCvImgToStore } from '../store/post/postData';
import { SecondaryBtn } from '../utils/Buttons';
import { IoTrashBin } from 'react-icons/io5';
import CustomAlert from './CustomAlert';
import AWS from 'aws-sdk';

const AddCvImg = ({ cvImgFromLocalStorage, setUploadingImg }) => {
   const [cvImg, setCvImg] = useState(cvImgFromLocalStorage || '');

   const [uploading, setUploading] = useState(false);

   const dispatch = useDispatch();

   useEffect(() => {
      dispatch(setCvImgToStore(cvImg));
   }, [cvImg, dispatch]);

   const [detections, setDetections] = useState([]);
   const [image, setImage] = useState();
   const handleCVImageUpload = async (e) => {
      const image = e.target.files[0];
    
      // Convert the image to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        Promise.all([
          setImage(image),
          setUploading(true),
          setUploadingImg(true),
          invokeLambda(base64Image) // Send the base64 encoded image to the invokeLambda function
        ]);
      };
      reader.readAsDataURL(image);
    };
    
   const invokeLambda = async (base64Image) => {
      try {
        const lambda = new AWS.Lambda({
          region: process.env.REACT_APP_AWS_REGION,
          accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        });
    
        const lambdaParams = {
          FunctionName: 'gcp-vision-api',
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify({
            image: base64Image // Pass the base64 encoded image as part of the payload
          }),
        };
    
        lambda.invoke(lambdaParams).promise()
         .then((res) => {
            setDetections(JSON.parse(res.Payload));
         })
      } catch (error) {
        console.error('Error invoking Lambda:', error);
      }
    };

   const [isError, setError] = useState(false);
   useEffect(() => {
      if (image) {
         if (detections.racy === 'VERY_LIKELY' || detections.racy === 'RACY') {
            setError(true);
            setUploading(false);
            setUploadingImg(false);
         } else {
            cvImg && removeImage(cvImg);

            const selectedImgPath = `images/${image.name}${nanoid()}`;
            setUploading(true);
            setUploadingImg(true);

            uploadImage(image, selectedImgPath)
               .then((url) => {
                  setUploading(false);
                  setUploadingImg(false);
                  setCvImg(url);
               })
               .catch((err) => console.log(err));
         }
      }
   }, [detections])

   const handleCVImgRemove = (url) => {
      setCvImg('');
      removeImage(url).catch((err) => console.log(err));
   };

   const spinnerColor = useColorModeValue(
      'light.headingHover',
      'dark.headingHover'
   );

   return (
      <Flex mb='1rem' justify='flex-start' align='center' flexWrap='wrap'>
         {uploading && (
            <HStack>
               <Spinner color={spinnerColor} size='md' />
               <Text letterSpacing='1px'>Uploading...</Text>
            </HStack>
         )}

         {
            isError && (
               <Box width="100%" borderRadius="5px" overflow="hidden">
                  <CustomAlert
                     status="error"
                     title="Error!"
                     description="You can't use this image for the cover."
                     visible={isError} // Pass the visibility state to CustomAlert
                     handleClose={() => setError(false)}
                  />
               </Box>
            )
         }

         {!uploading && (
            <Flex mt='1'>
               <Tooltip
                  label='Use a ratio of 100:42 for best result.'
                  aria-label='A tooltip'
                  borderRadius='3px'
               >
                  <Button
                     as='label'
                     cursor='pointer'
                     fontWeight="light"
                     leftIcon={<IoIosImage />}
                     width="220px"
                  >
                     <Input
                        display='none'
                        type='file'
                        accept='image/jpeg, image/png, image/jpg , image/webp, image/gif'
                        onChange={handleCVImageUpload}
                     />
                     {cvImg ? 'change' : 'Add a cover image'}
                  </Button>
               </Tooltip>

               {
                  cvImg && (
                     <SecondaryBtn
                        color='red'
                        hoverColor='red'
                        onClick={() => handleCVImgRemove(cvImg)}
                        m='0 0 0 .5rem'
                     >
                        <IoTrashBin size="75%" />
                     </SecondaryBtn>
                  )}
            </Flex>
         )}

         {!uploading && cvImg && (
            <Image
               src={cvImg}
               alt='cover_image'
               w='100%'
               h='335px'
               objectFit='cover'
               mr='1rem'
               mt="2"
               borderRadius='5px'
            />
         )}
      </Flex>
   );
};

export default React.memo(AddCvImg);
