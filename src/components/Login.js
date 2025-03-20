import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
    useToast,
    VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authService.login(email, password);
            console.log('Login successful:', response);
            
            toast({
                title: 'Login successful',
                description: 'Welcome back!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            toast({
                title: 'Login failed',
                description: error.message || 'An error occurred during login',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic here
        toast({
            title: 'Google Login',
            description: 'Google login is not implemented yet',
            status: 'info',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <Container maxW="container.sm" py={10}>
            <Box
                p={8}
                borderWidth={1}
                borderColor={borderColor}
                borderRadius={8}
                boxShadow="lg"
                bg={bgColor}
            >
                <VStack spacing={6} align="stretch">
                    <Heading textAlign="center" size="xl" color="blue.500">
                        Welcome Back
                    </Heading>
                    <Text textAlign="center" color={textColor}>
                        Please sign in to continue
                    </Text>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel color={textColor}>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    size="lg"
                                    bg={bgColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'blue.500' }}
                                    _focus={{ borderColor: 'blue.500' }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={textColor}>Password</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        bg={bgColor}
                                        borderColor={borderColor}
                                        _hover={{ borderColor: 'blue.500' }}
                                        _focus={{ borderColor: 'blue.500' }}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="blue"
                                size="lg"
                                width="full"
                                mt={4}
                                isLoading={isLoading}
                                loadingText="Signing in..."
                            >
                                Sign In
                            </Button>

                            <Button
                                leftIcon={<FaGoogle />}
                                variant="outline"
                                colorScheme="red"
                                size="lg"
                                width="full"
                                onClick={handleGoogleLogin}
                                borderColor={borderColor}
                                _hover={{ borderColor: 'red.500' }}
                            >
                                Sign in with Google
                            </Button>
                        </VStack>
                    </form>

                    <Text textAlign="center" color={textColor}>
                        Don't have an account?{' '}
                        <Link to="/signup">
                            <Text as="span" color="blue.500" cursor="pointer">
                                Sign up
                            </Text>
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default Login; 