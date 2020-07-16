import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';

export const GET = async <T>(pathname: string, params?: any) => {
    try {
        const config: AxiosRequestConfig = {
            params
        }
        return await axios.get<T>(pathname, config)
    } catch (error) {
        console.error(error);
        return null;
    }
}