import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateSurvivorService } from '@/domain/services/create-survivor';
import {
  CreateSurvivorInput,
  CreateTradeInput,
  PaginatedSurvivorResponse,
  Survivor,
  SurvivorsArgs,
  Trade,
  UpdateSurvivorInput,
} from '../schema/survivor';
import { UpdateSurvivorService } from '@/domain/services/update-survivor';
import { GetSurvivorService } from '@/domain/services/get-survivor';
import { ListSurvivorsService } from '@/domain/services/list-survivors';
import { DeleteSurvivorService } from '@/domain/services/delete-survivor';
import { TradeItemsService } from '@/domain/services/trade-items';
import { UnauthorizedException } from '@nestjs/common';

@Resolver()
export class SurvivorsResolver {
  constructor(
    private readonly createSurvivorService: CreateSurvivorService,
    private readonly updateSurvivorService: UpdateSurvivorService,
    private readonly getSurvivorService: GetSurvivorService,
    private readonly listSurvivorsService: ListSurvivorsService,
    private readonly deleteSurvivorService: DeleteSurvivorService,
    private readonly tradeItemsService: TradeItemsService,
  ) {}

  @Query(() => PaginatedSurvivorResponse)
  async survivors(@Args() { first, offset }: SurvivorsArgs) {
    const { total, survivors } = await this.listSurvivorsService.execute({
      limit: first,
      page: offset / first + 1,
    });

    return {
      total,
      data: survivors,
    };
  }

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

  @Mutation(() => Survivor)
  async deleteSurvivor(@Args('id') id: string) {
    const { survivor } = await this.deleteSurvivorService.execute({
      id,
    });

    return survivor;
  }

  @Mutation(() => Trade)
  async createTrade(
    @Args('input') input: CreateTradeInput,
    @Context() ctx: any,
  ) {
    const requesterId = ctx.req.headers.authorization as string;

    if (!requesterId) {
      throw new UnauthorizedException();
    }

    return this.tradeItemsService.execute({
      requesterId,
      ...input,
    });
  }
}
