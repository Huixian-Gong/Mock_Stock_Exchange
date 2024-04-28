//
//  PortfolioViewModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/8/24.
//

import Foundation
import Alamofire


private let baseURL = "https://hw3backend-dot-csci-571-huixian.wl.r.appspot.com"

class PortfolioViewModel: ObservableObject {
    @Published var stocks: [PortfolioStock] = []
    @Published var isLoading = true
    @Published var walletBalance: Double = 0.0
    
    
    private var networkService: NetworkServiceProtocol
    
    var netWorth: Double {
        let totalStocksValue = stocks.reduce(0) { $0 + (($1.price) * Double($1.count)) }
            return walletBalance + totalStocksValue
        }
    
    // Dependency injection for easier testing
    init(networkService: NetworkServiceProtocol = NetworkService.shared) {
        self.networkService = networkService
    }
    
    func fetchStocks() {
//        isLoading = true // Start loading
        networkService.fetchPortfolioStocks { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let fetchedStocks):
                    self?.stocks = fetchedStocks
                    self?.fetchPrices(for: fetchedStocks) // fetchPrices will handle setting isLoading to false
                case .failure(let error):
                    print(error)
                    self?.isLoading = false // Stop loading on failure
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
    
    private func fetchPrices(for fetchedStocks: [PortfolioStock]) {
        let fetchGroup = DispatchGroup() // Create a dispatch group

        for stock in fetchedStocks {
            fetchGroup.enter() // Enter the group for each stock
            
            fetchPrice(for: stock.ticker) { [weak self] response in
                DispatchQueue.main.async {
                    defer { fetchGroup.leave() } // Ensure we leave the group even if we return early
                    
                    guard let self = self,
                          let index = self.stocks.firstIndex(where: { $0.ticker == stock.ticker }),
                          let currentPricePerShare = response?.c else {
                        return
                    }
                    
                    let currentTotalValue = currentPricePerShare * Double(self.stocks[index].count)
                    let storedTotalValue = self.stocks[index].price // Direct use without unwrapping
                    let difference = currentTotalValue - storedTotalValue
                    self.stocks[index].difference = difference
                    self.stocks[index].price = currentPricePerShare
                    let price = self.stocks[index].price ?? 1 // Assuming price cannot be zero to avoid division by zero
                    let differencePercentage = (difference / price) * 100
                    self.stocks[index].differencePercentage = differencePercentage
                }
            }
        }
        
        // Once all fetchPrice calls have completed, update isLoading
        fetchGroup.notify(queue: .main) { [weak self] in
            self?.isLoading = false
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
    
    func moveStocks(from source: IndexSet, to destination: Int) {
            stocks.move(fromOffsets: source, toOffset: destination)
            // Implement any additional logic needed to persist the changes
        }
}

