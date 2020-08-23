// You may import any optional interfaces
import BackgroundGeolocation, {
    // State,
    // Config,
    Location,
    // LocationError,
    // Geofence,
    // HttpEvent,
    // MotionActivityEvent,
    // ProviderChangeEvent,
    // MotionChangeEvent,
    // GeofenceEvent,
    // GeofencesChangeEvent,
    // HeartbeatEvent,
    // ConnectivityChangeEvent
} from "cordova-background-geolocation-lt";

 class Track {
    onLocation?: (location: Location) => void;
    constructor(listener?: {
        onLocation: (location: Location) => void
    }) {
        if (listener) {
            this.onLocation = listener.onLocation;
        }
    }
    // Like any Cordova plugin, you must wait for Platform.ready() before referencing the plugin.
    configureBackgroundGeolocation() {
        // 1.  Listen to events.
        BackgroundGeolocation.onLocation(location => {
            console.log('[location] - ', location);
            this.onLocation && this.onLocation(location);
        });

        BackgroundGeolocation.onMotionChange(event => {
            console.log('[motionchange] - ', event.isMoving, event.location);
        });

        BackgroundGeolocation.onHttp(response => {
            console.log('[http] - ', response.success, response.status, response.responseText);
        });

        BackgroundGeolocation.onProviderChange(event => {
            console.log('[providerchange] - ', event.enabled, event.status, event.gps);
        });

        // 2.  Configure the plugin with #ready
        BackgroundGeolocation.ready({
            reset: true,
            debug: true,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            url: 'http://my.server.com/locations',
            autoSync: true,
            stopOnTerminate: false,
            startOnBoot: true
        }, (state) => {
            console.log('[ready] BackgroundGeolocation is ready to use');
            if (!state.enabled) {
                // 3.  Start tracking.
                BackgroundGeolocation.start();
            }
        });
    }

    stop() {
        BackgroundGeolocation.stop();
    }
}
export default Track;