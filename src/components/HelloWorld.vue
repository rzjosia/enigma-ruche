<template>
  <div class="hello">
     <!--<button v-on:click="createConnection">Click</button>
     <br/>
     <button v-on:click="doSubscribe">subscribe</button>-->
      <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="logo"
      height="200px"
    ></v-img>

    <v-card-title>
      Temperature : {{temperature}}
    </v-card-title>

    <v-card-title>
      Humidity : {{ humidty }}
    </v-card-title>

    <v-card-title>
      Battery : {{ battery }}
    </v-card-title>

  </v-card>
  </div>

</template>

<script>
import mqtt from 'mqtt';
export default {
  name: "HelloWorld",
  mounted() {
      this.createConnection();
      this.doSubscribe();
    },
   data() {
    return {
      logo: require('../assets/weather.jpg'),
      temperature : '',
      humidty:'',
      battery:'',
      connection: {
        host: 'broker.hivemq.com',
        port: 8000,
        endpoint: '/mqtt',
        clean: true, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
        // Certification Information
        clientId: 'clientId-j0Nks3DYA0',
        username: '',
        password: '',
      },
      subscription: {
        topic: '/hive/j-118/from_device',
        qos: 0,
      },
      publish: {
        topic: 'topic/browser',
        qos: 0,
        payload: '{ "msg": "Hello, I am browser." }',
      },
      receiveNews: '',
      qosList: [
        { label: 0, value: 0 },
        { label: 1, value: 1 },
        { label: 2, value: 2 },
      ],
      client: {
        connected: false,
      },
      subscribeSuccess: false,
    }
  },

  methods: {
    createConnection() {
      const { host, port, endpoint, ...options } = this.connection
      const connectUrl = `ws://${host}:${port}${endpoint}`
      try {
        this.client = mqtt.connect(connectUrl, options)
      } catch (error) {
        console.log('mqtt.connect error', error)
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!')
      })
      this.client.on('error', error => {
        console.log('Connection failed', error)
      })
      this.client.on('message', (topic, message) => {
        this.receiveNews = this.receiveNews.concat(message)
        let data = JSON.parse(`${message}`);
        console.log(data);
        this.temperature = data.temp;
        this.humidty = data.humidity;
        this.battery = data.battery;
      })
    },
    doSubscribe() {
      const { topic, qos } = this.subscription
      this.client.subscribe(topic, { qos }, (error, res) => {
      if (error) {
        console.log('Subscribe to topics error', error)
        return
      }
      this.subscribeSuccess = true
      console.log(res)
    })
  },
  }
};
</script>
