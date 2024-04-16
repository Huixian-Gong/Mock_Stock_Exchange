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
    @Published var recommendations: [StockRecommendation] = []
    @Published var earning: [StockEarnings] = []
    @Published var insider: [StockInsider] = []
    @Published var isLoading = false
    @Published var insiderAggregates: InsiderAggregates?
    @Published var stockHourlyData: [[Double]] = []
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
                fetchRecommendations(for:),
                fetchEarnings(for:),
                fetchInsider(for:),
            ]

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
    
    
    func fetchRecommendations(for ticker: String) {
        networkService.fetchRecommendations(for: ticker) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let recommendations):
                    self?.recommendations = recommendations
//                    print(self?.recommendations)

                    self?.dataFetched()
                case .failure(let error):
                    print(error)
                    break
                }
            }
        }
    }
    
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

    func loadHourlyData(for ticker: String, endTime: Int) {
//        self.stockHourlyLoading = true
        var ee = endTime - 86400 * 3
        let formattedEndTime = self.formatUnixTimestamp(ee)
        
        let startTime = ee - 86400
        let formattedStartTime = self.formatUnixTimestamp(ee)

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
}
