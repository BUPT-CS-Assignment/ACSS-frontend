<template>
<v-container class="fill-height d-flex flex-column">
    <v-card class="rounded-lg w-75 bg-grey-lighten-3">
        <v-card-title class="d-flex flex-row mt-2">
            <p class="text-h4 font-weight-black">ACSS USER</p>
            <p class="ml-auto text-overline font-weight-bold">{{time.hour}}:{{time.minute}}:{{time.second}}</p>
        </v-card-title>
        <v-card-text>
            <p class="text-subtitle-1 text-grey-darken-1 font-weight-bold">{{ user }}</p>
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
                <p class="text-h6 font-weight-bold">NO TASK</p>
            </v-card-title>
        </v-card>
        <v-spacer class="my-3"></v-spacer>
    </template>
    <template v-else v-for="info in current">
    <v-card class="rounded-lg w-75">
        <v-card-title class="d-flex flex-row">
            <p class="text-h6 font-weight-bold">TASK: {{ info.car_id }}</p>
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
                <v-col cols="3">
                    <v-btn size="x-large" class="w-100 rounded-lg" color="orange-lighten-1"
                        @click="alter_mode(info)">
                        <p class="text-button font-weight-bold">CHANGE</p>
                    </v-btn>
                </v-col>
                <v-col cols="3" class="d-flex flex-column">
                    <v-card variant="outlined" elevation="0" color="grey-darken-1">
                        <v-card-title class="text-overline font-weight-bold">{{ info.mode ? 'FAST' : 'NORMAL' }}</v-card-title>
                    </v-card>
                </v-col>

                <v-col cols="3">
                    <v-btn size="x-large" class="w-100 rounded-lg" color="blue-lighten-1"
                        @click="alter_amount(info)">
                        <p class="text-button font-weight-bold">RESET</p>
                    </v-btn>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="info.input_amount" variant="solo" label="Amount" type="number"></v-text-field>
                </v-col>
            </v-row>
            <v-divider ></v-divider>
            <v-list>
                <v-list-item>STATUS: {{ info.status }}</v-list-item>
                <v-list-item>MODE: {{ info.mode }}</v-list-item>
                <v-list-item>QUEUE: {{ info.queue }}</v-list-item>
                <v-list-item>PILE: {{ info.pile }}</v-list-item>
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
                    <v-text-field v-model="input_amount" variant="solo" label="AMOUNT"></v-text-field>
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


const current = ref([]);
const history = ref([]);
const dialog = ref(false);
const dialog_input_mode = ref(0);
const input_car_id = ref('');
const input_amount = ref(0);
const time = ref({
    hour: '00',
    minute: '00',
    second: '00',
});

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
    const res = axios.post('api/user/alter/amout', {
        user_id: user,
        car_id: bill.car_id,
        amount: bill.input_amount
    }).then(res => {
        console.log(res.data)
        if(res.data.status == 0){
            alert('修改成功');
            bill.amount = bill.input_amount;
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
                console.log(element)
                var new_info = reactive({
                    valid: false,
                    car_id: element,
                    pile: 0,
                    queue: 0,
                    mode: 0,
                    status: 0,
                    remain: 0,
                    input_amount: 0,
                })
                current.value.push(new_info)
                query_detail(new_info);
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
            info.valid = true;
            info.pile = res.data.data.pile_id;
            info.queue = 0;
            info.remain = res.data.data.remain;
            info.mode = res.data.data.mode;
            info.status = res.data.data.status;
        }else{
            console.log('请求失败: ' + res.data.message);
        }
    }).catch(err => {
        console.log(err);
    })
}

query_request();

</script>