import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import { DarkModeSwitch } from "../components/DarLightMode";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
interface Props {}

const Navbar = (props: Props) => {
  const [{ data, fetching }] = useMeQuery();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
    // data is fetching
  } else if (!data?.me) {
    // User is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mx={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mx={2}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    // user is logged in

    body = (
      <Flex>
        <Box mx={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4}>
      <Flex ml="auto">
        {body}
        <DarkModeSwitch />
      </Flex>
    </Flex>
  );
};

export default Navbar;
