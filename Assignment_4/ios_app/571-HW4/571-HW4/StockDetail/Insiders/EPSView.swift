//
//  EPSView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/15/24.
//

import SwiftUI
import Highcharts

struct EPSView: UIViewRepresentable {
    var earningsData: [StockEarnings]

        func makeUIView(context: Context) -> HIChartView {
            let chartView = HIChartView(frame: CGRect.zero)
            setupChart(chartView: chartView)
            return chartView
        }

        func updateUIView(_ uiView: HIChartView, context: Context) {
            // Update the chart with new data if necessary
        }

        private func setupChart(chartView: HIChartView) {
            let options = HIOptions()

            options.title = HITitle()
            options.title.text = "Historical EPS Surprises"

            let xAxis = HIXAxis()
            xAxis.categories = earningsData.map { "\($0.period) <br> Surprise: \($0.surprise)" }
            options.xAxis = [xAxis]

            let yAxis = HIYAxis()
            yAxis.title = HITitle()
            yAxis.title.text = "Quarterly EPS"
            options.yAxis = [yAxis]
            
            let tooltip = HITooltip()
                tooltip.shared = true
                options.tooltip = tooltip


            let actualSeries = HISpline()
            actualSeries.data = earningsData.map { $0.actual }
            actualSeries.name = "Actual"

            let estimateSeries = HISpline()
            estimateSeries.data = earningsData.map { $0.estimate }
            estimateSeries.name = "Estimate"


            options.series = [actualSeries, estimateSeries]

            chartView.options = options
        }
}


#Preview {
    EPSView(earningsData: [_71_HW4.StockEarnings(actual: 2.41, estimate: 2.3834, quarter: 1, surprise: 0.0266, surprisePercent: 1.1161, period: "2023-12-31"), _71_HW4.StockEarnings(actual: 2.33, estimate: 2.2879, quarter: 4, surprise: 0.0421, surprisePercent: 1.8401, period: "2023-09-30"), _71_HW4.StockEarnings(actual: 2.16, estimate: 2.1581, quarter: 3, surprise: 0.0019, surprisePercent: 0.088, period: "2023-06-30"), _71_HW4.StockEarnings(actual: 2.09, estimate: 2.0263, quarter: 2, surprise: 0.0637, surprisePercent: 3.1437, period: "2023-03-31")])
}
