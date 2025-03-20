import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const bgColor = useColorModeValue('gray.50', 'gray.900');

    return (
        <Box minH="100vh" bg={bgColor}>
            <Sidebar />
            <Box ml="250px" p={4}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout; 