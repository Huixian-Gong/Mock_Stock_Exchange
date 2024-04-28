//
//  StockDetailViewModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/11/24.
//

import Foundation
import Combine

class StockDetailViewModel: ObservableObject {
    // Published properties to hold the fetched data
    @Published var profile: StockProfile?
    @Published var quote: StockQuote?
    @Published var news: [StockNews] = []
    @Published var peers: [String] = []
    @Published var recommendations: [StockRecommendation] = [] // This should be a single-dimensional array
    @Published var earning: [StockEarnings] = []
    @Published var insider: [StockInsider] = []
    @Published var isLoading = false
    @Published var insiderAggregates: InsiderAggregates?
    @Published var stockHourlyData: [[Double]] = []
    @Published var stockHistoricData: [StockChart.ChartData] = []
    @Published var stockFavDetail: StockInfo?
    @Published var walletBalance: Double = 0.0
//    @Published var stockHourlyLoading = false
    

    // Add other published properties for the remaining data types
    
    private let networkService: NetworkServiceProtocol
    private var fetchCount = 0
    
    init(networkService: NetworkServiceProtocol = NetworkService.shared) {
        self.networkService = networkService
    }
    
    func fetchAllData(for ticker: String) {
            isLoading = true
            let fetchFunctions = [
                fetchProfile(for:),
                fetchQuote(for:),
                fetchNews(for:),
                fetchPeers(for:),
                fetchEarnings(for:),
                fetchInsider(for:),
                loadRecommendationData(for:),
                loadHistoryData(for:),
                loadFavStock(for:),
            ]
            fetchWalletBalance()
            fetchCount = fetchFunctions.count  // Set count to number of fetches
            fetchFunctions.forEach { fetch in
                fetch(ticker)
            }
        }

        private func dataFetched() {
            fetchCount -= 1
            if fetchCount == 0 {
                isLoading = false
            }
            print(fetchCount)
        }
    
    func fetchProfile(for ticker: String) {
        networkService.fetchProfile(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let profile):
                    self?.profile = profile
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }
    
    func fetchQuote(for ticker: String) {
        networkService.fetchQuote(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let quote):
                    self?.quote = quote
                    self?.dataFetched()
                    self?.loadHourlyData(for: ticker, endTime: quote.t)
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
        
    }
    
    func fetchNews(for ticker: String) {
        networkService.fetchNews(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let news):
                    let filteredNews = news.filter { !$0.headline.isEmpty && !$0.source.isEmpty && !$0.summary.isEmpty && !$0.image.isEmpty && !$0.url.isEmpty }.prefix(20)
//                    print(filteredNews)
                    self?.news = Array(filteredNews)
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }
    
    func fetchPeers(for ticker: String) {
        networkService.fetchPeers(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let peers):
                    self?.peers = peers
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }
    
    
//    func fetchRecommendations(for ticker: String) {
//        networkService.fetchRecommendations(for: ticker) { [weak self] result in
//            DispatchQueue.main.async {
//                switch result {
//                case .success(let recommendations):
//                    self?.recommendations = recommendations
//                    print(self?.recommendations)
//                    self?.dataFetched()
//                case .failure(let error):
//                    print(error)
//                    break
//                }
//            }
//        }
//    }
    
    func fetchEarnings(for ticker: String) {
        networkService.fetchEarnings(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let earning):
                    self?.earning = earning
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }
    
    func fetchInsider(for ticker: String) {
        networkService.fetchInsider(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let insiders):
                    let aggregates = self?.calculateAggregates(from: insiders) ?? InsiderAggregates(totalMspr: 0, positiveMspr: 0, negativeMspr: 0, totalChange: 0, positiveChange: 0, negativeChange: 0)
                    self?.insiderAggregates = aggregates
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }

