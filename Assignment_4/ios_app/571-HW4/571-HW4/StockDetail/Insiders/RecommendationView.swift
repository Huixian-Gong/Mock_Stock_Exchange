//
//  RecommendationView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/15/24.
//
import SwiftUI
import Highcharts

struct RecommendationsChartView: UIViewRepresentable {
    var recommendations: [StockRecommendation]
    
    func makeUIView(context: Context) -> HIChartView {
        let chartView = HIChartView(frame: CGRect.zero)
        setupChart(chartView: chartView)
        return chartView
    }
    
    func updateUIView(_ uiView: HIChartView, context: Context) {}
    
    private func setupChart(chartView: HIChartView) {
        let options = HIOptions()
        options.chart = HIChart()
        options.chart.type = "column"
        
        options.title = HITitle()
        options.title.text = "Recommendation Trends"
        
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd" // the current format
        let newDateFormatter = DateFormatter()
        newDateFormatter.dateFormat = "yyyy-MM" // the desired format
        
        // Map and convert the periods
        let formattedPeriods = recommendations.compactMap { recommendation -> String? in
            guard let date = dateFormatter.date(from: recommendation.period) else { return nil }
            return newDateFormatter.string(from: date)
        }
        
        // Assign the formatted periods to the xAxis categories
        options.xAxis = [HIXAxis()]
        options.xAxis[0].categories = formattedPeriods
        
        options.yAxis = [HIYAxis()]
        options.yAxis[0].min = 0
        options.yAxis[0].title = HITitle()
        options.yAxis[0].title.text = "# Analysis"
        
        options.legend = HILegend()
        options.legend.enabled = true
        
        options.tooltip = HITooltip()
                options.tooltip.shared = false
                options.tooltip.useHTML = true
        
                options.tooltip.headerFormat = "<b>{point.x}</b><br/>"
        options.tooltip.pointFormat = "<span style='color:{series.color}'>\u{25CF}</span> {series.name}: {point.y}<br/>"

        
        let dataLabels = HIDataLabels()
        dataLabels.enabled = true
        dataLabels.format = "{y:.0f}"
        dataLabels.color = "contrast" // Hex value for black
        dataLabels.style = HICSSObject()
        dataLabels.style.textOutline = "1.5px contrast"
        
        // Setup plot options for stacking
        options.plotOptions = HIPlotOptions()
        options.plotOptions.column = HIColumn()
        options.plotOptions.column.stacking = "normal"
        options.plotOptions.column.dataLabels = [dataLabels]
        
        
        
        
        let seriesColors = ["356D3D", "57B660", "B28D37", "E26561", "773634"]
        let seriesNames = ["Strong Buy", "Buy", "Hold", "Sell", "Strong Sell"]
        let dataArrays = [recommendations.map { $0.strongBuy },
                          recommendations.map { $0.buy },
                          recommendations.map { $0.hold },
                          recommendations.map { $0.sell },
                          recommendations.map { $0.strongSell }]
        
        options.series = zip(seriesNames, dataArrays).enumerated().map { index, tuple in
            let (name, data) = tuple
            let series = HISeries()
            series.name = name
            series.data = data
            series.color = HIColor(hexValue: seriesColors[index])
            return series
        }
        
        chartView.options = options
    }
}

#Preview {
    RecommendationsChartView(recommendations: [_71_HW4.StockRecommendation(buy: 36, hold: 5, period: "2024-04-01", sell: 0, strongBuy: 22, strongSell: 0), _71_HW4.StockRecommendation(buy: 35, hold: 5, period: "2024-03-01", sell: 0, strongBuy: 21, strongSell: 0), _71_HW4.StockRecommendation(buy: 33, hold: 5, period: "2024-02-01", sell: 0, strongBuy: 20, strongSell: 0), _71_HW4.StockRecommendation(buy: 36, hold: 4, period: "2024-01-01", sell: 0, strongBuy: 20, strongSell: 0)])
}
