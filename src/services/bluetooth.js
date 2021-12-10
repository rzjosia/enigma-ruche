export const scanBluetoothDevices = async (notificationCallback, onDisconnected) => {
    // optionalServices: ["battery_service", "device_information", "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6"]

    console.log("[Bluetooth] Requesting any Bluetooth Device...");

    const serviceUuid = "ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6";
    const characteristicUuid = "ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6";
    // const characteristicUuid = "ebe0ccd9-7a0a-4b0c-8a1a-6ff2997da3a6";

    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                { name: "LYWSD03MMC" },
            ],
            optionalServices: ["battery_service", "device_information", serviceUuid]
        });

        device.addEventListener('gattserverdisconnected', onDisconnected);

        console.log("[Bluetooth] Connecting to GATT Server...");

        const server = await device.gatt.connect();

        console.log("[Bluetooth] Getting Service...");
        const service = await server.getPrimaryService(serviceUuid);
        // const batteryService = await server.getPrimaryService("battery_service")

        // console.log("[Bluetooth] Getting Characteristic battery", batteryService);

        Promise.resolve().then(() => service.getCharacteristics().then(characteristics => {
            console.log("[Bluetooth] > Service: " + service.uuid);
            characteristics.forEach(characteristic => {
                if (characteristic.uuid === characteristicUuid) {
                    console.log(">> Characteristic: " + characteristic.uuid + " " +
                        getSupportedProperties(characteristic));
                }
            });
        }));

        console.log("[Bluetooth] Getting Service...");
        const characteristic = await service.getCharacteristic(characteristicUuid);
        // const batteryCharacteristic = await batteryService.getCharacteristic("battery_level");
        // const batteryLevel = await batteryCharacteristic.readValue()
        // const batteryLevelValue = batteryLevel.getUint8(0);

        console.log("[Bluetooth] Getting Characteristic...");
        Promise.resolve().then(() => service.getCharacteristics().then(characteristics => {
            console.log("[Bluetooth] > Service: " + service.uuid);
            characteristics.forEach(characteristic => {
                if (characteristic.uuid === characteristicUuid) {
                    console.log(">> Characteristic: " + characteristic.uuid + " " +
                        getSupportedProperties(characteristic));
                }
            });
        }));

        // console.log("[Bluetooth] battery level value:", batteryLevelValue)

        const currentCharateristic = characteristic;

        currentCharateristic.startNotifications().then(() => {
            console.log("[Bluetooth] > Notifications started");

            currentCharateristic.addEventListener("characteristicvaluechanged",
                (event) => notificationCallback(event, handleNotifications(event)));
        });

        // batteryCharacteristic.startNotifications().then(() => {
        //     console.log("[Bluetooth] > Notifications battery started");

        //     batteryCharacteristic.addEventListener("characteristicvaluechanged",
        //         handleNotifications);
        // });


        return characteristic;

    } catch (error) {
        console.error("[Bluetooth] Argh! " + error);
        return false;
    }
};

export function handleNotifications(event) {
    let value = event.target.value;
    console.log("[Bluetooth] Receive value", event);
    let a = [];
    // Convert raw data bytes to hex values just for the sake of showing something.
    // In the "real" world, you"d use data.getUint8, data.getUint16 or even
    // TextDecoder to process raw data bytes.
    for (let i = 0; i < value.byteLength; i++) {

        /**
         *  0 =>
         *  1 =>
         *  2 => percentage
         */
        const hex = "0x" + ("00" + value.getUint8(i).toString(16)).slice(-2);
        console.log("[Bluetooth] value => ", parseInt(hex, 16));
        a.push(hex);
    }

    console.log("[Bluetooth] > " + a.join(" "));
    return a;
}

function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
            supportedProperties.push(p.toUpperCase());
        }
    }

    return `[ ${supportedProperties.join(", ")} ]`;
}