import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

// 创建 Axios 实例
const instance = axios.create({

    timeout: 10000,  // 超时时间（毫秒）
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
});

// 请求拦截器
instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 在请求发送前处理，例如添加 Token
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // 处理请求错误
        console.error("请求错误: ", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 处理成功响应，直接返回数据
        return response.data;
    },
    (error) => {
        // 处理响应错误
        if (error.response) {
            const {status, data} = error.response;
            console.error(`响应错误 [状态码: ${status}]`, data);

            // 示例：处理 401 未授权错误
            if (status === 401) {
                alert("登录已过期，请重新登录");
                localStorage.removeItem("token");
                window.location.href = "/login";
            }

            // 处理其他常见错误
            if (status === 500) {
                alert("服务器内部错误，请稍后再试");
            }
        } else if (error.request) {
            // 网络错误或请求未发送
            alert("网络错误，请检查您的网络连接");
        } else {
            // 其他错误
            alert("请求失败，请稍后再试");
        }
        return Promise.reject(error);
    }
);

// 通用请求方法封装
const request = {
    get: <T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) =>
        instance.get<T>(url, {params, ...config}),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        instance.post<T>(url, data, {...config}),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        instance.put<T>(url, data, {...config}),

    delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
        instance.delete<T>(url, {...config}),
};

export default request;
