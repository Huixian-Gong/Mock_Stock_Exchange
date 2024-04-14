//
//  WatchlistStockRowView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/10/24.
//

import SwiftUI


struct WatchlistStockRowView: View {
    @Environment(\.editMode) private var editMode
    
    var ticker: String
    var companyName: String
    var price: Double?
    var difference: Double?
    var differencePercentage: Double?
    @State private var isShowingDetailView = false

    
    var body: some View {
        
        NavigationLink(destination: StockDetailView(stockSymbol: ticker, isShowingDetailView: $isShowingDetailView), isActive: $isShowingDetailView) {
            HStack {
                VStack(alignment: .leading) {
                    Text(ticker)
                        .font(.system(size: 20))
                        .bold()
                    Text(companyName)
                        .font(.system(size: 15))
                        .foregroundStyle(.gray)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                
                Spacer()
                
                VStack() {
                    
                    Text("$\(price ?? 0, specifier: "%.2f")")
                        .bold()
                        .frame(maxWidth: .infinity, alignment: .trailing)
                    if editMode?.wrappedValue.isEditing == true {
                        VStack {
                            let differenceColor = difference.map { $0 < 0 ? Color.red : Color.green } ?? Color.gray
                            HStack {
                                
                                
                                Image(systemName: difference.flatMap { $0 < 0 ? "arrow.down.right" : "arrow.up.right" } ?? "arrow.up.right")
                                    .foregroundColor(differenceColor)
                                    .font(.system(size: 20))
                                
                                Text("$\(difference ?? 0, specifier: "%.2f")")
                                    .foregroundColor(differenceColor)
                            }
                            
                            Text("(\(differencePercentage ?? 0, specifier: "%.2f")%)")
                                .foregroundColor(differenceColor)
                                .frame(maxWidth: .infinity, alignment: .trailing)
                        }
                        .font(.system(size: 14))
                    } else {
                        HStack {
                            let differenceColor = difference.map { $0 < 0 ? Color.red : Color.green } ?? Color.gray
                            
                            Image(systemName: difference.flatMap { $0 < 0 ? "arrow.down.right" : "arrow.up.right" } ?? "arrow.up.right")
                                .foregroundColor(differenceColor)
                                .font(.system(size: 20))
                            
                            Text("$\(difference ?? 0, specifier: "%.2f")")
                                .foregroundColor(differenceColor)
                            
                            Text("(\(differencePercentage ?? 0, specifier: "%.2f")%)")
                                .foregroundColor(differenceColor)
                        }
                        .font(.system(size: 14))
                    }
                }
                .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
        .onTapGesture {
                    self.isShowingDetailView = true
                }
    }
}



