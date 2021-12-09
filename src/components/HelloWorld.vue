<template>
  <div class="hello">
     <!--<button v-on:click="createConnection">Click</button>
     <br/>
     <button v-on:click="doSubscribe">subscribe</button>-->
    <div v-if="temperature === ''">
      <v-row align="center" style="display: flex; justify-content: center; margin-top: 50px">
        <v-img
          contain
          :src="loader"
          max-height="100"
          max-width="100"
        ></v-img>
      </v-row>
    </div> 
    <div v-else>
      <v-card
      class="mx-auto"
      max-width="344"
      style="margin-top: 50px"
      >
      <v-img
        :src="logo"
        height="200px"
      ></v-img>

      <div v-if="temperature === ''">
        <v-img
        :src="loader"
        height="50px"
        ></v-img>
      </div>  
      
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

        <div id="table" align="center" style="width:50%; margin-left: 25%; margin-right: 25%; margin-top: 50px">
          <v-data-table
            dense
            :headers="headers"
            :items="allData"
            item-key="name"
            class="elevation-1"
          ></v-data-table>
        </div>
    </div>
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
      loader: require('../assets/loader.gif'),
      temperature : '',
      humidty:'',
      battery:'',
      headers: [
        { text: 'Temperature', value: 'temp' },
        { text: 'Humidity', value: 'humidity' },
        { text: 'Battery', value: 'battery' },
        { text: 'Date', value: 'date' },
      ],
      allData:[],
      connection: {
        host: 'broker.emqx.io',
        port: 8084,
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
      const connectUrl = `wss://${host}:${port}${endpoint}`
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
        this.receiveNews = this.receiveNews.concat(message);
        let data = JSON.parse(`${message}`);
        let d = new Date();
        let now = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        let objet = {temp:data.temp, humidity:data.humidity, battery:data.battery, date: now};
        this.allData.unshift(objet);
        //for(var element in this.receiveNews) {
          console.log(this.allData);
        //}
        
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
