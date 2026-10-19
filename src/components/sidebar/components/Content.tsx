// chakra imports
import { Box, Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import { useAuth } from 'contexts/AuthContext';
import { MdLogout } from 'react-icons/md';
import { IRoute } from 'types/navigation';

// FUNCTIONS

interface SidebarContentProps {
	routes: IRoute[];
}

function SidebarContent(props: SidebarContentProps) {
	const { routes } = props;
	const { signOut } = useAuth();
	// SIDEBAR
	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
			<Brand />
			<Stack direction='column' mt='8px' mb='auto'>
				<Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }}>
					<Links routes={routes} />
					<HStack
						as='button'
						onClick={() => signOut()}
						py='5px'
						ps='10px'
						mt='4px'
						w='100%'
						color='red.500'
						_hover={{ opacity: 0.8 }}>
						<Flex w='100%' alignItems='center' h='36px'>
							<Icon as={MdLogout} w='20px' h='20px' me='18px' />
							<Text>Logout</Text>
						</Flex>
					</HStack>
				</Box>
			</Stack>

			<Box ps='20px' pe={{ lg: '16px', '2xl': '20px' }} mt='40px' mb='40px' borderRadius='30px'>
				<SidebarCard />
			</Box>
		</Flex>
	);
}

export default SidebarContent;
