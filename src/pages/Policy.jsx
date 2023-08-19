import { Box, List, ListItem, Heading, Text, Flex, Link } from "@chakra-ui/react";

const Policy = () => {
    return (
        <Box w='100%' maxW='750px' flex={1} p={{ md: '.5rem', xl: '1rem' }}>
            <Box px={['.5rem', '.5rem', '0']} mb={3}>
                <Heading>Privacy Policy</Heading>
                <Flex mx="4" flexDirection="column" gap="2">
                    <Box>
                        <Text fontSize="20px" fontWeight="bold">
                            1. What we collect:
                        </Text>
                        <List>
                            <ListItem>- name, fullname</ListItem>
                            <ListItem>- profile picture</ListItem>
                            <ListItem>- email address</ListItem>
                            <ListItem>- website of user</ListItem>
                            <ListItem>- github link of user</ListItem>
                            <ListItem>- twitter link of user</ListItem>
                            <ListItem>- location</ListItem>
                            <ListItem>- education</ListItem>
                            <ListItem>- technical skill, language</ListItem>
                        </List>
                    </Box>
                    <Box>
                        <Text fontSize="20px" fontWeight="bold">
                            2. What we do with the information we gather:
                        </Text>
                        <List>
                            <Text>
                                We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                            </Text>
                            <ListItem>
                                - Display username and unique avatar for each user.
                            </ListItem>
                            <ListItem>
                                - Social links is using to connect with the user.
                            </ListItem>
                            <ListItem>
                                - Location information help companies find the potential employees in the disireble location.
                            </ListItem>
                            <ListItem>
                                - Education, and skills that use to show the qualify of user.
                            </ListItem>
                        </List>
                    </Box>

                    <Box>
                        <Text fontSize="20px" fontWeight="bold">3. Controlling your personal information</Text>
                        <List>
                            <ListItem>- We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</ListItem>
                            <ListItem>- We use OAuth method by Firebase, and it managed by firebase only. We just save the name, and profile picture of the user to display the unique information in website.</ListItem>
                            <ListItem>- If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible at <Link style={{textDecoration: 'underline'}} onClick={() => window.open('mailto:vuong.cloud23@gmail.com')}>vuong.cloud23@gmail.com</Link>. We will promptly correct any information found to be incorrect.</ListItem>
                        </List>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
}

export default Policy;


