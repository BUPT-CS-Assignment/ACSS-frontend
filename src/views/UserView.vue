<template>
<v-container class="fill-height d-flex flex-column">
    <v-card class="rounded-lg w-75 bg-grey-lighten-3">
        <v-card-title class="d-flex flex-row mt-2">
            <p class="text-h4 font-weight-black">HELLO, {{user}}</p>
            <p class="ml-auto text-overline font-weight-bold">{{time.year}}/{{time.month}}/{{time.day}} {{time.hour}}:{{time.minute}}</p>
        </v-card-title>
        <v-card-text class="d-flex flex-row">
            <p class="text-subtitle-1 text-grey-darken-1 font-weight-bold">ACSS</p>
            <v-btn class="ml-auto" variant="text" density="compact" color="black" icon="mdi-exit-to-app" @click="quit"/>
        </v-card-text>
    </v-card>

    <v-spacer class="my-3"></v-spacer>

    <!-- 充电请求 -->
    <v-btn class="w-75 rounded-lg" color="green-lighten-1"
        @click="dialog = true">
        <p class="text-button font-weight-bold">NEW REQUEST</p>
    </v-btn>

    <v-spacer class="my-3"></v-spacer>

    <!-- 当前状态 -->
    <template v-if="current.length == 0">
        <v-card class="rounded-lg w-75">
            <v-card-title class="d-flex flex-row">
                <v-chip label class="mx-2">
                    <p class="text-overline font-weight-bold">NO TASK</p>
                </v-chip>
            </v-card-title>
        </v-card>
        <v-spacer class="my-3"></v-spacer>
    </template>
    <template v-else v-for="info in current">
    <v-card class="rounded-lg w-75">
        <v-card-title class="d-flex flex-row">
            <v-chip label class="mx-2">
                <p class="text-overline font-weight-bold">TASK</p>
            </v-chip>
            <p class="text-h6 font-weight-bold ml-2">{{ info.car_id }}</p>
            <v-btn class="ml-auto" color="red" 
                    density="compact" @click="">
                <p class="font-weight-bold">CANCEL</p>
            </v-btn>
            <v-btn class="ml-4" color="grey" variant="text" 
                    density="compact" icon="mdi-refresh"
                    @click="query_detail(info)"/>
        </v-card-title>
        
        <v-card-text v-if="info.valid">
            <v-row class="mt-3">
                <v-col cols="5">
                    <v-btn size="x-large" class="w-100 rounded-lg" color="orange-darken-2"
                        :disabled="info.status != -1"
                        @click="alter_mode(info)">
                        <p class="text-button font-weight-bold">CHANGE MODE</p>
                    </v-btn>
                </v-col>

                <v-col cols="4">
                    <v-btn size="x-large" class="w-100 rounded-lg" color="blue-lighten-1"
                        :disabled="info.status == 1 || info.status == 2"
                        @click="alter_amount(info)">
                        <p class="text-button font-weight-bold">RESET</p>
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="info.input_amount" 
                        variant="solo" label="Amount" type="number" 
                        :disabled="info.status == 1 || info.status == 2"/>
                </v-col>
            </v-row>
            <v-divider ></v-divider>
            <v-list>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-h6 font-weight-bold">STATUS</p>
                        <p class="text-h6 font-weight-bold ml-6" :class="status_color[String(info.status)]">{{ status_str[String(info.status)] }}</p>
                    </div>
                </v-list-item>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-h6 font-weight-bold">MODE</p>
                        <p class="text-h6 font-weight-bold ml-6" :class="mode_color[String(info.mode)]">{{ mode_str[String(info.mode)] }}</p>
                        <p class="text-h6 font-weight-bold ml-auto">PILE</p>
                        <p class="text-h6 font-weight-bold text-grey ml-6">{{ info.pile != "" ? info.pile :'N/A' }}</p>
                    </div>
                </v-list-item>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-h6 font-weight-bold">REQUEST</p>
                        <p class="text-h6 font-weight-bold text-grey ml-6">{{ info.request_amount }}</p>
                        <p class="text-h6 font-weight-bold ml-auto">CHARGED</p>
                        <p class="text-h6 font-weight-bold text-grey ml-6">{{ info.charged_amount }}</p>
                    </div>
                </v-list-item>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-h6 font-weight-bold">START</p>
                        <p class="text-h6 font-weight-bold text-grey ml-6">{{ info.start_time != "" ? info.start_time : 'N/A' }}</p>
                    </div>
                </v-list-item>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-h6 font-weight-bold ">REMAIN</p>
                        <p class="text-h6 font-weight-bold text-grey ml-6">{{ info.remain }} </p>
                        <p class="text-button font-weight-bold text-grey ml-1">{{ info.remain == "N/A" ? "" : "H"}}</p>
                    </div>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
    <v-spacer class="my-3"></v-spacer>
    </template>
    
    <!-- 历史记录 -->
    <v-card class="rounded-lg w-75">
        <v-card-title class="d-flex flex-row">
            <p class="text-h6 font-weight-bold">HISTORY</p>
            <v-btn class="ml-auto" color="grey" variant="text" 
                    density="compact" icon="mdi-refresh"
                    @click="query_profile()"/>
        </v-card-title>
    
        <v-card-text>
            <template v-for="bill in history">
            <v-card class="rounded-lg my-2">
                <v-list>
                    <v-list-group value="详情">
                        <template v-slot:activator="{ props }" @click="query_bill(bill)">
                            <v-list-item
                            v-bind="props">
                            <v-card-title class="d-flex flex-row">
                                <p class="text-overline font-weight-bold">{{ bill.car }}</p>
                                <p class="text-overline font-weight-bold text-grey ml-auto"> {{ bill.status }}</p>
                            </v-card-title>
                            </v-list-item>
                        </template>
                        <v-list-item>BILL: {{ bill.bill_id }}</v-list-item>
                        <v-list-item>DATE: {{ bill.date }}</v-list-item>
                        <template v-if="bill.valid">
                            <v-list-item>MODE: {{ bill.detail.mode }}</v-list-item>
                            <v-list-item>AMOUNT: {{ bill.amount }}</v-list-item>
                            <v-list-item>PILE: {{ bill.detail.pile }}</v-list-item>
                            <v-list-item>DURATION: {{ bill.detail.duration }}</v-list-item>
                            <v-list-item>START TIME: {{ bill.detail.start_time }}</v-list-item>
                            <v-list-item>END TIME: {{ bill.detail.end_time }}</v-list-item>
                            <v-list-item>SERVICE FEE: {{ bill.cost.service }}</v-list-item>
                            <v-list-item>CHARGE FEE: {{ bill.cost.charge }}</v-list-item>
                            <v-list-item>TOTAL FEE: {{ bill.cost.total }}</v-list-item>
                        </template>
                    </v-list-group>
                </v-list>
            </v-card>
            </template>
        </v-card-text>
    </v-card>

    <v-dialog class="w-75" v-model="dialog" elevation-10>
      <v-card class="rounded-lg overflow-hidden">
          <v-card-title class="text-button font-weight-bold">
            NEW REQUEST
          </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="input_car_id" variant="solo" label="CAR ID"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="input_amount" variant="solo" label="AMOUNT" type="number"></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-radio-group v-model="dialog_input_mode" inline>
                        <v-radio label="NORMAL" value="0"></v-radio>
                        <v-radio label="FAST" value="1"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="3">
                    <v-btn size="x-large" density="compact" color="red" 
                        class="w-auto rounded-lg" @click="dialog = false"> CANCEL </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn size="x-large" density="compact" color="green" 
                        class="w-auto rounded-lg" @click="charge_request()"> SUBMIT </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

