import { FieldError } from "../generated/graphql";

export const toErrorMap = (
  errors: ({ __typename?: "FieldError" | undefined } & Pick<
    FieldError,
    "message"
  > &
    Pick<FieldError, "field">)[]
) => {
  const errorMap: Record<string, string> = {};

  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
