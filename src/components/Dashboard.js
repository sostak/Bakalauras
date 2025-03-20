import {
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await authService.getCurrentUserInfo();
                if (!userData) {
                    throw new Error('No user data received');
                }
                setUser(userData);
            } catch (error) {
                console.error('Error loading user data:', error);
                navigate('/login');
            }
        };

        loadUserData();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (!user) {
        return null;
    }

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
                        Welcome, {user.firstName}!
                    </Heading>
                    <Menu isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                        <MenuButton
                            as={Button}
                            variant="ghost"
                            rightIcon={<Icon as={FiUser} />}
                            leftIcon={<Avatar size="sm" name={user.firstName} />}
                        >
                            {user.firstName}
                        </MenuButton>
                        <MenuList>
                            <MenuItem icon={<Icon as={FiUser} />} onClick={() => navigate('/profile')}>
                                Profile
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiSettings} />} onClick={() => navigate('/settings')}>
                                Settings
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiLogOut} />} onClick={handleLogout} color="red.500">
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>

                <Text fontSize="lg" color={textColor} mb={6}>
                    This is your dashboard. You can manage your profile, view appointments, and more.
                </Text>
            </Box>
        </Container>
    );
};

export default Dashboard; 