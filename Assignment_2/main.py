'''
Finhub API key: cms4589r01qlk9b11g1gcms4589r01qlk9b11g20
Polygon.io API key: wjYgWwDJ_fIrb0Iem90No7WkqTF1yyYu
'''

from flask import Flask, jsonify, request
from datetime import *
from dateutil.relativedelta import *
import finnhub, requests, calendar

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def homepage():
    return app.send_static_file("index.html")

@app.route('/lookup')
def lookup():
    symbol = request.args.get('symbol')
    # url = f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token=cms4589r01qlk9b11g1gcms4589r01qlk9b11g20'
    response = requests.get(f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token=cms4589r01qlk9b11g1gcms4589r01qlk9b11g20')
    # return jsonify(response.json())
    return response.json()

@app.route('/stock')
def stock():
    symbol = request.args.get('symbol')
    api_key="cms4589r01qlk9b11g1gcms4589r01qlk9b11g20"
    quote_url = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={api_key}'
    rec_url = f'https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={api_key}'
    quote_response = requests.get(quote_url)
    rec_response = requests.get(rec_url)

    ret = (quote_response.json())|((rec_response.json())[0])
    # print(ret)
    return jsonify(ret)

@app.route('/chart')
def chart():
    symbol = request.args.get('symbol').upper()
    multiplier = 1
    timespan = 'day'
    end_date = date.today()
    # end_date = end_date+relativedelta(days=-19)
    print(end_date)
    from_date = end_date+relativedelta(months=-6, days=-1)
    api_key="wjYgWwDJ_fIrb0Iem90No7WkqTF1yyYu"
    url = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{from_date}/{end_date}?adjusted=true&sort=asc&apiKey={api_key}'
    response = requests.get(url)
    data = []
    for i in response.json()['results']:
        data.append([i['t'], i['c'],i['v']])
    # print(url)
    return data


@app.route('/news')
def news():
    symbol = request.args.get('symbol')
    today_date = end_date = date.today()
    before_30 = end_date+relativedelta(days=-30)
    api_key="cms4589r01qlk9b11g1gcms4589r01qlk9b11g20"
    url = f'https://finnhub.io/api/v1/company-news?symbol={symbol}&from={before_30}&to={today_date}&token={api_key}'
    response = requests.get(url)
    # print(url)
    # print(jsonify(response.json()))
    return jsonify(response.json())

if __name__ == '__main__':
     app.run(debug=True)
