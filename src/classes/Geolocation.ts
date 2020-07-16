import { Plugins, GeolocationWatchCallback } from '@capacitor/core';

const { Geolocation } = Plugins;

class Geolo {
    id: string | undefined;
    async getCurrentPosition() {
        const coordinates = await Geolocation.getCurrentPosition();
        console.log('Current', coordinates);
        return coordinates;
    }

    watchPosition(callback: GeolocationWatchCallback) {
        this.id = Geolocation.watchPosition({}, (position, err) => {
            console.log(position);
            console.log(err);
            callback(position, err)
        })
    }
    clearWatch() {
        if (this.id) {
            Geolocation.clearWatch({id: this.id})
        }
    }
}

export default Geolo;