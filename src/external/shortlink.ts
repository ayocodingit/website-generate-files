import axios from 'axios'
import { Config } from '../config/config.interface'

class Shortlink {
    constructor(private config: Config) {}

    public async GenerateLink(url: string, seconds: number) {
        try {
            const expired = new Date(Date.now() + seconds * 1000)

            const { data } = await axios.post(this.config.shortlink.url, {
                url,
                expired,
            })
            return data.data.short_link
        } catch (error) {
            return url
        }
    }
}

export default Shortlink
