//
//  Backend.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/9/24.
//

import Foundation
import Alamofire


protocol NetworkServiceProtocol {
    func fetchFavoriteStocks(completion: @escaping (Result<[WatchlistStock], Error>) -> Void)
    func fetchPortfolioStocks(completion: @escaping (Result<[PortfolioStock], Error>) -> Void)
    func fetchWalletBalance(completion: @escaping (Result<Double, Error>) -> Void)
    func fetchCompanyDetails(for ticker: String, completion: @escaping (Result<CompanyDetailsResponse, Error>) -> Void)
    func fetchProfile(for ticker: String, completion: @escaping (Result<StockProfile, Error>) -> Void)
    func fetchQuote(for ticker: String, completion: @escaping (Result<StockQuote, Error>) -> Void)
    func fetchNews(for ticker: String, completion: @escaping (Result<[StockNews], Error>) -> Void)
    func fetchPeers(for ticker: String, completion: @escaping (Result<[String], Error>) -> Void)
    func fetchRecommendations(for ticker: String, completion: @escaping (Result<[StockRecommendation], Error>) -> Void)
    func fetchEarnings(for ticker: String, completion: @escaping (Result<[StockEarnings], Error>) -> Void)
    func fetchInsider(for ticker: String, completion: @escaping (Result<[StockInsider], Error>) -> Void)
    func fetchFavStock(for ticker: String, completion: @escaping (Result<StockInfo, Error>) -> Void)
    func addFav(for ticker: String, completion: @escaping (Result<String, AFError>) -> Void)
    func delFav(for ticker: String, completion: @escaping (Result<String, AFError>) -> Void)
    func buyStock(for ticker: String, count: Int, price: Double, completion: @escaping (Result<String, AFError>) -> Void)
    func sellStock(for ticker: String, count:Int, price: Double, sellAll: Int, completion: @escaping (Result<String, AFError>) -> Void)
   }

class NetworkService: NetworkServiceProtocol {
    static let shared = NetworkService()
    private let baseURL = "https://hw3backend-dot-csci-571-huixian.wl.r.appspot.com"
    
    private init() {}
    
    func fetchFavoriteStocks(completion: @escaping (Result<[WatchlistStock], Error>) -> Void) {
        let url = "\(baseURL)/fav_list"
        AF.request(url).validate().responseDecodable(of: [WatchlistStock].self) { response in
            switch response.result {
            case .success(let stocks):
                // On success, pass the stocks array within a .success Result to the completion handler
                completion(.success(stocks))
            case .failure(let error):
                completion(.failure(error as Error))
            }
        }
    }
    
    func fetchPortfolioStocks(completion: @escaping (Result<[PortfolioStock], Error>) -> Void) {
        let url = "\(baseURL)/portfolio"
        AF.request(url).validate().responseDecodable(of: [PortfolioStock].self) { response in
            switch response.result {
            case .success(let stocks):
                // On success, pass the stocks array within a .success Result to the completion handler
                completion(.success(stocks))
            case .failure(let error):
                completion(.failure(error as Error))
            }
        }
    }
    
