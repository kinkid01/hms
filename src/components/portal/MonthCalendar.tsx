// Read-only month calendar. Days with events show coloured dots; clicking a
// day only selects it so the page can show that day's details.
import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { dayKey } from 'lib/format';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export interface CalendarMarker {
  date: string; // ISO
  color: string; // Chakra colour token
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  markers,
}: {
  month: Date; // any date within the month to display
  onMonthChange: (d: Date) => void;
  selected: string; // dayKey
  onSelect: (key: string) => void;
  markers: CalendarMarker[];
}) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const mutedColor = useColorModeValue('secondaryGray.500', 'secondaryGray.600');
  const hoverBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const todayBorder = useColorModeValue('brand.500', 'brand.400');

  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const gridStart = new Date(year, m, 1 - first.getDay());
  const weeks = Math.ceil((first.getDay() + new Date(year, m + 1, 0).getDate()) / 7);
  const days = Array.from({ length: weeks * 7 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));

  const byDay: Record<string, string[]> = {};
  markers.forEach((mk) => (byDay[dayKey(mk.date)] ??= []).push(mk.color));
  const today = dayKey(new Date());

  return (
    <Box>
      <Flex align="center" justify="space-between" mb="16px">
        <IconButton
          aria-label="Previous month"
          icon={<Icon as={MdChevronLeft} w="22px" h="22px" />}
          variant="light"
          size="sm"
          onClick={() => onMonthChange(new Date(year, m - 1, 1))}
        />
        <Text fontSize="lg" fontWeight="700" color={textColor}>
          {month.toLocaleString('en-NG', { month: 'long', year: 'numeric' })}
        </Text>
        <IconButton
          aria-label="Next month"
          icon={<Icon as={MdChevronRight} w="22px" h="22px" />}
          variant="light"
          size="sm"
          onClick={() => onMonthChange(new Date(year, m + 1, 1))}
        />
      </Flex>

      <Grid templateColumns="repeat(7, 1fr)" gap="4px" role="grid">
        {WEEKDAYS.map((d) => (
          <Text key={d} textAlign="center" fontSize="xs" fontWeight="700" color={mutedColor} pb="6px">
            {d}
          </Text>
        ))}
        {days.map((d) => {
          const key = dayKey(d);
          const inMonth = d.getMonth() === m;
          const isSelected = key === selected;
          const dots = byDay[key] ?? [];
          return (
            <Flex
              key={key}
              as="button"
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={`${d.toDateString()}${dots.length ? `, ${dots.length} event(s)` : ''}`}
              onClick={() => onSelect(key)}
              direction="column"
              align="center"
              justify="center"
              h={{ base: '44px', md: '56px' }}
              borderRadius="12px"
              border="2px solid"
              borderColor={key === today && !isSelected ? todayBorder : 'transparent'}
              bg={isSelected ? 'brand.500' : 'transparent'}
              color={isSelected ? 'white' : inMonth ? textColor : mutedColor}
              opacity={inMonth ? 1 : 0.5}
              fontWeight={dots.length ? '700' : '500'}
              fontSize="sm"
              _hover={{ bg: isSelected ? 'brand.500' : hoverBg }}
              transition="background .15s"
            >
              {d.getDate()}
              <Flex gap="3px" h="6px" mt="3px">
                {dots.slice(0, 3).map((c, i) => (
                  <Box key={i} w="6px" h="6px" borderRadius="full" bg={isSelected ? 'white' : c} />
                ))}
              </Flex>
            </Flex>
          );
        })}
      </Grid>
    </Box>
  );
}
