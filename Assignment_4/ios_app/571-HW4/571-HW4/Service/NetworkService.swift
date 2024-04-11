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
        // The response should be decoded as Double, not as [PortfolioStock]
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
    
}



