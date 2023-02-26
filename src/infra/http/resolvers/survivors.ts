import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurvivorService } from '@/domain/services/create-survivor';
import {
  CreateSurvivorInput,
  Survivor,
  UpdateSurvivorInput,
} from '../schema/survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';

@Resolver()
export class SurvivorsResolver {
  constructor(
    private readonly createSurvivorService: CreateSurvivorService,
    private readonly updateSurvivorService: UpdateSurvivorService,
  ) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation(() => Survivor)
  async createSurvivor(@Args('input') input: CreateSurvivorInput) {
    const { survivor } = await this.createSurvivorService.execute(input);

    return survivor;
  }

  @Mutation(() => Survivor)
  async updateSurvivor(@Args('input') input: UpdateSurvivorInput) {
    const { survivor } = await this.updateSurvivorService.execute(input);

    return survivor;
  }
}
