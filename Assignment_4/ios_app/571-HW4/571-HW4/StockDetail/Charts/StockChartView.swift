//
//  StockChartView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/16/24.
//
import SwiftUI
import WebKit

struct StockChartView: View {
    var data: [StockChart.ChartData]
    var stockSymbol: String

    var body: some View {
        WebView(htmlName: "chart", chartData: prepareChartData(), volumeData: prepareVolumeData(), ticker: stockSymbol)
    }

    private func prepareChartData() -> [[Double]] {
            // Map the data to [[Double]]
            let ohlcData = data.map { [$0.t, $0.o, $0.h, $0.l, $0.c] }
            return ohlcData
        }

    private func prepareVolumeData() -> [[Double]] {
            // Map the data to [[Double]]
            let volumeData = data.map { [$0.t, $0.v] }
            return volumeData
        }

//    private func jsonString(from array: [[Any]]) -> String {
//        guard let data = try? JSONSerialization.data(withJSONObject: array, options: []),
//              let jsonString = String(data: data, encoding: .utf8) else {
//            return "[]"
//        }
//        return jsonString
//    }
}


#Preview {
    StockChartView(data: [_71_HW4.StockChart.ChartData(v: 4018551, vw: 275.9863, o: 278.36, c: 274.0, h: 279.085, l: 273.56, t: 1712203200000, n: 81423), _71_HW4.StockChart.ChartData(v: 4392050, vw: 276.8549, o: 276.1, c: 277.14, h: 277.957, l: 275.03, t: 1712289600000, n: 79353), _71_HW4.StockChart.ChartData(v: 5542428, vw: 277.5011, o: 276.25, c: 277.76, h: 277.98, l: 275.15, t: 1712548800000, n: 72587), _71_HW4.StockChart.ChartData(v: 7314306, vw: 276.1938, o: 277.63, c: 276.72, h: 278.0, l: 273.32, t: 1712635200000, n: 82364), _71_HW4.StockChart.ChartData(v: 5261012, vw: 274.758, o: 275.42, c: 274.48, h: 276.82, l: 274.12, t: 1712721600000, n: 72064), _71_HW4.StockChart.ChartData(v: 8102293, vw: 275.3413, o: 274.0, c: 275.68, h: 276.48, l: 272.18, t: 1712808000000, n: 86750), _71_HW4.StockChart.ChartData(v: 9038411, vw: 275.8311, o: 275.55, c: 275.96, h: 277.0, l: 274.055, t: 1712894400000, n: 98270), _71_HW4.StockChart.ChartData(v: 6782674, vw: 272.3827, o: 277.89, c: 271.28, h: 277.91, l: 270.34, t: 1713153600000, n: 95413)], stockSymbol: "V")
}
