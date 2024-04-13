//
//  SearchResultView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/10/24.
//
import SwiftUI

class DebounceTimer {
    var workItem: DispatchWorkItem?
    
    
    func debounce(interval: TimeInterval, action: @escaping () -> Void) {
        // Cancel the previous work item if it exists
        workItem?.cancel()
        
        // Create a new work item
        let task = DispatchWorkItem(block: action)
        
        // Assign the new work item to the workItem property
        self.workItem = task
        
        // Execute the work item after the given interval
        DispatchQueue.main.asyncAfter(deadline: .now() + interval, execute: task)
    }
}

struct SearchResultsView: View {
    @Binding var searchTicker: String
    @StateObject private var viewModel = SearchViewModel()
    @State private var isShowingDetailView = false  // State to control button visibility
    
    var body: some View {
        List {
            if viewModel.isLoading {

            } else {
                ForEach(viewModel.searchResults, id: \.symbol) { result in
                    NavigationLink(destination: StockDetailView(stockSymbol: result.symbol, isShowingDetailView: $isShowingDetailView)) {
                        VStack(alignment: .leading) {
                            Text(result.displaySymbol).bold()
                            Text(result.description).foregroundColor(.gray)
                        }
                    }
                }
            }
        }
        .onChange(of: searchTicker) { newValue in
            viewModel.performSearch(ticker: newValue)
        }
        .onAppear {
            isShowingDetailView = false
        }
    }
}



// Dummy model for the stock symbola
struct StockSearchResult: Decodable {
    let description: String
    let displaySymbol: String
    let symbol: String
    let type: String?
}

