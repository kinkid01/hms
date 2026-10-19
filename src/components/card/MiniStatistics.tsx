import type { ReactElement } from 'react';
// Chakra imports
import { Flex, Stat, StatLabel, StatNumber, useColorModeValue, Text } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';

export default function Default(props: {
	startContent?: ReactElement;
	endContent?: ReactElement;
	name: string;
	subtitle?: string;
	value: string | number;
}) {
	const { startContent, endContent, name, subtitle, value } = props;
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = 'secondaryGray.600';

	return (
		<Card py='15px' h='100%'>
			<Flex my='auto' h='100%' align='center'>
				{startContent}

				<Stat my='auto' ms={startContent ? '16px' : '0px'} minW='0'>
					<StatLabel lineHeight='100%' color={textColorSecondary} fontSize='sm'>
						{name}
					</StatLabel>
					<StatNumber color={textColor} fontSize={{ base: 'xl', '2xl': '2xl' }} noOfLines={1}>
						{value}
					</StatNumber>
					{subtitle && (
						<Text color={textColorSecondary} fontSize='xs' noOfLines={1}>
							{subtitle}
						</Text>
					)}
				</Stat>
				{endContent && (
					<Flex ms='auto' w='max-content'>
						{endContent}
					</Flex>
				)}
			</Flex>
		</Card>
	);
}
