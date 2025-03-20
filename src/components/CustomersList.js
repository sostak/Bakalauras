import {
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';
import authService from '../services/authService';

const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [specialization, setSpecialization] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    const loadCustomers = useCallback(async () => {
        try {
            const response = await authService.getAllCustomers();
            setCustomers(response);
        } catch (error) {
            console.error('Error loading customers:', error);
            toast({
                title: 'Error',
                description: 'Failed to load customers. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }, [toast]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const handleRoleChange = (customer) => {
        setSelectedCustomer(customer);
        onOpen();
    };

    const handleSubmit = async () => {
        try {
            await authService.changeUserRole(selectedCustomer.id, 'Mechanic', {
                specialization,
                experienceLevel
            });
            toast({
                title: 'Success',
                description: 'Customer role updated successfully!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            loadCustomers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update role. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

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
                <Flex justify="space-between" align="center" mb={8}>
                    <Heading size="xl" color="blue.500">
                        Customers List
                    </Heading>
                </Flex>

                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>User</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {customers.map((customer) => (
                                <Tr key={customer.id}>
                                    <Td>
                                        <Flex align="center">
                                            <Avatar
                                                size="sm"
                                                name={customer.firstName}
                                                mr={3}
                                            />
                                            <Box>
                                                <Text fontWeight="medium">
                                                    {customer.firstName} {customer.lastName}
                                                </Text>
                                                <Text fontSize="sm" color={textColor}>
                                                    ID: {customer.id}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Td>
                                    <Td>{customer.email}</Td>
                                    <Td>{customer.phoneNumber || 'Not provided'}</Td>
                                    <Td>
                                        <Badge colorScheme="green">Active</Badge>
                                    </Td>
                                    <Td>
                                        <Button
                                            leftIcon={<Icon as={FiEdit2} />}
                                            colorScheme="blue"
                                            size="sm"
                                            onClick={() => handleRoleChange(customer)}
                                        >
                                            Make Mechanic
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Update User Role</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <VStack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Specialization</FormLabel>
                                    <Input
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        placeholder="Enter specialization"
                                        bg={bgColor}
                                        borderColor={borderColor}
                                        _hover={{ borderColor: 'blue.500' }}
                                        _focus={{ borderColor: 'blue.500' }}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Experience Level</FormLabel>
                                    <Select
                                        value={experienceLevel}
                                        onChange={(e) => setExperienceLevel(e.target.value)}
                                        placeholder="Select experience level"
                                        bg={bgColor}
                                        borderColor={borderColor}
                                        _hover={{ borderColor: 'blue.500' }}
                                        _focus={{ borderColor: 'blue.500' }}
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </Select>
                                </FormControl>

                                <Flex justify="flex-end" w="100%" gap={3}>
                                    <Button
                                        leftIcon={<Icon as={FiX} />}
                                        variant="ghost"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        leftIcon={<Icon as={FiCheck} />}
                                        colorScheme="blue"
                                        onClick={handleSubmit}
                                        isDisabled={!specialization || !experienceLevel}
                                    >
                                        Confirm
                                    </Button>
                                </Flex>
                            </VStack>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Container>
    );
};

export default CustomersList; 