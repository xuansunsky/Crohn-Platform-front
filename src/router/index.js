import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import LoginView2 from "../views/LoginView2.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import insuranceMap from "@/components/tabs/PolicyMapTab.vue";
import ExperienceCard from "@/components/ExperienceCard.vue";
import TestTab from "@/components/tabs/TestTab.vue";
export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: LoginView },
        { path: '/', redirect: '/login' },
        { path: '/login2', component: LoginView2, name: 'LoginView2' },
        {path: '/register', name: 'register', component: RegisterView},
        {path:'/dashboard',name:'dashboard',component:DashboardView},
        {path:'/insuranceMap',name:'insuranceMap',component:insuranceMap},
        {path:'/ExperienceCard',name:'ExperienceCard',component:ExperienceCard},
        {path:'/TestTab',name:'TestTab',component:TestTab}

    ]
})
