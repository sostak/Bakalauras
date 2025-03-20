import {
    Box,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Switch,
    Text,
    useColorMode,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
import React from 'react';

const Settings = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    return (
        <Container maxW="container.xl" py={10}>
            <Box
                p={8}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius={8}
                boxShadow="lg"
                bg={bgColor}
            >
                <VStack spacing={8} align="stretch">
                    <Heading size="xl" color="blue.500" mb={8}>
                        Settings
                    </Heading>

                    <Box>
                        <FormControl display="flex" alignItems="center" mb={6}>
                            <FormLabel mb="0" color={textColor}>
                                Dark Mode
                            </FormLabel>
                            <Switch
                                isChecked={colorMode === 'dark'}
                                onChange={toggleColorMode}
                                colorScheme="blue"
                            />
                        </FormControl>

                        <Text color={textColor} fontSize="sm">
                            Toggle between light and dark mode for the application.
                        </Text>
                    </Box>

                    <Divider />

                    <Box>
                        <Heading size="md" mb={4}>
                            Notifications
                        </Heading>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Email Notifications
                            </FormLabel>
                            <Switch colorScheme="blue" />
                        </FormControl>
                        <FormControl>
                            <FormHelperText>
                                Receive email notifications about your account
                            </FormHelperText>
                        </FormControl>
                    </Box>

                    <Divider />

                    <Box>
                        <Heading size="md" mb={4}>
                            Privacy
                        </Heading>
                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">
                                Profile Visibility
                            </FormLabel>
                            <Switch colorScheme="blue" />
                        </FormControl>
                        <FormControl>
                            <FormHelperText>
                                Make your profile visible to other users
                            </FormHelperText>
                        </FormControl>
                    </Box>
                </VStack>
            </Box>
        </Container>
    );
};

export default Settings; 