import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/organizations",
      name: "Organizations",
      component: () => import("../views/OrganizationView.vue"),
    },
    {
      path: "/deadlines",
      name: "Deadlines",
      component: () => import("../views/DeadlinesView.vue"),
    },
    {
      path: "/threads",
      name: "Threads",
      component: () => import("../views/ThreadsView.vue"),
    },
    {
      path: "/invitations",
      name: "Invitations",
      component: () => import("../views/InvitationsView.vue"),
    },
    {
      path: "/auth",
      name: "Auth",
      component: () => import("../views/AuthView.vue"),
    },
    {
      path: "/auth/otp",
      name: "OTP",
      component: () => import("../views/OtpView.vue"),
    },
    {
      path: "/:catchAll(.*)",
      redirect: "/organizations",
    },
  ],
});

export default router;
