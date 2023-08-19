import { Box, Heading, Text, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Card from './Card';

const FAQ = () => {
   // scroll top
   useEffect(() => window.scrollTo(0, 0), []);

   const faqItems = [
      {
         question: 'How do I post article on Rapify Cloud?',
         answer: 'Click on "Create Post" in the top right corner of the site. Write your article, give it a title, tag it with appropriate tags, and fill out any other relevant fields. Then, once you\'re ready, click publish. Your post will now be published. You can also draft your post.',
      },
      {
         question: 'Can I add image url instead of uploading local images in markdown?',
         answer: 'Of course, You can add image url using the syntax below.\n\n![image description](https://example_image.png)',
      },
   ];

   return (
      <Card>
         <Heading fontSize={{ base: '1.7rem', md: '2.5rem' }}>
            Frequently Asked Questions 🤔
         </Heading>
         <Text fontStyle='italic' my='1rem'>
            Some of these are not actually asked frequently, but they're still
            good to know.
         </Text>

         <Accordion mt="1rem" allowMultiple>
            {faqItems.map((item, index) => (
               <AccordionItem key={index}>
                  {({ isExpanded }) => (
                     <>
                        <AccordionButton>
                           <Box flex="1" textAlign="left">
                              <Heading fontSize={{ base: '1.3rem', md: '1.5rem' }}>
                                 {index + 1} . {item.question}
                              </Heading>
                           </Box>
                           <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                           <Text>
                              {item.answer}
                           </Text>
                        </AccordionPanel>
                     </>
                  )}
               </AccordionItem>
            ))}
         </Accordion>
      </Card>
   );
};

export default FAQ;
