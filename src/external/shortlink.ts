import axios from 'axios'
import { Config } from '../config/config.interface'

class Shortlink {
    constructor(private config: Config) {}

    public async GenerateLink(url: string) {
        try {
            const today = new Date()
            const nextWeek = new Date(today)
            nextWeek.setDate(today.getDate() + 7)

            const { data } = await axios.post(this.config.shortlink.url, {
                url,
                expired: nextWeek,
            })
            return data.data.short_link
        } catch (error) {
            return url
        }
    }
}

export default Shortlink
