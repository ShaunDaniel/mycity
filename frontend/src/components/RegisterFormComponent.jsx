import React from 'react'
import { FormControl, FormLabel, Input, FormErrorMessage } from "@chakra-ui/react";

function RegisterFormComponent({ id, label, type, value, onChange, onBlur, placeholder, error, isRequired }) {
  return (
    <FormControl id={id} mb={4} isInvalid={error}>
    <FormLabel fontSize={{base:'x-large',lg:'md'}}>{label}</FormLabel>
    <Input type={type} value={value} fontSize={{base:'lg',lg:'md'}} onChange={onChange} onBlur={onBlur} placeholder={placeholder} isRequired={isRequired}/>
        {error && (
      <FormErrorMessage>{error}</FormErrorMessage>
    )}
  </FormControl>
  )
}

export default RegisterFormComponent