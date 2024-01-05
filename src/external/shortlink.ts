import axios from "axios";
import { Config } from "../config/config.interface";

class Shortlink {
    constructor(private config: Config) {
        
    }

    public async GenerateLink(url: string) {
        try {
            const { data } = await axios.post(this.config.shortlink.url, {
                url
            })
            return data.data.short_link   
        } catch (error) {
            return url
        }
    } 
}

export default Shortlink