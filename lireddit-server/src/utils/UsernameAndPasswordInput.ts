import { Field, InputType } from "type-graphql";

@InputType()
export class UsernameAndPasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
