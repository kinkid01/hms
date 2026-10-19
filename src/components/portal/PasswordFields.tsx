import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdCheckCircle, MdOutlineRadioButtonUnchecked, MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Hospital password policy. Keep in sync with backend validation.
export const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'An uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'A lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'A number', test: (p: string) => /\d/.test(p) },
  { label: 'A special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export const isStrongPassword = (p: string) => passwordRules.every((r) => r.test(p));

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  id: string;
}) {
  const [show, setShow] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  return (
    <FormControl isInvalid={!!error} mb="20px">
      <FormLabel htmlFor={id} ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
        {label}
      </FormLabel>
      <InputGroup size="md">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? 'text' : 'password'}
          variant="auth"
          fontSize="sm"
          size="lg"
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <InputRightElement display="flex" alignItems="center" mt="4px">
          <Icon
            color="gray.400"
            _hover={{ cursor: 'pointer' }}
            as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
            onClick={() => setShow(!show)}
            aria-label={show ? 'Hide password' : 'Show password'}
          />
        </InputRightElement>
      </InputGroup>
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <List spacing="6px" mb="24px" fontSize="sm">
      {passwordRules.map((r) => {
        const ok = r.test(password);
        return (
          <ListItem key={r.label} display="flex" alignItems="center" color={ok ? 'green.500' : 'secondaryGray.600'}>
            <Icon as={ok ? MdCheckCircle : MdOutlineRadioButtonUnchecked} me="8px" />
            {r.label}
          </ListItem>
        );
      })}
    </List>
  );
}
