//
//  WebView.swift
//  571-HW4
//
//  Created by Huixian Gong on 4/16/24.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    var htmlName: String
    var chartData: [[Double]]
    var volumeData: [[Double]]  // Example data array you might want to pass to JavaScript
    var ticker: String
    @StateObject private var viewModel = StockDetailViewModel()


    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        loadLocalHTML(webView: webView)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        if let url = Bundle.main.url(forResource: htmlName, withExtension: "html") {
            let request = URLRequest(url: url)
            uiView.load(request)
            uiView.navigationDelegate = context.coordinator  // Set the navigation delegate
        }
    }

    // Add a Coordinator to handle the web loading delegate
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: WebView

        init(_ parent: WebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Called when the navigation is complete.
            let c_jsonString = String(data: try! JSONEncoder().encode(parent.chartData), encoding: .utf8)!
            let v_jsonString = String(data: try! JSONEncoder().encode(parent.volumeData), encoding: .utf8)!
            let stockSymbol = parent.ticker
            
            let jsCode = "loadChartData(\(c_jsonString),\(v_jsonString),'\(stockSymbol)');"
            webView.evaluateJavaScript(jsCode, completionHandler: nil)
        }
    }


    private func loadLocalHTML(webView: WKWebView) {
        if let url = Bundle.main.url(forResource: htmlName, withExtension: "html") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}

