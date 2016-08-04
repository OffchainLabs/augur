/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");
var constants = require("../constants");

module.exports = {

    buy: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.buy);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        var prepare = function (res, cb) {
            res.tradeID = utils.sha3([
                constants.BID,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            if (!utils.is_function(cb)) return res;
            return cb(res);
        };
        if (!utils.is_function(onSent)) return prepare(this.transact(tx));
        this.transact(tx, onSent, utils.compose(prepare, onSuccess), onFailed, utils.compose(prepare, onConfirmed));
    },

    sell: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.sell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        var prepare = function (res, cb) {
            res.tradeID = utils.sha3([
                constants.ASK,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            if (!utils.is_function(cb)) return res;
            return cb(res);
        };
        if (!utils.is_function(onSent)) return prepare(this.transact(tx));
        this.transact(tx, onSent, utils.compose(prepare, onSuccess), onFailed, utils.compose(prepare, onConfirmed));
    },

    buyCompleteSetsThenSell: function (amount, price, market, outcome, onSent, onSuccess, onFailed, onConfirmed) {
        var self = this;
        if (amount.constructor === Object && amount.amount) {
            price = amount.price;
            market = amount.market;
            outcome = amount.outcome;
            onSent = amount.onSent;
            onSuccess = amount.onSuccess;
            onFailed = amount.onFailed;
            onConfirmed = amount.onConfirmed;
            amount = amount.amount;
        }
        onSent = onSent || utils.noop;
        onSuccess = onSuccess || utils.noop;
        onFailed = onFailed || utils.noop;
        var tx = clone(this.tx.BuyAndSellShares.buyCompleteSetsThenSell);
        tx.params = [abi.fix(amount, "hex"), abi.fix(price, "hex"), market, outcome];
        var prepare = function (res, cb) {
            res.tradeID = utils.sha3([
                constants.ASK,
                market,
                abi.fix(amount, "hex"),
                abi.fix(price, "hex"),
                res.from,
                res.blockNumber,
                parseInt(outcome)
            ]);
            if (!utils.is_function(cb)) return res;
            return cb(res);
        };
        if (!utils.is_function(onSent)) return prepare(this.transact(tx));
        this.transact(tx, onSent, utils.compose(prepare, onSuccess), onFailed, utils.compose(prepare, onConfirmed));
    }
};
