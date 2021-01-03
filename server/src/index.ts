import "dotenv/config"
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { createConnections } from 'typeorm';
import cookiesParser from 'cookie-parser';
import { UserResolver } from "./resolvers/user.resolver";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken, createRefeshToken, setTokenInCookie } from "./helpers/auth";

(async () => {
    const app = express();

    app.use(cookiesParser());

    app.post('/refresh_token', async (req, res) => {
        const token = req.cookies.jid;
        if (!token) {
            return res.send({ ok: false, accessToken: '' });
        }

        let payload: any = null;
        try {
            payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
        } catch (error) {
            console.log(error)
            return res.send({ ok: false, accessToken: '' });
        }

        // token is valid
        // and send back new accesstoken
        const user = await User.findOne({ id: payload.userId });

        if (!user) {
            return res.send({ ok: false, accessToken: '' });
        }

        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: '' });
        }

        setTokenInCookie(res, createRefeshToken(user));

        return res.send({ ok: false, accessToken: createAccessToken(user) });

    })
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
        }),
        context: ({ req, res }) => ({ req, res }),
    });

    // check ormconfig.json if error
    await createConnections();

    apolloServer.applyMiddleware({ app });

    app.listen(3000, () => {
        console.log('express server is running')
    })

})()

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
