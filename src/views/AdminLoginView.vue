<template>
<v-container class="fill-height d-flex flex-column">
    <v-card width="50%" max-width="500px" min-width="200px" class="elevation-3 rounded-lg pb-6">
        <v-card-title>
            <p class="text-h3 font-weight-black my-5">LOGIN</p>
        </v-card-title>
        <v-card-text>
            <v-spacer class="my-4"></v-spacer>
            <v-text-field ref="username" label="Username"></v-text-field>
            <v-text-field ref="password" label="Password" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn class="mx-auto text-center elevation-1" rounded="lg" 
                    prepend-icon="mdi-check-circle"
                    @click="login">
                <template v-slot:prepend>
                    <v-icon color="success"></v-icon>
                </template>
                Login
            </v-btn>
        </v-card-actions>
    </v-card>
</v-container>
</template>

<script>
import axios from 'axios';
export default{
    data(){},
    methods:{
        login(){
            axios.post('/api/login', {
                username: this.$refs.username.value,
                password: this.$refs.password.value,
                auth:1
            })
            .then(res => {
                console.log(res.data)
                if(res.data.status == 0){
                    localStorage.setItem('admin', this.$refs.username.value);
                    this.$router.push('/admin/dashboard')
                }else{
                    alert('登录失败');
                }
            }).catch(err => {
                console.log(err);
                alert('登录失败');
            })
        }   
    }
}

</script>