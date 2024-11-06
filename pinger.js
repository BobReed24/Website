<script>
    setInterval(function() {
        const username = '{{ session["username"] }}';
        const currentPage = window.location.hostname; 
        const subdomain = currentPage.split('.')[0]; 

        if (username) {
            fetch('https://8000-gitpoddemos-springpetcl-aknc43cwuam.ws-us116.gitpod.io/update_active', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    username: username, 
                    currentPage: window.location.href 
                })
            });
        }
    }, 1000); 
</script>