    private func calculateAggregates(from insiders: [StockInsider]) -> InsiderAggregates {
        let totalMspr = insiders.reduce(0) { $0 + $1.mspr }
        let positiveMspr = insiders.filter { $0.mspr > 0 }.reduce(0) { $0 + $1.mspr }
        let negativeMspr = insiders.filter { $0.mspr < 0 }.reduce(0) { $0 + $1.mspr }
        let totalChange = insiders.reduce(0) { $0 + $1.change }
        let positiveChange = insiders.filter { $0.change > 0 }.reduce(0) { $0 + $1.change }
        let negativeChange = insiders.filter { $0.change < 0 }.reduce(0) { $0 + $1.change }

        return InsiderAggregates(
            totalMspr: totalMspr,
            positiveMspr: positiveMspr,
            negativeMspr: negativeMspr,
            totalChange: totalChange,
            positiveChange: positiveChange,
            negativeChange: negativeChange
        )
    }
    func loadRecommendationData(for ticker: String) {
            NetworkService.shared.fetchRecommendations(for: ticker) { [weak self] result in // Use [weak self] to capture self weakly if needed
                DispatchQueue.main.async { // Make sure you update the UI on the main thread
                    switch result {
                    case .success(let data):
//                        print(data)
                        self?.recommendations = data
                        self?.dataFetched()
                    case .failure(let error):
                        print("Error: \(error)")
                        self?.recommendations = [] // Optionally clear data or show an error state
                    }
                }
            }
        }
    func loadHistoryData(for ticker: String) {
        let endDate = Date()
        let calendar = Calendar.current
        guard let startDate = calendar.date(byAdding: .year, value: -2, to: endDate) else { return }
        
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let formattedEndTime = formatter.string(from: endDate)
        let formattedStartTime = formatter.string(from: startDate)

        NetworkService.shared.fetchChartData(for: ticker, startTime: formattedStartTime, endTime: formattedEndTime) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let stockChart):
                    // Extract only the 'results' key value pair
//                    print(stockChart.results)

                    self?.stockHistoricData = stockChart.results
                    self?.dataFetched()
                case .failure(let error):
                    print("Error loading historical data: \(error.localizedDescription)")
                    self?.stockHistoricData = [] // Clear data or handle the error as needed
                }
            }
        }
    }



    func loadHourlyData(for ticker: String, endTime: Int) {
//        self.stockHourlyLoading = true
//        var ee = endTime - 86400 * 3
        let formattedEndTime = self.formatUnixTimestamp(endTime)
//        print(formattedEndTime)
        let startTime = endTime - 86400
        let formattedStartTime = self.formatUnixTimestamp(startTime)
//        print(formattedStartTime)
        NetworkService.shared.fetchHourlyStockData(for: ticker, from: formattedStartTime, to: formattedEndTime) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let data):
                    
                    self?.stockHourlyData = data.compactMap { item in
                        if let timestamp = item.first as? Double, let value = item.last as? Double {
                            return [timestamp, value]
                        }
                        return nil
                    }
//                    self?.stockHourlyLoading = false
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                    self?.stockHourlyData = []  // Handle error by clearing data or showing default data
                }
            }
        }
    }
    
    // Utility function to convert Unix timestamp to "yyyy-MM-dd" format
    func formatUnixTimestamp(_ timestamp: Int) -> String {
        let date = Date(timeIntervalSince1970: TimeInterval(timestamp))
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)  // Adjust timezone if needed!
        return dateFormatter.string(from: date)
    }
    // Add other fetch functions for the remaining data types
    
    func loadFavStock (for ticker: String) {
        networkService.fetchFavStock(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let favDetail):
                    self?.stockFavDetail = favDetail
//                    print(self?.stockFavDetail)
                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    print(ticker, "not found")
                    break
                }
            }
        }
    }
    
    func fetchWalletBalance() {
            NetworkService.shared.fetchWalletBalance { [weak self] result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let balance):
                        self?.walletBalance = balance
                        
                    case .failure(let error):
                        print(error)
                        // Handle error or show some default value
                        self?.walletBalance = 0.0
                    }
                }
            }
        }
    func addFav (for ticker: String) {
        networkService.addFav(for: ticker){ [weak self] result in
            switch result {
            case .success(let message):
                print("Success: \(message)")
                // Handle success, update favorites
                self?.loadFavStock(for: ticker)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                // Handle error
            }
        }
    }
    
    func delFav (for ticker: String) {
        networkService.delFav(for: ticker){ [weak self] result in
            switch result {
            case .success(let message):
                print("Success: \(message)")
                // Handle success, update favorites
                self?.loadFavStock(for: ticker)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                // Handle error
            }
        }
    }
    func buyStock (for ticker: String, count: Int, price: Double) {
        networkService.buyStock(for: ticker, count: count, price: price){ [weak self] result in
            switch result {
            case .success(let message):
                print("Success: \(message)")
                // Handle success, update favorites
                self?.loadFavStock(for: ticker)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                // Handle error
            }
        }
    }
    
    func sellStock (for ticker: String, count: Int, price: Double, sellAll: Int) {
        networkService.sellStock(for: ticker, count: count, price: price, sellAll: sellAll){ [weak self] result in
            switch result {
            case .success(let message):
                print("Success: \(message)")
                // Handle success, update favorites
                self?.loadFavStock(for: ticker)
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
                // Handle error
            }
        }
    }
}

