import React from "react";
import { Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Wrapper from "../components/wrapper";
import InputTextField from "../components/InputTextField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
interface loginProps {}

const Login: React.FC<loginProps> = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputTextField
              name="usernameOrEmail"
              placeholder="Enter Username or Email"
              label="Username Or Email"
            />
            <InputTextField
              name="password"
              placeholder="Enter Password"
              label="Password"
              type="password"
            />
            <Flex>
              <Link mx={3} ml="auto" color="teal">
                <NextLink href="/forgot-password"> Forgot Password ?</NextLink>
              </Link>
            </Flex>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
