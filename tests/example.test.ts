import { BigDecimal } from "@graphprotocol/graph-ts";
import { assert, test } from "matchstick-as/assembly/index";

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