</v-container>
</template>

<script setup>
import axios from 'axios';
import router from '../router/index';
import { ref, reactive, getCurrentInstance, onMounted }  from 'vue'


const user = localStorage.getItem('username');
if (user == null) { router.push('/login'); }
const quit = () => {
    localStorage.removeItem('username');
    for(var i in current.value){
        clearInterval(current.value[i].timer);
    }
    clearInterval(sys_timer);
    router.push('/login');
}

const status_str = {
    '-1': 'PENDING',
    '0': 'WAITING',
    '1': 'CHARGING',
    '2': 'FINISTHED'
}

const status_color = {
    '-1': 'text-grey',
    '0': 'text-orange',
    '1': 'text-green',
    '2': 'text-blue'
}

const mode_str= {
    '0':'NORMAL',
    '1':'FAST'
}

const mode_color={
    '0':'text-red',
    '1':'text-green'
}

const current = ref([]);
const history = ref([]);
const dialog = ref(false);
const dialog_input_mode = ref(0);
const input_car_id = ref('');
const input_amount = ref(0);
const time = reactive({
    year: '0000',
    month: '00',
    day: '00',
    hour: '00',
    minute: '00',
});

var basetime = 0;
var sys_timer = null;
const time_sync = () => {
    console.log('sync system time');
    axios.get('api/time')
    .then(res => {
        console.log(res.data)
        basetime = res.data.data.stamp;
        update_time(basetime);
        var ratio = res.data.data.ratio;
        sys_timer = setInterval(() => {
            update_time(basetime + 60)
        }, 60 * 1000 / ratio);
    }).catch(err => {
        console.log(err);
    })
}
const update_time = (stamp) => {
    basetime = stamp;
    var date = new Date(stamp * 1000);
    time.year = date.getFullYear();
    var m = date.getMonth() + 1;
    time.month = m < 10 ? '0' + m : m;
    var d = date.getDate();
    time.day = d < 10 ? '0' + d : d;
    var h = date.getHours();
    time.hour = h < 10 ? '0' + h : h;
    var mi = date.getMinutes();
    time.minute = mi < 10 ? '0' + mi : mi;
}
time_sync();

