import {
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    HStack,
    Heading,
    Icon,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FiEdit2, FiLogOut, FiMail, FiPhone, FiSave, FiSettings, FiUser, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await authService.getCurrentUserInfo();
        if (!userData) {
          throw new Error('No user data received');
        }
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phoneNumber: userData.phoneNumber || '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      }
    };

    loadUserData();
  }, [toast, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await authService.updateUser(user.id, formData);
      setUser(prevUser => ({
        ...prevUser,
        ...formData
      }));
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phoneNumber: user.phoneNumber || '',
    });
    setIsEditing(false);
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
            Profile
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
              <MenuItem icon={<Icon as={FiSettings} />} onClick={() => navigate('/edit-profile')}>
                Settings
              </MenuItem>
              <MenuItem icon={<Icon as={FiLogOut} />} onClick={() => navigate('/login')} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList mb={6}>
            <Tab>
              <Icon as={FiUser} mr={2} />
              Profile Information
            </Tab>
            <Tab>
              <Icon as={FiSettings} mr={2} />
              Settings
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem colSpan={2}>
                  <Flex direction="column" align="center" mb={8}>
                    <Avatar
                      size="2xl"
                      name={user.firstName}
                      mb={4}
                    />
                    <Heading size="md">{user.firstName} {user.lastName}</Heading>
                    <Badge colorScheme="blue" mt={2}>{user.role}</Badge>
                  </Flex>
                </GridItem>

                <GridItem>
                  <Box p={6} borderWidth={1} borderColor={borderColor} borderRadius="lg" bg={bgColor}>
                    <HStack justify="space-between" mb={4}>
                      <Heading size="sm">Personal Information</Heading>
                      {!isEditing && (
                        <Button
                          leftIcon={<Icon as={FiEdit2} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
                      )}
                    </HStack>
                    <Divider mb={4} />
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel color={textColor}>First Name</FormLabel>
                        {isEditing ? (
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            bg={inputBgColor}
                            borderColor={inputBorderColor}
                            _hover={{ borderColor: 'blue.500' }}
                            _focus={{ borderColor: 'blue.500' }}
                          />
                        ) : (
                          <Text color={textColor}>{user.firstName}</Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel color={textColor}>Last Name</FormLabel>
                        {isEditing ? (
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            bg={inputBgColor}
                            borderColor={inputBorderColor}
                            _hover={{ borderColor: 'blue.500' }}
                            _focus={{ borderColor: 'blue.500' }}
                          />
                        ) : (
                          <Text color={textColor}>{user.lastName}</Text>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel color={textColor}>Phone Number</FormLabel>
                        {isEditing ? (
                          <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            bg={inputBgColor}
                            borderColor={inputBorderColor}
                            _hover={{ borderColor: 'blue.500' }}
                            _focus={{ borderColor: 'blue.500' }}
                          />
                        ) : (
                          <Text color={textColor}>{user.phoneNumber}</Text>
                        )}
                      </FormControl>

                      {isEditing && (
                        <HStack spacing={4} mt={4}>
                          <Button
                            leftIcon={<Icon as={FiSave} />}
                            colorScheme="blue"
                            onClick={handleSave}
                          >
                            Save Changes
                          </Button>
                          <Button
                            leftIcon={<Icon as={FiX} />}
                            variant="ghost"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </GridItem>

                <GridItem>
                  <Box p={6} borderWidth={1} borderColor={borderColor} borderRadius="lg" bg={bgColor}>
                    <Heading size="sm" mb={4}>Contact Information</Heading>
                    <Divider mb={4} />
                    <VStack spacing={4} align="stretch">
                      <Flex align="center">
                        <Icon as={FiMail} mr={2} />
                        <Text color={textColor}>{user.email}</Text>
                      </Flex>
                      <Flex align="center">
                        <Icon as={FiPhone} mr={2} />
                        <Text color={textColor}>{user.phoneNumber || 'Not provided'}</Text>
                      </Flex>
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </TabPanel>

            <TabPanel>
              <Text color={textColor}>Settings content will go here</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Profile; 