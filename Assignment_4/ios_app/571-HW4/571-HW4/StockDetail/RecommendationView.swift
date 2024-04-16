//
//  RecommendationView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/15/24.
//

import SwiftUI
import Highcharts


struct RecommendationView: UIViewRepresentable {
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

//#Preview {
//    RecommendationView()
//}
