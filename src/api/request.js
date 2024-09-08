export default async function request({ url, method = 'GET', params, data }) {
    const baseUrl = process.env.VUE_APP_BASE_URL; // 从环境变量获取基础URL
    let fullUrl = `${baseUrl}${url}`; // 将基础URL和相对路径的URL合并

    const options = {
        method,
        credentials: 'include'
    };

    if (data) {
        if (data instanceof FormData) {
            options.body = data; // 如果传递的是FormData对象，直接使用
        } else {
            // 处理其他类型的数据，比如 JSON
            options.body = JSON.stringify(data);
            options.headers = {
                'Content-Type': 'application/json'
            };
        }
    }

    // Append query parameters for GET requests
    if (method === 'GET' && params) {
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
            fullUrl += `?${queryString}`;
        }
    }


    try {
        const response = await fetch(fullUrl, options); // 使用合并后的完整URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response
    } catch (error) {
        console.error('Request failed:', error);
        throw error;
    }
}