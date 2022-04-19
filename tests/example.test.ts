import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { assert, test } from "matchstick-as/assembly/index";

function intToBigDecimal(value: i32): BigDecimal {
  return new BigDecimal(BigInt.fromI32(value));
}

test("BigDecimal#div", () => {
  assert.stringEquals(
    intToBigDecimal(1).div(intToBigDecimal(5000000)).toString(),
    "0.0000002"
  );
  assert.stringEquals(
    intToBigDecimal(1)
      .div(BigDecimal.fromString("1000000000000000000"))
      .toString(),
    "0.000000000000000001"
  );
});

test("BigDecimal#truncate", () => {
  assert.stringEquals(
    BigDecimal.fromString("1234.1234").truncate(1).toString(),
    "1234.1"
  );
  assert.stringEquals(
    BigDecimal.fromString("1234.1234").truncate(2).toString(),
    "1234.12"
  );
  assert.stringEquals(
    BigDecimal.fromString("1234.1234").truncate(3).toString(),
    "1234.123"
  );
  assert.stringEquals(
    BigDecimal.fromString("1234.1234").truncate(4).toString(),
    "1234.1234"
  );
});
