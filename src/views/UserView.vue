<template>
<v-container v-if="user != null" class="fill-height d-flex flex-column">
    <v-card class="rounded-lg w-100 bg-grey-lighten-3">
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
    
    <v-btn class="w-100 rounded-lg" color="green-lighten-1"
        @click="dialog = true">
        <template v-if="current.length == 0">
            <p class="text-button font-weight-bold">CREATE TASK</p>
        </template>
        <template v-else>
            <p class="text-button font-weight-bold">NEW TASK</p>
        </template>
    </v-btn>
    

    <v-spacer class="my-3"></v-spacer>

    <!-- 当前状态 -->
    
    <template v-if="current.length > 0" v-for="info in current">
    <v-card class="rounded-lg w-100" variant="outlined">
        <v-card-title class="d-flex flex-row mt-2">
            <v-chip label class="mx-2" @click="info.status == -1 ? alter_mode(info) : ''">
                <p class="text-overline font-weight-bold text-green">{{ info.mode == 1 ? "FAST" : "NORMAL" }} - {{ info.pile }}</p>
            </v-chip>
            <p class="text-subtitle-1 font-weight-bold ml-2">{{ info.car_id }}</p>
            <p class="text-overline font-weight-bold ml-6" :class="status_color[String(info.status)]">{{ status_str[String(info.status)] }}</p>
            <p v-if="info.queuing > 0 && info.status != -2 && info.status != 2" class="text-overline font-weight-bold ml-2" :class="status_color[String(info.status)]">{{ info.queuing }}</p>

            <v-btn v-if="info.status != -2 && info.status != 2" class="ml-auto" color="grey" variant="text"
                    density="compact" icon="mdi-refresh"
                    @click="query_detail(info)"/>

            <v-btn v-if="info.status != -2 && info.status != 2" class="ml-2" color="red" variant="text" 
                    density="compact" icon="mdi-close"
                    @click="alter_cancel(info)"/>
        </v-card-title>
        
        <v-card-text v-if="info.valid" class="py-0">
            <v-divider ></v-divider>
            <v-list>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-subtitle-2 font-weight-bold">REQUEST</p>
                        <p class="text-subtitle-2 font-weight-bold text-grey ml-6">{{ info.request_amount }}</p>
                        <v-btn v-if="info.status == -1" size="" class="ml-2" color="orange" variant="text" 
                            density="compact" icon="mdi-pencil"
                            @click="current_bill = info; dialog_change=true;"/>
                        <p class="text-subtitle-2 font-weight-bold ml-auto">CHARGED</p>
                        <p class="text-subtitle-2 font-weight-bold ml-6" :class="info.status == 1 ? 'text-blue' : 'text-grey'">{{ info.charged_amount }}</p>
                    </div>
                </v-list-item>
                <v-list-item>
                    <div class="d-flex flex-row mr-16">
                        <p class="text-subtitle-2 font-weight-bold">START</p>
                        <p class="text-subtitle-2 font-weight-bold text-grey ml-6">{{ info.start_time != "" ? info.start_time : 'N/A' }}</p>
                        <p class="text-subtitle-2 font-weight-bold ml-auto">REMAIN</p>
                        <p class="text-subtitle-2 font-weight-bold text-grey ml-6">{{ info.remain }} </p>
                        <p class="text-subtitle-2 font-weight-bold text-grey ml-1">{{ info.remain == "N/A" ? "" : "H"}}</p>
                    </div>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
    <v-spacer class="my-3"></v-spacer>
    </template>
    
    <!-- 历史记录 -->
    <v-card class="rounded-lg w-100" color="grey-lighten-4">
        <v-card-title class="d-flex flex-row">
            <p class="text-subtitle-1 font-weight-bold">HISTORY</p>
            <v-btn class="ml-auto" color="grey" variant="text" 
                    density="compact" icon="mdi-refresh"
                    @click="query_profile()"/>
        </v-card-title>
    
        <v-card-text>
            <template v-for="bill in history">
            <v-card class="rounded-lg my-2">
                <v-list>
                    <v-list-group value="详情">
                        <template v-slot:activator="{ props }">
                            <v-list-item
                            v-bind="props">
                            <v-card-title class="d-flex flex-row" @click="query_bill(bill)">
                                <p class="text-overline font-weight-bold">{{ bill.car }}</p>
                                <p class="text-overline font-weight-bold text-grey-darken-2 ml-auto"> {{ bill.date }}</p>
                            </v-card-title>
                            </v-list-item>
                        </template>
                        <template v-if="bill.valid">
                            <v-list-item class="mr-5">
                                <div class="d-flex flex-column">
                                    <template v-for="detail in bill.detail">
                                        <div class="d-flex flex-row mb-1">
                                            <v-chip label>
                                                <p class="text-overline font-weight-bold" :class="mode_color[String(detail.mode)]">
                                                    {{ mode_str[String(detail.mode)] }} {{ detail.pile }}
                                                </p>
                                            </v-chip>
                                            <v-chip label variant="outlined" class="ml-2 text-overline font-weight-bold" color="orange-lighten-1">
                                                {{ Number(detail.amount).toFixed(2) }} kWh
                                            </v-chip>
                                            <v-chip label variant="outlined" class="ml-2 text-overline font-weight-bold" color="black">
                                                {{ detail.start_time }} - {{ detail.end_time }}
                                            </v-chip>
                                            <!-- <div class="ml-auto d-flex flex-row text-overline font-weight-bold text-grey-darken-1">
                                                <p class="text-black ml-auto">DURATION:</p>
                                                <p class="ml-2">{{ Number(detail.duration).toFixed(2) }} HOURS</p>
                                            </div> -->

                                        </div>
                                    </template>
                                    
                                    
                                </div>
                            </v-list-item>
                            <v-list-item class="mr-5 ml-1">
                                <div class="d-flex flex-row text-grey-darken-2 text-overline font-weight-bold">
                                    <p class="text-black">CHARGE AMOUNT:</p>
                                    <p class="ml-2">{{ Number(bill.amount).toFixed(2) }} kWh</p>
                                    <p class="text-black ml-auto">DURATION:</p>
                                    <p class="ml-2">{{ Number(bill.duration).toFixed(2) }} HOURS</p>
                                </div>
                            </v-list-item>
                            <v-divider class="my-1 mx-6"></v-divider>
                            <v-list-item class="mr-10 my-3">
                                <div class="d-flex flex-row text-grey-darken-2 text-overline font-weight-bold">
                                    <p class="ml-auto text-black mr-3">CHARGE FEE:</p> 
                                    <p v-for="detail,index in bill.detail">{{ index == 0 ? '' : '+'}} {{Number(detail.charge).toFixed(2)}}</p>
                                    <template v-if="bill.detail.length > 1">
                                        <p class="ml-2"> = {{ Number(bill.charge).toFixed(2) }}</p>   
                                    </template>
                                </div>
                                <div class="d-flex flex-row text-grey-darken-2 text-overline font-weight-bold">
                                    <p class="ml-auto text-subtitle-1 font-weight-bold text-black">+</p>
                                    <p class="ml-6 text-black mr-3">SERVICE FEE:</p> 
                                    <p v-for="detail,index in bill.detail">{{ index == 0 ? '' : '+'}} {{Number(detail.service).toFixed(2)}}</p>
                                    <template v-if="bill.detail.length > 1">
                                        <p class="ml-2"> = {{ Number(bill.service).toFixed(2) }}</p>   
                                    </template>
                                </div>
                                <v-divider class="ml-auto w-50 border-opacity-100" color="black"></v-divider>
                                <div class="d-flex flex-row text-grey-darken-2 text-button font-weight-bold">
                                    <p class="ml-auto text-black">TOTAL:</p> 
                                    <p class="ml-2">{{ Number(bill.total).toFixed(2) }}</p>   
                                </div>
                            </v-list-item>
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

    <v-dialog class="w-75" v-model="dialog_change" elevation-10>
      <v-card class="rounded-lg overflow-hidden">
          <v-card-title class="text-button font-weight-bold">
            CHANGE REQUEST AMOUNT
          </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="input_amount" variant="solo" label="AMOUNT" type="number" density="compact"></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-btn size="x-large" density="compact" color="red" 
                        class="w-auto rounded-lg" @click="dialog_change = false"> CANCEL </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-btn size="x-large" density="compact" color="green" 
                        class="w-auto rounded-lg" @click="alter_amount(current_bill)"> SUBMIT </v-btn>
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
import { ref, reactive, inject, getCurrentInstance, onMounted }  from 'vue'
const user = localStorage.getItem('username');

