import React from 'react';
import shouldComponentUpdatePure from '../../../utils/should-component-update-pure';

import SiteHeader from '../../site/components/site-header';
import Basics from '../../market/components/basics';
import TradePanel from '../../trade/components/trade-panel';
import ReportPanel from '../../reports/components/report-panel';
import MarketPositions from '../../market/components/market-positions';

module.exports = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        siteHeader: React.PropTypes.object,
		market: React.PropTypes.object,
		numPendingReports: React.PropTypes.number
    },

	shouldComponentUpdate: shouldComponentUpdatePure,

	render: function() {
		var p = this.props,
			nodes = [];

		// no market
		if (!p.market || !p.market.id) {
			nodes.push(
				<section key="no-market" className="basics">
					<span className="description">No market</span>
				</section>
			);
		}

		// market exists
		else {
			nodes.push(<Basics key="bascis" { ...p.market } />);

			// report form
			if (p.market.isRequiredToReportByAccount) {
				nodes.push(
					<ReportPanel
						key="report-panel"
						{ ...p.market }
						{ ...p.market.report }
						numPendingReports={ p.numPendingReports } />
				);
			}

			// trade panel
			else if (p.market.isOpen) {
				nodes.push(
			        <TradePanel
			        	key="trade-panel"
			            { ...p.market }
			            { ...p.market.tradeSummary } />
				);

				// positions
				if (p.market.positionsSummary && p.market.positionsSummary.numPositions && p.market.positionsSummary.numPositions.value) {
					nodes.push(
						<MarketPositions
							key="market-positions"
							className="market-positions"
							positionsSummary={ p.market.positionsSummary }
							outcomes={ p.market.positionOutcomes }
							/>
					);
				}
			}
		}

		return (
			<main className="page market">
				<SiteHeader { ...p.siteHeader } />
				<article className="page-content">
					{ nodes }
				</article>
			</main>
		);
	}
});