import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurvivorService } from '@/domain/services/create-survivor';
import {
  CreateSurvivorInput,
  Survivor,
  UpdateSurvivorInput,
} from '../schema/survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { GetSurvivorService } from '@/domain/services/get-survivor';

@Resolver()
export class SurvivorsResolver {
  constructor(
    private readonly createSurvivorService: CreateSurvivorService,
    private readonly updateSurvivorService: UpdateSurvivorService,
    private readonly getSurvivorService: GetSurvivorService,
  ) {}

  @Query(() => Survivor)
  async survivor(@Args('id') id: string) {
    const { survivor } = await this.getSurvivorService.execute({ id });

    return survivor;
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
