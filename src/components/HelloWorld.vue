<template>
	<div class="hello">
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
			    style="margin-top: 50px">
			    <div class="text-h6 font-weight-light mb-2">Dernières données récupérées</div>
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
					Humidity : {{ humidity }}
				</v-card-title>

				<v-card-title>
					Battery : {{ battery }}
				</v-card-title>
			</v-card>
			<v-card
		        class="mt-4 mx-auto"
		        max-width="650">
		        <v-sheet
			    class="v-sheet--offset mx-auto"
			    color="cyan"
			    elevation="12"
			    max-width="calc(100% - 32px)">
			        <v-sparkline
				    :labels="labels"
				    :value="valueTemp"
				    color="white"
				    line-width="2"
				    padding="16"></v-sparkline>
		        </v-sheet>

		        <v-card-text class="pt-0">
			        <div class="text-h6 font-weight-light mb-2">
				        10 dernières températures récupérées
			        </div>
			        <v-divider class="my-2"></v-divider>
		        </v-card-text>
		    </v-card>
        </div>
	</div>
</template>

<script>
import mqtt from 'mqtt';
export default {
	name: "HelloWorld",
	mounted() {
			this.createConnection();
			if(localStorage.temperature) {
				this.temperature = localStorage.temperature;
			}
            if(localStorage.humidity) {
				this.humidity = localStorage.humidity;
			}
            if(localStorage.battery) {
				this.battery = localStorage.battery;
			}
            if(localStorage.valueTemp) {
				this.valueTemp = JSON.parse(localStorage.valueTemp);
			}
		},
	 data() {
		return {
			logo: require('../assets/weather.jpg'),
			loader: require('../assets/loader.gif'),
			labels: [
				0
			],
			valueTemp: [
				0
			],
			temperature : '',
			humidity:'',
			battery:'',
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
		}
	},

	methods: {
		createConnection() {
			const { host, port, endpoint } = this.connection;
			const connectUrl = `wss://${host}:${port}${endpoint}`;
			try {
				this.client = mqtt.connect(connectUrl, { options: { keepAlive: 30}} )
			} catch (error) {
				console.log('mqtt.connect error', error)
			}
			this.client.on('connect', () => {
				console.log('Connection succeeded!')
				this.doSubscribe();
			})
			this.client.on('error', error => {
				console.log('Connection failed', error)
			})
			this.client.on('message', (topic, message) => {
				this.receiveNews = this.receiveNews.concat(message)
				let data = JSON.parse(`${message}`);
				this.temperature = data.temp;
				this.humidity = data.humidity;
				this.battery = data.battery;
				if(this.valueTemp.length == 10){
					this.valueTemp.shift();
					this.valueTemp.push(data.temp);
				}
				else{
						this.valueTemp.push(data.temp);
				}
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
