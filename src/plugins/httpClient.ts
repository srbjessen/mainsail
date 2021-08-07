import _Vue from "vue";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import axios from "axios";


export function HttpClientPlugin<AxiosInstance>(Vue: typeof _Vue, options: HttpClientPluginOptions): void {
    window.console.log("setup httpClientPlugin", options)

    const HttpClient = axios.create({
        baseURL: options.url,
        timeout: options.timeout,
        transformRequest: [function (data, headers) {
            headers['Authorization'] = options.store.getters['socket/getToken']
            // Do whatever you want to transform the data

            return JSON.stringify(data);
            //return data
        }],
        headers: {
            'Content-Type': 'application/json'
        }
    })

    Vue.prototype.$httpClient = HttpClient
    Vue.$httpClient = HttpClient
}

export interface HttpClientPluginOptions {
    url: string
    timeout: number
    store: Store<RootState>
}