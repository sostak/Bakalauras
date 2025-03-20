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

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: 'Error',
                description: 'Passwords do not match',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
            };

            await authService.register(userData);
            
            toast({
                title: 'Success',
                description: 'Account created successfully! Please log in.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            toast({
                title: 'Registration failed',
                description: error.message || 'An error occurred during registration',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // Implement Google sign-up logic here
        toast({
            title: 'Google Sign Up',
            description: 'Google sign-up is not implemented yet',
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
                        Create Account
                    </Heading>
                    <Text textAlign="center" color={textColor}>
                        Sign up to get started
                    </Text>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel color={textColor}>First Name</FormLabel>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    size="lg"
                                    bg={bgColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'blue.500' }}
                                    _focus={{ borderColor: 'blue.500' }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={textColor}>Last Name</FormLabel>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    size="lg"
                                    bg={bgColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'blue.500' }}
                                    _focus={{ borderColor: 'blue.500' }}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color={textColor}>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleChange}
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

                            <FormControl isRequired>
                                <FormLabel color={textColor}>Confirm Password</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                        bg={bgColor}
                                        borderColor={borderColor}
                                        _hover={{ borderColor: 'blue.500' }}
                                        _focus={{ borderColor: 'blue.500' }}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            variant="ghost"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
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
                                loadingText="Creating account..."
                            >
                                Create Account
                            </Button>

                            <Button
                                leftIcon={<FaGoogle />}
                                variant="outline"
                                colorScheme="red"
                                size="lg"
                                width="full"
                                onClick={handleGoogleSignUp}
                                borderColor={borderColor}
                                _hover={{ borderColor: 'red.500' }}
                            >
                                Sign up with Google
                            </Button>
                        </VStack>
                    </form>

                    <Text textAlign="center" color={textColor}>
                        Already have an account?{' '}
                        <Link to="/login">
                            <Text as="span" color="blue.500" cursor="pointer">
                                Sign in
                            </Text>
                        </Link>
                    </Text>
                </VStack>
            </Box>
        </Container>
    );
};

export default SignUp; 