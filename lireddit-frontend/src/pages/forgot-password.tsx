import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  CloseButton,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Wrapper from "../components/wrapper";
import InputTextField from "../components/InputTextField";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";
interface loginProps {}
interface Props {}

const ForgotPassword: React.FC = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          if (values.email === "") {
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Your browser is outdated!</AlertTitle>
              <AlertDescription>
                Your Chakra experience may be degraded.
              </AlertDescription>
              <CloseButton position="absolute" right="8px" top="8px" />
            </Alert>;
          } else {
            console.log(values.email);
            await forgotPassword({ email: values.email });
            setSubmitting(true);
            setIsCompleted(true);
          }
        }}
      >
        {({ isSubmitting }) =>
          isCompleted ? (
            <Flex>
              <Text>We have sent email, please check your inbox </Text>
              <Link mx={3} ml="auto" color="teal">
                <NextLink href="/login">Login</NextLink>
              </Link>
            </Flex>
          ) : (
            <Form>
              <InputTextField
                name="email"
                placeholder="Enter Email"
                label="Email"
                type="email"
              />
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
