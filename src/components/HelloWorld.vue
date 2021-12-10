<template>
  <div>
    <div v-if="onLine" class="connexion-with-internet mx-auto">
      <v-card class="mx-auto" max-width="650" style="margin-top: 50px; padding: 2rem">
        <v-alert v-if="connexionState" type="success">Etat de la connexion au M5Stack : Connecté</v-alert>
        <v-alert v-else type="error">Etat de la connexion au M5Stack : Déconnecté</v-alert>
        <h1>Entrez le nom d'un M5Stack</h1>
        <v-form ref="form" lazy-validation>
          <v-text-field v-model="nameM5Stack" label="Nom du M5Stack" required></v-text-field>
          <v-btn color="success" class="mr-4" v-on:click="addName">Connexion</v-btn>
          <v-btn color="error" class="mr-4" v-on:click="reset">Réinitialiser les données</v-btn>
        </v-form>
        <v-alert
          style="margin-top: 50px"
          v-if="error == true"
          border="top"
          color="red lighten-2"
          dark
        >Merci de remplir le champ</v-alert>
      </v-card>
    </div>
    <div v-else class="connexion-with-bluetooth">
      <v-card class="mx-auto" max-width="650" style="margin-top: 50px; padding: 2rem">
        <h1>Connexion bluetooth</h1>
        <div class="text-center">
          <v-btn
            :disabled="disabledButton"
            rounded
            color="primary"
            dark
            @click="scanBluetoothDevices"
          >
            <v-icon left dark>mdi-bluetooth</v-icon>
            {{ connectBluetoothLabel }}
          </v-btn>
        </div>
      </v-card>
    </div>
    <div v-if="temperature != null">
      <v-card class="mx-auto" max-width="344" style="margin-top: 50px; padding: 1rem">
        <div class="text-h6 font-weight-light mb-2">Dernières données récupérées</div>
        <v-img :src="logo" height="200px"></v-img>
        <v-card-title>Temperature : {{temperature}}</v-card-title>

        <v-card-title>Humidity : {{ humidity }}</v-card-title>

        <v-card-title>Battery : {{ battery }}</v-card-title>
      </v-card>
      <v-card class="mt-4 mx-auto" max-width="650" style="padding: 1rem;">
        <v-sheet
          class="v-sheet--offset mx-auto"
          color="cyan"
          elevation="12"
          max-width="calc(100% - 32px)"
          style="margin-top: 2rem;"
        >
          <v-sparkline
            :labels="labels"
            :value="valueTemp"
            color="white"
            line-width="2"
            padding="16"
          ></v-sparkline>
        </v-sheet>
        <v-card-text style="margin-top: 2rem;" class="pt-0">
          <div class="text-h6 font-weight-light mb-2">10 dernières températures récupérées</div>
        </v-card-text>
      </v-card>
      <div
        id="table"
        align="center"
        style="width:50%; margin-left: 25%; margin-right: 25%; margin-top: 50px"
      >
        <v-data-table dense :headers="headers" :items="allData" item-key="name" class="elevation-1"></v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
import mqtt from "mqtt";
import dayjs from "dayjs";
import { scanBluetoothDevices } from "@/services/bluetooth";

