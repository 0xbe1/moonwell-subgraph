# Moonwell Subgraph

Moonwell is a Compound fork on Moonriver.

## Major Differences between Compound and Moonwell Subgraphs

### Naming

Moonwell renames c-prefix into m-prefix for all concepts, including:

- cToken -> mToken
- cErc -> mErc

### Accural Per Second, not Per Block

In Ethereum mainnet blocks are fairly predictable and Compound was originally written to make interest calculations based on blocks. But on other EVM chains where blocks are not as predictable, we must make calculations for interest rates using seconds and timestamps instead of assuming all blocks are fixed time.

- (supplyRate/borrowRate)PerBlock -> (supplyRate/borrowRate)PerTimestamp

### Rewards

Moonwell rewards both borrowers and suppliers with 2 tokens: MFAM (rewardType=0) and MOVR (rewardType=1).

## Validation (as of Apr 27)

Compare [Moonwell mUSDC dashboard](https://moonwell.fi/apollo/USDC) with [The Graph query](https://api.thegraph.com/subgraphs/name/0xbe1/moonwell-subgraph/graphql) below.

```gql
{
  market(id: "0xd0670aee3698f66e2d4daf071eb9c690d978bfa8") {
    id
    name
    protocol {
      totalDepositBalanceUSD
      totalBorrowBalanceUSD
    }
    liquidationThreshold
    inputToken {
      name
    }
    outputToken {
      name
    }
    rates {
      rate
      side
      type
    }
    totalDepositBalanceUSD
    totalBorrowBalanceUSD
    inputTokenPriceUSD
    rewardTokens {
      token {
        name
      }
      type
    }
    rewardTokenEmissionsAmount
  }
}
```

Result.

|                                                                    | Moonwell Dashboard | The Graph    |
| ------------------------------------------------------------------ | ------------------ | ------------ |
| market overview total supply USD / protocol.totalDepositBalanceUSD | 317387313.12       | 314984317.47 |
| market overview total borrow USD / protocol.totalBorrowBalanceUSD  | 150583681.17       | 150165384.57 |
| mUSDC total supply USDC / totalSupplyBalanceUSD                    | 105260104.47       | 104948771.86 |
| mUSDC total borrow USDC / totalBorrowBalanceUSD                    | 42696183.83        | 42695495.63  |
| mUSDC supply APY / rates[1].rate                                   | 1.98               | 1.96         |
| mUSDC borrow APY / rates[0].rate                                   | 6.24               | 6.05         |
| price USD / inputTokenPriceUSD                                     | 1                  | 1            |
| Collateral Factor / liquidationThreshold                           | 60                 | 60           |

## Resources

[Deployed Subgraph](https://thegraph.com/hosted-service/subgraph/0xbe1/moonwell-subgraph)