const time = inject('time');
const time_sync = inject('time_sync');
const sys_timer = inject('sys_timer');

const quit = () => {
    localStorage.removeItem('username');
    for(var i in current.value){
        clearInterval(current.value[i].timer);
    }
    clearInterval(sys_timer);
    router.push('/user/login');
}

const status_str = {
    '-2': 'CANCELED',
    '-1': 'PENDING',
    '0': 'WAITING',
    '1': 'CHARGING',
    '2': 'FINISHED'
}

const status_color = {
    '-2': 'text-red',
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
const current_bill = ref(null);
const dialog_change = ref(false);
const input_car_id = ref('');
const input_amount = ref(0);


const charge_request = () => {
    console.log('charging request');
    var car_id = String(input_car_id.value);
    axios.post('/api/user/charge', {
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
                status: -1,
                remain: 0,
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
    axios.post('/api/user/alter/mode', {
        user_id: user,
        car_id: bill.car_id,
        mode: Number(!bill.mode),
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            bill.mode = !bill.mode;
            query_detail(bill);
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const alter_cancel = (bill) => {
    console.log('alter cancel');
    axios.post('/api/user/alter/cancel', {
        user_id: user,
        car_id: bill.car_id,
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            query_detail(bill);
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
    if(bill == null){
        return;
    }
    var amount = input_amount.value
    const res = axios.post('/api/user/alter/amount', {
        user_id: user,
        car_id: bill.car_id,
        amount: Number(amount)
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            bill.amount = amount ;
            query_detail(bill);
            dialog_change.value = false;
        }else{
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_bill = (bill)=>{
    if(bill.valid == true){
        return;
    }
    console.log('query bill');
    axios.get('/api/user/query/bill', {
        params:{
            user_id: user,
            bill_id: bill.bill_id,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            bill.car = res.data.data.car;
            bill.date = res.data.data.detail[0].date;
            bill.detail = reactive(res.data.data.detail);
            bill.service = 0.0;
            bill.charge = 0.0;
            bill.total = 0.0;
            bill.amount = 0.0;
            bill.duration = 0.0;
            res.data.data.detail.forEach((item,inde) => {
                bill.service += item.service;
                bill.charge += item.charge;
                bill.total += item.total;
                bill.amount += item.amount;
                bill.duration += item.duration;
            });
            bill.start_time = res.data.data.detail[0].start_time
            bill.end_time = res.data.data.detail[res.data.data.detail.length - 1].end_time
            bill.valid = true;
        }else{
            bill.valid = false;
            alert('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_profile = () => {
    console.log('query profile');
    axios.get('/api/user/query/profile', {
        params:{
            user_id: user,
        }
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            var bills = res.data.data.bill
            for(var index in bills){
                if(history.value.findIndex((item, idx) => {
                    return item.bill_id == bills[index].id;
                }) != -1){
                    continue;
                }
                history.value.push(reactive({
                    bill_id: bills[index].id,
                    date: bills[index].date,
                    car:bills[index].car,
                    valid: false,
                }))
            }
        }else{
            alert('请求失败: ' + res.data.message);
            quit();
        }
    }).catch(err => {
        console.log(err);
        alert('请求失败: 网络错误');
    })
}

const query_request = ()=>{
    console.log('query request');
    axios.get('/api/user/query/request', {
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
                    status: -1,
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
    axios.get('/api/user/query/detail', {
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
            info.queuing = res.data.data.queuing;
            info.request_amount = Number(res.data.data.request_amount).toFixed(2);
            info.start_time = res.data.data.start_time;
            info.charged_amount = Number(res.data.data.charged_amount).toFixed(2);
            info.valid = true;
        }else if(res.data.status == 1){
            info.queue = 0;
            info.remain = 0;
            if(info.status == 1){
                query_profile()
            }
            info.status = info.status == 1 ? 2 : -2;
            clearInterval(info.timer);
            console.log('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
    })
}


if (user == null) {
    quit();
}
else{
    time_sync();
    query_request();
    query_profile();
}


</script>