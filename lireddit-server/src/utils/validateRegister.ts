import { UsernameAndPasswordInput } from "./UsernameAndPasswordInput";

export const validateRegister = (options: UsernameAndPasswordInput) => {
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Cannot use '@' in username",
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username should be at least 3 characters",
      },
    ];
  }

  if (options.password.length < 6) {
    return [
      {
        field: "password",
        message: "password should be at least 6 characters",
      },
    ];
  }
  return null;
};