export default {
  name: "HelloWorld",
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
    if (localStorage.temperature) {
      this.temperature = localStorage.temperature;
    }
    if (localStorage.humidity) {
      this.humidity = localStorage.humidity;
    }
    if (localStorage.battery) {
      this.battery = localStorage.battery;
    }
    if (localStorage.valueTemp) {
      this.valueTemp = JSON.parse(localStorage.valueTemp);
    }
    if (localStorage.allData) {
      this.allData = JSON.parse(localStorage.allData);
    }
    if (localStorage.nameM5Stack) {
      this.nameM5Stack = localStorage.nameM5Stack.replace(/['"]+/g, "");
    }
	console.log(this.temperature)
  },
  data() {
    return {
      nameM5Stack: "",
      error: false,
      onLine: navigator.onLine,
      connexionState: false,
      logo: require("../assets/weather.jpg"),
      loader: require("../assets/loader.gif"),
      labels: [0],
      valueTemp: [0],
      temperature: null,
      humidity: "",
      battery: "",
      headers: [
        { text: "Temperature", value: "temp" },
        { text: "Humidity", value: "humidity" },
        { text: "Battery", value: "battery" },
        { text: "Date", value: "date" },
      ],
      allData: [],
      connection: {
        host: "broker.emqx.io",
        port: 8084,
        endpoint: "/mqtt",
        clean: true, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
        // Certification Information
        clientId: "clientId-j0Nks3DYA0",
        username: "",
        password: "",
      },
      subscription: {
        topic: "",
        qos: 0,
      },
      publish: {
        topic: "topic/browser",
        qos: 0,
        payload: '{ "msg": "Hello, I am browser." }',
      },
      receiveNews: "",
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
      disabledButton: false,
      connectBluetoothLabel: "Connect",
    };
  },

  watch: {
    temperature(newTemperature) {
      localStorage.temperature = newTemperature;
    },
    humidity(newHumidity) {
      localStorage.humidity = newHumidity;
    },
    battery(newBattery) {
      localStorage.battery = newBattery;
    },
    valueTemp(newValueTemp) {
      localStorage.valueTemp = JSON.stringify(newValueTemp);
    },
    allData(newAllData) {
      localStorage.allData = JSON.stringify(newAllData);
    },
    nameM5Stack(newNameM5Stack) {
      localStorage.nameM5Stack = newNameM5Stack;
    },
  },

  methods: {
    createConnection() {
      this.destroyConnection();
      this.connexionState = true;
      const { host, port, endpoint } = this.connection;
      const connectUrl = `wss://${host}:${port}${endpoint}`;
      try {
        this.client = mqtt.connect(connectUrl, { options: { keepAlive: 30 } });
      } catch (error) {
        console.log("mqtt.connect error", error);
      }
      this.client.on("connect", () => {
        console.log("Connection succeeded!");
        this.doSubscribe();
      });
      this.client.on("error", (error) => {
        console.log("Connection failed", error);
      });
      this.client.on("message", (topic, message) => {
        this.receiveNews = this.receiveNews.concat(message);
        let data = JSON.parse(`${message}`);
        let now = dayjs().format("DD-MM-YYYY H:mm");
        let objet = {
          temp: data.temp,
          humidity: data.humidity,
          battery: data.battery,
          date: now,
        };
        this.allData.unshift(objet);

        this.temperature = data.temp;
        this.humidity = data.humidity;
        this.battery = data.battery;
        if (this.valueTemp.length == 10) {
          this.valueTemp.shift();
          this.valueTemp.push(data.temp);
        } else {
          this.valueTemp.push(data.temp);
        }
		console.log(this.temperature)
      });
    },
    doSubscribe() {
      const { topic, qos } = this.subscription;
      this.client.subscribe(topic, { qos }, (error, res) => {
        console.log(res);
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        this.subscribeSuccess = true;
      });
    },
    destroyConnection() {
      this.connexionState = false;
      if (this.client.connected) {
        try {
          this.client.end();
          this.client = {
            connected: false,
          };
          console.log("Successfully disconnected!");
        } catch (error) {
          console.log("Disconnect failed", error.toString());
        }
      }
    },
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === "online";
    },
    addName() {
      if (this.nameM5Stack == "") {
        this.error = true;
        window.setInterval(() => {
          this.error = false;
        }, 4000);
      } else {
        this.error = false;
        this.subscription.topic = "/hive/" + this.nameM5Stack + "/from_device";
        this.createConnection();
      }
    },
    beforeDestroy() {
      window.removeEventListener("online", this.updateOnlineStatus);
      window.removeEventListener("offline", this.updateOnlineStatus);
    },
    reset() {
      this.destroyConnection();
      this.temperature = null;
      this.humidity = "";
      this.battery = "";
      this.nameM5Stack = "";
      localStorage.removeItem("temperature");
      localStorage.removeItem("humidity");
      localStorage.removeItem("battery");
      localStorage.removeItem("valueTemp");
      localStorage.removeItem("allData");
      localStorage.removeItem("nameM5Stack");
    },
    async scanBluetoothDevices() {
      const dispatchIfErrorMessage = (error) => {
        this.$store.dispatch("alertPopping/setAlert", {
          open: true,
          title: "Erreur connection bluetooth",
          message: `[${error.name}] ${error.message}`,
          type: "error",
        });
      };

      const dispatchIfSuccessMessage = (success) => {
        this.$store.dispatch("alertPopping/setAlert", {
          open: true,
          title: "Connection réussie",
          message: `[${success.name}] ${success.message}`,
          type: "success",
        });
      };

      this.disabledButton = true;
      this.connectBluetoothLabel = "Waiting";

      const bluetooth = await scanBluetoothDevices(
        (event, value) => {
          if (this.onLine) {
            return;
          }
          const decoder = new TextDecoder("utf-8");

          console.log(
            "[Bluetooth] humidity",
            decoder.decode(event.target.value)
          );
          let now = dayjs().format("DD-MM-YYYY H:mm");
          let data = {
            temp: parseInt(value[0], 16),
            humidity: parseInt(value[2], 16),
            battery: "",
            date: now,
          };
          this.allData.unshift(data);

          this.temperature = data.temp;
          this.humidity = data.humidity;
          this.battery = data.battery;
          if (this.valueTemp.length == 10) {
            this.valueTemp.shift();
            this.valueTemp.push(data.temp);
          } else {
            this.valueTemp.push(data.temp);
          }
        },
        (event) => {
          const device = event.target;
          dispatchIfErrorMessage({
            name: "Bluetooth",
            message: `Device ${device} disconnected`,
          });
        }
      );

      this.disabledButton = false;
      this.connectBluetoothLabel = "Connect";

      if (bluetooth) {
        dispatchIfSuccessMessage({
          name: "Bluetooth",
          message: "Connexion bluetooth réussie",
        });
      } else {
        dispatchIfErrorMessage({
          name: "Bluetooth",
          message: "La connexion au bluetooth a échoué",
        });
      }

      console.log("[Home bluetooth]", bluetooth);
    },
  },
};
</script>
