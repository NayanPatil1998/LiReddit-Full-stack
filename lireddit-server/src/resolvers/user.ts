import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Ctx,
  Arg,
  Int,
  Mutation,
  Field,
  InputType,
  ObjectType,
} from "type-graphql";

import argon2 from "argon2";
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernameAndPasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) return null;

    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "username should be at least 3 characters",
          },
        ],
      };
    }

    if (options.password.length < 6) {
      return {
        errors: [
          {
            field: "password",
            message: "password should be at least 6 characters",
          },
        ],
      };
    }

    const hashedPass = await argon2.hash(options.password);
    console.log(hashedPass);

    const user = em.create(User, {
      username: options.username,
      password: hashedPass,
    });
    try {
      await em.persistAndFlush(user);
    } catch (error) {
      if (error.detail.includes("already exists"))
        return {
          errors: [
            {
              field: "username",
              message: `Username with ${options.username} is already exist`,
            },
          ],
        };
    }
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernameAndPasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: options.username,
    });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `User with ${options.username} username does not exist`,
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user: user,
    };
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
