<template lang="jade">

.login-status
    div(v-if="logged") You are logged in
    div(v-if="!logged") You are not logged in

</template>

<script>

export default {
    data() {
        let data = {
            logged: false,
        };

        firebase.auth().onAuthStateChanged(function(user) {
            logged = !!user;
        });

        return data;
    }
}

</script>