//
//  StockNewsView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/12/24.
//

import SwiftUI
import Kingfisher

class GlobalState: ObservableObject {
    static let shared = GlobalState()  // Singleton instance
    @Published var selectedArticle: StockNews?
}

struct StockNewsView: View {
    
    var news: [StockNews] // This should be filled with your news data
    @State private var showNewsDetail = false
    
    
    @ObservedObject var state = GlobalState.shared
    
    var body: some View {
        //        List {
        ForEach(news.indices, id: \.self) { index in
            if index == 0 {
                // Special formatting for the first news item
                VStack(alignment: .leading) {
                    KFImage(URL(string: news[index].image))
                        .resizable()
//                        .aspectRatio(contentMode: .fill)
                        .clipped()
                        .cornerRadius(8)
                        .frame(height: 200)
                    Spacer()
                        .frame(height: 10)
                    HStack{
                        Text("\(news[index].source)")
                            .foregroundColor(.secondary)
                            .bold()
                        Text("\(timeAgoSinceDate(news[index].datetime))")
                            .foregroundColor(.secondary)
                    }
                    .font(.system(size: 12))
                    Spacer()
                        .frame(height: 10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 12))
                    Text(news[index].headline)
                        .font(.headline)
                    //                        .lineLimit(3)
                }
                .onTapGesture {
                    state.selectedArticle = news[index]  // Set the global selectedArticle
                    self.showNewsDetail = true
                }
                
                
                
            } else {
                // Regular formatting for all other news items
                if index == 1 {
                    Divider()
                    Spacer()
                        .frame(height: 20)
                }
                HStack {
                    
                    VStack(alignment: .leading) {
                        HStack{
                            Text("\(news[index].source)")
                                .foregroundColor(.secondary)
                                .bold()
                            Text("\(timeAgoSinceDate(news[index].datetime))")
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .font(.system(size: 12))
                        Spacer()
                            .frame(height: 5)
                        Text(news[index].headline)
                            .font(.system(size: 15))
                            .bold()
                            .lineLimit(3)
                        
                        
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    
                    KFImage(URL(string: news[index].image))
                        .resizable()
                        .frame(width: 80, height: 80)
                        .cornerRadius(8)
                        .frame(maxWidth: 85, alignment: .trailing)
                }
                .onTapGesture {
                    state.selectedArticle = news[index]  // Set the global selectedArticle
                    
                    self.showNewsDetail = true
                }
                
                
                
                Spacer()
                    .frame(height: 20)
            }
            
        }
        
        .sheet(isPresented: $showNewsDetail) {
            if let article = state.selectedArticle {
                NewsDetailView(article: article)
            } else {
                Text("No article data available").font(.title)
            }
        }
        
    }
    
    private func timeAgoSinceDate(_ timestamp: Int) -> String {
        let newsDate = Date(timeIntervalSince1970: Double(timestamp))
        let currentDate = Date()
        let components: Set<Calendar.Component> = [.minute, .hour, .day, .weekOfYear]
        let difference = Calendar.current.dateComponents(components, from: newsDate, to: currentDate)
        
        if let week = difference.weekOfYear, week > 0 {
            return "\(week)w"
        } else if let day = difference.day, day > 0 {
            return "\(day)d"
        } else {
            // Construct the string to show both hours and minutes
            let hour = difference.hour ?? 0
            let minute = difference.minute ?? 0
            let hourPart = hour > 0 ? "\(hour)hr" : ""
            let minutePart = minute > 0 ? ", \(minute)min" : ""
            return "\(hourPart)\(minutePart)"
        }
    }
}



#Preview {
    StockNewsView(news: [
        StockNews(datetime: 1712954706, headline: "Apple Stock Rises On AI Mac News. Shares Look To Retake Key Level.", image: "https://media.zenfs.com/en/ibd.com/7b8a4efb804c37dfbecacd236d571629", source: "Yahoo", summary: "Apple stock rose on a news report that the company plans a big AI-focused refresh of its Mac computer lineup.", url: "https://finnhub.io/api/news?id=7a8f62cc6b42f99b703d381eea10b524c780fb68c9146c06a661ca3e7fd40504"),
        StockNews(datetime: 1712951639, headline: "Is Apple \'in stealth mode\' while acquiring AI companies?", image: "https://s.yimg.com/ny/api/res/1.2/TFLnJDZVPIbX.QoRQ.Ri1g--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://s.yimg.com/os/creatr-uploaded-images/2024-04/262a5270-f903-11ee-b3ff-9d3480f37b3d", source: "Yahoo", summary: "In another installment of Yahoo Finance\'s Good Buy or Goodbye, RSE Ventures Co-Founder and CEO Matt Higgins joins Josh Lipton to share his insights into iPhone maker Apple (AAPL) and chip company Arm Holdings (ARM). Higgins names Apple shares as his good buy, stating that the tech leader may be on the up-and-up after the stock slid in 2024\'s first quarter. Higgins points to Apple\'s quick adoption and integration of AI into its devices as a major catalyst. \"They have been gobbling up AI companies below the radar — I think they\'ve bought 32 of them,\" Higgins says. \"Clearly they\'re working on it because If they don\'t they\'re facing an existential threat to their very survival. I think Apple has been keeping its head down while its stock has faltered.\" Arm is the stock Higgins would wish to say good buy to, calling the semiconductor designer overvalued as early investors were \"looking for different ways to chase Nvidia (NVDA)\" in the broad chip landscape. Catch more of Good Buy or Goodbye here, or watch this full episode of Market Domination. This post was written by Luke Carberry Mogan.", url: "https://finnhub.io/api/news?id=2a7443f2b74d65d8d433121ee82511a822b9f8a658d77a203de1db7f13227954"),
        StockNews(datetime: 1712946444, headline: "The iPhone suggests a Palestinian flag when some people type ‘Jerusalem.’ Apple is working on a fix", image: "https://media.cnn.com/api/v1/images/stellar/prod/gettyimages-1683373855.jpg?c=16x9&q=w_800,c_fill", source: "Yahoo", summary: "Apple is working to a fix a bug in its latest iOS software that suggests the Palestinian flag emoji when some users search for the word “Jerusalem” in the emoji keyboard.", url: "https://finnhub.io/api/news?id=3391f992b018633257879b729709f0bbe914e54c73d481b24fdb7e8f040fca99"),
        // ... other news articles
    ])
}
