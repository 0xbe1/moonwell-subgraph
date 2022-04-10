import { BigInt } from "@graphprotocol/graph-ts"
import {
  Comptroller,
  ActionPaused,
  ActionPaused1,
  CompAccruedAdjusted,
  CompBorrowSpeedUpdated,
  CompGranted,
  CompReceivableUpdated,
  CompSupplySpeedUpdated,
  ContributorCompSpeedUpdated,
  DistributedBorrowerComp,
  DistributedSupplierComp,
  Failure,
  MarketEntered,
  MarketExited,
  MarketListed,
  NewBorrowCap,
  NewBorrowCapGuardian,
  NewCloseFactor,
  NewCollateralFactor,
  NewLiquidationIncentive,
  NewPauseGuardian,
  NewPriceOracle
} from "../generated/Comptroller/Comptroller"
import { ExampleEntity } from "../generated/schema"

export function handleActionPaused(event: ActionPaused): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.action = event.params.action
  entity.pauseState = event.params.pauseState

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract._borrowGuardianPaused(...)
  // - contract._mintGuardianPaused(...)
  // - contract._setBorrowPaused(...)
  // - contract._setCloseFactor(...)
  // - contract._setCollateralFactor(...)
  // - contract._setLiquidationIncentive(...)
  // - contract._setMintPaused(...)
  // - contract._setPauseGuardian(...)
  // - contract._setPriceOracle(...)
  // - contract._setSeizePaused(...)
  // - contract._setTransferPaused(...)
  // - contract._supportMarket(...)
  // - contract.accountAssets(...)
  // - contract.admin(...)
  // - contract.allMarkets(...)
  // - contract.borrowAllowed(...)
  // - contract.borrowCapGuardian(...)
  // - contract.borrowCaps(...)
  // - contract.borrowGuardianPaused(...)
  // - contract.checkMembership(...)
  // - contract.closeFactorMantissa(...)
  // - contract.compAccrued(...)
  // - contract.compBorrowSpeeds(...)
  // - contract.compBorrowState(...)
  // - contract.compBorrowerIndex(...)
  // - contract.compContributorSpeeds(...)
  // - contract.compInitialIndex(...)
  // - contract.compRate(...)
  // - contract.compReceivable(...)
  // - contract.compSpeeds(...)
  // - contract.compSupplierIndex(...)
  // - contract.compSupplySpeeds(...)
  // - contract.compSupplyState(...)
  // - contract.comptrollerImplementation(...)
  // - contract.enterMarkets(...)
  // - contract.exitMarket(...)
  // - contract.getAccountLiquidity(...)
  // - contract.getAllMarkets(...)
  // - contract.getAssetsIn(...)
  // - contract.getBlockNumber(...)
  // - contract.getCompAddress(...)
  // - contract.getHypotheticalAccountLiquidity(...)
  // - contract.isComptroller(...)
  // - contract.isDeprecated(...)
  // - contract.lastContributorBlock(...)
  // - contract.liquidateBorrowAllowed(...)
  // - contract.liquidateCalculateSeizeTokens(...)
  // - contract.liquidationIncentiveMantissa(...)
  // - contract.markets(...)
  // - contract.maxAssets(...)
  // - contract.mintAllowed(...)
  // - contract.mintGuardianPaused(...)
  // - contract.oracle(...)
  // - contract.pauseGuardian(...)
  // - contract.pendingAdmin(...)
  // - contract.pendingComptrollerImplementation(...)
  // - contract.proposal65FixExecuted(...)
  // - contract.redeemAllowed(...)
  // - contract.repayBorrowAllowed(...)
  // - contract.seizeAllowed(...)
  // - contract.seizeGuardianPaused(...)
  // - contract.transferAllowed(...)
  // - contract.transferGuardianPaused(...)
}

export function handleActionPaused1(event: ActionPaused1): void {}

export function handleCompAccruedAdjusted(event: CompAccruedAdjusted): void {}

export function handleCompBorrowSpeedUpdated(
  event: CompBorrowSpeedUpdated
): void {}

export function handleCompGranted(event: CompGranted): void {}

export function handleCompReceivableUpdated(
  event: CompReceivableUpdated
): void {}

export function handleCompSupplySpeedUpdated(
  event: CompSupplySpeedUpdated
): void {}

export function handleContributorCompSpeedUpdated(
  event: ContributorCompSpeedUpdated
): void {}

export function handleDistributedBorrowerComp(
  event: DistributedBorrowerComp
): void {}

export function handleDistributedSupplierComp(
  event: DistributedSupplierComp
): void {}

export function handleFailure(event: Failure): void {}

export function handleMarketEntered(event: MarketEntered): void {}

export function handleMarketExited(event: MarketExited): void {}

export function handleMarketListed(event: MarketListed): void {}

export function handleNewBorrowCap(event: NewBorrowCap): void {}

export function handleNewBorrowCapGuardian(event: NewBorrowCapGuardian): void {}

export function handleNewCloseFactor(event: NewCloseFactor): void {}

export function handleNewCollateralFactor(event: NewCollateralFactor): void {}

export function handleNewLiquidationIncentive(
  event: NewLiquidationIncentive
): void {}

export function handleNewPauseGuardian(event: NewPauseGuardian): void {}

export function handleNewPriceOracle(event: NewPriceOracle): void {}
