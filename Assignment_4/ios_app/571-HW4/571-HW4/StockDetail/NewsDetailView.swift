//
//  NewsDetailView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/12/24.
//

import SwiftUI

struct NewsDetailView: View {
    let article: StockNews
    @Environment(\.presentationMode) var presentationMode
    
    var body: some View {
        NavigationView {
            VStack(alignment: .leading, spacing: 5) {
                Text(article.source)
                    .fontWeight(.medium)
                    .font(.system(size: 30))
                    .bold()
                Text(Date(timeIntervalSince1970: Double(article.datetime)), style: .date)
                    .foregroundStyle(.secondary)
                    .font(.system(size: 15))
                Divider()
                Text(article.headline)
                    .font(.system(size: 20))
                    .bold()
                
                Text(article.summary)
                    .font(.system(size: 13))
                HStack {
                    Text("For more details click")
                        .foregroundStyle(.secondary)
                    Link(destination: URL(string: article.url)!) {
                        Text("here")
                    }
                }
                .font(.system(size: 13))
                
                HStack {
                    Button(action: {
                        // Code to share on Twitter
                        let tweetText = article.headline
                        let tweetUrl = article.url
                        let tweetHashtags = "news"
                        let shareString = "https://twitter.com/intent/tweet?text=\(tweetText)&url=\(tweetUrl)&hashtags=\(tweetHashtags)"
                        if let escapedShareString = shareString.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed),
                           let url = URL(string: escapedShareString) {
                            UIApplication.shared.open(url, options: [:], completionHandler: nil)
                        }
                    }) {
                        Label{
                            
                        } icon: {
                            Image("twitterIcon")
                                .resizable()         // Allow image to be resized
                                .aspectRatio(contentMode: .fit) // Preserve aspect ratio during resize
                                .frame(width: 50, height: 50)   // Set the frame size to 30x30
                        }
                        
                    }
                    
                    
                    Button(action: {
                        // Code to share on Facebook
                        let url = URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(article.url)")!
                        UIApplication.shared.open(url, options: [:], completionHandler: nil)
                    }) {
                        Label {
                           
                        } icon: {
                            Image("facebookIcon")
                                .resizable()         // Allow image to be resized
                                .aspectRatio(contentMode: .fit) // Preserve aspect ratio during resize
                                .frame(width: 50, height: 50)   // Set the frame size to 30x30
                        }
                    }
                }
                Spacer()
            }
            
            .padding()
            .navigationBarItems(trailing: Button(action: {
                self.presentationMode.wrappedValue.dismiss()
            }) {
                Image(systemName: "xmark")
                    .foregroundColor(.black)
                    .imageScale(.medium)
            })
            
        }
    }
}




#Preview {
    NewsDetailView(article: StockNews(datetime: 1712954706, headline: "Apple Stock Rises On AI Mac News. Shares Look To Retake Key Level.", image: "https://media.zenfs.com/en/ibd.com/7b8a4efb804c37dfbecacd236d571629", source: "Yahoo", summary: "Apple stock rose on a news report that the company plans a big AI-focused refresh of its Mac computer lineup.", url: "https://finnhub.io/api/news?id=7a8f62cc6b42f99b703d381eea10b524c780fb68c9146c06a661ca3e7fd40504"))
}
