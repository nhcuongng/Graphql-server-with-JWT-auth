import { User } from '../entity/User';
import { hash } from 'bcryptjs';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';

@Resolver()
export class UserResolver {

  @Query(() => String)
  hello() {
    return 'hi'
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    const hashPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashPassword
      })
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }

} 