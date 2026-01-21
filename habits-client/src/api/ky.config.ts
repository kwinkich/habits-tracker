import ky from 'ky'
import type { Options } from 'ky'

const CONFIG: Options = {
  hooks: {
    afterResponse: [
      async (_request, _options, response): Promise<void> => {
        if (response.status >= 400) {
          throw await response.json()
        }
        return response.json()
      },
    ],
  },
}

export const api = ky.extend({
  prefixUrl: 'http://localhost:5051/',
  ...CONFIG,
})
