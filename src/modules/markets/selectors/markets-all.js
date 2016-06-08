import memoizerific from 'memoizerific';
import { isMarketDataOpen } from '../../../utils/is-market-data-open';
// import { makeDateFromBlock } from '../../../utils/format-number';

import store from '../../../store';

import { assembleMarket } from '../../market/selectors/market';

export default function () {
	const { marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory } = store.getState();
	return selectMarkets(marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory, store.dispatch);
}

export const selectMarkets = memoizerific(1)((marketsData, favorites, reports, outcomes, accountTrades, tradesInProgress, blockchain, selectedSort, priceHistory, dispatch) => {
	if (!marketsData) {
		return [];
	}

	return Object.keys(marketsData).map(marketID => {
		if (!marketID || !marketsData[marketID]) {
			return {};
		}

		const endDate = new Date((marketsData[marketID].endDate * 1000) || 0);

		return assembleMarket(
			marketID,
			marketsData[marketID],
			priceHistory[marketID],
			isMarketDataOpen(marketsData[marketID], blockchain && blockchain.currentBlockNumber),

			!!favorites[marketID],
			outcomes[marketID],

			reports[marketsData[marketID].eventID],
			accountTrades[marketID],
			tradesInProgress[marketID],

			// the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, and never hitting the memoization cache
			endDate.getFullYear(),
			endDate.getMonth(),
			endDate.getDate(),
			blockchain && blockchain.isReportConfirmationPhase,
			dispatch);

	}).sort((a, b) => {
		const aVal = cleanSortVal(a[selectedSort.prop]);
		const bVal = cleanSortVal(b[selectedSort.prop]);

		if (bVal < aVal) {
			return selectedSort.isDesc ? -1 : 1;
		} else if (bVal > aVal) {
			return selectedSort.isDesc ? 1 : -1;
		}
		return a.id < b.id ? -1 : 1;
	});
});

function cleanSortVal(val) {
	// if a falsy simple value return it to sort as is
	if (!val) {
		return val;
	}

	// if this is a formatted number object, with a `value` prop, use that for sorting
	if (val.value || val.value === 0) {
		return val.value;
	} else if (val.toLowerCase) {
	// if the val is a simple prop, that can be lowercased, use that
		return val.toLowerCase();
	}
}
