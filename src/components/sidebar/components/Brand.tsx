// Chakra imports
import { Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';
import { hospital } from 'config/hospital';
import { MdLocalHospital } from 'react-icons/md';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			<Flex align='center' my='32px' gap='10px'>
				<Flex
					align='center'
					justify='center'
					w='40px'
					h='40px'
					borderRadius='12px'
					bg='linear-gradient(135deg, #868CFF 0%, #4318FF 100%)'>
					<Icon as={MdLocalHospital} color='white' w='24px' h='24px' />
				</Flex>
				<Flex direction='column' lineHeight='1.1'>
					<Text color={logoColor} fontWeight='800' fontSize='lg'>
						{hospital.name}
					</Text>
					<Text color='secondaryGray.600' fontSize='xs' fontWeight='500'>
						{hospital.portalName}
					</Text>
				</Flex>
			</Flex>
			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarBrand;
