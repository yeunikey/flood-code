import xior from 'xior';

export const defaultOptions: Record<string, string> = {
  'Content-Type': 'application/json'
}

// export const baseUrl = 'http://172.20.10.3:3001/v1'
export const baseUrl = 'http://localhost:3001/v1'
export const socketUrl = "http://localhost:3001"
// export const baseUrl = 'https://panel-api.flood.astanait.edu.kz/v1'
// export const socketUrl = "https://panel-api.flood.astanait.edu.kz"

export const api = xior.create({
  baseURL: baseUrl,
  headers: defaultOptions
});

export const vapi = xior.create({
  baseURL: baseUrl
}); 