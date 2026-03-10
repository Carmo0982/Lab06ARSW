import api from '../apiClient.js'

export const getAll = async () => {
    const { data } = await api.get('/v1/blueprints')
    return data.data
}

export const getByAuthor = async (author) => {
    const { data } = await api.get(`/v1/blueprints/${encodeURIComponent(author)}`)
    return data.data
}

export const getByAuthorAndName = async (author, name) => {
    const { data } = await api.get(`/v1/blueprints/${encodeURIComponent(author)}/${encodeURIComponent(name)}`)
    return data.data
}

export const create = async (blueprint) => {
    const { data } = await api.post('/v1/blueprints', blueprint)
    return data.data
}