//
//  WatchlistViewModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/9/24.
//
import Foundation
import Alamofire
import Dispatch

struct StockPriceResponse: Decodable {
    var c: Double
    var d: Double
    var dp: Double
    var h: Double
    var l: Double
    var o: Double
    var pc: Double
    var t: Int
      }

struct CompanyDetailsResponse: Decodable {
    var name: String
    var logo: String
    var weburl: String
    var exchange: String
    var finnhubIndustry: String
    var ipo: String
    var ticker: String
}



private let baseURL = "https://hw3backend-dot-csci-571-huixian.wl.r.appspot.com"

class WatchlistViewModel: ObservableObject {
    @Published var stocks: [WatchlistStock] = []
    @Published var isLoading = false
    
    private var networkService: NetworkServiceProtocol

    var watchlistStocks: [WatchlistStock] {
        stocks.filter { $0.watchlist }
    }

    init(networkService: NetworkServiceProtocol = NetworkService.shared) {
        self.networkService = networkService
    }
    
    func fetchStocks() {
        isLoading = true
        networkService.fetchFavoriteStocks { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let fetchedStocks):
                    self?.stocks = fetchedStocks
                    self?.fetchPrices(for: fetchedStocks) {
                        self?.fetchCompanyDetails() {
                            self?.isLoading = false // Only set isLoading to false here
                        }
                    }
                case .failure(let error):
                    print(error)
                    self?.isLoading = false // Ensure isLoading is set to false if fetching fails
                }
            }
        }
    }

    private func fetchPrices(for fetchedStocks: [WatchlistStock], completion: @escaping () -> Void) {
        let group = DispatchGroup()
        
        for stock in fetchedStocks {
            group.enter() // Signal the dispatch group that a task has started
            
            fetchPrice(for: stock.ticker) { [weak self] response in
                DispatchQueue.main.async {
                    if let index = self?.stocks.firstIndex(where: { $0.ticker == stock.ticker }),
                       let priceResponse = response {
                        self?.stocks[index].price = priceResponse.c
                        self?.stocks[index].difference = priceResponse.d
                        self?.stocks[index].differencePercentage = priceResponse.dp
                    }
                    group.leave() // Signal the dispatch group that the task has completed
                }
            }
        }
        
        // Notify when all fetchPrice calls have completed
        group.notify(queue: .main) {
            completion()
        }
    }


    private func fetchPrice(for ticker: String, completion: @escaping (StockPriceResponse?) -> Void) {
        let url = "\(baseURL)/quote/\(ticker)"
        AF.request(url).validate().responseDecodable(of: StockPriceResponse.self) { response in
            switch response.result {
            case .success(let priceResponse):
                completion(priceResponse)
            case .failure:
                completion(nil) // Handle the error, perhaps logging it or setting a default value
            }
        }
    }
    
    func fetchCompanyDetails(completion: @escaping () -> Void) {
        let group = DispatchGroup()
        for i in 0..<stocks.count {
            group.enter()
            let ticker = stocks[i].ticker
            networkService.fetchCompanyDetails(for: ticker) { [weak self] result in
                DispatchQueue.main.async {
                    switch result {
                    case .success(let details):
                        self?.stocks[i].companyName = details.name
                    case .failure(let error):
                        print("Failed to fetch details for \(ticker): \(error)")
                    }
                    group.leave()
                }
            }
        }
        
        group.notify(queue: .main) {
            completion()
        }
    }
    
    func removeStock(at offsets: IndexSet) {
            // Iterate over the indices to be deleted
            offsets.forEach { index in
                let stockTicker = stocks[index].ticker
                // Construct the URL for deletion
                let url = "\(baseURL)/favorites/remove/\(stockTicker)"
                
                
                // Perform the network request
                // This is a placeholder, replace with your actual network request code
                AF.request(url).response { response in
                    switch response.result {
                    case .success:
                        print("Successfully removed \(stockTicker) from favorites")
                        // Remove the stock from the local array if the request was successful
                        DispatchQueue.main.async {
                            self.stocks.remove(atOffsets: offsets)
                        }
                    case .failure(let error):
                        print("Failed to remove \(stockTicker) from favorites: \(error)")
                    }
                }
            }
        }
    
    func moveStocks(from source: IndexSet, to destination: Int) {
            stocks.move(fromOffsets: source, toOffset: destination)
            // Implement any additional logic needed to persist the changes
        }
}
