const Config = {
    polling_delay: 2500, // says poll game state after 5 seconds
    update_delay: 4000, // says time after app gets forcibly re rendered
    backend: 'https://gruppe2.toni-barth.com',
    mock: true,
    //backend: 'http://127.0.0.1:8080',
    put: async (api: string, body: Object, onSuccess: (obj: any) => void, onFailure: (obj: any) => void) => {
        const options = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(body),
        };
        await fetch(`${Config.backend}${api}`, options)
            .then((response) => response.json())
            .then(onSuccess)
            .catch(onFailure);
    },
    patch: async (api: string, body: Object, onSuccess: (obj: any) => void, onFailure: (obj: any) => void) => {
        const options = {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(body),
        };
        await fetch(`${Config.backend}${api}`, options)
            .then((response) => response.json())
            .then(onSuccess)
            .catch(onFailure);
    },
    post: async (api: string, body: Object, onSuccess: (obj: any) => void, onFailure: (obj: any) => void) => {
        const options = {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify(body),
        };
        await fetch(`${Config.backend}${api}`, options)
            .then((response) => response.json())
            .then(onSuccess)
            .catch(onFailure);
    },
    get: async (api: string, onSuccess: (obj: any) => void, onFailure: (obj: any) => void) => {
        const options = {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        };
        await fetch(`${Config.backend}${api}`, options)
            .then((response) => response.json())
            .then(onSuccess)
            .catch(onFailure);
    },
    delete: async (api: string, onSuccess: (obj: any) => void, onFailure: (obj: any) => void) => {
        const options = {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
        };
        await fetch(`${Config.backend}${api}`, options)
            .then(onSuccess)
            .catch(onFailure);
    }
}

export default Config;