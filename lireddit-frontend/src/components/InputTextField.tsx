import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";
import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  placeholder: string;
  name: string;
};

const InputTextField = (props: InputProps) => {
  const [field, { error, touched }] = useField(props);

  return (
    <Box my={4}>
      <FormControl isInvalid={error && touched}>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
        <Input {...field} id={field.name} placeholder={props.placeholder} />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
    </Box>
  );
};

export default InputTextField;
