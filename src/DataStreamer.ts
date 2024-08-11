// DataStreamer.ts
export interface ServerRespond {
  stock: string;
  top_ask_price: number;
  top_bid_price: number;
  timestamp: Date;
}

export default class DataStreamer {
  static getData(callback: (data: ServerRespond[]) => void) {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080/query?id=1', true);
    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        const data = JSON.parse(this.responseText) as ServerRespond[];
        callback(data);
      } else {
        // Error
        console.error('Failed to load data:', this.responseText);
      }
    };
    request.onerror = function () {
      console.error('Request error');
    };
    request.send();
  }
}