const charge_request = () => {
    console.log('charging request');
    var car_id = String(input_car_id.value);
    axios.post('api/user/charge', {
        user_id: user,
        car_id: car_id,
        amount: Number(input_amount.value),
        mode: Number(dialog_input_mode.value),
    })
    .then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            var task = reactive({
                valid: false,
                car_id: car_id,
                pile: 0,
                queue: 0,
                mode: 0,
                status: 0,
                remain: 0,
                input_amount: 0,
            })
            current.value.push(task);
            query_detail(task)
            var timer = setInterval(() => {
                query_detail(task);
            }, 5 * 1000);
            task.timer = timer;
            dialog.value = false;
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const alter_mode = (bill) => {
    console.log('alter mode');
    axios.post('api/user/alter/mode', {
        user_id: user,
        car_id: bill.car_id,
        mode: Number(!bill.mode),
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            alert('修改成功');
            bill.mode = !bill.mode;
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const alter_amount = (bill) => {
    console.log('alter amount');
    const res = axios.post('api/user/alter/amount', {
        user_id: user,
        car_id: bill.car_id,
        amount: bill.input_amount
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            bill.amount = bill.input_amount;
            query_detail(bill);
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_bill = (bill)=>{
    console.log('query bill');
    if(bill.valid == true){
        return;
    }

    const res = axios.get('api/user/query/bill', {
        params:{
            user_id: user,
            bill_id: bill.bill_id,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            bill.date = res.data.data.date;
            bill.car = res.data.data.car;
            bill.status = res.data.data.status;
            bill.detail = res.data.data.detail;
            bill.cost = res.data.data.cost;
            bill.valid = true;
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_profile = () => {
    console.log('query profile');
    axios.get('api/user/query/profile', {
        params:{
            user_id: user,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            user = res.data.data.user;
            for(var bill in res.data.bill){
                if(history.find(bill.id) != null){
                    continue;
                }
                history.push({
                    bill_id: bill.id,
                    date: bill.date,
                    valid: false,
                })
            }
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_request = ()=>{
    console.log('query request');
    axios.get('api/user/query/request', {
        params:{
            user_id: user,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            current.value = [];
            res.data.data.forEach(element => {
                var new_info = reactive({
                    valid: false,
                    car_id: element,
                })
                current.value.push(new_info)
                query_detail(new_info);
                var timer = setInterval(() => {
                    query_detail(new_info);
                }, 5 * 1000);
                new_info.timer = timer;
            });
        }else{
            console.log('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
    })
}

const query_detail = (info) => {
    console.log('query detail');
    axios.get('api/user/query/detail', {
        params:{
            user_id: user,
            car_id: info.car_id,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            info.pile = res.data.data.pile_id;
            info.queue = 0;
            if(res.data.data.remain == -1){
                info.remain = 'N/A';
            }else{
                info.remain = Number(res.data.data.remain / 3600).toFixed(1);
            }
            info.mode = res.data.data.mode;
            info.status = res.data.data.status;
            info.request_amount = res.data.data.request_amount;
            info.start_time = res.data.data.start_time;
            info.charged_amount = Number(res.data.data.charged_amount).toFixed(2);
            info.valid = true;
        }else{
            console.log('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
    })
}

query_request();

</script>