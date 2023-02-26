import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurvivorService } from '@/domain/services/create-survivor';
import { CreateSurvivorInput, Survivor } from '../schema/survivor';

@Resolver()
export class SurvivorsResolver {
  constructor(private readonly createSurvivorService: CreateSurvivorService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Survivor)
  async createSurvivor(@Args('input') input: CreateSurvivorInput) {
    const { survivor } = await this.createSurvivorService.execute(input);

    return survivor;
  }
}
