import _Vue from "vue";
import {Store} from "vuex";
import {RootState} from "@/store/types";
import axios from "axios";


export function HttpClientPlugin<AxiosInstance>(Vue: typeof _Vue, options: HttpClientPluginOptions): void {
    const HttpClient = axios.create({
        baseURL: options.url,
        timeout: options.timeout,
        transformRequest: [function (data, headers) {
            const token = options.store.getters['socket/getToken']
            if (token !== null) headers['Authorization'] = token
            // Do whatever you want to transform the data

            if ('Content-Type' in headers && headers['Content-Type'] === 'application/json')
                return JSON.stringify(data)

            return data
        }],
    })

    HttpClient.prototype.CancelToken = axios.CancelToken

    Vue.prototype.$httpClient = HttpClient
    Vue.$httpClient = HttpClient
}

export interface HttpClientPluginOptions {
    url: string
    timeout: number
    store: Store<RootState>
}