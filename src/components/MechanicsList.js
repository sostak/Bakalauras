import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
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
    Th,
    Thead,
    Tr,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import authService from '../services/authService';

const MechanicsList = () => {
    const [mechanics, setMechanics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMechanic, setSelectedMechanic] = useState(null);
    const [formData, setFormData] = useState({
        specialization: '',
        experienceLevel: '',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    useEffect(() => {
        loadMechanics();
    }, []);

    const loadMechanics = async () => {
        try {
            const data = await authService.getAllMechanics();
            setMechanics(data);
        } catch (error) {
            console.error('Error loading mechanics:', error);
            toast({
                title: 'Error',
                description: 'Failed to load mechanics list',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (mechanic) => {
        setSelectedMechanic(mechanic);
        setFormData({
            specialization: mechanic.specialization || '',
            experienceLevel: mechanic.experienceLevel || '',
        });
        onOpen();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await authService.updateMechanic(selectedMechanic.id, formData);
            toast({
                title: 'Success',
                description: 'Mechanic details updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            loadMechanics();
        } catch (error) {
            console.error('Error updating mechanic:', error);
            toast({
                title: 'Error',
                description: 'Failed to update mechanic details',
                status: 'error',
                duration: 3000,
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
                <Heading size="xl" color="blue.500" mb={8}>
                    Mechanics List
                </Heading>

                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th color={textColor}>Name</Th>
                                <Th color={textColor}>Email</Th>
                                <Th color={textColor}>Specialization</Th>
                                <Th color={textColor}>Experience Level</Th>
                                <Th color={textColor}>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {mechanics.map((mechanic) => (
                                <Tr key={mechanic.id}>
                                    <Td color={textColor}>
                                        {mechanic.firstName} {mechanic.lastName}
                                    </Td>
                                    <Td color={textColor}>{mechanic.email}</Td>
                                    <Td color={textColor}>{mechanic.specialization || 'Not specified'}</Td>
                                    <Td color={textColor}>{mechanic.experienceLevel || 'Not specified'}</Td>
                                    <Td>
                                        <Button
                                            colorScheme="blue"
                                            size="sm"
                                            onClick={() => handleEdit(mechanic)}
                                        >
                                            Edit
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent bg={bgColor}>
                        <ModalHeader color={textColor}>Edit Mechanic Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <FormControl mb={4}>
                                <FormLabel color={textColor}>Specialization</FormLabel>
                                <Input
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="Enter specialization"
                                    bg={bgColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'blue.500' }}
                                    _focus={{ borderColor: 'blue.500' }}
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel color={textColor}>Experience Level</FormLabel>
                                <Select
                                    name="experienceLevel"
                                    value={formData.experienceLevel}
                                    onChange={handleChange}
                                    bg={bgColor}
                                    borderColor={borderColor}
                                    _hover={{ borderColor: 'blue.500' }}
                                    _focus={{ borderColor: 'blue.500' }}
                                >
                                    <option value="">Select experience level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                </Select>
                            </FormControl>

                            <Button
                                colorScheme="blue"
                                onClick={handleSave}
                                width="full"
                            >
                                Save Changes
                            </Button>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
        </Container>
    );
};

export default MechanicsList; 