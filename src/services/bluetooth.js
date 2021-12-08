export const scanBluetoothDevices = async (errorCallback = null) => {
    console.log('[Bluetooth] Requesting any Bluetooth Device...');
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
    })
        .then(device => {
            console.log(`[Bluetooth] Connecting to GATT Server ${device.name} ...`);
            return device.gatt.connect();
        })
        .then(server => {
            // Note that we could also get all services that match a specific UUID by
            // passing it to getPrimaryServices().
            console.log('[Bluetooth] Getting Services...');
            return server.getPrimaryServices();
        })
        .then(services => {
            console.log('[Bluetooth] Getting Characteristics...');
            let queue = Promise.resolve();
            services.forEach(service => {
                queue = queue.then(() => service.getCharacteristics().then(characteristics => {
                    console.log(`[Bluetooth] > Service: ${service.uuid}`);
                    characteristics.forEach(characteristic => {
                        console.log(`[Bluetooth] >> Characteristic: ${characteristic.uuid} 
                            ${getSupportedProperties(characteristic)}`);
                    });
                }));
            });
            return queue;
        })
        .catch(error => {
            console.error(`[Bluetooth] Argh! ${error}`);

            if (errorCallback) {
                errorCallback(error);
            }
        });
};

const getSupportedProperties = (characteristic) => {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
            supportedProperties.push(p.toUpperCase());
        }
    }
    return `[ ${supportedProperties.join(', ')} ]`;
}