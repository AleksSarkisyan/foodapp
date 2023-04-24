export const httpRestaurantApi = async ({ method, token, path, params, queryString }: any) => {
    const baseUrl = process.env.HTTP_RESTAURANT_API_URL;
    const url = baseUrl + path;

    let options = {
        method,
        headers: {
            Authorization: '',
            "Content-Type": "application/json"
        },
        body: null
    }

    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `${token}`
        }
    }

    if (method == 'POST') {
        options.body = params
    }

    let callApi = await fetch(url, options);

    return await callApi.json();
}