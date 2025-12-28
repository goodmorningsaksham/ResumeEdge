import axios from 'axios'

const api = axios.create({
    baseURL: "http://13.232.220.202:3000"
})

export default api