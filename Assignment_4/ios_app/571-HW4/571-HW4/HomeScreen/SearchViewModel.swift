//
//  SearchViewModel.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/10/24.
//

import Foundation
import Combine

class SearchViewModel: ObservableObject {
    @Published var searchResults: [StockSearchResult] = []
    @Published var isLoading = false

    private var debounceTimer = DebounceTimer()

    func performSearch(ticker: String) {
        isLoading = true  // Indicate loading starts
        
        debounceTimer.debounce(interval: 0.5) { [weak self] in
            guard !ticker.isEmpty else {
                DispatchQueue.main.async {
                    self?.searchResults = []
                    self?.isLoading = false  // Reset when search is cleared
                }
                return
            }
            
            NetworkService.shared.fetchSearchResults(for: ticker) { result in
                DispatchQueue.main.async {
                    self?.isLoading = false  // Ensure loading ends regardless of result
                    switch result {
                    case .success(let results):
                        self?.searchResults = results
                    case .failure(let error):
                        print("Error: \(error.localizedDescription)")
                        // Consider handling error more visibly in UI
                        self?.searchResults = []
                    }
                }
            }
        }
    }
    
}
