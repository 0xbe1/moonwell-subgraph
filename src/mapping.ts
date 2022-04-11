import { Address, BigInt, BigDecimal, log, ethereum } from "@graphprotocol/graph-ts"
import {
  Comptroller,
  MarketListed,
  NewCollateralFactor,
  NewLiquidationIncentive,
} from "../generated/Comptroller/Comptroller"
import { CToken } from "../generated/Comptroller/CToken"
import { ERC20 } from "../generated/Comptroller/ERC20"
import { LendingProtocol, Market, Token } from "../generated/schema"
import { BIGDECIMAL_ZERO, BIGINT_ZERO, LendingType, Network, ProtocolType, RiskType } from "./constants"

let comptrollerAddr = Address.fromString("0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B")
let ethAddr = Address.fromString("0x0000000000000000000000000000000000000000")
let cETHAddr = Address.fromString("0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5")
let compAddr = "0xc00e94cb662c3520282e6f5717214004a7f26888"

// 
//
// event.params.cToken: The address of the market (token) to list
export function handleMarketListed(event: MarketListed): void {
  let cTokenAddr = event.params.cToken
  let cToken = Token.load(cTokenAddr.toHexString())
  if (cToken != null) {
    return
  }
  // this is a new cToken, a new underlying token, and a new market

  //
  // create cToken
  //
  let cTokenContract = CToken.bind(event.params.cToken)
  
  // get underlying token
  let underlyingTokenAddr: Address

  // if we cannot fetch the underlying token of a non-cETH cToken
  // then fail early
  if (cTokenAddr == cETHAddr) {
    underlyingTokenAddr = ethAddr
  } else {
    let underlyingTokenAddrResult = cTokenContract.try_underlying()
    if (underlyingTokenAddrResult.reverted) {
      log.warning("[handleMarketListed] could not fetch underlying token of cToken: {}", [cTokenAddr.toHexString()])
      return
    }
    underlyingTokenAddr = underlyingTokenAddrResult.value
  }

  cToken = new Token(cTokenAddr.toHexString())
  
  if (cTokenAddr == cETHAddr) {
    cToken.name = "Compound Ether"
    cToken.symbol = "cETH"
    cToken.decimals = 18
    cToken.save()
  } else {
    cToken.name = getOrElse<string>(cTokenContract.try_name(), "unknown")
    cToken.symbol = getOrElse<string>(cTokenContract.try_symbol(), "unknown")
    cToken.decimals = getOrElse<BigInt>(cTokenContract.try_decimals(), BIGINT_ZERO).toI32()
    cToken.save()
  }
  
  //
  // create underlying token
  //
  let underlyingToken = new Token(underlyingTokenAddr.toHexString())
  if (underlyingTokenAddr == ethAddr) {
    underlyingToken.name = "Ether"
    underlyingToken.symbol = "ETH"
    underlyingToken.decimals = 18
  } else {
    let underlyingTokenContract = ERC20.bind(underlyingTokenAddr)
    underlyingToken.name = getOrElse<string>(underlyingTokenContract.try_name(), "unknown")
    underlyingToken.symbol = getOrElse<string>(underlyingTokenContract.try_symbol(), "unknown")
    underlyingToken.decimals = getOrElse<i32>(underlyingTokenContract.try_decimals(), 0)
    underlyingToken.save()
  }

  //
  // create market
  //
  let market = new Market(cTokenAddr.toHexString())
  let protocol = getOrCreateProtocol()
  market.name = cToken.name
  market.protocol = protocol.id
  market.inputTokens = [underlyingToken.id]
  market.inputTokenBalances = [BIGINT_ZERO]
  market.inputTokenPricesUSD = [BIGDECIMAL_ZERO]
  market.outputToken = cToken.id
  // TODO: market.rewardTokens
  market.createdTimestamp = event.block.timestamp
  market.createdBlockNumber = event.block.number
  market.isActive = true
  market.canUseAsCollateral = true
  market.canBorrowFrom = true
  market.liquidationPenalty = protocol._liquidationIncentive
  market.save()
}

//
//
// event.params.cToken:
// event.params.oldCollateralFactorMantissa:
// event.params.newCollateralFactorMantissa:
export function handleNewCollateralFactor(event: NewCollateralFactor): void {
  let marketID = event.params.cToken.toHexString()
  let market = Market.load(marketID)
  if (market == null) {
    log.warning("[handleNewCollateralFactor] Market not found: {}", [marketID])
    return
  }
  let collateralFactor = convertMantissaToRatio(event.params.newCollateralFactorMantissa)
  market.maximumLTV = collateralFactor
  market.liquidationThreshold = collateralFactor
  market.save()
}

//
//
// event.params.oldLiquidationIncentiveMantissa
// event.params.newLiquidationIncentiveMantissa
export function handleNewLiquidationIncentive(
  event: NewLiquidationIncentive
): void {
  let protocol = getOrCreateProtocol()
  let liquidationIncentive = convertMantissaToRatio(event.params.newLiquidationIncentiveMantissa)
  protocol._liquidationIncentive = liquidationIncentive
  protocol.save()

  // for (let i = 0; i < protocol.markets.length; i++) {
  //   let market = Market.load(protocol.markets[i])
  //   if (!market) {
  //     log.warning("[handleNewLiquidationIncentive] Market not found: {}", [protocol.markets[i]])
  //     // best effort
  //     continue
  //   }
  //   market.liquidationPenalty = liquidationIncentive
  //   market.save()
  // }
}

function getOrCreateProtocol(): LendingProtocol {
  let protocol = LendingProtocol.load(comptrollerAddr.toHexString())
  if (!protocol) {
    protocol = new LendingProtocol(comptrollerAddr.toHexString())
    protocol.name = "Compound V2"
    protocol.slug = "compound-v2"
    protocol.schemaVersion = "1.1.0"
    protocol.subgraphVersion = "1.0.0"
    protocol.methodologyVersion = "1.0.0"
    protocol.network = Network.ETHEREUM
    protocol.type = ProtocolType.LENDING
    protocol.lendingType = LendingType.POOLED
    protocol.riskType = RiskType.GLOBAL

    let comptroller = Comptroller.bind(comptrollerAddr)
    protocol._liquidationIncentive = convertMantissaToRatio(comptroller.liquidationIncentiveMantissa())
    protocol.save()
  }
  return protocol
}

// TODO: verify this is correct
function convertMantissaToRatio(mantissa: BigInt): BigDecimal {
  return mantissa.toBigDecimal().div(BigDecimal.fromString("1000000000000000000"))
}

function getOrElse<T>(result: ethereum.CallResult<T>, defaultValue: T): T {
  if (result.reverted) {
    return defaultValue
  }
  return result.value
}