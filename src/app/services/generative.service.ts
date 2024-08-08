import { Injectable } from "@angular/core";

import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GenerativeService {
  getModel(): GenerativeModel {
    const api = new GoogleGenerativeAI(

      /* Put your API key here  */
      /* Generate an API key at https://makersuite.google.com/app/apikey */
      'AIzaSyD9H81ZN2P7LCj8JJHVrXiFdRV-Bi9E7wg'

    );
    return api.getGenerativeModel({ model: 'gemini-pro' });
  }
}