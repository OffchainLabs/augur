import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { startClaimingMarketsProceeds, claimMarketsProceedsGas } from 'modules/positions/actions/claim-markets-proceeds';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { createBigNumber } from 'utils/create-big-number';
import {
  formatDai,
  formatEther,
} from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Proceeds } from 'modules/modal/proceeds';
import {
  CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
  MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT,
  PROCEEDS_TO_CLAIM_TITLE,
  CLAIM_ALL_TITLE,
  CLAIMMARKETSPROCEEDS,
} from 'modules/common/constants';
import { CLAIM_MARKETS_PROCEEDS } from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  NodeStyleCallback,
  MarketClaimablePositions,
  MarketData,
} from 'modules/types';
import { selectLoginAccountClaimablePositions } from 'modules/positions/selectors/login-account-claimable-winnings';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';

const mapStateToProps = (state: AppState) => {
  const pendingQueue = state.pendingQueue || [];
  const accountMarketClaimablePositions: MarketClaimablePositions = selectLoginAccountClaimablePositions(
    state
  );
  let claimableMarkets = [];
  if (
    accountMarketClaimablePositions.markets &&
    accountMarketClaimablePositions.markets.length > 0
  ) {
    claimableMarkets = accountMarketClaimablePositions.markets.map(
      (market: MarketData) => {
        const marketId = market.id;
        const claimablePosition =
          accountMarketClaimablePositions.positions[marketId];
        const pending =
          pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
          pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];

        const unclaimedProceeds = formatDai(
          claimablePosition.unclaimedProceeds
        );
        const unclaimedProfit = formatDai(claimablePosition.unclaimedProfit);

        return {
          marketId,
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: 'Proceeds',
              value: unclaimedProceeds.full,
            },
            {
              label: 'Profit',
              value: unclaimedProfit.full,
            },
            {
              label: 'Transaction Fee',
              value: state.appStatus.gsnEnabled
                ? displayGasInDai(CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE)
                : formatEther(CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE).formattedValue,
            },
          ],
          text: PROCEEDS_TO_CLAIM_TITLE,
          action: null,
        };
      }
    );
  }
  return {
    modal: state.modal,
    gasCost: CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    claimableMarkets,
    totalUnclaimedProfit:
      accountMarketClaimablePositions.totals.totalUnclaimedProfit,
    totalUnclaimedProceeds:
    accountMarketClaimablePositions.totals.totalUnclaimedProceeds,
    GsnEnabled: state.appStatus.gsnEnabled,
    account: state.loginAccount.address,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  startClaimingMarketsProceeds: (
    marketIds: string[],
    account: string,
    callback: NodeStyleCallback
  ) => startClaimingMarketsProceeds(marketIds, account, callback),
  estimateGas: (
    marketIds: string[],
    address: string,
  ) => claimMarketsProceedsGas(marketIds, address),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const markets = sP.claimableMarkets;
  const showBreakdown = markets.length > 1;
  const claimableMarkets = showBreakdown
    ? markets.map(m => ({
        ...m,
        queueName: CLAIMMARKETSPROCEEDS,
        queueId: m.marketId,
        action: () => dP.startClaimingMarketsProceeds([m.marketId], sP.account, () => {}),
      }))
    : markets.map(m => ({
        ...m,
        action: () => dP.startClaimingMarketsProceeds([m.marketId], sP.account, () => {}),
        queueName: CLAIMMARKETSPROCEEDS,
        queueId: m.marketId,
        properties: [
          ...m.properties,
        ],
      }));

  const multiMarket = claimableMarkets.length > 1 ? 's' : '';
  const totalUnclaimedProceedsFormatted = formatDai(sP.totalUnclaimedProceeds);
  const totalUnclaimedProfitFormatted = formatDai(sP.totalUnclaimedProfit);
  const submitAllTxCount = Math.ceil(
    claimableMarkets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  if (markets.length === 0) {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
    return {};
  }

  const breakdown = showBreakdown ? [
    {
      label: 'Total Proceeds',
      value: totalUnclaimedProceedsFormatted.formatted,
    },
    {
      label: 'Total Profit',
      value: totalUnclaimedProfitFormatted.formatted,
    },
  ] : null;

  return {
    title: PROCEEDS_TO_CLAIM_TITLE,
    descriptionMessage: [
      {
        preText: 'You currently have a total of',
        boldText: totalUnclaimedProceedsFormatted.full,
      },
    ],
    rows: claimableMarkets,
    submitAllTxCount,
    estimateGas: async () => {
      if (breakdown) {
        const gas = await dP.estimateGas(claimableMarkets.map(m => m.marketId), sP.account);
        const displayfee = sP.GsnEnabled ? displayGasInDai(gas) : formatEther(gas).formattedValue;
        return {
          label: 'Transaction Fee',
          value: String(displayfee),
        };
      }
      return null;
    },
    breakdown,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    buttons: [
      {
        text: `${multiMarket ? CLAIM_ALL_TITLE : PROCEEDS_TO_CLAIM_TITLE}`,
        disabled: claimableMarkets.find(market => market.status === 'pending'),
        action: () => {
          dP.startClaimingMarketsProceeds(
            claimableMarkets.map(m => m.marketId),
            sP.account,
            sP.modal.cb
          );
          dP.closeModal();
        },
      },
      {
        text: 'Close',
        action: () => {
          if (sP.modal.cb) {
            sP.modal.cb();
          }
          dP.closeModal();
        },
      },
    ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);
