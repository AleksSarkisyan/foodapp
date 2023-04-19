export const httpClientApi = async ({ method, token, path, params, queryString }: any) => {
    const baseUrl = process.env.HTTP_CLIENT_API_URL;
    const url = baseUrl + path;

    let options = {
        method,
        headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json"
        },
        body: null
    }

    if (method == 'POST') {
        options.body = params
    }

    let callApi = await fetch(url, options);

    return await callApi.json();
}