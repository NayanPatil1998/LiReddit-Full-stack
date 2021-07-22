import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
// import { User } from "./entities/User";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import session from "express-session";
import cors from "cors";

let RedisStore = connectRedis(session);
let redis = new Redis();

const main = async () => {
  // sendEmail("nayan96047833@gmail.com", "dcsildcusi");
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  console.log(__dirname);

  // const generator = orm.getSchemaGenerator();
  // await generator.updateSchema();
  // await orm.em.nativeDelete(User, {});
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax", //CSEF
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "bvbildzvisdsucvsbiukdhsdviku",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
      redis,
    }),
  });

  // const users = await orm.em.find(User, {});

  // console.log(users);

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Server is running on 4000");
  });

  // const post = orm.em.create(Post, { title: "my second post" });
  // await orm.em.persistAndFlush(post);

  // const posts = await orm.em.find(Post, {});
  // console.log(posts);
};

main().catch((err) => console.error(err));
