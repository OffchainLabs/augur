/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateSell = require("../../../../src/trading/simulation/simulate-sell");
var constants = require("../../../../src/constants");
var ZERO = constants.ZERO;

describe("trading/simulation/simulate-sell", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(simulateSell(t.params.outcome, t.params.sharesToCover, t.params.shareBalances, t.params.tokenBalance, t.params.userAddress, t.params.minPrice, t.params.maxPrice, t.params.price, t.params.marketCreatorFeeRate, t.params.reportingFeeRate, t.params.shouldCollectReportingFees, t.params.buyOrderBook));
    });
  };
  test({
    description: "single matching bid, taker partially filled",
    params: {
      outcome: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      userAddress: "USER_ADDRESS",
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      buyOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: "0.7",
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS"
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        settlementFees: ZERO,
        gasFees: ZERO,
        otherSharesDepleted: ZERO,
        sharesDepleted: ZERO,
        tokensDepleted: new BigNumber("0.9", 10),
        shareBalances: [ZERO, new BigNumber("5", 10)]
      });
    }
  });
  test({
    description: "no matching bids",
    params: {
      outcome: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      userAddress: "USER_ADDRESS",
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      buyOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: "0.6",
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS"
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        settlementFees: ZERO,
        gasFees: ZERO,
        otherSharesDepleted: ZERO,
        sharesDepleted: ZERO,
        tokensDepleted: new BigNumber("0.9", 10),
        shareBalances: [ZERO, new BigNumber("5", 10)]
      });
    }
  });
  test({
    description: "two matching bids, complete fill",
    params: {
      outcome: 0,
      sharesToCover: new BigNumber("3", 10),
      shareBalances: [ZERO, new BigNumber("5", 10)],
      tokenBalance: ZERO,
      userAddress: "USER_ADDRESS",
      minPrice: ZERO,
      maxPrice: new BigNumber("1", 10),
      price: new BigNumber("0.7", 10),
      marketCreatorFeeRate: ZERO,
      reportingFeeRate: new BigNumber("0.01", 10),
      shouldCollectReportingFees: 1,
      buyOrderBook: {
        ORDER_0: {
          amount: "2",
          fullPrecisionPrice: "0.8",
          sharesEscrowed: "2",
          outcome: 0,
          owner: "OWNER_ADDRESS"
        },
        ORDER_1: {
          amount: "1",
          fullPrecisionPrice: "0.7",
          sharesEscrowed: "1",
          outcome: 0,
          owner: "OWNER_ADDRESS"
        }
      }
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        settlementFees: ZERO,
        gasFees: ZERO,
        otherSharesDepleted: ZERO,
        sharesDepleted: ZERO,
        tokensDepleted: new BigNumber("0.7", 10),
        shareBalances: [ZERO, new BigNumber("5", 10)]
      });
    }
  });
});
