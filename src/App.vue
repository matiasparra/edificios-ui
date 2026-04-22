<template>
  <div>
    <Navbar v-if="mostrarNavbar" />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: { Navbar },

  computed: {
    mostrarNavbar() {
      return this.$route.path !== "/login";
    }
  }
};
</script>