//
//  StockDetailView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/11/24.
//

import SwiftUI



struct StockDetailView: View {
    var stockSymbol: String
    // Add a binding to control whether the add button is displayed
    @Binding var isShowingDetailView: Bool
    @StateObject private var viewModel = StockDetailViewModel()
    @State private var showToast = false
    @State private var toastMessage = ""
    @State private var toastOpacity = 0.0
    @State private var showingTradeSheet = false
    
    
    init(stockSymbol: String, isShowingDetailView: Binding<Bool>) {
        self.stockSymbol = stockSymbol
        self._isShowingDetailView = isShowingDetailView
    }
    
    
    
    var body: some View {
        ZStack {
            ScrollView {
                VStack(alignment: .leading){
                    Text(stockSymbol)
                        .bold()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 30))
                    Spacer()
                        .frame(height: 20)
                    Text(viewModel.profile?.name ?? "name")
                        .foregroundStyle(.gray)
                        .font(.system(size: 17))
                    Spacer()
                        .frame(height: 20)
                    HStack{
                        Text("$\(viewModel.quote?.c ?? 0, specifier: "%.2f")")
                            .font(.system(size: 35))
                        HStack {
                            let differenceColor = viewModel.quote?.d.map {
                                $0 == 0 ? Color.gray : ($0 < 0 ? Color.red : Color.green)
                            } ?? Color.gray // Default color if nil
                            
                            Image(systemName: viewModel.quote?.d.flatMap { $0 < 0 ? "arrow.down.right" : "arrow.up.right" } ?? "minus")
                                .foregroundColor(differenceColor)
                                .font(.system(size: 20))
                            
                            Text("$\(viewModel.quote?.d ?? 0, specifier: "%.2f")")
                                .foregroundColor(differenceColor)
                            
                            Text("(\(viewModel.quote?.dp ?? 0, specifier: "%.2f")%)")
                                .foregroundColor(differenceColor)
                        }
                    }
                    Spacer()
                        .frame(height: 20)
                    if !viewModel.stockHourlyData.isEmpty {
                        TabView {
                            StockHourlyPriceChartView(data: viewModel.stockHourlyData,
                                                      ticker: stockSymbol,
                                                      diff: viewModel.quote?.d ?? 0)
                            .tabItem {
                                Label("Hourly", systemImage: "chart.xyaxis.line")
                            }
                            .background(Color.white)
                            
                            StockChartView(data: viewModel.stockHistoricData, stockSymbol: stockSymbol)
                                .tabItem {
                                    Label("Historical", systemImage: "clock.fill")
                                }
                                .background(Color.white)
                        }
                        .frame(height: 350)
                    } else {
                        Text("")
                            .frame(height: 350)
                    }
                    
                    
                    Spacer()
                        .frame(height: 20)
                    VStack{
                        Text("Portfolio")
                            .font(.system(size: 23))
                            .frame(maxWidth: .infinity, alignment: .leading)
                        
                        //                        StockOwnedView(stockDetail: viewModel.stockFavDetail, currPrice: viewModel.quote?.c, balance: viewModel.walletBalance, name: viewModel.profile?.name)
                        if viewModel.stockFavDetail?.count ?? 0 > 0 {
                            HStack {
                                VStack (alignment: .leading, spacing: 10) {
                                    HStack {
                                        Text("Shares Owned: ")
                                        Text("\(viewModel.stockFavDetail?.count ?? 0)")
                                    }
                                    HStack {
                                        Text("Avg. Cost / Share: ")
                                        Text("$\(averageCostPerShare, specifier: "%.2f")")
                                    }
                                    HStack {
                                        Text("Total Cost: ")
                                        Text("$\(viewModel.stockFavDetail?.price ?? 0.00, specifier: "%.2f")")
                                    }
                                    
                                    HStack {
                                        Text("Change: ")
                                        Text("$\( costDiff, specifier: "%.2f")")
                                            .foregroundColor(differenceColor)
                                    }
                                    HStack {
                                        Text("Market Value: ")
                                        Text("$\(Double(viewModel.stockFavDetail?.count ?? 0) * (viewModel.quote?.c ?? 0.00), specifier: "%.2f")")
                                            .foregroundColor(differenceColor)
                                    }
                                }
                                .bold()
                                .font(.system(size: 15))
                                Spacer()
                                Button(action: {
                                    self.showingTradeSheet = true
                                }) {
                                    Text("Trade")
                                        .fontWeight(.bold)  // Optional: making the text bold
                                        .foregroundColor(.white)  // Set the text color to white
                                        .padding()
                                        .frame(width:140, height: 60)
                                }
                                .sheet(isPresented: $showingTradeSheet, onDismiss: {
                                    // Call the function directly in the closure here
                                    performActionAfterSheetDismissal()
                                }) {
                                    // The view that you want to show as a sheet goes here
                                    TradeSheetView(stockDetail: viewModel.stockFavDetail, stockPrice: viewModel.quote?.c ?? 0, availableFunds: viewModel.walletBalance, name: viewModel.profile?.name ?? "<Company Name>")
                                }
                                .background(Color.green)  // Set the background color to green
                                .clipShape(Capsule())  // Clip the background to a capsule shape
                            }
                        } else {
                            HStack {
                                VStack (alignment: .leading, spacing: 10){
                                    Text("You have 0 shares of \(viewModel.stockFavDetail?.ticker ?? "Ticker"). ")
                                    Text("Start trading!")
                                }
                                .font(.system(size: 15))
                                Spacer()
                                Button(action: {
                                    self.showingTradeSheet = true
                                }) {
                                    Text("Trade")
                                        .fontWeight(.bold)  // Optional: making the text bold
                                        .foregroundColor(.white)  // Set the text color to white
                                        .padding()
                                        .frame(width:140, height:50)
                                }
                                .background(Color.green)  // Set the background color to green
                                .clipShape(Capsule())  // Clip the background to a capsule shape
                                .sheet(isPresented: $showingTradeSheet, onDismiss: {
                                    // Call the function directly in the closure here
                                    performActionAfterSheetDismissal()
                                }) {
                                    // The view that you want to show as a sheet goes here
                                    TradeSheetView(stockDetail: viewModel.stockFavDetail, stockPrice: viewModel.quote?.c ?? 0, availableFunds: viewModel.walletBalance, name: viewModel.profile?.name ?? "<Company Name>")
                                }
                            }
                        }
                    }
                        Spacer()
                            .frame(height: 20)
                        VStack{
                            Text("Stats")
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .font(.system(size: 23))
                            Spacer()
                            HStack{
                                VStack{
                                    Text("High Price:")
                                    Spacer()
                                    Text("Low Price:")
                                }
                                .bold()
                                Spacer()
                                VStack{
                                    Text("$\(viewModel.quote?.h ?? 0, specifier: "%.2f")")
                                    Spacer()
                                    Text("$\(viewModel.quote?.l ?? 0, specifier: "%.2f")")
                                }
                                Spacer()
                                VStack{
                                    Text("Open Price:")
                                    Spacer()
                                    Text("Prev. Close:")
                                }
                                .bold()
                                Spacer()
                                VStack{
                                    Text("$\(viewModel.quote?.o ?? 0, specifier: "%.2f")")
                                    Spacer()
                                    Text("$\(viewModel.quote?.pc ?? 0, specifier: "%.2f")")
                                }
                            }
                        }
                        .font(.system(size: 15))
                        Spacer()
                            .frame(height: 20)
                        VStack(alignment: .leading){
                            
                            
                            Text("About")
                                .font(.system(size: 23))
                            Spacer()
                            
                            VStack{
                                HStack {
                                    Text("IPO Start Date:")
                                        .frame(maxWidth: .infinity*0.4, alignment: .leading)
                                        .font(.system(size: 15))
                                        .bold()
                                    Spacer()
                                    Text(viewModel.profile?.ipo ?? "<ipo date>")
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .font(.system(size: 15))
                                }
                                Spacer()
                                HStack{
                                    Text("Industry:")
                                        .frame(maxWidth: .infinity*0.4, alignment: .leading)
                                        .font(.system(size: 15))
                                        .bold()
                                    Spacer()
                                    Text(viewModel.profile?.finnhubIndustry ?? "<finnhubIndustry>")
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .font(.system(size: 15))
                                }
                                Spacer()
                                HStack{
                                    Text("Webpage:")
                                        .frame(maxWidth: .infinity*0.4, alignment: .leading)
                                        .font(.system(size: 15))
                                        .bold()
                                    Spacer()
                                    Link(viewModel.profile?.weburl ?? "finnhub.io", destination: URL(string: viewModel.profile?.weburl ?? "finnhub.io")!)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .font(.system(size: 15))
                                }
                                Spacer()
                                HStack {
                                    Text("Company Peers:")
                                        .frame(maxWidth: .infinity*0.4, alignment: .leading)
                                        .font(.system(size: 15))
                                        .bold()
                                    Spacer()
                                    ScrollView(.horizontal, showsIndicators: false) {
                                        HStack {
                                            ForEach(viewModel.peers, id: \.self) { peer in
                                                NavigationLink(destination: StockDetailView(stockSymbol: peer, isShowingDetailView: .constant(true))) {
                                                    Text("\(peer),")
                                                        .foregroundColor(.blue)
                                                }
                                            }
                                        }
                                    }
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .font(.system(size: 15))
                                }
                            }
                            
                            
                        }
                        
                        Spacer()
                            .frame(height: 20)
                        VStack{
                            Text("Insights")
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .font(.system(size: 23))
                            Spacer()
                            Text("Insight Sentiments")
                                .font(.system(size: 23))
                            Spacer()
                                .frame(height: 25)
                            
                            HStack{
                                VStack (alignment:.leading){
                                    Text(viewModel.profile?.name ?? "<Name>")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text("Total")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text("Positive")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text("Negative")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                }
                                Spacer()
                                VStack(alignment:.leading) {
                                    Text("MSPR")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.totalMspr ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.positiveMspr ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.negativeMspr ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                }
                                
                                Spacer()
                                VStack(alignment:.leading) {
                                    Text("Change")
                                        .bold()
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.totalChange ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.positiveChange ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                    Text(String(format: "%.2f", viewModel.insiderAggregates?.negativeChange ?? 0))
                                    Rectangle()
                                        .frame(width:100, height: 0.5)
                                        .foregroundColor(.gray)
                                }
                                
                            }
                            
                        }
                        if !viewModel.recommendations.isEmpty {
                            RecommendationsChartView(recommendations: viewModel.recommendations)
                                .frame(height: 400)
                        } else {
                            Text("Loading...")
                        }
                        if !viewModel.earning.isEmpty {
                            EPSView(earningsData: viewModel.earning)
                                .frame(height: 400)
                        } else {
                            Text("Loading...")
                        }
                        
                        Spacer()
                            .frame(height: 20)
                        VStack{
                            Text("News")
                                .font(.system(size: 25))
                                .frame(maxWidth: .infinity, alignment: .leading)
                            StockNewsView(news: viewModel.news)
                            
                        }
                        
                    }
                    .padding()
                    
                    
                }
                .navigationBarTitle(stockSymbol, displayMode: .inline)
                .toolbar {
                    // Add the button conditionally
                    if isShowingDetailView {
                        if viewModel.stockFavDetail?.watchlist ==  true {
                            Button(action: {
                                
                                viewModel.delFav(for: stockSymbol)
                                toastMessage = "Removing \(stockSymbol) from favorites"
                                showToast = true
                                // Hide toast after 3 seconds
                                //                            DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                                //                                showToast = false
                                //                            }
                                
                                
                            }) {
                                Image(systemName: "plus.circle.fill")
                            }
                        } else  {
                            Button(action: {
                                
                                viewModel.addFav(for: stockSymbol)
                                toastMessage = "Adding \(stockSymbol) to favorites"
                                showToast = true
                                
                                
                            }) {
                                Image(systemName: "plus.circle")
                            }
                        }
                        
                    }
                }
                .overlay(loadingOverlay)
                // When the view appears, set isShowingDetailView to true
                .onAppear {
                    isShowingDetailView = true
                    viewModel.fetchAllData(for: stockSymbol)
                }
                // When the view disappears, set isShowingDetailView to false
                .onDisappear {
                    //            isShowingDetailView = false
                }
                if showToast {
                    VStack {
                        Spacer()
                        ToastView(message: toastMessage)
                            .opacity(toastOpacity)  // Use the opacity state for the fade animation
                            .onAppear {
                                withAnimation(.easeIn(duration: 0.2)) {
                                    toastOpacity = 1.0
                                }
                                // Schedule the fade out after 3 seconds
                                DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
                                    withAnimation(.easeOut(duration: 0.2)) {
                                        toastOpacity = 0.0
                                    }
                                }
                                DispatchQueue.main.asyncAfter(deadline: .now() + 3.2) {
                                    showToast = false
                                }
                            }
                    }
                    .padding()
                }
            }
            
        
    }
    
    @ViewBuilder
    private var loadingOverlay: some View {
        if viewModel.isLoading {
            Color.white.edgesIgnoringSafeArea(.all)
            VStack(spacing: 8) {
                ProgressView().scaleEffect(1.5).progressViewStyle(CircularProgressViewStyle(tint: .gray))
                Text("Fetching Data...").foregroundStyle(.gray)
            }
        }
    }
    private func performActionAfterSheetDismissal() {
        print("Sheet has been dismissed.")
        // Your code to execute after the sheet is dismissed...
        if let ticker = viewModel.stockFavDetail?.ticker {
            viewModel.loadFavStock(for: ticker)
            print("Loaded favorite stock for \(ticker)")
        }
    }
    
    private var averageCostPerShare: Double {
        if let price = viewModel.stockFavDetail?.price, let count = viewModel.stockFavDetail?.count, count > 0 {
            return price / Double(count)
        } else {
            return 0  // Return 0 if count is 0 or if either value is nil
        }
    }
    private var costDiff: Double {
        return (viewModel.quote?.c ?? 0) - averageCostPerShare
    }
    private var differenceColor: Color {
        if costDiff == 0 {
            return .gray
        } else {
            return costDiff < 0 ? .red : .green
        }
    }
}



#Preview {
    StockDetailView(stockSymbol: "NVDA", isShowingDetailView: .constant(true))
    
}
