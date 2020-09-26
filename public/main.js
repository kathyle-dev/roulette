var bet = document.getElementsByClassName("btn-bet");
// var choice = document.getElementById("start");
// var trash = document.getElementsByClassName("fa-trash");

Array.from(bet).forEach(function(element) {
      element.addEventListener('click', function(e){
        const choice = e.target.getAttribute("name")
        const user = document.getElementById("userEmail").innerHTML
        const wins = parseFloat(document.getElementById("wins").innerHTML)
        const losses = parseFloat(document.getElementById("losses").innerHTML)
        const total = parseFloat(document.getElementById("total").innerHTML)
        // const botChoice = getChoice();
        // document.getElementById("botChoice").innerHTML = botChoice
        // if(e.target.getAttribute("name") == botChoice){
        //   fetch('roulette', {
        //     method: 'put',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify({
        //       'user': user,
        //       'wins': wins,
        //       'losses': losses,
        //       'total': total
        //       // 'botChoice': botChoice
        //     })
        //   })
        //   .then(response => {
        //     if (response.ok) return response.json()
        //   })
        //   .then(data => {
        //     window.location.reload(true)
        //   })
        // }else{
          fetch('roulette', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'user': user,
              'wins': wins,
              'losses': losses,
              'total': total,
              'choice': choice
            })
          })
          .then(response => {
            if (response.ok) return response.json()
          })
          .then(data => {
            window.location.reload(true)
          })
        });
});
