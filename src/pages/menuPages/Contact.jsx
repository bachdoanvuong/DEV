import { Heading, Link, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Card from './Card';

const Socials = ({ socialName, address, href, onClick }) => {
   return (
      <Text>
         {socialName}:{' '}
         <Link
            as='a'
            cursor='pointer'
            color={useColorModeValue('light.primary', 'dark.primary')}
            _hover={{
               color: useColorModeValue(
                  'light.headingHover',
                  'dark.headingHover'
               ),
            }}
            href={href}
            onClick={onClick}
            target='blank'
            mb='1rem'
            display='inline-block'
         >
            {address}
         </Link>
      </Text>
   );
};

const Contact = () => {
   // scroll top
   useEffect(() => window.scrollTo(0, 0), []);

   return (
      <Card>
         <Heading fontSize={{ base: '1.7rem', md: '2.5rem' }} mb='1.5rem'>
            Contacts
         </Heading>

         <Text mb='1rem'>DEV Community 👩‍💻👨‍💻 would love to hear from you!</Text>

         <Socials
            socialName='Email'
            address='vuong.cloud23@gmail.com'
            onClick={() => window.open(`mailto:vuong.cloud23@gamil.com`)}
         />

         <Socials
            socialName='Github'
            address='@bachdoanvuong'
            href='https://github.com/bachdoanvuong'
         />

         <Socials
            socialName='Linkedin'
            address='@bachdoanvuong'
            href='https://www.linkedin.com/in/vuongbd2007/'
         />
      </Card>
   );
};

export default Contact;
