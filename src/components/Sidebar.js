import {
    Box,
    Flex,
    Icon,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import {
    FiHome,
    FiLogOut,
    FiSettings,
    FiTool,
    FiUser,
    FiUsers
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'gray.300');
    const hoverBg = useColorModeValue('blue.50', 'blue.900');
    const hoverColor = useColorModeValue('blue.500', 'blue.200');

    const handleLogout = () => {
        authService.logout();
    };

    const menuItems = [
        { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { name: 'Profile', icon: FiUser, path: '/profile' },
        { name: 'Customers', icon: FiUsers, path: '/customers' },
        { name: 'Mechanics', icon: FiTool, path: '/mechanics' },
        { name: 'Settings', icon: FiSettings, path: '/settings' },
    ];

    return (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            h="100vh"
            w="250px"
            bg={bgColor}
            borderRight="1px"
            borderColor={borderColor}
            py={5}
        >
            <Flex direction="column" h="100%">
                <Box px={5} mb={8}>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                        Auto Service
                    </Text>
                </Box>

                <Box flex="1">
                    {menuItems.map((item) => (
                        <Flex
                            key={item.name}
                            align="center"
                            px={5}
                            py={3}
                            cursor="pointer"
                            color={location.pathname === item.path ? 'blue.500' : 'gray.600'}
                            bg={location.pathname === item.path ? hoverBg : 'transparent'}
                            _hover={{
                                bg: hoverBg,
                                color: hoverColor,
                            }}
                            onClick={() => navigate(item.path)}
                            transition="all 0.2s"
                        >
                            <Icon as={item.icon} mr={3} />
                            <Text>{item.name}</Text>
                        </Flex>
                    ))}
                </Box>

                <Box px={5}>
                    <Flex
                        align="center"
                        px={5}
                        py={3}
                        cursor="pointer"
                        color={textColor}
                        _hover={{
                            bg: hoverBg,
                            color: hoverColor,
                        }}
                        onClick={handleLogout}
                        transition="all 0.2s"
                    >
                        <Icon as={FiLogOut} mr={3} />
                        <Text>Logout</Text>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default Sidebar; 