    func fetchWalletBalance(completion: @escaping (Result<Double, Error>) -> Void) {
        let url = "\(baseURL)/balance"
        AF.request(url).validate().responseDecodable(of: Double.self) { response in
            switch response.result {
            case .success(let balance):
                // On success, pass the balance Double within a .success Result to the completion handler
                completion(.success(balance))
            case .failure(let error):
                completion(.failure(error as Error))
            }
        }
    }
    

    
    func fetchCompanyDetails(for ticker: String, completion: @escaping (Result<CompanyDetailsResponse, Error>) -> Void) {
        let url = "\(baseURL)/search/\(ticker)"
        AF.request(url).validate().responseDecodable(of: CompanyDetailsResponse.self) { response in
            switch response.result {
            case .success(let companyDetails):
                completion(.success(companyDetails))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchSearchResults(for ticker: String, completion: @escaping (Result<[StockSearchResult], Error>) -> Void) {
        let url = "\(baseURL)/ticker/\(ticker)"
        AF.request(url).validate().responseDecodable(of: [StockSearchResult].self) { response in
            switch response.result {
            case .success(let results):
                completion(.success(results))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchProfile(for ticker: String, completion: @escaping (Result<StockProfile, Error>) -> Void) {
        let url = "\(baseURL)/search/\(ticker)"
        AF.request(url).validate().responseDecodable(of: StockProfile.self) { response in
//            print(response.result)
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchQuote(for ticker: String, completion: @escaping (Result<StockQuote, Error>) -> Void) {
        let url = "\(baseURL)/quote/\(ticker)"
        AF.request(url).validate().responseDecodable(of: StockQuote.self) { response in
//            print(response.result)
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }

    func fetchNews(for ticker: String, completion: @escaping (Result<[StockNews], Error>) -> Void) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        let currDate = dateFormatter.string(from: Date())
        let prevDate = dateFormatter.string(from: Calendar.current.date(byAdding: .day, value: -14, to: Date())!)
        
        let url = "\(baseURL)/news/\(ticker)/\(prevDate)/\(currDate)"
        AF.request(url).validate().responseDecodable(of: [StockNews].self) { response in
//            print(response.result)
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchPeers(for ticker: String, completion: @escaping (Result<[String], Error>) -> Void) {
        let url = "\(baseURL)/peers/\(ticker)"
        AF.request(url).validate().responseDecodable(of: [String].self) { response in
//            print(response.result)
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchRecommendations(for ticker: String, completion: @escaping (Result<[StockRecommendation], Error>) -> Void) {
            let url = "\(baseURL)/recommendation/\(ticker)"
            AF.request(url).validate().responseDecodable(of: [StockRecommendation].self) { response in
                switch response.result {
                case .success(let recommendations):
                    completion(.success(recommendations))
                case .failure(let error):
                    completion(.failure(error))
                }
            }
        }
    
    func fetchEarnings(for ticker: String, completion: @escaping (Result<[StockEarnings], Error>) -> Void) {
        let url = "\(baseURL)/earning/\(ticker)"
        AF.request(url).validate().responseDecodable(of: [StockEarnings].self) { response in
//            print(response.result)
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    
    func fetchInsider(for ticker: String, completion: @escaping (Result<[StockInsider], Error>) -> Void) {
        let url = "\(baseURL)/insider/\(ticker)"
        AF.request(url).validate().responseDecodable(of: [StockInsider].self) { response in
            switch response.result {
            case .success(let tickers):
                completion(.success(tickers))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchHourlyStockData(for ticker: String, from startTime: String, to endTime: String, completion: @escaping (Result<[[Any]], Error>) -> Void) {
        let url = "\(baseURL)/stock/hourly/\(ticker)/\(startTime)/\(endTime)"
        AF.request(url).validate().responseDecodable(of: HourlyResponse.self) { response in
            switch response.result {
            case .success(let data):
                let chartData = self.prepareDataForHighcharts(hourlyData: data.results)
//                print(chartData)
                completion(.success(chartData))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }

    private func prepareDataForHighcharts(hourlyData: [StockHourly]) -> [[Any]] {
        return hourlyData.map { [Double($0.t), $0.c] }
    }

    func fetchChartData(for ticker: String, startTime: String, endTime: String, completion: @escaping (Result<StockChart, Error>) -> Void) {
        let urlString = "\(baseURL)/chart/\(ticker)/\(startTime)/\(endTime)"
        AF.request(urlString).validate().responseDecodable(of: StockChart.self) { response in
            switch response.result {
            case .success(let chartData):
                completion(.success(chartData))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func fetchFavStock(for ticker: String, completion: @escaping (Result<StockInfo, Error>) -> Void) {
        let url = "\(baseURL)/favorites/check/\(ticker)"
        AF.request(url).validate().response { response in
            // Check if the data is empty and handle accordingly
            guard let data = response.data, !data.isEmpty else {
                print("Received empty response for ticker: \(ticker), providing default values.")
                completion(.success(StockInfo.defaultInstance(ticker: ticker)))
                return
            }
            
            do {
                let stockInfo = try JSONDecoder().decode(StockInfo.self, from: data)
                print("Fetched data for ticker: \(stockInfo.ticker), Watchlist: \(stockInfo.watchlist), Count: \(stockInfo.count), Price: $\(stockInfo.price)")
                completion(.success(stockInfo))
            } catch {
                print("Failed to decode data for ticker: \(ticker) with error: \(error.localizedDescription)")
                completion(.failure(error))
            }
        }
    }
    
    func addFav(for ticker: String, completion: @escaping (Result<String, AFError>) -> Void) {
        let url = "\(baseURL)/favorites/add/\(ticker)"
        AF.request(url).responseString { response in
            switch response.result {
            case .success(let message):
                completion(.success(message))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }

    func delFav(for ticker: String, completion: @escaping (Result<String, AFError>) -> Void) {
        let url = "\(baseURL)/favorites/remove/\(ticker)"
        AF.request(url).responseString { response in
            switch response.result {
            case .success(let message):
                completion(.success(message))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func buyStock(for ticker: String, count: Int, price: Double, completion: @escaping (Result<String, AFError>) -> Void) {
        let url = "\(baseURL)/buy/\(ticker)/\(count)/\(price)"
        AF.request(url).responseString { response in
            switch response.result {
            case .success(let message):
                completion(.success(message))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }

    func sellStock(for ticker: String, count:Int, price: Double, sellAll: Int, completion: @escaping (Result<String, AFError>) -> Void) {
        let url = "\(baseURL)/sell/\(ticker)/\(count)/\(price)/\(sellAll)"
        AF.request(url).responseString { response in
            switch response.result {
            case .success(let message):
                completion(.success(message))
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
}



