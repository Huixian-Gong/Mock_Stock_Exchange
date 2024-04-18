//
//  HighchartsView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/15/24.
//
import SwiftUI
import Highcharts

struct StockHourlyPriceChartView: UIViewRepresentable {
    var data: [[Double]]  // Array holding timestamp and value pairs
    var ticker: String    // Ticker symbol for the stock
    var diff: Double

    func makeUIView(context: Context) -> HIChartView {
        let chartView = HIChartView(frame: CGRect.zero) // Initialize with zero frame; it will expand to available space
        setupChart(chartView: chartView, data: data, ticker: ticker, diff:diff)
        return chartView
    }

    func updateUIView(_ uiView: HIChartView, context: Context) {
        // This function can dynamically update the chart if necessary
    }
    
    private func setupChart(chartView: HIChartView, data: [[Double]], ticker: String, diff: Double) {
        let options = HIOptions()

        let title = HITitle()
        title.text = "\(ticker) Hourly Price Variation"
        options.title = title

        let xAxis = HIXAxis()
                xAxis.type = "datetime"
                xAxis.crosshair = HICrosshair() // Enable crosshair for x-axis
                xAxis.crosshair.width = 1
                xAxis.crosshair.color = HIColor(name: "gray")
                options.xAxis = [xAxis]

        let yAxis = HIYAxis()
        yAxis.labels = HILabels()
        yAxis.labels.align = "right"
        yAxis.opposite = true
        yAxis.labels.x = -3 // Shift labels to the left by 10 pixels
        yAxis.title = HITitle()
        yAxis.title.text = ""
        options.yAxis = [yAxis]

        let plotOptions = HIPlotOptions()
        plotOptions.series = HISeries()
        plotOptions.series.marker = HIMarker()
        plotOptions.series.marker.enabled = false // Disable the data point markers (dots)
        options.plotOptions = plotOptions

        let series = HISeries()
        series.name = ticker
        series.data = data
        series.type = "line"
        if (diff > 0) {
            series.color = HIColor(name: "green")
        } else  if (diff < 0){
            series.color = HIColor(name: "red")
        } else  {
            series.color = HIColor(name: "gray")
        }
        
        options.series = [series]
        
        let scrollablePlotArea = HIScrollablePlotArea()
            scrollablePlotArea.minWidth = 380  // Set minimum width to enable horizontal scrolling
            scrollablePlotArea.scrollPositionX = 1  // Start scrolling from the latest data point
            options.chart = HIChart()
            options.chart.scrollablePlotArea = scrollablePlotArea

        let legend = HILegend()
        legend.enabled = false
        options.legend = legend
        

        let tooltip = HITooltip()
        tooltip.split = true
                tooltip.useHTML = true
                options.tooltip = tooltip


        chartView.options = options
    }
}


#Preview() {
    StockHourlyPriceChartView(data: [[1712822400000.0, 870.0], [1712826000000.0, 868.4], [1712829600000.0, 868.0], [1712833200000.0, 866.11], [1712836800000.0, 873.0005], [1712840400000.0, 880.52], [1712844000000.0, 886.235], [1712847600000.0, 890.6208], [1712851200000.0, 894.4], [1712854800000.0, 897.9262], [1712858400000.0, 899.3001], [1712862000000.0, 905.87], [1712865600000.0, 905.5], [1712869200000.0, 904.8], [1712872800000.0, 906.2], [1712876400000.0, 907.4], [1712908800000.0, 903.8], [1712912400000.0, 902.02], [1712916000000.0, 899.0], [1712919600000.0, 903.6], [1712923200000.0, 898.01], [1712926800000.0, 894.67], [1712930400000.0, 883.37], [1712934000000.0, 893.5], [1712937600000.0, 887.3446], [1712941200000.0, 885.3432], [1712944800000.0, 876.2], [1712948400000.0, 881.95], [1712952000000.0, 880.5], [1712955600000.0, 877.92], [1712959200000.0, 875.34], [1712962800000.0, 875.25]], ticker: "AAPL", diff: 0.3)
}


